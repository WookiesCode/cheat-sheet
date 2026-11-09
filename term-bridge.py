#!/usr/bin/env python3
"""term-bridge.py: a local shell for the cheat-sheet's Terminal dock.

A web page cannot start a shell, so this small helper does: it listens on
127.0.0.1 only, and each WebSocket connection gets its own login shell on a
pseudo-terminal (the same shell you would get in a terminal window on this
jumpbox). Standard library only; Linux and macOS.

    python3 term-bridge.py             # port 8767
    python3 term-bridge.py --port 9000
    python3 term-bridge.py --new-token # rotate the token

Safety:
  * Binds to 127.0.0.1, never to the network.
  * Every connection must carry the token from ~/.config/dc-cheatsheet/term-token
    (mode 0600). Other web pages open in the same browser can reach localhost,
    but not this token.
  * The Origin header must be the cheat-sheet itself: a file:// page ("null") or
    http://localhost / http://127.0.0.1 on any port.
  * Closing the page or pressing Disconnect hangs up the shell (SIGHUP).
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
import threading
from urllib.parse import parse_qs, urlsplit

WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
TOKEN_PATH = os.path.expanduser('~/.config/dc-cheatsheet/term-token')
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
            log(f'shell pid {pid} closed')


class Server(socketserver.ThreadingTCPServer):
    daemon_threads = True
    allow_reuse_address = True


def log(msg):
    print(f'[term-bridge] {msg}', file=sys.stderr, flush=True)


def main():
    ap = argparse.ArgumentParser(description='Local shell bridge for the cheat-sheet Terminal dock.')
    ap.add_argument('--port', type=int, default=8767)
    ap.add_argument('--new-token', action='store_true', help='rotate the access token')
    a = ap.parse_args()
    srv = Server(('127.0.0.1', a.port), Handler)
    srv.token = load_token(a.new_token)
    print(f'term-bridge listening on 127.0.0.1:{a.port} (local only)')
    print(f'Token (paste once into the Terminal dock): {srv.token}')
    print(f'Stored in {TOKEN_PATH}. Ctrl-C stops the bridge and its shells.', flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print()


if __name__ == '__main__':
    main()
