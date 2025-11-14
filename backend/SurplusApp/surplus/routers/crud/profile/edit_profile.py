from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus.routers.crud.item.destroy_image import destroy_image

router = APIRouter()

class EditProfileForm(BaseModel):
    profile_pic_url: str
    name: str
    contact: str

@router.post("/profile/edit-profile/")
async def edit_profile(request: EditProfileForm, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    user = await get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    
    
    image_destroy_response = "None"

    if request.profile_pic_url != "":
        image_destroy_response = await destroy_image(user.profile_pic_url)
        user.profile_pic_url = request.profile_pic_url
    user.name = request.name
    user.contact = request.contact
    
    db.commit()
    db.refresh(user)

    return {"message": "Item updated successfully", "image_destroy_response": image_destroy_response}