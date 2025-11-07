from datetime import datetime
from bson import ObjectId
from app.database import db
from app.models.mood_model import MoodCreate

moods_collection = db["moods"]

async def log_mood(user_id: str, data: MoodCreate):
    mood_doc = {
        "user_id": ObjectId(user_id),
        "mood": data.mood,
        "stress_level": data.stress_level,
        "note": data.note,
        "created_at": datetime.utcnow(),
    }
    result = await moods_collection.insert_one(mood_doc)
    mood_doc["_id"] = str(result.inserted_id)
    mood_doc["user_id"] = user_id
    return mood_doc

async def get_user_moods(user_id: str, limit: int = 30):
    cursor = moods_collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).limit(limit)
    moods = []
    async for m in cursor:
        m["_id"] = str(m["_id"])
        m["user_id"] = str(m["user_id"])
        moods.append(m)
    return moods
