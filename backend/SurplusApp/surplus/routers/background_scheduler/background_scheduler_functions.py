import smtplib
from fastapi import Depends, HTTPException
from datetime import datetime, timezone
from fastapi_mail import FastMail, MessageSchema
from sqlalchemy.orm import Session
from surplus import models
from surplus.database import get_db
from surplus.mail_config import configuration
from surplus.routers.crud.item.destroy_image import destroy_image

# auto delete one month old daily data
async def remove_daily_data(db: Session = Depends(get_db)):
    all_daily_data = db.query(models.DailyData).all()
    for daily_data in all_daily_data:
        date = datetime.fromisoformat(daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            db.delete(daily_data)
    db.commit()
    all_user_daily_data = db.query(models.UserDailyData).all()
    for user_daily_data in all_user_daily_data:
        date = datetime.fromisoformat(user_daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            db.delete(user_daily_data)
    db.commit()

# auto delete one year old monthly data
async def remove_monthly_data(db: Session = Depends(get_db)):
    all_monthly_data = db.query(models.MonthlyData).all()
    for monthly_data in all_monthly_data:
        date = datetime.fromisoformat(monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 365:
            db.delete(monthly_data)
    db.commit()
    all_user_monthly_data = db.query(models.UserMonthlyData).all()
    for user_monthly_data in all_user_monthly_data:
        date = datetime.fromisoformat(user_monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 365:
            db.delete(user_monthly_data)
    db.commit()

# auto delete one month old notification data
async def remove_notification_data(db: Session = Depends(get_db)):
    all_admin_notifications = db.query(models.AdminNotification).all()
    for admin_notification in all_admin_notifications:
        date = datetime.fromisoformat(admin_notification.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            db.delete(admin_notification)
    db.commit()
    all_user_notifications = db.query(models.UserNotification).all()
    for user_notification in all_user_notifications:
        date = datetime.fromisoformat(user_notification.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            db.delete(user_notification)
    db.commit()

# auto delete collected items data after one month
async def remove_collected_items(db: Session = Depends(get_db)):
    all_collected_items = db.query(models.CollectedItem).all()
    for collected_item in all_collected_items:
        date = datetime.fromisoformat(collected_item.collection_time.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            image_destroy_response = await destroy_image(collected_item.image_url)
            db.delete(collected_item)
    db.commit()

# clear expired items from database
async def remove_expired_items_db(db: Session = Depends(get_db)):
    all_expired_items = db.query(models.ExpiredItem).all()
    for expired_item in all_expired_items:
        date = datetime.fromisoformat(expired_item.expiry_time.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        delta = (now-date).days
        if delta >= 30:
            image_destroy_response = await destroy_image(expired_item.image_url)
            db.delete(expired_item)
    db.commit()

# clear event after exceeding the date from database and add notification on the event date
async def handle_events(db: Session = Depends(get_db)):
    all_upcoming_events = db.query(models.AdminUpcomingEvent).all()
    for upcoming_event in all_upcoming_events:
        event_date = datetime.fromisoformat(upcoming_event.event_date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        today = datetime.now(timezone.utc).date()
        if event_date == today:
            new_notification = models.AdminNotification(
                message = f"Event {upcoming_event.title} is today.",
                seen = False,
                timestamp = datetime.now(timezone.utc).isoformat(),
            )
            new_notification.admin = upcoming_event.admin
            db.add(new_notification)
            db.commit()
            db.refresh(new_notification)
            # Mail Sending ------------------------------------- ##
            admin = db.query(models.Admin).filter(models.Admin.id == upcoming_event.admin_id).first()
            email = str(admin.username)
            message = MessageSchema(
                subject="Event Reminder",
                recipients=[email],
                body=f"Dear {admin.name},\nYou have an event {upcoming_event.title} today at {upcoming_event.location}.",
                subtype="plain"
            )
            try:
                fm = FastMail(configuration)
                await fm.send_message(message)
            except smtplib.SMTPRecipientsRefused:
                return {"status_code":"400", "detail":"Invalid email address"}
            except Exception as e:
                return {"status_code":"500", "detail":f"Email sending failed: {str(e)}"}
        elif today > event_date:
            db.delete(upcoming_event)
    db.commit()
