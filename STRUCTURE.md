# Project Structure

```
pair-programming/
│
├── backend/                          # Main FastAPI backend
│   ├── __init__.py
│   ├── main.py                      # 🚀 FastAPI app entry point
│   │
│   ├── core/                        # Configuration
│   │   ├── __init__.py
│   │   └── config.py               # Settings and constants
│   │
│   ├── db/                          # Database layer
│   │   ├── __init__.py
│   │   ├── database.py             # SQLite connection and init
│   │   └── models.py               # SQLAlchemy ORM models
│   │
│   ├── schemas/                     # Pydantic validation schemas
│   │   ├── __init__.py
│   │   ├── room.py                 # Room request/response schemas
│   │   └── autocomplete.py         # Autocomplete request/response schemas
│   │
│   ├── services/                    # Business logic
│   │   ├── __init__.py
│   │   ├── room_service.py         # Room CRUD operations
│   │   └── realtime.py             # 🔄 WebSocket manager and room state
│   │
│   ├── routers/                     # API endpoints
│   │   ├── __init__.py
│   │   ├── rooms.py                # Room REST endpoints
│   │   ├── autocomplete.py         # Autocomplete endpoint
│   │   └── ws.py                   # 🔌 WebSocket endpoint
│   │
│   ├── tests/                       # Unit and integration tests
│   │   ├── __init__.py
│   │   └── test_api.py             # Example tests
│   │
│   └── data/                        # Runtime data
│       └── app.db                   # SQLite database (auto-created)
│
├── examples/                        # Example code and clients
│   ├── __init__.py
│   └── client.py                    # WebSocket client example
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
│
├── API_REFERENCE.md                 # 📖 Complete API documentation
├── README.md                        # 📘 Full project documentation
├── QUICKSTART.md                    # ⚡ 5-minute setup guide
├── IMPLEMENTATION.md                # ✅ Implementation summary
├── copilot-instructions.md          # 🤖 Development guidelines
│
├── requirements.txt                 # Python dependencies
│
├── run.bat                          # 🪟 Windows startup script
├── run.sh                           # 🐧 Unix/macOS startup script
│
└── [.git/]                          # Git repository (hidden)
```

## File Descriptions

### Core Application
- **`main.py`** - FastAPI application setup, middleware, router registration
- **`core/config.py`** - Settings, constants, configuration values

### Database
- **`db/database.py`** - SQLite engine, session management, initialization
- **`db/models.py`** - SQLAlchemy ORM models (Room table)

### Schemas (Validation)
- **`schemas/room.py`** - Pydantic models for room endpoints
- **`schemas/autocomplete.py`** - Pydantic models for autocomplete

### Services (Business Logic)
- **`services/room_service.py`** - Room CRUD and database operations
- **`services/realtime.py`** - ConnectionManager, RoomState, WebSocket management

### Routers (Endpoints)
- **`routers/rooms.py`** - REST endpoints for room management
- **`routers/autocomplete.py`** - REST endpoint for autocomplete
- **`routers/ws.py`** - WebSocket endpoint for real-time collaboration

### Documentation
- **`README.md`** - Complete documentation with all features explained
- **`QUICKSTART.md`** - Quick setup guide to get running in 5 minutes
- **`API_REFERENCE.md`** - Complete API endpoint reference with examples
- **`IMPLEMENTATION.md`** - Summary of what was implemented
- **`copilot-instructions.md`** - Development guidelines for maintaining/extending

### Configuration
- **`requirements.txt`** - Python package dependencies
- **`.env.example`** - Environment variable template
- **`run.bat`** - Windows batch script to start server
- **`run.sh`** - Shell script to start server (Unix/macOS)

### Testing & Examples
- **`backend/tests/test_api.py`** - Unit and integration test examples
- **`examples/client.py`** - WebSocket client example for testing

---

## Key Statistics

- **Total Python Files**: 15 (including tests)
- **Lines of Code**: ~1500+
- **Classes**: 8+ (FastAPI, SQLAlchemy, Pydantic, custom)
- **REST Endpoints**: 3 (Create room, Get room, Autocomplete)
- **WebSocket Messages**: 8+ types
- **Database Models**: 1 (Room)
- **Documentation Files**: 5

---

## Quick Navigation

### To Add a New Feature
1. Create schema in `schemas/`
2. Add model in `db/models.py` if needed
3. Add service logic in `services/`
4. Add endpoint in `routers/`
5. Include router in `main.py`

### To Fix a Bug
1. Locate code in appropriate module
2. Add test case in `backend/tests/`
3. Fix the code
4. Verify test passes

### To Deploy
1. Follow setup in `QUICKSTART.md`
2. Run with `requirements.txt` dependencies
3. Use startup scripts (`run.bat` or `run.sh`)

### To Understand the Code
1. Start with `README.md` for overview
2. Read `API_REFERENCE.md` for endpoints
3. Check `IMPLEMENTATION.md` for architecture
4. Review `copilot-instructions.md` for patterns

---

## Architecture Layers

```
┌─────────────────────────────────────┐
│     FastAPI (main.py)               │  ← Entry point
├─────────────────────────────────────┤
│  Routers (rooms.py, ws.py, etc)     │  ← HTTP/WS endpoints
├─────────────────────────────────────┤
│  Schemas (room.py, etc)             │  ← Validation
├─────────────────────────────────────┤
│  Services (room_service.py, etc)    │  ← Business logic
├─────────────────────────────────────┤
│  Database (models.py, database.py)  │  ← Persistence
├─────────────────────────────────────┤
│  SQLite (app.db)                    │  ← Storage
└─────────────────────────────────────┘
```

---

## Environment Setup

The project automatically creates:
- `backend/data/` - Directory for database
- `backend/data/app.db` - SQLite database file
- `venv/` - Virtual environment (if using run scripts)

All tables are created automatically on first run via `init_db()` in `main.py`.
