from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    nickname: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_2fa_enabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    is_2fa_required: bool = False # 2FA 미완료 시 True

class OTPSetup(BaseModel):
    otp_auth_url: str
    secret_key: str
    qr_code_base64: Optional[str] = None
