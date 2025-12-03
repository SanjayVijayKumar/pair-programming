# Pair Programming Backend

A production-ready FastAPI backend for real-time collaborative code editing with WebSockets support.

## Features

✨ **Real-time Collaboration**
- WebSocket-based live code synchronization
- Cursor position tracking for multiple users
- Typing indicators
- In-memory room state management
- Last-write-wins conflict resolution

🗄️ **Persistent Storage**
- SQLite database for room metadata
- Code snapshots on demand and on disconnect
- Automatic database initialization

🤖 **AI Autocomplete (Mocked)**
- Rule-based mock suggestions for multiple languages
- Python-specific patterns and common completions

🏗️ **Clean Architecture**
- Modular structure with clear separation of concerns
- Service layer for business logic
- Router layer for REST and WebSocket endpoints
- Pydantic schemas for validation

🚀 **Production Ready**
- CORS support configured
- Error handling and validation
- Type hints throughout
- Python 3.9 compatible
- Easy deployment on Render

## Project Structure

```
backend/
├── main.py                  # FastAPI application entry point
├── core/
│   └── config.py           # Configuration and settings
├── db/
│   ├── database.py         # SQLite connection and DB utilities
│   └── models.py           # SQLAlchemy models (Room)
├── schemas/
│   ├── room.py             # Pydantic schemas for rooms
│   └── autocomplete.py     # Pydantic schemas for autocomplete
├── services/
│   ├── room_service.py     # Room business logic
│   └── realtime.py         # ConnectionManager and RoomState
├── routers/
│   ├── rooms.py            # Room REST endpoints
│   ├── autocomplete.py     # Autocomplete endpoints
│   └── ws.py               # WebSocket endpoint
└── data/
    └── app.db              # SQLite database (auto-created)
```

## Installation

### Prerequisites
- Python 3.9 or higher
- pip package manager

### Setup

1. **Clone and navigate to the project:**
```bash
cd pair-programming
```

2. **Create a virtual environment (recommended):**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the application:**
```bash
# Option 1: Direct execution
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python main
cd backend
python main.py
```

The server will start at `http://localhost:8000`

## API Documentation

### Interactive Docs
Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### REST Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy"
}
```

#### Create Room
```http
POST /api/rooms
```

Response (201 Created):
```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Get Room
```http
GET /api/rooms/{room_id}
```

Response:
```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-12-03T10:30:00",
  "last_updated": "2024-12-03T10:35:00"
}
```

#### Autocomplete
```http
POST /api/autocomplete
Content-Type: application/json

{
  "code": "def my_function",
  "cursor_position": 15,
  "language": "python"
}
```

Response:
```json
{
  "suggestion": "(self):\n    pass",
  "context": "Context for python"
}
```

### WebSocket Endpoint

**URL**: `ws://localhost:8000/api/ws/{room_id}`

#### Message Types

**Client → Server:**

1. **Initialize** (on connection):
```json
{
  "type": "init",
  "userId": "user-123"
}
```

2. **Code Update**:
```json
{
  "type": "code_update",
  "userId": "user-123",
  "code": "def hello():\n    print('Hello')",
  "timestamp": 1701600600000
}
```

3. **Cursor Position**:
```json
{
  "type": "cursor_update",
  "userId": "user-123",
  "cursorPosition": 42
}
```

4. **Typing Indicator**:
```json
{
  "type": "typing",
  "userId": "user-123",
  "isTyping": true
}
```

**Server → Client:**

1. **Initial State** (on connect):
```json
{
  "type": "init",
  "code": "# Welcome to the pair programming room!",
  "language": "python"
}
```

2. **Code Broadcast**:
```json
{
  "type": "code_update",
  "code": "def hello():\n    print('Hello')",
  "user_id": "user-123",
  "timestamp": 1701600600000
}
```

3. **Cursor Broadcast**:
```json
{
  "type": "cursor_update",
  "user_id": "user-123",
  "cursor_position": 42
}
```

4. **Typing Broadcast**:
```json
{
  "type": "typing",
  "user_id": "user-123",
  "is_typing": true
}
```

5. **User Presence**:
```json
{
  "type": "user_joined",
  "user_id": "user-123",
  "active_users": 2
}
```

```json
{
  "type": "user_left",
  "user_id": "user-123",
  "active_users": 1
}
```

6. **Error**:
```json
{
  "type": "error",
  "message": "Invalid message format"
}
```

## Database Schema

### Room Table
```sql
CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_snapshot TEXT,
  last_updated DATETIME
);
```

The database is automatically initialized on application startup.

## Configuration

Edit `backend/core/config.py` to customize:

- **Database Path**: `DATABASE_PATH`
- **CORS Origins**: `CORS_ORIGINS`
- **API Prefix**: `API_V1_PREFIX`
- **Default Language**: `DEFAULT_LANGUAGE`
- **Default Code**: `DEFAULT_ROOM_CODE`

### Environment Variables

```bash
# Set custom database path
export DATABASE_PATH=/path/to/database.db

# Set CORS origins (space-separated)
export CORS_ORIGINS="http://localhost:3000 http://localhost:5173"
```

## Deployment on Render

### Prerequisites
- GitHub repository with this code
- Render account

### Steps

1. **Connect your repository to Render**

2. **Create a new Web Service**

3. **Configure**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables** (if needed):
   - `DATABASE_PATH`: Leave default for SQLite in container
   - `CORS_ORIGINS`: Set your frontend URL

5. **Deploy**

The application will be available at your Render URL.

## Development

### Running Tests
```bash
pytest
```

### Code Quality
```bash
# Format code
black backend

# Lint
flake8 backend

# Type checking
mypy backend
```

### Hot Reload
The application runs with `--reload` by default in development, so changes are reflected immediately.

## Architecture Highlights

### ConnectionManager Pattern
The `ConnectionManager` class provides:
- Centralized WebSocket connection tracking
- Per-room state management
- Broadcast utilities for efficient message distribution
- Automatic cleanup of empty rooms

### Room State Management
`RoomState` maintains in-memory:
- Current code content
- Programming language
- User cursor positions
- User typing status
- Last update timestamp

### Last-Write-Wins Strategy
When multiple users edit simultaneously:
- Latest code update replaces previous state
- No merging or conflict resolution
- Simple and predictable behavior
- Suitable for real-time collaborative editing

## Performance Considerations

- **In-memory State**: Fast access and updates, suitable for active rooms
- **Broadcast Optimization**: Sends only to connected clients, not persisted
- **Database Operations**: Snapshots only on demand or disconnect
- **Async/Await**: Non-blocking I/O for scalability
- **WebSocket Efficiency**: Binary frames for low latency

## Error Handling

- Invalid room ID: WebSocket closes with policy violation
- Malformed JSON: Error message sent to client
- Disconnection: Clean cleanup of user state
- Database errors: Graceful degradation with in-memory fallback

## Security Notes

⚠️ **For production use:**
- Implement authentication/authorization
- Validate and sanitize user input
- Add rate limiting
- Use HTTPS/WSS in production
- Implement proper access control
- Add audit logging

## Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Database Lock
Delete `backend/data/app.db` and restart the application.

### CORS Issues
Ensure frontend URL is in `CORS_ORIGINS` in `backend/core/config.py`.

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WebSockets with FastAPI](https://fastapi.tiangolo.com/advanced/websockets/)
- [SQLAlchemy with FastAPI](https://fastapi.tiangolo.com/advanced/sql-databases/)
- [Render Deployment](https://render.com/docs)

## License

MIT

## Author

Interview Project - Pair Programming Backend
