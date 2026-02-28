from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.config import settings
from app.api.v1 import (
    auth, 
    boards, 
    lists, 
    cards, 
    websocket
)

app = FastAPI(title=settings.PROJECT_NAME)

# Use ALLOW_CORS_ORIGINS to avoid Pydantic conflict with CORS_ORIGINS
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

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(boards.router, prefix="/api/v1/boards", tags=["boards"])
app.include_router(lists.router, prefix="/api/v1/lists", tags=["lists"])
app.include_router(cards.router, prefix="/api/v1/cards", tags=["cards"])
app.include_router(websocket.router, prefix="/api/v1/ws", tags=["websocket"])
