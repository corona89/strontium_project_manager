from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.list_card import CardCreate, CardResponse, CardUpdate
from app.models.list_card import List, Card
from app.models.board import WorkspaceMember, Board
from app.api import deps

router = APIRouter(prefix="/cards", tags=["cards"])

@router.post("/", response_model=CardResponse)
def create_card(
    card_in: CardCreate,
    db: Session = Depends(get_db),
    current_user: deps.User = Depends(deps.get_current_user)
):
    target_list = db.query(List).filter(List.id == card_in.list_id).first()
    if not target_list:
        raise HTTPException(status_code=404, detail="List not found")
    
    # Check parent board access
    member = db.query(WorkspaceMember).join(Board).filter(
        Board.id == target_list.board_id,
        WorkspaceMember.workspace_id == Board.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Access denied")

    if card_in.position is None:
        max_pos = db.query(func.max(Card.position)).filter(Card.list_id == card_in.list_id).scalar()
        card_in.position = (max_pos or 0) + 1024.0

    new_card = Card(
        title=card_in.title,
        description=card_in.description,
        list_id=card_in.list_id,
        position=card_in.position,
        priority=card_in.priority,
        due_date=card_in.due_date
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

@router.put("/{card_id}", response_model=CardResponse)
def update_card(
    card_id: str,
    card_update: CardUpdate,
    db: Session = Depends(get_db),
    current_user: deps.User = Depends(deps.get_current_user)
):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
        
    # Logic for update...
    for var, value in vars(card_update).items():
        if value is not None:
            setattr(card, var, value)
            
    db.commit()
    db.refresh(card)
    return card
