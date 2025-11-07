from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MoodCreate(BaseModel):
    mood: str = Field(..., description="Mood description like 'happy', 'sad', 'stressed'")
    stress_level: Optional[int] = Field(None, ge=1, le=10, description="Stress level from 1–10")
    note: Optional[str] = Field(None, description="Optional user note or reflection")

class MoodOut(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    mood: str
    stress_level: Optional[int]
    note: Optional[str]
    created_at: datetime
