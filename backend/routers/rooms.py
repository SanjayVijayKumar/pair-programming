"""REST endpoints for room operations."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..schemas.room import RoomCreate, RoomIdResponse, RoomResponse
from ..services.room_service import RoomService

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomIdResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    db: Session = Depends(get_db),
) -> RoomIdResponse:
    """Create a new room.
    
    Returns:
        The newly created room ID
    """
    room = RoomService.create_room(db)
    return RoomIdResponse(room_id=room.id)


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str,
    db: Session = Depends(get_db),
) -> RoomResponse:
    """Get a room by ID.
    
    Args:
        room_id: The room ID
        
    Returns:
        The room information
        
    Raises:
        HTTPException: If room is not found
    """
    room = RoomService.get_room(db, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room {room_id} not found",
        )
    return RoomResponse.from_orm(room)
