#!/usr/bin/env python3
"""term-bridge.py: a local shell for the cheat-sheet's Terminal dock.

A web page cannot start a shell, so this small helper does: it listens on
127.0.0.1 only, and each WebSocket connection gets its own login shell on a
pseudo-terminal (the same shell you would get in a terminal window on this
jumpbox). Standard library only; Linux and macOS.

    python3 term-bridge.py              # start in the background, open the site with the token
    python3 term-bridge.py --stop       # stop it and hang up its shells
    python3 term-bridge.py --port 9000
    python3 term-bridge.py --new-token  # rotate the token
    python3 term-bridge.py --foreground # stay attached (Ctrl-C stops it)

Starting it opens the cheat-sheet in your default browser with the token in the
address fragment (#term-token=...): the fragment never leaves the browser, and the
page saves it, removes it from the address bar and connects. Then the bridge runs
in the background, so the terminal you started it from can be closed. The page's
Stop bridge button, or --stop, ends it.

Safety:
  * Binds to 127.0.0.1, never to the network.
  * Every connection must carry the token from ~/.config/dc-cheatsheet/term-token
    (mode 0600). Other web pages open in the same browser can reach localhost,
    but not this token.
  * The Origin header must be the cheat-sheet itself: a file:// page ("null") or
    http://localhost / http://127.0.0.1 on any port.
  * Closing the page or pressing Disconnect hangs up the shell (SIGHUP).
  * The token is never served over HTTP: a sandboxed iframe on any site also
    sends Origin "null", so only the browser-open hand-off carries it.
"""
import argparse
import base64
import fcntl
import hashlib
import hmac
import json
import os
import pty
import secrets
import select
import signal
import socket
import socketserver
import struct
import sys
import termios
import subprocess
import threading
import time
import urllib.request
from urllib.parse import parse_qs, quote, urlsplit

WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
TOKEN_PATH = os.path.expanduser('~/.config/dc-cheatsheet/term-token')
PID_PATH = os.path.expanduser('~/.config/dc-cheatsheet/term-bridge.pid')
LOG_PATH = os.path.expanduser('~/.cache/dc-cheatsheet/term-bridge.log')
SITE_DIR = os.path.dirname(os.path.abspath(__file__))
ALLOWED_HOSTS = {'localhost', '127.0.0.1', '[::1]'}


