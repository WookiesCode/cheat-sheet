"""Exercise term-bridge.py with a tiny WebSocket client.

Runs the bridge with a throwaway HOME (so the real token is untouched), then:
  1. paste test: send a large multi-line paste into `cat > file` and compare byte counts
  2. bad resize: send {"type":"resize","cols":"abc"} and check the shell survives
  3. resizes reach the pty
  4. a {"type":"stop"} message (the page's Stop bridge button) ends the bridge and its shells
  5. background start, "already running", and --stop
Usage: python3 tests/bridge.test.py [path-to-term-bridge.py]   (default: the repo's term-bridge.py)
Exits 1 if any check fails.
"""
import base64
import json
import os
import socket
import struct
import subprocess
import sys
import tempfile
import time

BRIDGE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'term-bridge.py')
failures = []
PORT = 18767


def frame(data, op):
    mask = os.urandom(4)
    n = len(data)
    head = bytes([0x80 | op])
    if n < 126:
        head += bytes([0x80 | n])
    elif n < 65536:
        head += bytes([0x80 | 126]) + struct.pack('!H', n)
    else:
        head += bytes([0x80 | 127]) + struct.pack('!Q', n)
    return head + mask + bytes(b ^ mask[i & 3] for i, b in enumerate(data))


def connect(token):
    s = socket.create_connection(('127.0.0.1', PORT))
    key = base64.b64encode(os.urandom(16)).decode()
    s.sendall((f'GET /term?token={token} HTTP/1.1\r\nHost: 127.0.0.1\r\nUpgrade: websocket\r\n'
               f'Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nOrigin: null\r\n\r\n').encode())
    resp = s.recv(4096)
    assert b'101' in resp.split(b'\r\n')[0], resp
    return s


def drain(s, secs):
    s.settimeout(0.2)
    out, end = b'', time.time() + secs
    while time.time() < end:
        try:
            chunk = s.recv(65536)
            if not chunk:
                return out, False
            out += chunk
        except socket.timeout:
            pass
    return out, True


