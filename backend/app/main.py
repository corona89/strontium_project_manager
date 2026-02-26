from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, boards, lists, cards, websocket
from app.models import user, board, list_card # Ensure models are loaded
from app.database import engine, Base

# 서버 시작 시 테이블 생성 (소규모 개발용)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(boards.router, prefix="/api/v1")
app.include_router(lists.router, prefix="/api/v1")
app.include_router(cards.router, prefix="/api/v1")
app.include_router(websocket.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Trello Copy API System", "status": "operational"}
