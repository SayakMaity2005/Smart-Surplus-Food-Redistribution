from fastapi import APIRouter, Depends
from pydantic import BaseModel
from surplus.auth import get_db
from surplus import models
from sqlalchemy.orm import Session

router = APIRouter()

class RequestSchema(BaseModel):
    num_admin: int

class TopAdminData:
    def __init__(self, name, profile_pic_url, impact_score, items_provided_in_month):
        self.name: str = name
        self.profile_pic_url: str = profile_pic_url
        self.impact_score: float = impact_score
        self.items_provided_in_month: int = items_provided_in_month


@router.post("/home/get-top-n-admins/")
async def get_top_n_admins(request: RequestSchema, db: Session = Depends(get_db)):
    highest_items_provided_monthly_data = db.query(models.MonthlyData).order_by(models.MonthlyData.items_provided.desc()).first()
    highest_items_provided = highest_items_provided_monthly_data.items_provided
    if highest_items_provided == 0: highest_items_provided = 1
    top_n_items_provided_monthly_data = db.query(models.Admin).order_by(
        ((0.75*(models.Admin.monthly_data.impact_score))+(0.25*((100.0*(models.Admin.monthly_data.items_provided))/highest_items_provided))).desc()
    ).limit(request.num_admin).all()
    top_n_admins: list[TopAdminData] = []
    # for monthly_data in top_n_items_provided_monthly_data:
    #     top_n_admins.append(TopAdminData(monthly_data.admin.name, monthly_data.admin.profile_pic_url, monthly_data.impact_score, monthly_data.items_provided))

    for admin_data in top_n_items_provided_monthly_data:
        top_n_admins.append(TopAdminData(admin_data.name, admin_data.profile_pic_url, admin_data.monthly_data.impact_score, admin_data.monthly_data.items_provided))

    return {"message": "Top admins data collected", "data": top_n_admins}


