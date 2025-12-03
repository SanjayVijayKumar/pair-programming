"""Real-time WebSocket connection and room state management."""
import json
from typing import Dict, List, Set, Optional, Any
from datetime import datetime

from fastapi import WebSocket


class RoomState:
    """Maintains in-memory state for a single room."""
    
    def __init__(self, room_id: str) -> None:
        """Initialize room state.
        
        Args:
            room_id: The room ID
        """
        self.room_id: str = room_id
        self.code: str = "# Welcome to the pair programming room!\n# Start typing here...\n"
        self.language: str = "python"
        self.cursors: Dict[str, int] = {}  # userId -> cursor position
        self.typing: Dict[str, bool] = {}  # userId -> is typing
        self.last_updated: datetime = datetime.utcnow()
    
    def update_code(self, code: str, user_id: str) -> None:
        """Update the room's code.
        
        Args:
            code: The new code
            user_id: The user who updated it
        """
        self.code = code
        self.last_updated = datetime.utcnow()
    
    def update_cursor(self, user_id: str, position: int) -> None:
        """Update a user's cursor position.
        
        Args:
            user_id: The user ID
            position: The cursor position
        """
        self.cursors[user_id] = position
    
    def update_typing(self, user_id: str, is_typing: bool) -> None:
        """Update a user's typing status.
        
        Args:
            user_id: The user ID
            is_typing: Whether the user is typing
        """
        self.typing[user_id] = is_typing
    
    def remove_user(self, user_id: str) -> None:
        """Remove a user from the room state.
        
        Args:
            user_id: The user ID
        """
        self.cursors.pop(user_id, None)
        self.typing.pop(user_id, None)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert room state to dictionary.
        
        Returns:
            Dictionary representation of room state
        """
        return {
            "room_id": self.room_id,
            "code": self.code,
            "language": self.language,
            "cursors": self.cursors,
            "typing": self.typing,
            "last_updated": self.last_updated.isoformat(),
        }


class ConnectionManager:
    """Manages WebSocket connections and room state for all active rooms."""
    
    def __init__(self) -> None:
        """Initialize the connection manager."""
        self.rooms: Dict[str, RoomState] = {}  # room_id -> RoomState
        self.connections: Dict[str, List[WebSocket]] = {}  # room_id -> list of WebSockets
        self.user_connections: Dict[str, Dict[str, WebSocket]] = {}  # room_id -> userId -> WebSocket
    
    def get_or_create_room(self, room_id: str) -> RoomState:
        """Get or create a room state.
        
        Args:
            room_id: The room ID
            
        Returns:
            The RoomState for the given room_id
        """
        if room_id not in self.rooms:
            self.rooms[room_id] = RoomState(room_id)
            self.connections[room_id] = []
            self.user_connections[room_id] = {}
        return self.rooms[room_id]
    
    async def connect(self, room_id: str, websocket: WebSocket, user_id: str) -> None:
        """Register a new WebSocket connection.
        
        Args:
            room_id: The room ID
            websocket: The WebSocket connection
            user_id: The user ID
        """
        await websocket.accept()
        room = self.get_or_create_room(room_id)
        self.connections[room_id].append(websocket)
        self.user_connections[room_id][user_id] = websocket
    
    def disconnect(self, room_id: str, websocket: WebSocket, user_id: str) -> None:
        """Unregister a WebSocket connection.
        
        Args:
            room_id: The room ID
            websocket: The WebSocket connection
            user_id: The user ID
        """
        if room_id in self.connections:
            self.connections[room_id].remove(websocket)
        
        if room_id in self.user_connections:
            self.user_connections[room_id].pop(user_id, None)
        
        if room_id in self.rooms:
            self.rooms[room_id].remove_user(user_id)
        
        # Clean up empty rooms
        if room_id in self.connections and len(self.connections[room_id]) == 0:
            self.rooms.pop(room_id, None)
            self.connections.pop(room_id, None)
            self.user_connections.pop(room_id, None)
    
    async def broadcast(self, room_id: str, message: str) -> None:
        """Broadcast a message to all users in a room.
        
        Args:
            room_id: The room ID
            message: The JSON message to send
        """
        if room_id not in self.connections:
            return
        
        dead_sockets = []
        for websocket in self.connections[room_id]:
            try:
                await websocket.send_text(message)
            except Exception:
                dead_sockets.append(websocket)
        
        # Remove dead connections
        for websocket in dead_sockets:
            try:
                self.connections[room_id].remove(websocket)
            except ValueError:
                pass
    
    async def broadcast_to_others(
        self,
        room_id: str,
        websocket: WebSocket,
        message: str
    ) -> None:
        """Broadcast a message to all users except the sender in a room.
        
        Args:
            room_id: The room ID
            websocket: The sender's WebSocket connection
            message: The JSON message to send
        """
        if room_id not in self.connections:
            return
        
        dead_sockets = []
        for conn in self.connections[room_id]:
            if conn != websocket:
                try:
                    await conn.send_text(message)
                except Exception:
                    dead_sockets.append(conn)
        
        # Remove dead connections
        for websocket_dead in dead_sockets:
            try:
                self.connections[room_id].remove(websocket_dead)
            except ValueError:
                pass
    
    def get_room_state(self, room_id: str) -> Optional[RoomState]:
        """Get the current state of a room.
        
        Args:
            room_id: The room ID
            
        Returns:
            The RoomState or None if room doesn't exist
        """
        return self.rooms.get(room_id)
    
    def get_active_users_count(self, room_id: str) -> int:
        """Get the number of active users in a room.
        
        Args:
            room_id: The room ID
            
        Returns:
            The count of active users
        """
        return len(self.user_connections.get(room_id, {}))


# Global connection manager instance
manager = ConnectionManager()
