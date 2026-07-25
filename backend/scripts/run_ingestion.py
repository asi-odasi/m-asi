"""Pipeline'ı manuel olarak tetiklemek için CLI script.

Kullanım:
    python scripts/run_ingestion.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.logging import configure_logging  # noqa: E402
from app.pipeline.ingest_job import run_ingestion  # noqa: E402

if __name__ == "__main__":
    configure_logging()
    run_ingestion()
