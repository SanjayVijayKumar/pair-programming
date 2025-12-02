"""
Schemas for room-related requests and responses.
"""
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class RoomCreate(BaseModel):
    """Schema for creating a room (empty for now)."""

    pass


class RoomResponse(BaseModel):
    """Schema for room response."""

    room_id: UUID


class RoomDetail(BaseModel):
    """Detailed room information."""

    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
