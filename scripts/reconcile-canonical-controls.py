#!/usr/bin/python3
"""Bounded no-model reconciliation. Configuration is installed by the owning task."""
import argparse
import datetime as dt
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile


def digest(data):
    return hashlib.sha256(data).hexdigest()


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as f:
        f.write(data)
        name = f.name
    os.replace(name, path)


def save(path, obj):
    write(path, (json.dumps(obj, indent=2) + '\n').encode())


def notify(text):
    # Native notification acceptance does not prove visible delivery.
    r = subprocess.run(['/usr/bin/osascript', '-e',
        'on run argv\ndisplay notification (item 1 of argv) with title "NEURO-DIV reconciliation"\nend run', text],
        capture_output=True, timeout=15)
    return {'accepted': r.returncode == 0, 'visibleDelivery': 'unverified'}


def run(config, force=False, watchdog=False):
    c = json.loads(config.read_text())
    root, source = Path(c['target']), Path(c['source'])
    statefile = Path(c['state'])
    state = json.loads(statefile.read_text())
    now = dt.datetime.now(dt.timezone.utc)
    iso = now.isoformat()
    due = dt.datetime.fromisoformat(state['nextDue'])
    if watchdog:
        job = subprocess.run(['/bin/launchctl', 'print', c['launchTarget']], capture_output=True)
        problem = job.returncode != 0 or (not state['paused'] and now > due + dt.timedelta(days=1))
        if problem and state.get('watchdogAlertFor') != state['nextDue']:
            state['watchdogAlertFor'] = state['nextDue']
            state['watchdogAlert'] = notify('Scheduled reconciliation is missing or overdue. See the canonical reconciliation receipt.')
        state['watchdogCheckedAt'] = iso
        save(statefile, state)
        return state
    if state['paused'] or (now < due and not force):
        return {'status': 'paused' if state['paused'] else 'not-due', 'nextDue': state['nextDue']}
    if state['runs'] >= c['maxRuns'] or now >= dt.datetime.fromisoformat(c['expires']):
        state['paused'] = True
        state['pauseReason'] = 'pilot-expired'
        state['notification'] = notify('The bounded reconciliation pilot has expired. Review its receipt before renewal.')
        save(statefile, state)
        return state
    receipt = {'controlId': 'ND-SYNC-001', 'startedAt': iso, 'source': str(source),
               'target': str(root), 'aiCalls': 0, 'changed': [], 'cloudReplication': 'unverified',
               'operatingEffectiveness': 'not-established'}
    previous = {}
    try:
        if not (source / 'resources/workspace-source-authority.json').is_file():
            raise ValueError('Canonical source authority record missing')
        authority = json.loads((source / 'resources/workspace-source-authority.json').read_text())
        if str(source) not in authority['executableSourceRoots']:
            raise ValueError('Source not an authorized executable root')
        # Never execute a changed verifier unattended.
        for rel, expected in c['pinnedVerifiers'].items():
            if digest((root / rel).read_bytes()) != expected:
                raise ValueError('Verifier changed; active review required: ' + rel)
        prospective = {}
        for rel in c['documents']:
            current = (root / rel).read_bytes()
            if digest(current) != state['targetHashes'][rel]:
                raise ValueError('Conflicting local edit: ' + rel)
            data = (source / rel).read_bytes()
            if len(data) > 256000 or not data:
                raise ValueError('Source size outside reviewed bound: ' + rel)
            prospective[rel] = data
        rel = 'resources/agent-resources.json'
        target = json.loads((root / rel).read_text())
        upstream = json.loads((source / rel).read_text())
        current_field = json.dumps(target.get('sourceAcquisitionRecognitionControl'), sort_keys=True).encode()
        if digest(current_field) != state['metadataHash']:
            raise ValueError('Conflicting acquisition metadata edit')
        target['sourceAcquisitionRecognitionControl'] = upstream['sourceAcquisitionRecognitionControl']
        prospective[rel] = (json.dumps(target, indent=2) + '\n').encode()
        for rel, data in prospective.items():
            old = (root / rel).read_bytes()
            if old != data:
                previous[rel] = old
                backup = Path(c['backup']) / iso.replace(':', '-') / rel
                write(backup, old)
                write(root / rel, data)
                receipt['changed'].append(rel)
        env = dict(os.environ, PATH=c['path'])
        check = subprocess.run(['/bin/sh', 'scripts/verify-agent-resources.sh'], cwd=root,
                               env=env, capture_output=True, text=True, timeout=90)
        receipt['checks'] = {'exitCode': check.returncode, 'output': (check.stdout + check.stderr)[-12000:]}
        if check.returncode:
            raise ValueError('Resource checks failed; restoring changed files')
        for rel in c['documents']:
            state['targetHashes'][rel] = digest((root / rel).read_bytes())
        state['metadataHash'] = digest(json.dumps(target['sourceAcquisitionRecognitionControl'], sort_keys=True).encode())
        state['errors'] = 0
        state['noops'] = 0 if receipt['changed'] else state['noops'] + 1
        receipt['status'] = 'updated-and-verified' if receipt['changed'] else 'verified-no-change'
        receipt['hashes'] = state['targetHashes']
    except Exception as e:
        for rel, data in previous.items():
            write(root / rel, data)
        state['errors'] += 1
        state['noops'] = 0
        receipt.update(status='error', error=str(e), rollback=bool(previous))
        receipt['notification'] = notify('Reconciliation needs review: ' + str(e)[:160])
    state['runs'] += 1
    state['lastRun'] = iso
    state['nextDue'] = (max(due, now) + dt.timedelta(days=14)).isoformat()
    state['paused'] = state['errors'] >= 2 or state['noops'] >= 3 or state['runs'] >= c['maxRuns']
    if state['paused']:
        state['pauseReason'] = 'error-noop-or-run-limit'
        receipt['pauseNotification'] = notify('Reconciliation pilot paused at its safety limit. See its canonical receipt.')
    state['lastReceipt'] = receipt
    save(statefile, state)
    save(Path(c['receipt']), state)
    return receipt


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('config', type=Path)
    parser.add_argument('--force', action='store_true')
    parser.add_argument('--watchdog', action='store_true')
    args = parser.parse_args()
    with open(str(args.config) + '.lock', 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        print(json.dumps(run(args.config, args.force, args.watchdog), indent=2))
