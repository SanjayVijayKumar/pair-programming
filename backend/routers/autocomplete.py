"""REST endpoints for autocomplete operations."""
import random
from fastapi import APIRouter, status

from ..schemas.autocomplete import AutocompleteRequest, AutocompleteResponse

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])

# Meaningful Python suggestions based on context
PYTHON_SUGGESTIONS = {
    "def": [
        "__init__(self):",
        "main():",
        "validate(self):",
        "process(self):",
        "execute(self):",
        "get_data(self):",
        "set_value(self, value):",
    ],
    "class": [
        "(object):",
        "(Exception):",
        "(ABC):",
    ],
    "import": [
        " os",
        " sys",
        " json",
        " datetime",
        " requests",
        " pandas as pd",
    ],
    "for": [
        " item in items:",
        " key, value in dict.items():",
        " i in range(10):",
    ],
    "if": [
        " condition:",
        " __name__ == '__main__':",
        " value is not None:",
    ],
    "self.": [
        "name",
        "value",
        "data",
        "config",
        "status",
        "validate()",
        "process()",
        "update()",
        "save()",
        "load()",
        "initialize()",
        "execute()",
        "create()",
        "delete()",
        "reset()",
    ],
}


def generate_mocked_suggestion(code: str, cursor_position: int, language: str) -> str:
    """Generate a meaningful autocomplete suggestion based on context.
    
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
    lines = text_before.split('\n')
    current_line = lines[-1] if lines else ""
    
    # Get the last meaningful token
    tokens = current_line.split()
    last_token = tokens[-1] if tokens else ""
    
    if language.lower() == "python":
        # Check for specific patterns
        if "def " in current_line and not current_line.strip().endswith(":"):
            return random.choice(PYTHON_SUGGESTIONS.get("def", ["():"]))
        elif "class " in current_line and not current_line.strip().endswith(":"):
            return random.choice(PYTHON_SUGGESTIONS.get("class", ["():"]))
        elif "import " in current_line and not current_line.strip().startswith("from"):
            return random.choice(PYTHON_SUGGESTIONS.get("import", [" module"]))
        elif "from " in current_line:
            return " import "
        elif "for " in current_line and not current_line.strip().endswith(":"):
            return random.choice(PYTHON_SUGGESTIONS.get("for", [" in items:"]))
        elif "if " in current_line and not current_line.strip().endswith(":"):
            return random.choice(PYTHON_SUGGESTIONS.get("if", [" condition:"]))
        elif last_token == "self.":
            return random.choice(PYTHON_SUGGESTIONS.get("self.", ["value"]))
        elif "(" in last_token and ")" not in last_token:
            return ")"
        else:
            # Return a generic suggestion
            return random.choice(PYTHON_SUGGESTIONS.get("self.", ["value"]))
    
    # Default for other languages
    return "_suggestion"


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
