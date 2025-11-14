from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from surplus.database import get_db
from surplus import models
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/home/get-stat-data/")
async def get_stat_data(db: Session = Depends(get_db)):
    all_daily_data = db.query(models.DailyData).all()
    all_monthly_data = db.query(models.MonthlyData).all()
    today_total_items_provided = 0
    this_month_total_items_provided = 0
    this_month_impact_score = 0
    for data in all_daily_data:
        date = datetime.fromisoformat(data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        now = datetime.now(timezone.utc).date()
        if date==now:
            today_total_items_provided += data.items_provided
    for data in all_monthly_data:
        this_month_total_items_provided += data.items_provided
        this_month_impact_score += data.impact_score
    if all_monthly_data: this_month_impact_score = this_month_impact_score/len(all_monthly_data)
    return {"message": "Stat data fetched successful", "data": {"daily_data": today_total_items_provided, "monthly_data": this_month_total_items_provided, "impact_score": this_month_impact_score}}
