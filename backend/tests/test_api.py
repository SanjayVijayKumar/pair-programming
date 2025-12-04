"""Example tests for the pair programming backend.

Run with: pytest backend/tests/test_*.py -v
"""
import json
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.db.database import SessionLocal, init_db
from backend.services.realtime import ConnectionManager


@pytest.fixture(scope="function")
def client():
    """Create a test client."""
    # Initialize database for tests
    init_db()
    yield TestClient(app)


class TestRoomEndpoints:
    """Test room REST endpoints."""
    
    def test_create_room(self, client):
        """Test creating a new room."""
        response = client.post("/api/rooms")
        assert response.status_code == 201
        data = response.json()
        assert "room_id" in data
        assert isinstance(data["room_id"], str)
        assert len(data["room_id"]) == 36  # UUID format
    
    def test_get_room(self, client):
        """Test getting a room."""
        # Create a room first
        create_response = client.post("/api/rooms")
        room_id = create_response.json()["room_id"]
        
        # Get the room
        response = client.get(f"/api/rooms/{room_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["room_id"] == room_id
        assert "created_at" in data
    
    def test_get_nonexistent_room(self, client):
        """Test getting a non-existent room."""
        response = client.get("/api/rooms/nonexistent-room-id")
        assert response.status_code == 404


class TestAutocompleteEndpoint:
    """Test autocomplete endpoint."""
    
    def test_autocomplete_python_def(self, client):
        """Test autocomplete suggestion for Python def."""
        response = client.post(
            "/api/autocomplete",
            json={
                "code": "def my_function",
                "cursor_position": 15,
                "language": "python",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "suggestion" in data
        assert isinstance(data["suggestion"], str)
    
    def test_autocomplete_python_class(self, client):
        """Test autocomplete suggestion for Python class."""
        response = client.post(
            "/api/autocomplete",
            json={
                "code": "class MyClass",
                "cursor_position": 13,
                "language": "python",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "suggestion" in data
    
    def test_autocomplete_python_import(self, client):
        """Test autocomplete suggestion for Python import."""
        response = client.post(
            "/api/autocomplete",
            json={
                "code": "import ",
                "cursor_position": 7,
                "language": "python",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["suggestion"] == "module"


class TestHealthCheck:
    """Test health check endpoint."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestConnectionManager:
    """Test ConnectionManager functionality."""
    
    def test_get_or_create_room(self):
        """Test room creation in ConnectionManager."""
        manager = ConnectionManager()
        room_id = "test-room-123"
        
        room = manager.get_or_create_room(room_id)
        assert room.room_id == room_id
        
        # Getting again should return same room
        room2 = manager.get_or_create_room(room_id)
        assert room is room2
    
    def test_active_users_count(self):
        """Test active users count."""
        manager = ConnectionManager()
        room_id = "test-room-456"
        
        assert manager.get_active_users_count(room_id) == 0
    
    def test_room_state_updates(self):
        """Test room state updates."""
        manager = ConnectionManager()
        room_id = "test-room-789"
        room = manager.get_or_create_room(room_id)
        
        # Update code
        new_code = "print('hello')"
        room.update_code(new_code, "user1")
        assert room.code == new_code
        
        # Update cursor
        room.update_cursor("user1", 10)
        assert room.cursors["user1"] == 10
        
        # Update typing
        room.update_typing("user1", True)
        assert room.typing["user1"] is True
        
        # Remove user
        room.remove_user("user1")
        assert "user1" not in room.cursors
        assert "user1" not in room.typing


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
