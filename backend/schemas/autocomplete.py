"""
Schemas for autocomplete requests and responses.
"""
from pydantic import BaseModel


class AutocompleteRequest(BaseModel):
    """Request schema for autocomplete."""

    code: str
    cursor_position: int
    language: str = "python"


class AutocompleteResponse(BaseModel):
    """Response schema for autocomplete."""

    suggestion: str
