# app/routes/blockchain_routes.py

from fastapi import APIRouter, Depends, HTTPException
from app.services import blockchain_service
from app.deps import get_current_user

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])

@router.post("/log")
async def log_blockchain_record(data: dict, user=Depends(get_current_user)):
    """
    Logs a new blockchain record from user activity (chat summary, mood log, etc.).
    """
    if "content" not in data:
        raise HTTPException(status_code=400, detail="Missing 'content' field.")
    
    block = await blockchain_service.add_record_to_blockchain(user.id, data["content"])
    return {"status": "success", "block": block}

@router.post("/verify")
async def verify_blockchain_record(data: dict):
    """
    Verifies if a given content exists on the blockchain (integrity check).
    """
    if "content" not in data:
        raise HTTPException(status_code=400, detail="Missing 'content' field.")
    
    exists = await blockchain_service.verify_record_integrity(data["content"])
    return {"exists": exists}

@router.post("/reward")
async def reward_user_for_action(data: dict, user=Depends(get_current_user)):
    """
    Rewards a user with tokens for engagement.
    """
    tokens = data.get("tokens", 1)
    new_balance = await blockchain_service.reward_user(user.id, tokens)
    return {"message": f"{tokens} token(s) added.", "balance": new_balance}

@router.get("/balance")
async def get_user_balance(user=Depends(get_current_user)):
    """
    Returns the user's total token balance.
    """
    balance = await blockchain_service.get_user_balance(user.id)
    return {"user": user.email, "balance": balance}
