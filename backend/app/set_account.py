from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import uuid

db = SessionLocal()
try:
    email = "corona89@nate.com"
    password = "New1234!@#"
    
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    if user:
        # Update existing user password
        user.hashed_password = get_password_hash(password)
        db.commit()
        print(f"User {email} password updated successfully!")
    else:
        # Create new user
        hashed_password = get_password_hash(password)
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            hashed_password=hashed_password,
            nickname="Master"
        )
        db.add(user)
        db.commit()
        print(f"User {email} created successfully!")
except Exception as e:
    print(f"Error setting up account: {e}")
finally:
    db.close()
