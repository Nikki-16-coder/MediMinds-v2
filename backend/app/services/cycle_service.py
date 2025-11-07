from datetime import datetime, timedelta, date
from bson import ObjectId
from app.database import db
from app.models.cycle_model import CycleCreate

cycles_collection = db["cycles"]


# ───────────────────────────────────────────────
# 🧩 Utility: Ensure Mongo-Safe Date Format
# ───────────────────────────────────────────────
def to_datetime(value):
    """Convert date → datetime for MongoDB safety."""
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):
        return datetime.combine(value, datetime.min.time())
    return None


# ───────────────────────────────────────────────
# 🩸 Log a new cycle entry
# ───────────────────────────────────────────────
async def log_cycle(user_id: str, data: CycleCreate):
    """
    Logs a new menstrual cycle entry for a given user.
    Converts all date fields to datetime before saving.
    """

    doc = {
        "user_id": ObjectId(user_id),
        "cycle_start": to_datetime(data.cycle_start),
        "cycle_end": to_datetime(data.cycle_end),
        "symptoms": data.symptoms or [],
        "notes": data.notes or "",
        "created_at": datetime.utcnow(),
    }

    try:
        result = await cycles_collection.insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        doc["user_id"] = user_id
        # Convert datetime fields for JSON safety
        if isinstance(doc.get("cycle_start"), datetime):
            doc["cycle_start"] = doc["cycle_start"].isoformat()
        if isinstance(doc.get("cycle_end"), datetime):
            doc["cycle_end"] = doc["cycle_end"].isoformat()
        doc["created_at"] = doc["created_at"].isoformat()
        return doc
    except Exception as e:
        print(f"❌ Error inserting cycle document: {e}")
        raise e


# ───────────────────────────────────────────────
# 📜 Fetch user’s cycle history
# ───────────────────────────────────────────────
async def get_user_cycles(user_id: str, limit: int = 10):
    """
    Fetch recent menstrual cycles for a user.
    Converts all datetime fields to ISO strings for safe JSON serialization.
    """
    try:
        cursor = (
            cycles_collection.find({"user_id": ObjectId(user_id)})
            .sort("cycle_start", -1)
            .limit(limit)
        )

        cycles = []
        async for c in cursor:
            c["_id"] = str(c["_id"])
            c["user_id"] = str(c["user_id"])

            # Convert datetimes to ISO strings
            if isinstance(c.get("cycle_start"), datetime):
                c["cycle_start"] = c["cycle_start"].isoformat()
            if isinstance(c.get("cycle_end"), datetime):
                c["cycle_end"] = c["cycle_end"].isoformat()
            if c.get("created_at"):
                c["created_at"] = c["created_at"].isoformat()

            cycles.append(c)

        return cycles
    except Exception as e:
        print(f"❌ Error fetching cycles for user {user_id}: {e}")
        raise e


# ───────────────────────────────────────────────
# 🔮 Predict next cycle start date
# ───────────────────────────────────────────────
async def predict_next_cycle(user_id: str):
    """
    Predicts the next menstrual cycle start date based on the latest logged data.
    Assumes an average cycle length equal to the last recorded cycle duration.
    """

    try:
        last_cycle = await cycles_collection.find_one(
            {"user_id": ObjectId(user_id)}, sort=[("cycle_start", -1)]
        )

        if not last_cycle or not last_cycle.get("cycle_end"):
            return {
                "message": "Not enough data to predict next cycle",
                "predicted_next_cycle_start": None,
            }

        start = last_cycle["cycle_start"]
        end = last_cycle["cycle_end"]

        if not isinstance(start, datetime) or not isinstance(end, datetime):
            return {
                "message": "Invalid stored cycle data format",
                "predicted_next_cycle_start": None,
            }

        # Calculate cycle length and predict
        avg_length = (end - start).days or 28
        next_start = start + timedelta(days=avg_length)

        return {
            "predicted_next_cycle_start": next_start.isoformat(),
            "avg_cycle_length_days": avg_length,
            "message": "Prediction generated successfully",
        }

    except Exception as e:
        print(f"❌ Error predicting next cycle for user {user_id}: {e}")
        raise e
