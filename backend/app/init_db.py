from app.database import engine, Base
from app.models.user import User
import os

print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
