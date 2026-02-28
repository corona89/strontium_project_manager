from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# --- Forward declarations for circular refs if needed ---

class BoardBase(BaseModel):
    title: str
    background: Optional[str] = None
    is_public: bool = False

class BoardCreate(BoardBase):
    pass

from app.schemas.list_card import ListResponse

class BoardResponse(BoardBase):
    id: str
    workspace_id: str
    created_at: datetime
    lists: List[ListResponse] = []
    model_config = ConfigDict(from_attributes=True)

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: str
    owner_id: str
    created_at: datetime
    boards: List[BoardResponse] = [] # Include boards for Trello-like homepage
    model_config = ConfigDict(from_attributes=True)
