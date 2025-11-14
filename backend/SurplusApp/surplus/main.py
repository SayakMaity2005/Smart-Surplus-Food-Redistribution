from fastapi import FastAPI
from surplus import models
from surplus.database import engine
from surplus.routers.authentication import register, login, logout, verify_session, check_registration_request, generate_otp, verify_otp
from surplus.routers.crud.item import add_item, get_added_items, select_item, get_all_items, get_selected_items_user, edit_item, confirm_donation, remove_item, remove_selected_item, upload_image
from surplus.routers.crud.stat_data import get_daily_stat_data, get_daily_user_stat_data, get_user_current_data
from surplus.routers.crud.notification import get_admin_notification, get_user_notification, make_notification_seen
from surplus.routers.crud.event import add_event, get_all_events, remove_event
from surplus.routers.crud.home import get_stat_data
from surplus.routers.crud.profile import get_profile, edit_profile, discard_profile_edit, delete_profile_pic
from surplus.routers.background_scheduler import auto_background_scheduler
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(verify_session.router)
app.include_router(add_item.router)
app.include_router(get_added_items.router)
app.include_router(select_item.router)
app.include_router(get_all_items.router)
# app.include_router(remove_expired_item.router)
app.include_router(get_selected_items_user.router)
app.include_router(edit_item.router)
app.include_router(get_daily_stat_data.router)
app.include_router(check_registration_request.router)
app.include_router(generate_otp.router)
app.include_router(verify_otp.router)
app.include_router(confirm_donation.router)
app.include_router(get_daily_user_stat_data.router)
app.include_router(get_user_current_data.router)
app.include_router(get_admin_notification.router)
app.include_router(get_user_notification.router)
app.include_router(make_notification_seen.router)
app.include_router(remove_item.router)
app.include_router(upload_image.router)
app.include_router(remove_selected_item.router)
app.include_router(add_event.router)
app.include_router(get_all_events.router)
app.include_router(remove_event.router)
app.include_router(get_stat_data.router)
app.include_router(get_profile.router)
app.include_router(edit_profile.router)
app.include_router(discard_profile_edit.router)
app.include_router(delete_profile_pic.router)


scheduler = BackgroundScheduler()
# scheduler.add_job(check_expired_items, 'interval', seconds=3)  # runs every 3 seconds
scheduler.add_job(auto_background_scheduler.execute_transfer_expired_items, 'interval', minutes=5)  # runs every 5 minutes
scheduler.add_job(auto_background_scheduler.execute_remove_daily_data, 'cron', hour=3, minute=30)  # runs every day at dawn
scheduler.add_job(auto_background_scheduler.execute_remove_monthly_data, 'cron', hour=3, minute=35)  # runs every day at dawn
scheduler.add_job(auto_background_scheduler.execute_remove_notification_data, 'cron', hour=3, minute=40)  # runs every day at dawn
scheduler.add_job(auto_background_scheduler.execute_remove_collected_items, 'cron', hour=3, minute=45)  # runs every day at dawn
scheduler.add_job(auto_background_scheduler.execute_remove_expired_items_db, 'cron', hour=3, minute=50)  # runs every day at dawn
scheduler.add_job(auto_background_scheduler.execute_handle_events, 'cron', hour=3, minute=55)  # runs every day at dawn

scheduler.start()


models.Base.metadata.create_all(bind=engine)