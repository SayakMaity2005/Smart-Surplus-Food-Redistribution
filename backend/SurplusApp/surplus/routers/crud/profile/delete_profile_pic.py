from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.routers.authentication.verify_session import verify_session
from surplus.routers.crud.item.destroy_image import destroy_image

router = APIRouter()

class RequestURL(BaseModel):
    profile_pic_url: str

@router.get("/profile/delete-profile-pic/")
async def delete_profile_pic(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    user = await get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    
    image_destroy_response = await destroy_image(user.profile_pic_url)
    user.profile_pic_url = ""
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile pic deleted successfully", "image_destroy_response": image_destroy_response}