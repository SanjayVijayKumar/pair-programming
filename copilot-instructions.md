# Copilot Instructions for Pair Programming Backend

You are helping me maintain and extend a Python 3.9 backend for a real-time pair-programming web application.

## Stack and Constraints
- **Language**: Python 3.9 (no 3.10+ syntax like `list[str]`)
- **Framework**: FastAPI (async)
- **Realtime**: WebSockets (FastAPI / Starlette)
- **Database**: SQLite (file-based) for room metadata and snapshots
- **State**: In-memory per room for live collaboration (room code, cursors, typing)
- **Authentication**: None required

## Project Structure
The backend follows a modular, scalable structure:

```
backend/
├── main.py                  # FastAPI app, routers, CORS, startup DB init
├── core/config.py          # Settings (DB path, CORS origins, etc.)
├── db/
│   ├── database.py         # SQLite connection/init helpers
│   └── models.py           # SQLAlchemy models for Room
├── schemas/
│   ├── room.py             # Pydantic schemas for room operations
│   └── autocomplete.py     # Pydantic schemas for autocomplete
├── services/
│   ├── room_service.py     # Business logic for rooms
│   └── realtime.py         # ConnectionManager and RoomState (in-memory state)
├── routers/
│   ├── rooms.py            # REST room endpoints
│   ├── autocomplete.py     # REST autocomplete endpoint (mocked AI)
│   └── ws.py               # WebSocket endpoint for /ws/{room_id}
└── data/app.db             # SQLite database (auto-created)
```

## Key Components

### ConnectionManager (in `services/realtime.py`)
Manages all WebSocket connections and room state:
- Tracks active rooms and their RoomState
- Maintains list of active WebSocket connections per room
- Maps userId → WebSocket for efficient targeted messaging
- Provides `connect()`, `disconnect()`, `broadcast()`, and `broadcast_to_others()` methods
- Automatically cleans up empty rooms

### RoomState (in `services/realtime.py`)
In-memory state for a single room:
- `code`: Current code string
- `language`: Programming language (default "python")
- `cursors`: Dict of userId → cursor position
- `typing`: Dict of userId → isTyping boolean
- `last_updated`: Timestamp of last code update

### Database Models (in `db/models.py`)
**Room table:**
- `id` (UUID): Primary key
- `created_at`: Creation timestamp
- `last_snapshot`: Latest code snapshot
- `last_updated`: Last modification timestamp

## REST Endpoints

### Rooms
- `POST /api/rooms` → Returns `{"room_id": "<uuid>"}`
- `GET /api/rooms/{room_id}` → Returns room metadata

### Autocomplete
- `POST /api/autocomplete` → Accepts code/cursor/language, returns `{"suggestion": "..."}`

## WebSocket Endpoint

**URL**: `ws://localhost:8000/api/ws/{room_id}`

### Message Protocol (JSON over text)

**Client → Server:**
```json
{"type": "init", "userId": "u1"}
{"type": "code_update", "userId": "u1", "code": "...", "timestamp": 1234}
{"type": "cursor_update", "userId": "u1", "cursorPosition": 42}
{"type": "typing", "userId": "u1", "isTyping": true}
```

**Server → Client:**
```json
{"type": "init", "code": "...", "language": "python"}
{"type": "code_update", "code": "...", "userId": "u1", "timestamp": 1234}
{"type": "cursor_update", "userId": "u1", "cursorPosition": 42}
{"type": "typing", "userId": "u1", "isTyping": true}
{"type": "user_joined", "userId": "u1", "active_users": 2}
{"type": "user_left", "userId": "u1", "active_users": 1}
{"type": "error", "message": "..."}
```

## Development Guidelines

### Best Practices
1. **Use type hints everywhere** – Improves code clarity and IDE support
2. **Keep endpoints thin** – Move business logic to services
3. **Use dependency injection** – Pass `db: Session = Depends(get_db)`
4. **Keep Pydantic schemas clean** – One file per entity type
5. **Use async/await idiomatically** – For DB and WebSocket operations
6. **Error handling** – Return appropriate HTTP status codes and messages
7. **Code organization** – Separate concerns: routers, schemas, services, models

### Adding New Features

**New REST Endpoint:**
1. Create or update a router in `backend/routers/`
2. Add Pydantic schemas to `backend/schemas/` if needed
3. Add business logic to appropriate service in `backend/services/`
4. Register router in `backend/main.py`

**Extending WebSocket Messages:**
1. Add new message type handling in `backend/routers/ws.py`
2. Update `RoomState` if new state is needed
3. Document in this file

**Adding Database Models:**
1. Create model in `backend/db/models.py`
2. Add service methods in `backend/services/room_service.py`
3. Tables auto-create on startup via `init_db()`

## Testing Considerations

- Test REST endpoints with FastAPI test client
- Test WebSocket with `websockets` library or similar
- Mock room operations for unit tests
- Integration tests with real SQLite

## Deployment

The backend is ready for deployment on Render:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Optionally set `DATABASE_PATH`, `CORS_ORIGINS`

## Security Considerations

- No authentication currently implemented
- Input validation via Pydantic
- CORS configured for specific origins
- For production: Add authentication, rate limiting, input sanitization, audit logging

## Common Patterns

### Getting Database Session
```python
from sqlalchemy.orm import Session
from backend.db.database import get_db

async def my_endpoint(db: Session = Depends(get_db)):
    pass
```

### Broadcasting Messages
```python
from backend.services.realtime import manager

# Broadcast to all users in room
await manager.broadcast(room_id, json.dumps({"type": "...", ...}))

# Broadcast to others (not sender)
await manager.broadcast_to_others(room_id, websocket, json.dumps({...}))
```

### Creating Database Records
```python
from backend.services.room_service import RoomService

room = RoomService.create_room(db)
```

## When in Doubt

- Refer to existing implementations in routers, services, and models
- Follow the async/await pattern used throughout
- Keep Python 3.9 compatibility (no walrus operator in type hints, etc.)
- Type all function parameters and returns
- Use Pydantic for all request/response validation
