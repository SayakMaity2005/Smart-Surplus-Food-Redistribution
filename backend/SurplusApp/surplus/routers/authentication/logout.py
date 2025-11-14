from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/logout/")
async def logout():
    response = JSONResponse(content={"status": "ok", "message": "Logout successful!"})
    response.delete_cookie(
        key="surplus_access_token",
        path="/",
        samesite="None",
        secure=True
    )
    return response