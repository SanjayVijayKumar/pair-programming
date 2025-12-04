"""SQLAlchemy/SQLModel database models."""
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Room(Base):
    """Room model for storing room metadata and snapshots."""
    
    __tablename__ = "rooms"
    
    id: str = Column(String(36), primary_key=True, index=True)
    created_at: datetime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_snapshot: Optional[str] = Column(String(65536), nullable=True)
    last_updated: datetime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    def __repr__(self) -> str:
        return f"<Room id={self.id} created_at={self.created_at}>"
