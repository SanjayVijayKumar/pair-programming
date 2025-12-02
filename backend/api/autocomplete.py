"""
API routes for autocomplete.
"""
from fastapi import APIRouter
from backend.schemas.autocomplete import AutocompleteRequest, AutocompleteResponse

router = APIRouter(prefix="/api/autocomplete", tags=["autocomplete"])


def generate_suggestion(code: str, cursor_position: int, language: str) -> str:
    """Generate a mocked autocomplete suggestion."""
    # Simple rule-based suggestions
    if language == "python":
        # Get the last token before cursor
        code_before = code[:cursor_position]
        tokens = code_before.split()
        
        if tokens:
            last_token = tokens[-1]
            
            # Common Python completions
            suggestions = {
                "def": "(self):\n    pass",
                "class": ":\n    pass",
                "if": ":",
                "for": " in :",
                "while": ":",
                "try": ":\n    pass\nexcept:",
                "import": " ",
            }
            
            if last_token in suggestions:
                return suggestions[last_token]
        
        return "# autocomplete suggestion"
    
    return "suggestion"


@router.post("/", response_model=AutocompleteResponse)
async def autocomplete(request: AutocompleteRequest) -> AutocompleteResponse:
    """
    Get autocomplete suggestion for code.
    
    Args:
        request: AutocompleteRequest with code, cursor position, and language.
    
    Returns:
        AutocompleteResponse with suggestion.
    """
    suggestion = generate_suggestion(request.code, request.cursor_position, request.language)
    return AutocompleteResponse(suggestion=suggestion)
