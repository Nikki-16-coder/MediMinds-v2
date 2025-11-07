from datetime import datetime
from app.database import db
from app.utils.gemini import generate_gemini_response
from app.utils.embedding import get_text_embedding
import hashlib
import sys
from pathlib import Path
from bson import ObjectId

# Ensure blockchain folder is importable
ROOT_DIR = Path(__file__).resolve().parents[2]
BLOCKCHAIN_DIR = ROOT_DIR / "blockchain"
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))
if str(BLOCKCHAIN_DIR) not in sys.path:
    sys.path.append(str(BLOCKCHAIN_DIR))

# Blockchain logging utility
from blockchain.scripts.log_record import log_record

user_memory = db["user_memory"]
users_collection = db["users"]

async def summarize_and_store_context(user_id: str, messages: list[str]):
    """
    Summarizes a batch of messages into a short memory chunk,
    includes user context (name, gender, goals),
    stores it with an embedding, and logs a proof hash to the blockchain.
    """
    if not messages:
        return None

    # 🔹 1. Fetch user profile for context (optional fields handled safely)
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"name": 1, "gender": 1, "age": 1, "goals": 1}
    )
    if not user:
        user = {"name": "User", "gender": "other", "age": None, "goals": []}

    user_name = user.get("name") or "User"
    gender = user.get("gender", "other")
    age = user.get("age", "unknown")
    goals = ", ".join(user.get("goals", [])) if user.get("goals") else "not specified"

    # 🔹 2. Combine the last few messages
    joined_text = "\n".join(messages[-10:])

    # 🔹 3. Create Gemini prompt with user awareness
    prompt = f"""
    You are summarizing recent reflections or chat messages for {user_name}.
    Gender: {gender.capitalize()}
    Age: {age}
    Goals: {goals}

    Summarize the following conversation or reflections in 2–3 sentences.
    Focus on emotions, mental state, and recurring themes.
    Be empathetic, culturally appropriate, and refer to the user as "you".

    Conversation:
    {joined_text}
    """

    # 🔹 4. Generate AI summary and embedding
    summary = await generate_gemini_response("Summarize this conversation:", prompt)
    embedding = get_text_embedding(summary)

    # 🔹 5. Store the summary in MongoDB
    doc = {
        "user_id": user_id,
        "summary": summary,
        "embedding": embedding,
        "created_at": datetime.utcnow(),
        "context": {
            "name": user_name,
            "gender": gender,
            "age": age,
            "goals": user.get("goals", [])
        }
    }
    await user_memory.insert_one(doc)

    # 🔹 6. Log the summary to the blockchain (proof-of-integrity)
    try:
        summary_hash = hashlib.sha256(summary.encode("utf-8")).hexdigest()
        log_record(user_id, summary)
        print(f"✅ Blockchain log created for user {user_name} | Hash: {summary_hash}")
    except Exception as e:
        print(f"⚠️ Blockchain logging failed for {user_name}: {e}")

    return summary
