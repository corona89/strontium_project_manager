from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.board import WorkspaceCreate, WorkspaceResponse, BoardCreate, BoardResponse, BoardBase
from app.models.board import Workspace, WorkspaceMember, Board
from app.models.user import User
from app.api import deps
from typing import List

router = APIRouter(prefix="/boards", tags=["boards"])

# --- Workspaces ---

@router.post("/workspaces", response_model=WorkspaceResponse)
def create_workspace(
    workspace_in: WorkspaceCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.get_current_user)
):
    new_workspace = Workspace(
        name=workspace_in.name,
        description=workspace_in.description,
        owner_id=current_user.id
    )
    db.add(new_workspace)
    db.commit()
    db.refresh(new_workspace)
    member = WorkspaceMember(workspace_id=new_workspace.id, user_id=current_user.id, role="admin")
    db.add(member)
    db.commit()
    return new_workspace

@router.get("/workspaces", response_model=List[WorkspaceResponse])
def get_my_workspaces(
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.get_current_user)
):
    return db.query(Workspace).join(WorkspaceMember).filter(WorkspaceMember.user_id == current_user.id).all()

# --- Boards ---

@router.post("/workspaces/{workspace_id}", response_model=BoardResponse)
def create_board(
    workspace_id: str,
    board_in: BoardBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this workspace")
    new_board = Board(
        title=board_in.title,
        workspace_id=workspace_id,
        background=board_in.background,
        is_public=board_in.is_public
    )
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/workspaces/{workspace_id}", response_model=List[BoardResponse])
def get_workspace_boards(
    workspace_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Access denied")
    return db.query(Board).filter(Board.workspace_id == workspace_id).all()

@router.get("/{board_id}", response_model=BoardResponse)
def get_board_detail(
    board_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == board.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()
    if not member and not board.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    return board
