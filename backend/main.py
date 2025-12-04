"""Main FastAPI application with static file serving."""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.core.config import (
    API_V1_PREFIX,
    API_TITLE,
    API_VERSION,
    CORS_ORIGINS,
    CORS_ALLOW_CREDENTIALS,
    CORS_ALLOW_METHODS,
    CORS_ALLOW_HEADERS,
)
from backend.db.database import init_db
from backend.routers import rooms, autocomplete, ws


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events.
    
    Args:
        app: The FastAPI application
    """
    # Startup
    print("Starting up: Initializing database...")
    init_db()
    print("Database initialized successfully.")
    
    yield
    
    # Shutdown
    print("Shutting down...")


# Create FastAPI application
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description="Backend for real-time pair programming with WebSockets",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)

# Mount static files from frontend folder
frontend_dir = Path(__file__).parent.parent / "frontend"
if frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

# Include routers
app.include_router(rooms.router, prefix=API_V1_PREFIX)
app.include_router(autocomplete.router, prefix=API_V1_PREFIX)
app.include_router(ws.router, prefix=API_V1_PREFIX)


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """Health check endpoint.
    
    Returns:
        A dictionary indicating the application status
    """
    return {"status": "healthy"}


@app.get("/", tags=["root"])
async def root() -> dict:
    """Root endpoint.
    
    Returns:
        A welcome message
    """
    return {
        "message": "Welcome to Pair Programming Backend",
        "version": API_VERSION,
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