home = tempfile.mkdtemp(prefix='tb-home-')
env = dict(os.environ, HOME=home, SHELL='/bin/bash')
proc = subprocess.Popen([sys.executable, BRIDGE, '--port', str(PORT), '--foreground', '--no-open'], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
try:
    time.sleep(0.8)
    token = open(os.path.join(home, '.config/dc-cheatsheet/term-token')).read().strip()
    target = os.path.join(home, 'paste.txt')

    # 1. Large paste
    s = connect(token)
    drain(s, 1.0)
    s.sendall(frame(f'stty -echo; cat > {target}\n'.encode(), 0x2))
    drain(s, 0.5)
    payload = b''.join(b'%06d ' % i + b'x' * 72 + b'\n' for i in range(4000))  # ~316 KB
    s.sendall(frame(payload, 0x2))
    drain(s, 3.0)
    s.sendall(frame(b'\x04', 0x2))  # Ctrl-D ends cat
    drain(s, 1.0)
    got = os.path.getsize(target) if os.path.exists(target) else 0
    print(f'paste: sent {len(payload)} bytes, file has {got} -> {"OK" if got == len(payload) else "LOST " + str(len(payload) - got)}')
    if got != len(payload):
        failures.append('paste')
    s.close()

    # 2. Bad resize message
    s = connect(token)
    drain(s, 1.0)
    s.sendall(frame(json.dumps({'type': 'resize', 'cols': 'abc', 'rows': 24}).encode(), 0x1))
    _, alive = drain(s, 1.0)
    if alive:
        s.sendall(frame(b'echo still-here\n', 0x2))
        out, alive = drain(s, 1.5)
        alive = alive and b'still-here' in out
    print(f'bad resize: shell {"survived" if alive else "was killed"}')
    if not alive:
        failures.append('bad resize')

    # 3. Valid and oversized resizes reach the pty (stty size prints "rows cols")
    for cols, rows, want in ((132, 40, b'40 132'), (100000, 24, b'24 65535')):
        s.sendall(frame(json.dumps({'type': 'resize', 'cols': cols, 'rows': rows}).encode(), 0x1))
        drain(s, 0.4)
        s.sendall(frame(b'stty size\n', 0x2))
        out, _ = drain(s, 1.0)
        print(f'resize {cols}x{rows}: {"OK" if want in out else "MISSING " + want.decode()}')
        if want not in out:
            failures.append(f'resize {cols}x{rows}')
    s.close()
finally:
    proc.terminate()
    _, err = proc.communicate(timeout=5)
    tail = [l for l in err.splitlines() if 'Traceback' in l or 'Error' in l]
    if tail:
        print('bridge stderr:', ' | '.join(tail[-3:]))


def check(ok, what):
    print(f'{"ok  " if ok else "FAIL"} {what}')
    if not ok:
        failures.append(what)


def port_open(port):
    try:
        socket.create_connection(('127.0.0.1', port), timeout=0.5).close()
        return True
    except OSError:
        return False


PID_FILE = os.path.join(home, '.config/dc-cheatsheet/term-bridge.pid')

# 4. The page's Stop bridge button: {"type":"stop"} ends the bridge and hangs up its shells.
proc = subprocess.Popen([sys.executable, BRIDGE, '--port', str(PORT), '--foreground', '--no-open'], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
time.sleep(0.8)
check(os.path.exists(PID_FILE), 'a running bridge writes its pid file')
s = connect(token)
out, _ = drain(s, 1.0)
shell_pid = json.loads(out[out.index(b'{'):out.index(b'}') + 1])['pid'] if b'"hello"' in out else None
s.sendall(frame(json.dumps({'type': 'stop'}).encode(), 0x1))
try:
    proc.wait(timeout=5)
    stopped = True
except subprocess.TimeoutExpired:
    proc.kill()
    stopped = False
check(stopped, 'a stop message from the page ends the bridge')
gone = True
if shell_pid:
    try:
        os.kill(shell_pid, 0)
        gone = False
    except OSError:
        pass
check(shell_pid is not None and gone, 'its shell was hung up')
check(not os.path.exists(PID_FILE) and not port_open(PORT), 'the pid file is removed and the port is closed')

# 5. Background start: the starting process returns at once; the bridge lives on in its own session.
r = subprocess.run([sys.executable, BRIDGE, '--port', str(PORT), '--no-open'], env=env, capture_output=True, text=True, timeout=10)
check(r.returncode == 0 and 'Running in the background' in r.stdout, 'it starts in the background and the starting command returns')
time.sleep(0.5)
bg = int(open(PID_FILE).read().strip()) if os.path.exists(PID_FILE) else None
check(bg is not None and port_open(PORT), 'the background bridge is listening')
check(bg is not None and os.getsid(bg) != os.getsid(0), 'it runs in its own session, so closing the terminal does not hang it up')
r2 = subprocess.run([sys.executable, BRIDGE, '--port', str(PORT), '--no-open'], env=env, capture_output=True, text=True, timeout=10)
check('already running' in r2.stdout, 'starting it again says it is already running')
s = connect(token)
out, alive = drain(s, 1.0)
check(b'"hello"' in out, 'the background bridge opens shells')
s.close()
r3 = subprocess.run([sys.executable, BRIDGE, '--stop'], env=env, capture_output=True, text=True, timeout=10)
time.sleep(0.3)
check(r3.returncode == 0 and 'stopped' in r3.stdout and not port_open(PORT) and not os.path.exists(PID_FILE), '--stop stops it')
r4 = subprocess.run([sys.executable, BRIDGE, '--stop'], env=env, capture_output=True, text=True, timeout=10)
check('not running' in r4.stdout, '--stop with nothing running says so')

sys.exit(1 if failures else 0)
