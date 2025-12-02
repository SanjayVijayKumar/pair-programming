"""
SQLModel database models.
"""
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field


class Room(SQLModel, table=True):
    """Room model for storing room metadata."""

    __tablename__ = "rooms"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RoomCodeSnapshot(SQLModel, table=True):
    """Store periodic snapshots of room code state."""

    __tablename__ = "room_code_snapshots"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="rooms.id")
    code: str = Field(default="")
    language: str = Field(default="python")
    created_at: datetime = Field(default_factory=datetime.utcnow)
