from app.database import engine, Base
from app.models.user import User
from app.models.workspace import Workspace
from app.models.board import Board
from app.models.list import List
from app.models.card import Card

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
