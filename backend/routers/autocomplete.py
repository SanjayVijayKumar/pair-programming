"""REST endpoints for autocomplete operations."""
from fastapi import APIRouter, status

from ..schemas.autocomplete import AutocompleteRequest, AutocompleteResponse

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])


def generate_mocked_suggestion(code: str, cursor_position: int, language: str) -> str:
    """Generate a mocked autocomplete suggestion.
    
    This is a simple rule-based mock implementation that provides suggestions
    based on common Python patterns.
    
    Args:
        code: The current code content
        cursor_position: The cursor position in the code
        language: The programming language
        
    Returns:
        A suggested code completion
    """
    # Ensure we don't go out of bounds
    cursor_position = min(cursor_position, len(code))
    
    # Get the text before cursor
    text_before = code[:cursor_position]
    
    # Get the last word/token
    words = text_before.split()
    last_token = words[-1] if words else ""
    
    # Simple rule-based suggestions
    if language.lower() == "python":
        if last_token.startswith("def "):
            return "(self):\n    pass"
        elif last_token.startswith("class "):
            return ":\n    pass"
        elif last_token == "if":
            return " condition:\n    pass"
        elif last_token == "for":
            return " item in items:\n    pass"
        elif last_token == "while":
            return " condition:\n    pass"
        elif last_token == "try":
            return ":\n    pass\nexcept Exception:\n    pass"
        elif last_token == "import":
            return " module"
        elif last_token == "from":
            return " module import name"
        elif "(" in last_token:
            return ")"
        else:
            return "_placeholder"
    
    # Default suggestion for other languages
    return "..."


@router.post("", response_model=AutocompleteResponse, status_code=status.HTTP_200_OK)
async def autocomplete(request: AutocompleteRequest) -> AutocompleteResponse:
    """Get an autocomplete suggestion for the given code.
    
    This endpoint provides mocked AI autocomplete suggestions based on the
    current code and cursor position.
    
    Args:
        request: The autocomplete request with code, cursor position, and language
        
    Returns:
        An autocomplete suggestion
    """
    suggestion = generate_mocked_suggestion(
        request.code,
        request.cursor_position,
        request.language,
    )
    
    return AutocompleteResponse(
        suggestion=suggestion,
        context=f"Context for {request.language}",
    )
