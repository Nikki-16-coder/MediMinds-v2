from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ChatMessageCreate(BaseModel):
    message: str = Field(..., description="User's message for the AI")

class ChatMessageOut(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    role: str  # "user" or "assistant"
    message: str
    created_at: datetime

class ChatHistory(BaseModel):
    user_id: str
    messages: List[ChatMessageOut]
