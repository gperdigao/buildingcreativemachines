import os
from pathlib import Path
import subprocess


def test_generate_index(tmp_path):
    index_path = Path('export/index.html')
    backup = None
    if index_path.exists():
        backup = index_path.read_bytes()
        index_path.unlink()
    try:
        subprocess.run(["python", "generate_index.py"], check=True, cwd="export-scripts")
        assert index_path.exists()
    finally:
        if index_path.exists():
            index_path.unlink()
        if backup is not None:
            index_path.write_bytes(backup)