def load_token(rotate=False):
    os.makedirs(os.path.dirname(TOKEN_PATH), mode=0o700, exist_ok=True)
    if not rotate and os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH) as f:
            tok = f.read().strip()
        if len(tok) >= 24:
            return tok
    tok = secrets.token_urlsafe(24)
    fd = os.open(TOKEN_PATH, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as f:
        f.write(tok + '\n')
    return tok


def origin_ok(origin):
    if origin in (None, '', 'null'):  # file:// pages send "null"
        return True
    try:
        u = urlsplit(origin)
    except ValueError:
        return False
    return u.scheme in ('http', 'https') and (u.hostname or '') in {h.strip('[]') for h in ALLOWED_HOSTS}


class WS:
    """Just enough RFC 6455 for one client: masked frames in, unmasked out."""

    def __init__(self, sock):
        self.sock = sock
        self.lock = threading.Lock()
        self.buf = b''

    def _read(self, n):
        while len(self.buf) < n:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise ConnectionError('closed')
            self.buf += chunk
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def recv(self):
        """Returns (opcode, payload) for a whole message."""
        msg, first_op = b'', None
        while True:
            b1, b2 = self._read(2)
            fin, op = b1 & 0x80, b1 & 0x0F
            ln = b2 & 0x7F
            if ln == 126:
                ln = struct.unpack('!H', self._read(2))[0]
            elif ln == 127:
                ln = struct.unpack('!Q', self._read(8))[0]
            if ln > 16 * 1024 * 1024:
                raise ConnectionError('frame too large')
            mask = self._read(4) if b2 & 0x80 else b'\0\0\0\0'
            data = bytearray(self._read(ln))
            for i in range(len(data)):
                data[i] ^= mask[i & 3]
            if op >= 0x8:  # control frames may arrive mid-message
                if op == 0x9:
                    self.send(bytes(data), 0xA)
                    continue
                if op == 0xA:
                    continue
                return op, bytes(data)
            if op != 0:
                first_op = op
            msg += data
            if fin:
                return first_op, msg

    def send(self, data, op=0x2):
        n = len(data)
        head = bytes([0x80 | op])
        if n < 126:
            head += bytes([n])
        elif n < 65536:
            head += bytes([126]) + struct.pack('!H', n)
        else:
            head += bytes([127]) + struct.pack('!Q', n)
        with self.lock:
            self.sock.sendall(head + data)


class Handler(socketserver.BaseRequestHandler):
    def reply(self, status, body=''):
        self.request.sendall(f'HTTP/1.1 {status}\r\nContent-Type: text/plain\r\nContent-Length: {len(body)}\r\nConnection: close\r\n\r\n{body}'.encode())

    def handle(self):
        sock = self.request
        sock.settimeout(10)
        raw = b''
        while b'\r\n\r\n' not in raw:
            chunk = sock.recv(4096)
            if not chunk or len(raw) > 16384:
                return
            raw += chunk
        head = raw.split(b'\r\n\r\n', 1)[0].decode('latin-1').split('\r\n')
        try:
            method, target, _ = head[0].split(' ', 2)
        except ValueError:
            return
        hdr = {}
        for line in head[1:]:
            k, _, v = line.partition(':')
            hdr[k.strip().lower()] = v.strip()
        url = urlsplit(target)
        if method != 'GET' or url.path != '/term' or hdr.get('upgrade', '').lower() != 'websocket':
            return self.reply('404 Not Found', 'term-bridge: open the Terminal from the cheat-sheet.\n')
        if not origin_ok(hdr.get('origin')):
            log(f'refused origin {hdr.get("origin")!r}')
            return self.reply('403 Forbidden', 'origin not allowed\n')
        tok = (parse_qs(url.query).get('token') or [''])[0]
        if not hmac.compare_digest(tok.encode(), self.server.token.encode()):
            log('refused: wrong token')
            return self.reply('401 Unauthorized', 'bad token\n')
        key = hdr.get('sec-websocket-key', '')
        accept = base64.b64encode(hashlib.sha1((key + WS_GUID).encode()).digest()).decode()
        sock.sendall(('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
                      f'Sec-WebSocket-Accept: {accept}\r\n\r\n').encode())
        sock.settimeout(None)
        self.session(WS(sock))

    def session(self, ws):
        shell = os.environ.get('SHELL') or '/bin/bash'
        pid, fd = pty.fork()
        if pid == 0:
            os.environ['TERM'] = 'xterm-256color'
            os.environ['COLORTERM'] = 'truecolor'
            os.environ['DC_TERMINAL'] = 'cheat-sheet'
            try:
                os.chdir(os.path.expanduser('~'))
            except OSError:
                pass
            os.execvp(shell, [shell, '-l'])
        log(f'shell {shell} pid {pid} opened')
        self.server.shells.add(pid)
        ws.send(json.dumps({'type': 'hello', 'user': os.environ.get('USER', ''), 'host': socket.gethostname(), 'shell': os.path.basename(shell), 'pid': pid}).encode(), 0x1)
        alive = threading.Event()
        alive.set()

        def pump():  # shell → browser
            try:
                while alive.is_set():
                    r, _, _ = select.select([fd], [], [], 0.5)
                    if fd in r:
                        try:
                            data = os.read(fd, 65536)
                        except OSError:
                            break
                        if not data:
                            break
                        ws.send(data)
            except (OSError, ConnectionError):
                pass
            finally:
                alive.clear()
                try:
                    ws.send(json.dumps({'type': 'exit'}).encode(), 0x1)
                    ws.send(b'', 0x8)
                except OSError:
                    pass

        t = threading.Thread(target=pump, daemon=True)
        t.start()
        try:
            while alive.is_set():
                op, data = ws.recv()
                if op == 0x8:
                    break
                if op == 0x2:
                    os.write(fd, data)
                elif op == 0x1:
                    try:
                        msg = json.loads(data.decode())
                    except ValueError:
                        continue
                    if isinstance(msg, dict) and msg.get('type') == 'stop':
                        # The page's Stop bridge button (this connection already passed the token check).
                        log('stop requested from the page')
                        self.server.stop()
                        break
                    if isinstance(msg, dict) and msg.get('type') == 'resize':
                        # A malformed size must not end the session: skip it. Clamp to what
                        # struct winsize (unsigned short) holds.
                        try:
                            cols, rows = int(msg.get('cols', 80)), int(msg.get('rows', 24))
                        except (TypeError, ValueError):
                            log(f'ignored bad resize {msg!r}')
                            continue
                        cols, rows = min(max(2, cols), 65535), min(max(2, rows), 65535)
                        fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', rows, cols, 0, 0))
        except (OSError, ConnectionError):
            pass
        finally:
            alive.clear()
            try:
                os.kill(pid, signal.SIGHUP)
            except ProcessLookupError:
                pass
            try:
                os.waitpid(pid, 0)
            except ChildProcessError:
                pass
            try:
                os.close(fd)
            except OSError:
                pass
            self.server.shells.discard(pid)
            log(f'shell pid {pid} closed')


class Server(socketserver.ThreadingTCPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.shells = set()
        self._stopping = False

    def stop(self):
        """Hang up every shell and end serve_forever (callable from any thread or a signal)."""
        if self._stopping:
            return
        self._stopping = True
        for pid in list(self.shells):
            try:
                os.kill(pid, signal.SIGHUP)
            except ProcessLookupError:
                pass
        threading.Thread(target=self.shutdown, daemon=True).start()


def log(msg):
    print(f'[term-bridge] {msg}', file=sys.stderr, flush=True)


def running_pid():
    """The pid of a bridge started earlier, if it is still alive."""
    try:
        with open(PID_PATH) as f:
            pid = int(f.read().strip())
        os.kill(pid, 0)
    except (OSError, ValueError):
        return None
    try:  # a reused pid that is not a bridge does not count
        with open(f'/proc/{pid}/cmdline', 'rb') as f:
            if b'term-bridge' not in f.read():
                return None
    except OSError:
        pass  # no /proc (macOS): trust the pid file
    return pid


def write_pid():
    fd = os.open(PID_PATH, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as f:
        f.write(f'{os.getpid()}\n')


def remove_pid():
    try:
        with open(PID_PATH) as f:
            if f.read().strip() == str(os.getpid()):
                os.remove(PID_PATH)
    except OSError:
        pass


def stop_running():
    pid = running_pid()
    if not pid:
        print('term-bridge is not running.')
        return 0
    os.kill(pid, signal.SIGTERM)
    for _ in range(50):
        time.sleep(0.1)
        try:
            os.kill(pid, 0)
        except OSError:
            print(f'term-bridge (pid {pid}) stopped; its shells were hung up.')
            return 0
    print(f'term-bridge (pid {pid}) did not stop within 5 s.', file=sys.stderr)
    return 1


def site_url(explicit):
    """Where to open the cheat-sheet: --url, else the repo preview server if it is up, else the file."""
    if explicit:
        return explicit
    try:  # python3 -m http.server 8765 in the repo serves this very file
        with urllib.request.urlopen('http://127.0.0.1:8765/term-bridge.py', timeout=0.5) as r:
            if r.status == 200 and r.read(64).startswith(b'#!/usr/bin/env python3\n"""term-bridge.py'):
                return 'http://127.0.0.1:8765/index.html'
    except (OSError, ValueError):
        pass
    return 'file://' + quote(os.path.join(SITE_DIR, 'index.html'))


def open_site(base, token, port):
    url = f'{base}#term-token={token}&term-port={port}'
    cmd = ['open', url] if sys.platform == 'darwin' else ['xdg-open', url]
    try:
        subprocess.Popen(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        print(f'Opening {base} in your default browser; it fills in the token and connects.')
    except OSError:
        print(f'Could not open a browser ({cmd[0]} not found): open {base} and paste the token.')


def detach():
    """Run on in the background with no terminal (double fork). Returns in the background
    process; the starting process prints the new pid and returns None."""
    r, w = os.pipe()
    if os.fork() > 0:  # the process the user started
        os.close(w)
        with os.fdopen(r) as f:
            return f.read().strip() or '?'
    os.close(r)
    os.setsid()  # no controlling terminal: closing the window sends no SIGHUP
    if os.fork() > 0:
        os._exit(0)
    os.makedirs(os.path.dirname(LOG_PATH), mode=0o700, exist_ok=True)
    out = os.open(LOG_PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    nul = os.open(os.devnull, os.O_RDONLY)
    os.dup2(nul, 0)
    os.dup2(out, 1)
    os.dup2(out, 2)
    os.chdir('/')
    with os.fdopen(w, 'w') as f:
        f.write(str(os.getpid()))
    return None


def main():
    ap = argparse.ArgumentParser(description='Local shell bridge for the cheat-sheet Terminal dock.')
    ap.add_argument('--port', type=int, default=8767)
    ap.add_argument('--new-token', action='store_true', help='rotate the access token')
    ap.add_argument('--stop', action='store_true', help='stop the running bridge and hang up its shells')
    ap.add_argument('--foreground', action='store_true', help='stay attached to this terminal (Ctrl-C stops it)')
    ap.add_argument('--no-open', action='store_true', help='do not open the cheat-sheet in the browser')
    ap.add_argument('--url', help='address of the cheat-sheet to open (default: the repo preview server on :8765 if up, else index.html as a file)')
    a = ap.parse_args()
    if a.stop:
        sys.exit(stop_running())

    pid = running_pid()
    if pid and a.new_token:
        stop_running()  # the running one holds the old token
        pid = None
    token = load_token(a.new_token)
    if pid:
        print(f'term-bridge is already running (pid {pid}).')
        if not a.no_open:
            open_site(site_url(a.url), token, a.port)
        return

    try:
        srv = Server(('127.0.0.1', a.port), Handler)
    except OSError as e:
        sys.exit(f'term-bridge: cannot listen on 127.0.0.1:{a.port} ({e.strerror}). Is something else using it? Try --port.')
    srv.token = token
    print(f'term-bridge listening on 127.0.0.1:{a.port} (local only)')
    print(f'Token (filled in for you; paste it only if the page asks): {srv.token}')
    print(f'Stored in {TOKEN_PATH}.', flush=True)
    base = None if a.no_open else site_url(a.url)

    if not a.foreground:
        child = detach()
        if child is not None:
            print(f'Running in the background (pid {child}); you can close this terminal.')
            print(f'Stop it with the Stop bridge button in the Terminal, or: python3 {os.path.abspath(__file__)} --stop')
            print(f'Log: {LOG_PATH}', flush=True)
            if base:
                open_site(base, token, a.port)
            return
    else:
        print('Ctrl-C stops the bridge and its shells.', flush=True)
        if base:
            open_site(base, token, a.port)

    write_pid()
    signal.signal(signal.SIGTERM, lambda *_: srv.stop())
    log(f'listening on 127.0.0.1:{a.port}, pid {os.getpid()}')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print()
        srv.stop()
    finally:
        for pid in list(srv.shells):
            try:
                os.kill(pid, signal.SIGHUP)
            except ProcessLookupError:
                pass
        srv.server_close()
        remove_pid()
        log('stopped')


if __name__ == '__main__':
    main()
