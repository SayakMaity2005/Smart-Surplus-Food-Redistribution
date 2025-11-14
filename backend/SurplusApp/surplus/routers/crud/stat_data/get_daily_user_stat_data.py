from datetime import datetime, timezone
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.get("/user/get-daily-user-stat-data/")
async def get_daily_user_stat_data(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to get user stat data")
    
    # Accessing daily user data
    all_user_daily_data = db.query(models.UserDailyData).filter(models.UserDailyData.user_id == current_user.id).all()
    today_user_daily_data = None
    for user_daily_data in all_user_daily_data: 
        date = datetime.fromisoformat(user_daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        now = datetime.now(timezone.utc).date()
        if date == now:
            today_user_daily_data = user_daily_data
            break
    if not today_user_daily_data:
        curr_user_new_daily_data = models.UserDailyData(
            date=datetime.now(timezone.utc).isoformat(),
            items_received = 0,
            user = current_user
        )
        db.add(curr_user_new_daily_data)
        db.commit()
        today_user_daily_data = curr_user_new_daily_data

    # Accessing monthly user data
    all_user_monthly_data = db.query(models.UserMonthlyData).filter(models.UserMonthlyData.user_id == current_user.id).all()
    curr_user_monthly_data = None
    for user_monthly_data in all_user_monthly_data: 
        date = datetime.fromisoformat(user_monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        now = datetime.now(timezone.utc).month
        if date == now:
            curr_user_monthly_data = user_monthly_data
            break
    if not curr_user_monthly_data:
        curr_user_new_monthly_data = models.UserMonthlyData(
            date=datetime.now(timezone.utc).isoformat(),
            items_received = 0,
            user = current_user
        )
        db.add(curr_user_new_monthly_data)
        db.commit()
        curr_user_monthly_data = curr_user_new_monthly_data

    return {"message": "Daily stat data accessed successfully", "data": {"daily_data": today_user_daily_data, "monthly_data": curr_user_monthly_data}}