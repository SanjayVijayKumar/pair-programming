"""REST endpoints for autocomplete operations."""
import random
from fastapi import APIRouter, status

from ..schemas.autocomplete import AutocompleteRequest, AutocompleteResponse

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])

# Common random suggestions for autocomplete
RANDOM_SUGGESTIONS = [
    "self.name",
    "self.value",
    "self.items",
    "self.count",
    "self.result",
    "self.config",
    "self.data",
    "self.message",
    "self.status",
    "self.handler",
    "self.callback",
    "self.validate()",
    "self.process()",
    "self.initialize()",
    "self.execute()",
    "self.save()",
    "self.update()",
    "self.delete()",
    "self.create()",
    "self.load()",
]


def generate_mocked_suggestion(code: str, cursor_position: int, language: str) -> str:
    """Generate a mocked autocomplete suggestion.
    
    This generates random but realistic suggestions that could follow the current code.
    
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
    
    # Rule-based suggestions for specific patterns
    if language.lower() == "python":
        if last_token.startswith("def "):
            return "(self):"
        elif last_token.startswith("class "):
            return "(object):"
        elif last_token == "if":
            return " condition:"
        elif last_token == "for":
            return " item in items:"
        elif last_token == "while":
            return " condition:"
        elif last_token == "try":
            return ":"
        elif last_token == "import":
            return " module"
        elif last_token == "from":
            return " module import name"
        elif last_token in ("self", "obj", "instance"):
            # Return a random method/attribute suggestion
            return random.choice(RANDOM_SUGGESTIONS)
        elif "(" in last_token:
            return ")"
        else:
            # Return a random suggestion
            return random.choice(RANDOM_SUGGESTIONS)
    
    # Default suggestion for other languages
    return random.choice(RANDOM_SUGGESTIONS)


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
