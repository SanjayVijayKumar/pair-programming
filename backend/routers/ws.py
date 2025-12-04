"""WebSocket endpoint for real-time collaboration."""
import json
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..services.realtime import manager
from ..services.room_service import RoomService

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/{room_id}")
async def websocket_endpoint(
    room_id: str,
    websocket: WebSocket,
    db: Session = Depends(get_db),
) -> None:
    """WebSocket endpoint for real-time collaboration.
    
    Manages connections, messages, and state for collaborative code editing.
    
    Args:
        room_id: The room ID to connect to
        websocket: The WebSocket connection
        db: Database session for room lookup
    """
    user_id: Optional[str] = None
    
    try:
        # Get or verify room exists in database
        room = RoomService.get_room(db, room_id)
        if not room:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Room not found")
            return
        
        # Connect the user (accept connection first)
        await manager.connect(room_id, websocket, "pending")
        room_state = manager.get_or_create_room(room_id)
        
        # Load initial room state from database ONLY if room is new (no code yet)
        if not room_state.code or room_state.code == "# Welcome to the pair programming room!\n# Start typing here...\n":
            initial_state = RoomService.get_room_initial_state(db, room_id)
            room_state.code = initial_state["code"]
            room_state.language = initial_state["language"]
        
        # Send initial state to the client (current room state, not database)
        await websocket.send_text(json.dumps({
            "type": "init",
            "code": room_state.code,
            "language": room_state.language,
        }))
        
        # Wait for init message to get user_id
        init_data = await websocket.receive_text()
        try:
            init_message = json.loads(init_data)
            if init_message.get("type") == "init":
                user_id = init_message.get("userId") or f"user-{id(websocket)}"
        except json.JSONDecodeError:
            user_id = f"user-{id(websocket)}"
        
        # Update the user connection with actual user_id
        if room_id in manager.user_connections:
            manager.user_connections[room_id]["pending"] = None
            manager.user_connections[room_id][user_id] = websocket
        
        # Broadcast user joined event
        await manager.broadcast(room_id, json.dumps({
            "type": "user_joined",
            "user_id": user_id,
            "active_users": manager.get_active_users_count(room_id),
        }))
        
        # Main message loop
        while True:
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format",
                }))
                continue
            
            message_type = message.get("type")
            
            # Skip processing init message again (already handled before loop)
            if message_type == "init":
                continue
            
            elif message_type == "code_update":
                # Update the code
                new_code = message.get("code", "")
                sender_user_id = message.get("userId") or message.get("user_id") or user_id or "unknown"
                timestamp = message.get("timestamp", 0)
                
                room_state.update_code(new_code, sender_user_id)
                
                # Broadcast to all clients
                await manager.broadcast(room_id, json.dumps({
                    "type": "code_update",
                    "code": new_code,
                    "user_id": sender_user_id,
                    "timestamp": timestamp,
                }))
            
            elif message_type == "cursor_update":
                # Update cursor position
                sender_user_id = message.get("userId") or message.get("user_id") or user_id or "unknown"
                cursor_position = message.get("cursorPosition") or message.get("cursor_position", 0)
                
                room_state.update_cursor(sender_user_id, cursor_position)
                
                # Broadcast to other clients
                await manager.broadcast_to_others(room_id, websocket, json.dumps({
                    "type": "cursor_update",
                    "user_id": sender_user_id,
                    "cursor_position": cursor_position,
                }))
            
            elif message_type == "typing":
                # Update typing status
                sender_user_id = message.get("userId") or message.get("user_id") or user_id or "unknown"
                is_typing = message.get("isTyping") or message.get("is_typing", False)
                
                room_state.update_typing(sender_user_id, is_typing)
                
                # Broadcast to other clients
                await manager.broadcast_to_others(room_id, websocket, json.dumps({
                    "type": "typing",
                    "user_id": sender_user_id,
                    "is_typing": is_typing,
                }))
            
            else:
                # Unknown message type
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                }))
    
    except WebSocketDisconnect:
        # Handle disconnection
        if user_id:
            manager.disconnect(room_id, websocket, user_id)
            
            # Broadcast user left event
            await manager.broadcast(room_id, json.dumps({
                "type": "user_left",
                "user_id": user_id,
                "active_users": manager.get_active_users_count(room_id),
            }))
            
            # Save snapshot when last user leaves
            if manager.get_active_users_count(room_id) == 0:
                room_state = manager.get_room_state(room_id)
                if room_state:
                    RoomService.update_room_snapshot(db, room_id, room_state.code)
        else:
            # Still remove even if user_id wasn't set
            manager.disconnect(room_id, websocket, "pending")
    
    except Exception as e:
        # Handle unexpected errors
        if user_id:
            manager.disconnect(room_id, websocket, user_id)
        else:
            manager.disconnect(room_id, websocket, "pending")
