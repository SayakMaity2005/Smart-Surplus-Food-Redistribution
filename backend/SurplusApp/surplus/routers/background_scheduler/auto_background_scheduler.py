import asyncio
from sqlalchemy.orm import Session
from surplus.routers.crud.item.remove_expired_item import remove_expired_item
from surplus.database import get_db, SessionLocal
from surplus.routers.background_scheduler.background_scheduler_functions import remove_daily_data, remove_monthly_data, remove_notification_data, remove_collected_items, remove_expired_items_db, handle_events
from surplus import models

def check_expired_items():
    print("Schedule job")

def execute_transfer_expired_items():
    db: Session = SessionLocal()
    asyncio.run(remove_expired_item(db))
    # print(asyncio.run(remove_expired_item(db)))

def execute_remove_daily_data():
    db: Session = SessionLocal()
    asyncio.run(remove_daily_data(db))

def execute_remove_monthly_data():
    db: Session = SessionLocal()
    asyncio.run(remove_monthly_data(db))

def execute_remove_notification_data():
    db: Session = SessionLocal()
    asyncio.run(remove_notification_data(db))

def execute_remove_collected_items():
    db: Session = SessionLocal()
    asyncio.run(remove_collected_items(db))

def execute_remove_expired_items_db():
    db: Session = SessionLocal()
    asyncio.run(remove_expired_items_db(db))

def execute_handle_events():
    db: Session = SessionLocal()
    asyncio.run(handle_events(db))