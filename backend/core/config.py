"""Application configuration and settings."""
import os
from pathlib import Path
from typing import Optional

# Get the backend directory path
BASE_DIR = Path(__file__).resolve().parent.parent

# Database configuration
DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "data" / "app.db"))
DATABASE_URL: str = f"sqlite:///{DATABASE_PATH}"

# API configuration
API_V1_PREFIX: str = "/api"
API_TITLE: str = "Pair Programming Backend"
API_VERSION: str = "1.0.0"

# CORS configuration
CORS_ORIGINS: list = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS: bool = True
CORS_ALLOW_METHODS: list = ["*"]
CORS_ALLOW_HEADERS: list = ["*"]

# WebSocket configuration
WS_ENDPOINT_PREFIX: str = f"{API_V1_PREFIX}/ws"

# Default language for new rooms
DEFAULT_LANGUAGE: str = "python"

# Room configuration
DEFAULT_ROOM_CODE: str = "# Welcome to the pair programming room!\n# Start typing here...\n"
