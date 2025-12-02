"""
API routes for room management.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.db.base import get_db
from backend.services.rooms import RoomService
from backend.schemas.rooms import RoomResponse

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.post("/", response_model=RoomResponse)
async def create_room(session: AsyncSession = Depends(get_db)) -> RoomResponse:
    """
    Create a new collaborative room.
    
    Returns:
        RoomResponse with the new room ID.
    """
    room_id = await RoomService.create_room(session)
    return RoomResponse(room_id=room_id)
