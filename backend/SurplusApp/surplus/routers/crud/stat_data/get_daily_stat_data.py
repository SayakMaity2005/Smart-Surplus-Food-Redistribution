from datetime import datetime, timezone
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from surplus.database import get_db
from surplus.auth import get_current_user
from surplus import models

router = APIRouter()

@router.get("/admin/get-daily-stat-data/")
async def get_daily_stat_data(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to get stat data")
    
    # Accessing daily data
    all_daily_data = db.query(models.DailyData).filter(models.DailyData.admin_id == current_admin.id).all()
    today_daily_data = None
    for daily_data in all_daily_data: 
        date = datetime.fromisoformat(daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        now = datetime.now(timezone.utc).date()
        if date == now:
            today_daily_data = daily_data
            break
    if not today_daily_data:
        curr_admin_new_daily_data = models.DailyData(
            date=datetime.now(timezone.utc).isoformat(),
            total_donations = 0,
            partial_donation = 0,
            impact_score = 0,
            items_provided = 0,
            admin = current_admin
        )
        db.add(curr_admin_new_daily_data)
        db.commit()
        today_daily_data = curr_admin_new_daily_data

    # Accessing monthly data
    all_monthly_data = db.query(models.MonthlyData).filter(models.MonthlyData.admin_id == current_admin.id).all()
    curr_monthly_data = None
    for monthly_data in all_monthly_data: 
        date = datetime.fromisoformat(monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        now = datetime.now(timezone.utc).month
        if date == now:
            curr_monthly_data = monthly_data
            break
    if not curr_monthly_data:
        curr_admin_new_monthly_data = models.MonthlyData(
            date=datetime.now(timezone.utc).isoformat(),
            total_donations = 0,
            partial_donation = 0,
            impact_score = 0,
            items_provided = 0,
            admin = current_admin
        )
        db.add(curr_admin_new_monthly_data)
        db.commit()
        curr_monthly_data = curr_admin_new_monthly_data
    
    return {"message": "Daily stat data accessed successfully", "data": {"daily_data": today_daily_data, "monthly_data": curr_monthly_data}}