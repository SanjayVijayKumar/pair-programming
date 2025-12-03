"""Pydantic schemas for autocomplete operations."""
from pydantic import BaseModel, Field


class AutocompleteRequest(BaseModel):
    """Schema for autocomplete request."""
    
    code: str = Field(..., description="The current code content")
    cursor_position: int = Field(..., description="The current cursor position in the code")
    language: str = Field(default="python", description="The programming language")


class AutocompleteResponse(BaseModel):
    """Schema for autocomplete response."""
    
    suggestion: str = Field(..., description="The suggested code completion")
    context: str = Field(default="", description="Optional context for the suggestion")
