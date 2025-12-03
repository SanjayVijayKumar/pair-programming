# Quick Start Guide

Get the pair programming backend running in 5 minutes!

## Prerequisites

- Python 3.9+
- pip
- Git

## Installation & Running

### 1. Clone the repository
```bash
cd pair-programming
```

### 2. Create virtual environment (optional but recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the server
```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

## Testing the API

### Option 1: Interactive Docs
Open in browser: **http://localhost:8000/docs**

### Option 2: Using curl

**Create a room:**
```bash
curl -X POST http://localhost:8000/api/rooms
```

Response:
```json
{"room_id": "550e8400-e29b-41d4-a716-446655440000"}
```

**Get autocomplete:**
```bash
curl -X POST http://localhost:8000/api/autocomplete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def my_func",
    "cursor_position": 11,
    "language": "python"
  }'
```

Response:
```json
{
  "suggestion": "(self):\n    pass",
  "context": "Context for python"
}
```

### Option 3: WebSocket Testing

**Using Python example client:**
```bash
python examples/client.py
```

**Using websocat (CLI tool):**
```bash
# First create a room to get room_id
ROOM_ID=$(curl -s -X POST http://localhost:8000/api/rooms | jq -r '.room_id')

# Connect to WebSocket
websocat ws://localhost:8000/api/ws/$ROOM_ID

# Type messages (JSON):
{"type": "init", "userId": "user1"}
{"type": "code_update", "userId": "user1", "code": "print('hello')", "timestamp": 1000}
```

## Project Structure

```
backend/
├── main.py              → FastAPI app entry point
├── core/config.py       → Configuration
├── db/
│   ├── database.py      → SQLite setup
│   └── models.py        → Database models
├── schemas/             → Pydantic validation models
├── services/            → Business logic
│   ├── room_service.py  → Room operations
│   └── realtime.py      → WebSocket manager
└── routers/             → API endpoints
    ├── rooms.py         → Room REST endpoints
    ├── autocomplete.py  → Autocomplete endpoint
    └── ws.py            → WebSocket endpoint
```

## Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/rooms` | Create new room |
| GET | `/api/rooms/{room_id}` | Get room info |
| POST | `/api/autocomplete` | Get code suggestions |
| WS | `/api/ws/{room_id}` | Real-time collaboration |

## WebSocket Message Examples

**Client → Server: Initialize**
```json
{"type": "init", "userId": "user1"}
```

**Client → Server: Code update**
```json
{
  "type": "code_update",
  "userId": "user1",
  "code": "def hello():\n    print('hi')",
  "timestamp": 1701600000000
}
```

**Server → Client: Code broadcast**
```json
{
  "type": "code_update",
  "code": "def hello():\n    print('hi')",
  "user_id": "user1",
  "timestamp": 1701600000000
}
```

## Common Commands

### Run with auto-reload (development)
```bash
python -m uvicorn backend.main:app --reload
```

### Run in production mode
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Run tests
```bash
pytest backend/tests/ -v
```

### Run with coverage
```bash
pytest backend/tests/ --cov=backend --cov-report=html
```

### Interactive Python shell with app context
```bash
python
>>> from backend.main import app
>>> from backend.db.database import init_db
>>> init_db()
```

## Troubleshooting

### Port 8000 already in use?
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000

# macOS/Linux:
lsof -i :8000

# Kill the process
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

### Database locked?
```bash
# Just delete the database file and restart
rm backend/data/app.db
# Restart the server - it will recreate
```

### CORS errors?
- Check that your frontend URL is in `backend/core/config.py` in `CORS_ORIGINS`
- Default includes: `localhost:3000`, `localhost:5173`, `127.0.0.1:3000`, `127.0.0.1:5173`

### Uvicorn not found?
```bash
pip install -r requirements.txt
```

## Next Steps

1. **Read the full README**: `README.md` for complete documentation
2. **Check copilot instructions**: `copilot-instructions.md` for development guidelines
3. **Explore examples**: `examples/client.py` for WebSocket client usage
4. **Look at tests**: `backend/tests/test_api.py` for endpoint examples
5. **Deploy**: See README.md section on Render deployment

## Need Help?

- FastAPI docs: https://fastapi.tiangolo.com/
- WebSocket guide: https://fastapi.tiangolo.com/advanced/websockets/
- SQLAlchemy docs: https://docs.sqlalchemy.org/

---

**Enjoy building! 🚀**
