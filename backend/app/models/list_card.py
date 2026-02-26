from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class List(Base):
    __tablename__ = "lists"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id = Column(String, ForeignKey("boards.id"), nullable=False)
    title = Column(String, nullable=False)
    position = Column(Float, default=65535.0) # Fractional Indexing

    board = relationship("Board", back_populates="lists")
    cards = relationship("Card", back_populates="list", cascade="all, delete-orphan", order_by="Card.position")

class Card(Base):
    __tablename__ = "cards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    list_id = Column(String, ForeignKey("lists.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    position = Column(Float, default=65535.0)
    due_date = Column(DateTime, nullable=True)
    priority = Column(String, default="med") # low, med, high
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    list = relationship("List", back_populates="cards")
    # comments = relationship("Comment", back_populates="card", cascade="all, delete-orphan")
