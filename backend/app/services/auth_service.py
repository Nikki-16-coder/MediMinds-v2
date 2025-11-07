from datetime import datetime
from fastapi import HTTPException, status
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token
from app.database import db

users_collection = db["users"]


# --------------------------
# User Registration
# --------------------------
async def register_user(user_data):
    # Check if user already exists
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password
    hashed_pw = hash_password(user_data.password)

    # ✅ Validate and normalize gender
    gender_value = (user_data.gender or "other").lower()
    if gender_value not in ["male", "female", "other"]:
        gender_value = "other"

    # Create user document
    new_user = {
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": hashed_pw,
        "gender": gender_value,
        "age": user_data.age,
        "goals": user_data.goals or [],
        "created_at": datetime.utcnow(),
        "last_login": None,
    }

    # Insert user
    result = await users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)

    # ✅ Create access + refresh tokens with gender in payload
    token_payload = {"user_id": user_id, "email": user_data.email, "gender": gender_value}
    access_token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "gender": gender_value,
    }


# --------------------------
# User Login
# --------------------------
async def login_user(email: str, password: str):
    # Fetch user by email
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Update last login timestamp
    await users_collection.update_one(
        {"_id": user["_id"]}, {"$set": {"last_login": datetime.utcnow()}}
    )

    # ✅ Include gender (default "other") in JWT payload
    gender_value = user.get("gender", "other").lower()

    token_payload = {"user_id": str(user["_id"]), "email": user["email"], "gender": gender_value}
    access_token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "gender": gender_value,
    }
