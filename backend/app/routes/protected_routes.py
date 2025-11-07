from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.models.user_model import UserOut

router = APIRouter(prefix="/protected", tags=["Protected Routes"])

@router.get("/user_info", response_model=UserOut)
async def get_user_info(current_user: UserOut = Depends(get_current_user)):
    return current_user
