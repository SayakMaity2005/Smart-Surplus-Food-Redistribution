from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.schemas import EditItemForm, CheckEdit
from surplus.routers.authentication.verify_session import verify_session
from surplus.routers.crud.item.destroy_image import destroy_image

router = APIRouter()

@router.post("/admin/remove-item/")
async def remove_item(request: CheckEdit, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to remove item")
    
    item = db.query(models.Item).filter(models.Item.id == request.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item and item.admin_id != current_admin.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to remove item")
    # update daily data
    curr_admin_daily_data = db.query(models.DailyData).filter(models.DailyData.admin_id == current_admin.id).all()
    curr_admin_today_data = None
    for daily_data in curr_admin_daily_data:
        date = datetime.fromisoformat(daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        added_date = datetime.fromisoformat(item.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        if date == added_date:
            curr_admin_today_data = daily_data
            break
    if curr_admin_today_data:
        if curr_admin_today_data.items_provided > 0: curr_admin_today_data.items_provided -= 1
        db.commit()
    # update monthly data
    curr_admin_monthly_data = db.query(models.MonthlyData).filter(models.MonthlyData.admin_id == current_admin.id).all()
    curr_admin_this_month_data = None
    for monthly_data in curr_admin_monthly_data:
        date = datetime.fromisoformat(monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        added_date = datetime.fromisoformat(item.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc).month
        if date == added_date:
            curr_admin_this_month_data = monthly_data
            break
    if curr_admin_this_month_data:
        if curr_admin_this_month_data.items_provided > 0: curr_admin_this_month_data.items_provided -= 1
        db.commit()

    # remove item
    image_destroy_response = "None"
    image_destroy_response = await destroy_image(item.image_url)
    db.delete(item)
    db.commit()

    return {"message": "Item removed successfully", "image_destroy_response": image_destroy_response}
