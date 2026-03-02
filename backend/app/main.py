from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.boards import router as boards_router
from app.api.v1.lists import router as lists_router
from app.api.v1.cards import router as cards_router
from app.api.v1.websocket import router as ws_router

app = FastAPI(title=settings.PROJECT_NAME)

raw_cors = os.getenv("ALLOW_CORS_ORIGINS", "*")
cors_origins = [i.strip() for i in raw_cors.split(",") if i.strip()]
if not cors_origins or "*" in cors_origins:
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "4.2.0-modern"}

@app.get("/")
async def root():
    return {"message": "Welcome to Strontium Project Manager API"}

# Include routers - explicit path concatenation
app.include_router(auth_router, prefix="/api/v1")
app.include_router(boards_router, prefix="/api/v1")
app.include_router(lists_router, prefix="/api/v1")
app.include_router(cards_router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1/ws")
