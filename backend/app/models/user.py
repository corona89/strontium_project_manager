from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nickname = Column(String)
    
    # 2FA 관련 필드
    is_2fa_enabled = Column(Boolean, default=False)
    totp_secret = Column(String, nullable=True) # Encrypted at rest (Option)
    recovery_codes = Column(JSON, nullable=True)
    
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
