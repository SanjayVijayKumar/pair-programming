# Pair Programming App

A real-time collaborative code editor built with FastAPI (backend) and React (frontend).

## Features

- **Real-time Collaboration**: Two users can edit code simultaneously in a shared room
- **WebSocket Communication**: Instant updates across all connected clients
- **AI Autocomplete**: Mocked AI suggestions when typing pauses for 600ms
- **Last-Write-Wins Sync**: Simple but effective conflict resolution
- **No Authentication**: Just create a room and share the URL

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **WebSockets**: Real-time bidirectional communication
- **PostgreSQL**: Persistent storage with async support
- **SQLModel**: SQL and Python dataclasses for database models

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server

## Project Structure

```
pair-programming-app/
├── backend/                 # FastAPI application
│   ├── main.py             # Entry point
│   ├── api/                # API routers
│   │   ├── rooms.py        # Room creation endpoint
│   │   ├── autocomplete.py # Autocomplete endpoint
│   │   └── ws.py           # WebSocket endpoint
│   ├── core/               # Configuration
│   ├── db/                 # Database models
│   ├── services/           # Business logic
│   ├── schemas/            # Pydantic models
│   └── requirements.txt    # Python dependencies
└── frontend/               # React application
    ├── src/
    │   ├── redux/          # Redux slices and store
    │   ├── pages/          # Page components
    │   ├── components/     # UI components
    │   ├── hooks/          # Custom hooks
    │   ├── utils/          # Utility functions
    │   ├── styles/         # CSS files
    │   └── main.tsx        # Entry point
    ├── package.json        # Node dependencies
    └── vite.config.ts      # Vite configuration
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 13+

### Backend Setup

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```
   DATABASE_URL=postgresql+asyncpg://user:password@localhost/pair_programming_app
   DEBUG=True
   ```

4. **Create the database:**
   ```bash
   createdb pair_programming_app
   ```

5. **Run the backend:**
   ```bash
   uvicorn backend.main:app --reload
   ```
   The API will be available at `http://localhost:8000`
   Swagger docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the `frontend/` directory:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## API Endpoints

### Rooms
- **POST /api/rooms/**: Create a new room
  - Response: `{ "room_id": "<uuid>" }`

### Autocomplete
- **POST /api/autocomplete/**: Get autocomplete suggestions
  - Body: `{ "code": string, "cursor_position": int, "language": "python" }`
  - Response: `{ "suggestion": string }`

### WebSocket
- **WS /api/ws/ws/{room_id}**: Connect to a room
  - **Message types:**
    - `init_request`: Request current room state
    - `init_state`: Response with current code
    - `code_update`: Notify of code changes

## Usage

1. Visit `http://localhost:3000` in your browser
2. Click "Create Room" to generate a new collaborative space
3. Share the room URL with another user
4. Both users can edit the same code simultaneously
5. Suggestions appear after typing pauses for 600ms

## Known Limitations

- **In-Memory State**: Room code state exists only in memory; restarting the backend clears all sessions
- **Single-Instance Only**: Designed for a single backend instance; scaling requires connection manager distribution
- **No Persistence Between Sessions**: Code is not saved to database by default (snapshots are optional)
- **Basic UI**: Editor is a simple textarea; no syntax highlighting or advanced features
- **Mocked Autocomplete**: Suggestions are rule-based, not AI-powered

## Future Enhancements

- Persistent code storage with version history
- User authentication and authorization
- Real syntax highlighting with Monaco or CodeMirror
- Undo/redo support with operation transforms
- Multiple file support
- Code execution environment
- User presence indicators
- Chat/comments system

## Development

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## License

MIT
