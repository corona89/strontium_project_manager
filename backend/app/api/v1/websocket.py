from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import json

router = APIRouter(prefix="/ws", tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        # board_id -> set of websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, board_id: str):
        await websocket.accept()
        if board_id not in self.active_connections:
            self.active_connections[board_id] = set()
        self.active_connections[board_id].add(websocket)

    def disconnect(self, websocket: WebSocket, board_id: str):
        if board_id in self.active_connections:
            self.active_connections[board_id].remove(websocket)
            if not self.active_connections[board_id]:
                del self.active_connections[board_id]

    async def broadcast(self, board_id: str, message: dict):
        if board_id in self.active_connections:
            # Create a list to avoid "Set size changed during iteration"
            for connection in list(self.active_connections[board_id]):
                try:
                    await connection.send_json(message)
                except:
                    self.disconnect(connection, board_id)

manager = ConnectionManager()

@router.websocket("/{board_id}")
async def websocket_endpoint(websocket: WebSocket, board_id: str):
    await manager.connect(websocket, board_id)
    try:
        while True:
            # We don't expect many messages from client, but need to keep it open
            data = await websocket.receive_text()
            # Handle incoming signals if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, board_id)
