from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import verify_access_token
from app.models.cycle_model import CycleCreate
from app.services import cycle_service

router = APIRouter(prefix="/cycle", tags=["Cycle Tracking"])
security = HTTPBearer()


# -----------------------------
# 🧠 Auth Dependency
# -----------------------------
def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodes the JWT and returns the full payload (id, email, gender, etc.)
    so we can enforce gender-based access control.
    """
    payload = verify_access_token(creds.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload  # contains user_id, gender, email, etc.


# -----------------------------
# 🩸 Log a Cycle Entry
# -----------------------------
@router.post("/", summary="Log a menstrual cycle entry")
async def log_cycle(data: CycleCreate, user=Depends(get_current_user)):
    """
    Records a new menstrual cycle entry for female users only.
    """
    if user.get("gender") != "female":
        raise HTTPException(
            status_code=403,
            detail="Cycle tracking is available only for female users."
        )
    return await cycle_service.log_cycle(user["user_id"], data)


# -----------------------------
# 📜 Get Cycle History
# -----------------------------
@router.get("/", summary="Get user's cycle history")
async def get_cycles(user=Depends(get_current_user)):
    """
    Retrieves the user's past menstrual cycle entries.
    """
    if user.get("gender") != "female":
        raise HTTPException(
            status_code=403,
            detail="Cycle tracking is available only for female users."
        )
    return await cycle_service.get_user_cycles(user["user_id"])


# -----------------------------
# 🔮 Predict Next Cycle
# -----------------------------
@router.get("/predict", summary="Predict next cycle start date")
async def predict_cycle(user=Depends(get_current_user)):
    """
    Predicts the next menstrual cycle start date based on the most recent records.
    """
    if user.get("gender") != "female":
        raise HTTPException(
            status_code=403,
            detail="Cycle tracking is available only for female users."
        )
    return await cycle_service.predict_next_cycle(user["user_id"])
