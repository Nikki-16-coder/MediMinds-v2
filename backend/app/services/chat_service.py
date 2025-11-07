from app.utils.encryption import encrypt_message, decrypt_message
from app.utils.summarizer import summarize_and_store_context
from blockchain.scripts.log_record import log_record
from app.utils.gemini import generate_gemini_response
from app.database import db
from app.services.cycle_service import get_user_cycles, predict_next_cycle
from datetime import datetime
import os
from bson import ObjectId

# -----------------------------
# 🔑 Load Blockchain Secret
# -----------------------------
blockchain_key = os.getenv("BLOCKCHAIN_SECRET_KEY", "your_default_secret_key_here")

def adjust_key_length(key: str, length: int = 32) -> bytes:
    key_bytes = key.encode("utf-8")
    return key_bytes[:length].ljust(length, b"\0")

blockchain_key = adjust_key_length(blockchain_key)

chat_collection = db["chats"]
users_collection = db["users"]

# -----------------------------
# 🧠 Smart Chat Handler
# -----------------------------
async def handle_chat(user_id: str, message: str):
    """
    Handles chat interaction:
    1️⃣ Fetch user profile
    2️⃣ Load cycle data (if applicable)
    3️⃣ Encrypt + log message
    4️⃣ Generate contextual AI response
    5️⃣ Encrypt + store reply
    """

    # 1️⃣ Fetch user context
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"name": 1, "gender": 1, "age": 1, "goals": 1}
    ) or {}

    user_name = user.get("name", "User")
    gender = user.get("gender", "other").lower()
    age = user.get("age", "unknown")
    goals = ", ".join(user.get("goals", [])) if user.get("goals") else "not specified"

    # 2️⃣ Optional: Load cycle data if user is female
    cycle_context = ""
    if gender in ["female", "woman", "female_user"]:
        try:
            cycles = await get_user_cycles(user_id, limit=3)
            prediction = await predict_next_cycle(user_id)

            if cycles:
                last_cycle = cycles[0]
                start = last_cycle.get("cycle_start", "N/A")
                end = last_cycle.get("cycle_end", "N/A")
                cycle_context = (
                    f"Her last recorded menstrual cycle started on {start} and ended on {end}. "
                    f"The average cycle length is about {prediction.get('avg_cycle_length_days', 'N/A')} days. "
                    f"The next predicted cycle may start around {prediction.get('predicted_next_cycle_start', 'N/A')}."
                )
            else:
                cycle_context = "No cycle data found yet for this user."
        except Exception as e:
            print(f"⚠️ Error loading cycle context: {e}")
            cycle_context = "Cycle data unavailable due to error."

    # 3️⃣ Encrypt + store user message
    encrypted_message, iv = encrypt_message(blockchain_key, message)
    await chat_collection.insert_one({
        "user_id": user_id,
        "role": "user",
        "message": encrypted_message,
        "iv": iv,
        "created_at": datetime.utcnow(),
    })

    # 4️⃣ Log to blockchain (optional)
    try:
        log_record(user_id, encrypted_message)
    except Exception as e:
        print(f"⚠️ Blockchain log failed: {e}")

    # 5️⃣ Compose AI prompt
    system_prompt = f"""
    You are MediMinds AI — a mental wellness companion.
    User profile:
    - Name: {user_name}
    - Gender: {gender}
    - Age: {age}
    - Goals: {goals}
    - {cycle_context}

    Always be empathetic, calm, supportive, and concise.
    Use “you” instead of “the user”. 
    If the user asks about menstrual cycles or health, use the latest cycle data and prediction when relevant.
    """

    ai_prompt = f"{system_prompt}\nUser: {message}\nAI:"
    ai_message = await generate_gemini_response("Chat response", ai_prompt)

    # 6️⃣ Encrypt + store AI reply
    encrypted_ai, ai_iv = encrypt_message(blockchain_key, ai_message)
    await chat_collection.insert_one({
        "user_id": user_id,
        "role": "assistant",
        "message": encrypted_ai,
        "iv": ai_iv,
        "created_at": datetime.utcnow(),
    })

    # 7️⃣ Auto-summarize every 10 chats
    total = await chat_collection.count_documents({"user_id": user_id})
    if total % 10 == 0:
        last_ten = await chat_collection.find({"user_id": user_id}).sort("created_at", -1).limit(10).to_list(None)
        plain_msgs = [decrypt_message(blockchain_key, m["message"], m["iv"]) for m in last_ten]
        await summarize_and_store_context(user_id, plain_msgs)

    return ai_message


# -----------------------------
# 📜 Chat History Retrieval
# -----------------------------
async def get_chat_history(user_id: str, limit: int = 20):
    """
    Fetch chat messages (decrypted)
    """
    cursor = chat_collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    messages = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["message"] = decrypt_message(blockchain_key, doc["message"], doc["iv"])
        messages.append(doc)
    return list(reversed(messages))
