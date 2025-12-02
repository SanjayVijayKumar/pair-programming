"""
Main FastAPI application entry point.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from backend.db.base import engine, async_session
from backend.db import models
from backend.api import rooms, autocomplete, ws
from backend.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan: startup and shutdown.
    """
    # Startup: Create tables
    logger.info("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(models.SQLModel.metadata.create_all)
    logger.info("Database tables created.")
    
    yield
    
    # Shutdown: Close connections
    logger.info("Shutting down...")
    await engine.dispose()


app = FastAPI(
    title="Pair Programming App",
    description="Real-time collaborative code editor",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rooms.router)
app.include_router(autocomplete.router)
app.include_router(ws.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        async with async_session() as session:
            await session.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "error", "database": "disconnected", "error": str(e)}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Pair Programming App Backend",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )
