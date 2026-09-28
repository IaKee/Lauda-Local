"""Testes do contrato IPC entre o Electron e o worker Python (worker.py)."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from lauda.worker import EVENT_DONE, EVENT_ERROR, EVENT_PROGRESS


def test_worker_invalid_args(tmp_path: Path) -> None:
    proc = subprocess.run(
        [sys.executable, "-m", "lauda.worker"],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    assert proc.returncode == 2
    assert "uso:" in proc.stdout


def test_worker_invalid_json(tmp_path: Path) -> None:
    bad_job = tmp_path / "bad_job.json"
    bad_job.write_text("invalid json content", encoding="utf-8")

    proc = subprocess.run(
        [sys.executable, "-m", "lauda.worker", str(bad_job)],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    assert proc.returncode == 2
    line = json.loads(proc.stdout.strip())
    assert line["t"] == EVENT_ERROR
    assert "não consegui ler o job" in line["message"]


def test_worker_json_events_schema() -> None:
    # Garantir compatibilidade dos eventos emitidos com o Electron preload
    prog = {"t": EVENT_PROGRESS, "stage": "asr", "fraction": 0.5, "message": "transcrevendo"}
    done = {"t": EVENT_DONE, "result": "/tmp/result.json"}
    err = {"t": EVENT_ERROR, "message": "erro", "kind": "LaudaError"}

    assert json.loads(json.dumps(prog)) == prog
    assert json.loads(json.dumps(done)) == done
    assert json.loads(json.dumps(err)) == err
