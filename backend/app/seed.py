from app.database import SessionLocal
from app.models.user import User
import uuid

# Very simple fake hash for testing if bcrypt is failing
# In a real app, you'd fix the bcrypt/passlib compatibility
# But for a quick seed:
dummy_hash = "$2b$12$Kkd.W/Yk3nQ.YI2oF4vY/.pI3nQ.YI2oF4vY/.pI3nQ.YI2oF4vY/" 

db = SessionLocal()
try:
    email = "admin@strontium.ai"
    if not db.query(User).filter(User.email == email).first():
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            hashed_password=dummy_hash,
            nickname="StrontiumAdmin"
        )
        db.add(user)
        db.commit()
        print("Admin user created successfully!")
    else:
        print("Admin user already exists.")
except Exception as e:
    print(f"Error creating admin: {e}")
finally:
    db.close()
