from fastapi import APIRouter, HTTPException
from app.models.user_model import UserCreate, UserLogin
from app.services import auth_service
from app.utils.jwt_handler import verify_refresh_token, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# 🆕 User Signup
@router.post("/signup", summary="Register a new user")
async def signup(user: UserCreate):
    return await auth_service.register_user(user)

# 🔑 User Login
@router.post("/login", summary="User Login")
async def login(credentials: UserLogin):
    return await auth_service.login_user(credentials.email, credentials.password)

# 🔄 Refresh Access Token
@router.post("/refresh", summary="Refresh Access Token")
async def refresh_access_token(refresh_token: str):
    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access_token = create_access_token(
        {"user_id": payload["user_id"], "email": payload["email"]}
    )
    return {"access_token": new_access_token, "token_type": "bearer"}
