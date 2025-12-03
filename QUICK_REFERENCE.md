# 🚀 Pair Programming - Quick Reference

## Start Everything (Copy & Paste)

### Windows
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### macOS/Linux
```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| API ReDoc | http://localhost:8000/redoc |

## What You Get

### Home Page (/)
- Big button to create room
- Features list
- Clean dark theme

### Room Page (/room/:roomId)
- Monaco code editor
- Real-time code sync
- Live cursor tracking
- Typing indicators
- Autocomplete suggestions
- Connection status
- User count

## File Locations

### Backend Key Files
| File | Purpose |
|------|---------|
| `backend/main.py` | App entry point |
| `backend/core/config.py` | Settings |
| `backend/routers/` | API endpoints |
| `backend/services/` | Business logic |
| `backend/db/models.py` | Database models |

### Frontend Key Files
| File | Purpose |
|------|---------|
| `frontend/src/app/page.tsx` | Home page |
| `frontend/src/app/room/[roomId]/page.tsx` | Room page |
| `frontend/src/store/` | Redux state |
| `frontend/src/components/` | UI components |
| `frontend/src/hooks/` | Reusable hooks |

## Common Commands

### Backend
```bash
cd backend
python -m uvicorn backend.main:app --reload     # Dev server
python -m pytest tests/ -v                      # Run tests
```

### Frontend
```bash
cd frontend
npm run dev                                     # Dev server
npm run build                                   # Production build
npm run type-check                              # Check types
npm run lint                                    # Lint code
```

## Features at a Glance

| Feature | Location |
|---------|----------|
| Create Room | POST /api/rooms |
| Code Sync | WebSocket /ws/{roomId} |
| Cursors | Redux + Monaco decorations |
| Typing | WebSocket + Status bar |
| Autocomplete | POST /api/autocomplete |
| Connection | useWebSocket hook |
| State | Redux store |

## Testing

### Test Backend
```bash
cd backend
pytest tests/ -v
```

### Test Full Stack
1. Open http://localhost:3000
2. Click "Create New Room"
3. Open URL in another window
4. See real-time sync

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Change port: `-p 3001` or `--port 8001` |
| Module not found | Run `npm install` or `pip install -r requirements.txt` |
| WebSocket fails | Check URLs in `.env.local` |
| Editor blank | Clear `.next` folder |
| Database error | Delete `backend/data/app.db` |

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

## Stack Summary

| Layer | Technology |
|-------|------------|
| Backend | FastAPI + SQLite |
| Frontend | Next.js + React |
| State | Redux Toolkit |
| Editor | Monaco Editor |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Real-time | WebSockets |

## API Quick Reference

### Create Room
```bash
curl -X POST http://localhost:8000/api/rooms
```

### Get Autocomplete
```bash
curl -X POST http://localhost:8000/api/autocomplete \
  -H "Content-Type: application/json" \
  -d '{"code":"def x","cursor_position":5,"language":"python"}'
```

### Connect WebSocket
```javascript
const ws = new WebSocket('ws://localhost:8000/api/ws/{roomId}');
ws.send(JSON.stringify({type:"init",userId:"user-1"}));
```

## Key Architecture Patterns

| Pattern | Used In |
|---------|---------|
| ConnectionManager | Backend WebSocket |
| Redux Toolkit | Frontend state |
| Custom Hooks | Frontend logic |
| Service Layer | Backend business logic |
| Async/Await | Both |

## Documentation Files

| File | Purpose |
|------|---------|
| IMPLEMENTATION_COMPLETE.md | Full overview |
| INTEGRATION_GUIDE.md | Backend + frontend |
| backend/README.md | Backend docs |
| frontend/README.md | Frontend docs |
| backend/QUICKSTART.md | Backend quick start |
| frontend/QUICKSTART.md | Frontend quick start |

## Interview Points

✅ Built full-stack app
✅ Real-time WebSocket collaboration
✅ Redux state management
✅ Modern stack (Next.js, FastAPI)
✅ Type-safe code
✅ Clean architecture
✅ Comprehensive docs
✅ Production ready

---

**Everything is ready to use! 🎉**

Start the servers and go to http://localhost:3000
