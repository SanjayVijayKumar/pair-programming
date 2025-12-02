"""
Real-time WebSocket connection and room state management.
"""
from typing import Dict, Set
from uuid import UUID
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)


class RoomState:
    """In-memory state for a collaborative room."""

    def __init__(self, room_id: UUID, language: str = "python"):
        self.room_id: UUID = room_id
        self.code: str = ""
        self.language: str = language
        self.last_update_timestamp: int = 0

    def update_code(self, code: str, timestamp: int) -> None:
        """Update code using last-write-wins strategy."""
        if timestamp >= self.last_update_timestamp:
            self.code = code
            self.last_update_timestamp = timestamp


class ConnectionManager:
    """Manages WebSocket connections across rooms."""

    def __init__(self):
        self.rooms: Dict[str, RoomState] = {}
        self.connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket) -> None:
        """Register a new WebSocket connection."""
        await websocket.accept()
        
        if room_id not in self.rooms:
            self.rooms[room_id] = RoomState(UUID(room_id))
            self.connections[room_id] = set()
        
        self.connections[room_id].add(websocket)
        logger.info(f"Client connected to room {room_id}")

    def disconnect(self, room_id: str, websocket: WebSocket) -> None:
        """Remove a WebSocket connection."""
        if room_id in self.connections:
            self.connections[room_id].discard(websocket)
            if len(self.connections[room_id]) == 0:
                del self.connections[room_id]
                del self.rooms[room_id]
        logger.info(f"Client disconnected from room {room_id}")

    async def broadcast(self, room_id: str, message: dict, sender: WebSocket = None) -> None:
        """Broadcast a message to all clients in a room."""
        if room_id not in self.connections:
            return
        
        message_json = json.dumps(message)
        for connection in self.connections[room_id]:
            if connection != sender:
                try:
                    await connection.send_text(message_json)
                except Exception as e:
                    logger.error(f"Error broadcasting to connection: {e}")

    async def broadcast_to_all(self, room_id: str, message: dict) -> None:
        """Broadcast a message to all clients including sender."""
        if room_id not in self.connections:
            return
        
        message_json = json.dumps(message)
        for connection in self.connections[room_id]:
            try:
                await connection.send_text(message_json)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {e}")

    def get_room_state(self, room_id: str) -> RoomState | None:
        """Get the current state of a room."""
        return self.rooms.get(room_id)


# Global connection manager instance
connection_manager = ConnectionManager()
