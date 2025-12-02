"""
Room service for database operations.
"""
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.db.models import Room, RoomCodeSnapshot


class RoomService:
    """Service for room operations."""

    @staticmethod
    async def create_room(session: AsyncSession) -> UUID:
        """Create a new room and return its ID."""
        room_id = uuid4()
        room = Room(id=room_id)
        session.add(room)
        await session.commit()
        return room_id

    @staticmethod
    async def get_room(session: AsyncSession, room_id: UUID) -> Room | None:
        """Get a room by ID."""
        query = select(Room).where(Room.id == room_id)
        result = await session.execute(query)
        return result.scalars().first()

    @staticmethod
    async def save_code_snapshot(
        session: AsyncSession, room_id: UUID, code: str, language: str = "python"
    ) -> None:
        """Save a code snapshot for a room."""
        snapshot = RoomCodeSnapshot(room_id=room_id, code=code, language=language)
        session.add(snapshot)
        await session.commit()

    @staticmethod
    async def get_latest_snapshot(
        session: AsyncSession, room_id: UUID
    ) -> RoomCodeSnapshot | None:
        """Get the latest code snapshot for a room."""
        query = (
            select(RoomCodeSnapshot)
            .where(RoomCodeSnapshot.room_id == room_id)
            .order_by(RoomCodeSnapshot.created_at.desc())
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalars().first()
