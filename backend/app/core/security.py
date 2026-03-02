from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings
import pyotp
import qrcode
import io
import base64
import bcrypt

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# 2FA Utils
def generate_otp_secret():
    return pyotp.random_base32()

def verify_otp(secret: str, code: str):
    totp = pyotp.TOTP(secret)
    return totp.verify(code)

def get_otp_auth_url(email: str, secret: str):
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=email, issuer_name=settings.OTP_ISSUER
    )

def get_otp_qr_base64(auth_url: str):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(auth_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()
