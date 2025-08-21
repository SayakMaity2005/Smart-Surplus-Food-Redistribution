from fastapi import APIRouter, Response

router = APIRouter()

@router.post("/logout/")
async def logout(response: Response):
    response.delete_cookie(key="surplus_access_token")
    return {"status": "ok", "message": "Logout successful!"}