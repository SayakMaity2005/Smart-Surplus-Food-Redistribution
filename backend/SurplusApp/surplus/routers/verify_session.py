from fastapi import APIRouter, Request, HTTPException, status, Depends
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus.schemas import VerifiedUser

router = APIRouter()

@router.get("/verify-session/")
async def verify_session(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    user = await get_current_user(token, db)
    if not user:
        return {"msg": "Not authorized", "user": None}
        # raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    verifiedUser = VerifiedUser(
        name=user.name,
        username=user.username,
        role=user.role
    )
    return {"msg": "Session valid", "user": verifiedUser}