import datetime as dt
import logging

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import get_settings
from app.pipeline.ingest_job import run_ingestion

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_scheduler() -> None:
    settings = get_settings()
    scheduler.add_job(
        run_ingestion,
        trigger="interval",
        hours=settings.ingestion_interval_hours,
        next_run_time=dt.datetime.now(),
        id="arxiv_ingestion",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Ingestion scheduler başlatıldı (her %d saatte bir).", settings.ingestion_interval_hours)


def stop_scheduler() -> None:
    scheduler.shutdown()
