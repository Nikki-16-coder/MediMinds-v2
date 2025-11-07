from fastapi import APIRouter, Depends
from app.models.chat_model import ChatMessageCreate
from app.services import chat_service
from app.deps import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("/send")
async def send_message(data: ChatMessageCreate, current_user=Depends(get_current_user)):
    response = await chat_service.handle_chat(current_user.id, data.message)
    return {"response": response}

@router.get("/history")
async def chat_history(current_user=Depends(get_current_user)):
    history = await chat_service.get_chat_history(current_user.id)
    return {"count": len(history), "messages": history}
