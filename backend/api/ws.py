"""
WebSocket endpoint for real-time collaboration.
"""
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.db.base import get_db
from backend.services.realtime import connection_manager
from backend.services.rooms import RoomService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ws", tags=["websocket"])


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(room_id: str, websocket: WebSocket):
    """
    WebSocket endpoint for collaborative editing.
    
    Message types:
    - init_request: Get current room state
    - code_update: Update code in the room
    """
    await connection_manager.connect(room_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "init_request":
                # Send current room state
                room_state = connection_manager.get_room_state(room_id)
                if room_state:
                    await websocket.send_text(
                        json.dumps({
                            "type": "init_state",
                            "code": room_state.code,
                            "language": room_state.language,
                        })
                    )
            
            elif message.get("type") == "code_update":
                # Update room state and broadcast
                code = message.get("code", "")
                timestamp = message.get("timestamp", 0)
                
                room_state = connection_manager.get_room_state(room_id)
                if room_state:
                    room_state.update_code(code, timestamp)
                    
                    # Broadcast to other clients
                    await connection_manager.broadcast(room_id, message, sender=websocket)
    
    except WebSocketDisconnect:
        connection_manager.disconnect(room_id, websocket)
        logger.info(f"WebSocket disconnected from room {room_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        connection_manager.disconnect(room_id, websocket)
