from fastapi import APIRouter, Depends
from app.models.mood_model import MoodCreate
from app.services import mood_service
from app.deps import get_current_user

router = APIRouter(prefix="/mood", tags=["Mood Tracker"])

@router.post("/log")
async def log_mood_entry(data: MoodCreate, current_user=Depends(get_current_user)):
    mood_entry = await mood_service.log_mood(current_user.id, data)
    return {"message": "Mood logged successfully", "data": mood_entry}

@router.get("/history")
async def get_mood_history(current_user=Depends(get_current_user)):
    moods = await mood_service.get_user_moods(current_user.id)
    return {"count": len(moods), "moods": moods}
