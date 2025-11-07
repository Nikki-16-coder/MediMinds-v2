from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.config import settings

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"

# You already had this 👇
def create_access_token(data: dict, expires_minutes: int = settings.JWT_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


# ✅ Add these new ones
def create_refresh_token(data: dict, expires_days: int = 7):
    """Creates a longer-lived refresh token (default: 7 days)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=expires_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token: str):
    """Verifies refresh token and ensures it’s of type 'refresh'"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None


def refresh_access_token(refresh_token: str):
    """Takes a refresh token and returns a new access token if valid"""
    payload = verify_refresh_token(refresh_token)
    if not payload:
        return None
    # Don’t include the refresh token’s 'type' field in the new token
    new_payload = {k: v for k, v in payload.items() if k not in ["exp", "type"]}
    new_access_token = create_access_token(new_payload)
    return new_access_token
