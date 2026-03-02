from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import uuid

db = SessionLocal()
try:
    email = "admin@strontium.ai"
    user = db.query(User).filter(User.email == email).first()
    if user:
        db.delete(user)
        db.commit()
        
    hashed_password = get_password_hash("password123")
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        hashed_password=hashed_password,
        nickname="StrontiumAdmin"
    )
    db.add(user)
    db.commit()
    print("Admin user re-seeded successfully!")
except Exception as e:
    print(f"Error seeding: {e}")
finally:
    db.close()
