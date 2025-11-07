from datetime import datetime, timedelta
from app.database import db
from app.utils.summarizer import summarize_and_store_context
from app.utils.gemini import generate_gemini_response
from bson import ObjectId

moods_collection = db["moods"]
users_collection = db["users"]


# ------------------------------
# 🧩 Weekly Insight (Personalized)
# ------------------------------
async def get_weekly_insight(user_id: str):
    """
    Compute weekly average mood & stress trends + generate personalized AI summary.
    """
    since = datetime.utcnow() - timedelta(days=7)
    cursor = moods_collection.find({"user_id": user_id, "created_at": {"$gte": since}})

    moods, stress_levels, notes = [], [], []
    async for entry in cursor:
        if entry.get("mood"):
            moods.append(entry["mood"])
        if entry.get("stress_level"):
            stress_levels.append(entry["stress_level"])
        if entry.get("note"):
            notes.append(entry["note"])

    avg_stress = round(sum(stress_levels) / len(stress_levels), 2) if stress_levels else None
    dominant_mood = max(set(moods), key=moods.count) if moods else None

    # 🔹 Fetch user details for personalization
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"name": 1, "gender": 1, "age": 1, "goals": 1}
    )
    if not user:
        user = {"name": "User", "gender": "other", "goals": []}

    user_name = user.get("name") or "User"
    gender = user.get("gender", "other")
    goals = ", ".join(user.get("goals", [])) if user.get("goals") else "not specified"

    summary = None
    if notes:
        # Combine recent notes into one text for Gemini
        notes_text = "\n".join(notes[-10:])
        ai_prompt = f"""
        You are MediMinds AI — a mental wellness coach.

        User profile:
        - Name: {user_name}
        - Gender: {gender.capitalize()}
        - Goals: {goals}

        Below are the user's reflections from the past week.
        Write a warm, empathetic 2–3 sentence summary highlighting their emotional progress,
        mentioning their goals when relevant. Address them directly as "you".

        Reflections:
        {notes_text}
        """

        try:
            summary = await generate_gemini_response("Weekly mood summary:", ai_prompt)
        except Exception as e:
            print(f"⚠️ AI summary failed: {e}")
            # Fallback to internal summarizer if AI fails
            summary = await summarize_and_store_context(user_id, notes)

    return {
        "user": {"name": user_name, "gender": gender},
        "average_stress": avg_stress,
        "dominant_mood": dominant_mood,
        "entries": len(moods),
        "ai_summary": summary or "Not enough data yet",
        "period_start": since,
        "period_end": datetime.utcnow(),
    }


# ------------------------------
# 📊 Mood Trend (30-day Chart)
# ------------------------------
async def get_mood_trend(user_id: str, days: int = 30):
    """
    Returns daily average stress over a given range for trend charting.
    """
    since = datetime.utcnow() - timedelta(days=days)
    pipeline = [
        {"$match": {"user_id": user_id, "created_at": {"$gte": since}}},
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                "avg_stress": {"$avg": "$stress_level"},
            }
        },
        {"$sort": {"_id": 1}},
    ]

    results = await moods_collection.aggregate(pipeline).to_list(None)
    return [
        {"date": r["_id"], "avg_stress": round(r["avg_stress"], 2)} for r in results
    ]
