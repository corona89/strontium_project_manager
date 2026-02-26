from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List as PyList

class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    position: Optional[float] = None
    priority: str = "med"
    due_date: Optional[datetime] = None

class CardCreate(CardBase):
    list_id: str

class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[float] = None
    list_id: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    is_archived: Optional[bool] = None

class CardResponse(CardBase):
    id: str
    list_id: str
    is_archived: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ListBase(BaseModel):
    title: str
    position: Optional[float] = None

class ListCreate(ListBase):
    board_id: str

class ListResponse(ListBase):
    id: str
    board_id: str
    cards: PyList[CardResponse] = []
    model_config = ConfigDict(from_attributes=True)
