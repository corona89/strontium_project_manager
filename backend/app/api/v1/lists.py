from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.list_card import ListCreate, ListResponse
from app.models.list_card import List
from app.models.board import WorkspaceMember, Board
from app.api import deps
from typing import List as PyList

router = APIRouter(prefix="/lists", tags=["lists"])

@router.post("/", response_model=ListResponse)
def create_list(
    list_in: ListCreate,
    db: Session = Depends(get_db),
    current_user: deps.User = Depends(deps.get_current_user)
):
    # Authorization: User must be member of workspace owning this board
    board = db.query(Board).filter(Board.id == list_in.board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
        
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == board.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Access denied")

    # Position logic: if not provided, take max + 1024
    if list_in.position is None:
        max_pos = db.query(func.max(List.position)).filter(List.board_id == list_in.board_id).scalar()
        list_in.position = (max_pos or 0) + 1024.0

    new_list = List(
        title=list_in.title,
        board_id=list_in.board_id,
        position=list_in.position
    )
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list
