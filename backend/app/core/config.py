import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Trello Copy API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SUPER_SECRET_LION_KEY_🐌")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # DB URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trello.db")

    # 2FA 설정
    OTP_ISSUER: str = "TrelloCopy"

    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
