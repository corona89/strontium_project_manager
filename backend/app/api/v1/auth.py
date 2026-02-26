from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token, OTPSetup, UserLogin
from app.services import auth_service
from app.api import deps
from app.core.security import create_access_token, generate_otp_secret, get_otp_auth_url, verify_otp, get_otp_qr_base64
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    return auth_service.register_user(db, user_in)

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.is_2fa_enabled:
        temp_token = create_access_token(data={"sub": user.id, "2fa_pending": True})
        return {"access_token": temp_token, "token_type": "bearer", "is_2fa_required": True}
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer", "is_2fa_required": False}

@router.post("/2fa/setup", response_model=OTPSetup)
def setup_2fa(user: User = Depends(deps.get_current_user), db: Session = Depends(get_db)):
    if user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="2FA already enabled")
    secret = generate_otp_secret()
    user.totp_secret = secret
    db.commit()
    
    auth_url = get_otp_auth_url(user.email, secret)
    qr_code = deps.security.get_otp_qr_base64(auth_url)
    return {"otp_auth_url": auth_url, "secret_key": secret, "qr_code_base64": qr_code}

@router.post("/2fa/verify", response_model=Token)
def verify_2fa(code: str, user: User = Depends(deps.get_current_user_2fa_pending), db: Session = Depends(get_db)):
    if not user.totp_secret:
        raise HTTPException(status_code=400, detail="OTP not setup")
        
    if not verify_otp(user.totp_secret, code):
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    user.is_2fa_enabled = True
    db.commit()
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer", "is_2fa_required": False}
