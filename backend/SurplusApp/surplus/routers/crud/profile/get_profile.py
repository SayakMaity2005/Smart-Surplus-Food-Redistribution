from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from surplus.auth import get_db
from surplus.auth import get_current_user
from surplus import models
from sqlalchemy.orm import Session

router = APIRouter()

class ProfileData(BaseModel):
    name: str
    username: str
    role: str
    contact: str
    profile_pic_url: str


@router.get("/profile/get-profile/")
async def get_profile(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    user = await get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    

    userProfile = ProfileData(
        name=user.name,
        username=user.username,
        role=user.role,
        contact=user.contact,
        profile_pic_url=user.profile_pic_url
    )

    return {"message": "Profile data fetched successful", "data": userProfile}