"""
Configuration settings for the backend.
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://user:password@localhost/pair_programming_app",
    )
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"

    class Config:
        env_file = ".env"


settings = Settings()
