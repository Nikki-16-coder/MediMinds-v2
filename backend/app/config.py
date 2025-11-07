from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    APP_NAME: str = "MEDIMINDS"
    APP_ENV: str = "dev"
    PORT: int = 8000

    MONGO_URI: str
    MONGO_DB: str

    GEMINI_API_KEY:str
    BLOCKCHAIN_SECRET_KEY: str | None = None

    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    class Config:
        env_file = ".env"

settings = Settings()
