from passlib.context import CryptContext

# Initialize the context for bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt, truncating if longer than 72 bytes.
    """
    if not password:
        raise ValueError("Password cannot be empty")

    # Ensure password isn't longer than 72 bytes (bcrypt limit)
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a stored hash.
    """
    if not plain_password or not hashed_password:
        return False

    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')

    return pwd_context.verify(plain_password, hashed_password)
