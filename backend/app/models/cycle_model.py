from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List
from bson import ObjectId

class CycleBase(BaseModel):
    cycle_start: date = Field(..., description="Start date of the menstrual cycle")
    cycle_end: Optional[date] = Field(None, description="End date of the cycle")
    symptoms: Optional[List[str]] = Field(default_factory=list, description="List of reported symptoms")
    notes: Optional[str] = Field(None, description="Optional notes about the cycle")

class CycleCreate(CycleBase):
    pass

class CycleOut(CycleBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
