from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.schemas import EditItemForm, CheckEdit
from surplus.routers.authentication.verify_session import verify_session
from surplus.routers.crud.item.destroy_image import destroy_image

router = APIRouter()

@router.post("/admin/check-editability/")
async def check_editability(request: CheckEdit, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to edit item")
    
    old_item = db.query(models.Item).filter(models.Item.id == request.id).first()
    if not old_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item already selected or not in database")
    if old_item.admin_id != current_admin.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to edit item")
    # if old_item.select == True:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item already selected, Not allowed to edit")
    return {"message": "You are eligible to edit"}


@router.post("/admin/edit-item/")
async def edit_item(request: EditItemForm, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to edit item")
    
    old_item = db.query(models.Item).filter(models.Item.id == request.id)
    if not old_item.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item already selected or not in database")
    if old_item.first().admin_id != current_admin.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to edit item")
    
    image_destroy_response = "None"

    if request.image_url == "":
        old_item.update({
            "title": request.title,
            "type": request.type,
            "quantity": request.quantity,
            "unit": request.unit,
            "freshness_level": request.freshness_level,
            "pickup_location": request.pickup_location,
            "expiry_time": request.expiry_time,
            "special_instruction": request.special_instruction,
            "provided_quantity": request.quantity
        }, synchronize_session=False)
    else:
        image_destroy_response = await destroy_image(old_item.first().image_url)
        old_item.update({
            "title": request.title,
            "type": request.type,
            "quantity": request.quantity,
            "unit": request.unit,
            "freshness_level": request.freshness_level,
            "pickup_location": request.pickup_location,
            "expiry_time": request.expiry_time,
            "special_instruction": request.special_instruction,
            "provided_quantity": request.quantity,
            "image_url": request.image_url
        }, synchronize_session=False)
    # new_item = models.Item(
    #     title = request.title,
    #     type = request.type,
    #     quantity = request.quantity,
    #     unit = request.unit,
    #     freshness_level = request.freshness_level,
    #     pickup_location = request.pickup_location,
    #     expiry_time = request.expiry_time,
    #     timestamp = request.timestamp,
    #     special_instruction = request.special_instruction,
    #     select = False
    # )
    # new_item.admin = current_admin
    
    db.commit()
    return {"message": "Item updated successfully", "image_destroy_response": image_destroy_response}
