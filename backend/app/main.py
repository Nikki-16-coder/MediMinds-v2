
# app/main.py
import sys
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.routes import auth_routes, protected_routes,mood_routes,chat_routes,blockchain_routes,insights_routes,cycle_routes
from app.utils.jwt_handler import verify_access_token

# ✅ Use simple HTTP Bearer instead of OAuth2PasswordBearer
security = HTTPBearer()

app = FastAPI(
    title=settings.APP_NAME,
    description="MEDIMINDS Backend API with simple Bearer Token Authentication",
    version="1.0.0",
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(protected_routes.router)
app.include_router(mood_routes.router)
app.include_router(chat_routes.router)
app.include_router(blockchain_routes.router)
app.include_router(insights_routes.router)
app.include_router(cycle_routes.router)
# Allow frontend React connection
origins = ["http://localhost:5173", "http://127.0.0.1:5173","http://localhost:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": f"🚀 {settings.APP_NAME} backend running successfully"}

# ✅ Optional: simple test route that validates JWT token directly
@app.get("/auth_check")
async def auth_check(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return {"message": "✅ Token is valid", "user": payload}
