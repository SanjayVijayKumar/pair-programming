"""Pydantic schemas for room operations."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    """Schema for creating a new room."""
    pass


class RoomResponse(BaseModel):
    """Schema for room response."""
    
    room_id: str = Field(..., alias="id")
    created_at: datetime
    last_updated: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True


class RoomIdResponse(BaseModel):
    """Schema for returning just the room ID."""
    
    room_id: str


class RoomWithSnapshot(BaseModel):
    """Schema for room with snapshot."""
    
    id: str
    created_at: datetime
    last_snapshot: Optional[str] = None
    last_updated: Optional[datetime] = None
    
    class Config:
        from_attributes = True
