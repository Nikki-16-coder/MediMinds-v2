from fastapi import APIRouter, Depends, HTTPException
from app.services.insight_service import get_weekly_insight, get_mood_trend
from app.utils.jwt_handler import verify_access_token
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter(prefix="/insights", tags=["Insights"])
security = HTTPBearer()


# -----------------------------
# 🧩 Auth Dependency
# -----------------------------
def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodes JWT and returns the full user payload (id, email, gender, etc.)
    instead of only user_id, so AI summaries can be gender/personalized.
    """
    payload = verify_access_token(creds.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload  # ✅ return full payload (not just user_id)


# -----------------------------
# 🌤️ Weekly Emotional Insight
# -----------------------------
@router.get("/weekly", summary="Get weekly emotional insight")
async def weekly_insight(user=Depends(get_current_user)):
    """
    Generates a 7-day AI-powered summary of user's emotional trends,
    personalized by name, gender, and goals.
    """
    user_id = user["user_id"]
    return await get_weekly_insight(user_id)


# -----------------------------
# 📈 Mood/Stress Trend Chart
# -----------------------------
@router.get("/trend", summary="Get mood/stress trend chart data")
async def mood_trend(user=Depends(get_current_user), days: int = 30):
    """
    Returns daily average stress levels for trend visualization.
    """
    user_id = user["user_id"]
    return await get_mood_trend(user_id, days)
