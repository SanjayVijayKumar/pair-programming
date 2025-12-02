# Pair Programming App - Root README

## Quick Start

This project consists of two parts:

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env file from .env.example
# Create PostgreSQL database
uvicorn backend.main:app --reload
```

### Frontend (React)
```bash
cd frontend
npm install
# Create .env.local file from .env.example
npm run dev
```

## Architecture

- **Backend**: WebSocket server managing real-time connections and room state
- **Frontend**: React app with Redux state management and WebSocket client

## Key Components

### Backend Flow
1. User creates room → POST /api/rooms
2. User connects to WebSocket → /api/ws/ws/{room_id}
3. Code updates broadcast to other clients
4. Autocomplete suggestions on request → POST /api/autocomplete

### Frontend Flow
1. Home page with "Create Room" button
2. Navigate to room page with URL
3. Connect to WebSocket and load initial code
4. Send code updates on change (debounced)
5. Fetch autocomplete suggestions (600ms debounce)

## Environment Setup

See `.env.example` files in both backend and frontend folders for required variables.

### Database Setup (PostgreSQL)
```bash
createdb pair_programming_app
```

Then update DATABASE_URL in backend/.env:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/pair_programming_app
```

## Testing

Backend docs available at: `http://localhost:8000/docs`
Frontend running at: `http://localhost:3000`

Visit the root page, create a room, and open the URL in another tab to test collaboration.
