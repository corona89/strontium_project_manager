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

    # CORS 설정 (Pydantic v2는 쉼표 구분된 문자열을 리스트로 자동 파싱 가능)
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # 2FA 설정
    OTP_ISSUER: str = "TrelloCopy"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
