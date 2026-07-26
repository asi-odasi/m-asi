"""PostgreSQL şemasını SQLAlchemy modellerinden oluşturur (schema.sql'e alternatif).

Kullanım:
    python scripts/init_db.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.logging import configure_logging  # noqa: E402
from app.db.models import Base  # noqa: E402
from app.db.session import engine  # noqa: E402

if __name__ == "__main__":
    configure_logging()
    Base.metadata.create_all(engine)
    print("Tablolar oluşturuldu (veya zaten mevcuttu).")
