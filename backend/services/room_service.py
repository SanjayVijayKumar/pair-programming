"""Business logic for room operations."""
from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from ..db.models import Room
from ..core.config import DEFAULT_ROOM_CODE, DEFAULT_LANGUAGE


class RoomService:
    """Service for room operations."""
    
    @staticmethod
    def create_room(db: Session) -> Room:
        """Create a new room in the database.
        
        Args:
            db: Database session
            
        Returns:
            The newly created Room object
        """
        room_id = str(uuid4())
        room = Room(
            id=room_id,
            last_snapshot=DEFAULT_ROOM_CODE,
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        return room
    
    @staticmethod
    def get_room(db: Session, room_id: str) -> Optional[Room]:
        """Get a room by ID.
        
        Args:
            db: Database session
            room_id: The room ID
            
        Returns:
            The Room object or None if not found
        """
        return db.query(Room).filter(Room.id == room_id).first()
    
    @staticmethod
    def update_room_snapshot(db: Session, room_id: str, code: str) -> Optional[Room]:
        """Update the snapshot of a room's code.
        
        Args:
            db: Database session
            room_id: The room ID
            code: The code to save as snapshot
            
        Returns:
            The updated Room object or None if not found
        """
        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.last_snapshot = code
            db.commit()
            db.refresh(room)
        return room
    
    @staticmethod
    def get_room_initial_state(db: Session, room_id: str) -> dict:
        """Get the initial state of a room.
        
        Args:
            db: Database session
            room_id: The room ID
            
        Returns:
            Dictionary with code and language for the room
        """
        room = RoomService.get_room(db, room_id)
        if not room:
            return {
                "code": DEFAULT_ROOM_CODE,
                "language": DEFAULT_LANGUAGE,
            }
        
        return {
            "code": room.last_snapshot or DEFAULT_ROOM_CODE,
            "language": DEFAULT_LANGUAGE,
        }
