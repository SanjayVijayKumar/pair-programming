# Backend & Frontend Integration Guide

Complete guide for running both backend and frontend together.

## Prerequisites

- Python 3.9+ for backend
- Node.js 18+ for frontend
- Git for version control

## Quick Setup (5 minutes)

### Terminal 1: Start Backend

```bash
cd backend

# Option 1: Using virtual environment (recommended)
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn backend.main:app --reload
```

The backend will start at `http://localhost:8000`

### Terminal 2: Start Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Create .env.local if it doesn't exist
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend will start at `http://localhost:3000`

### Terminal 3 (Optional): Monitor Backend

```bash
# Keep this window open to see backend logs
# Already started in Terminal 1
```

## Testing the Full Stack

### 1. Create a Room
1. Open `http://localhost:3000` in browser
2. Click "Create New Room"
3. You'll be redirected to `/room/{roomId}`

### 2. Test Real-time Collaboration
**Window 1:**
1. Open `http://localhost:3000`
2. Create a room
3. Type some code

**Window 2:**
1. Open same room URL from Window 1
2. Type code in Window 1
3. See code appear in real-time in Window 2
4. See cursor movement and typing indicator

### 3. Verify Features
- [ ] Code synchronization works
- [ ] Cursor tracking visible
- [ ] "User X is typing..." shows
- [ ] Autocomplete suggestions appear
- [ ] Status bar shows connection status
- [ ] Active user count updates

## Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

**Module not found**
```bash
pip install -r requirements.txt --force-reinstall
```

**Database locked**
```bash
rm backend/data/app.db
python -m uvicorn backend.main:app --reload
# Database will be recreated
```

### Frontend Issues

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

**Module not found**
```bash
npm install
rm -rf node_modules
npm install
```

**WebSocket connection failed**
- Verify backend is running on `http://localhost:8000`
- Check `.env.local` has correct URLs:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000/api
  NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
  ```

### CORS Issues

If you see CORS errors, the backend CORS configuration may need updating.

**Edit `backend/core/config.py`:**
```python
CORS_ORIGINS: list = [
    "http://localhost:3000",   # Add your frontend URL
    "http://localhost:5173",
    # ... other origins
]
```

## Development Workflow

### Making Backend Changes

1. Edit files in `backend/`
2. Server auto-reloads (if running with `--reload`)
3. Frontend will reconnect automatically
4. Test in browser

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Server auto-reloads
3. Browser hot-reloads
4. Changes appear immediately

## API Quick Reference

### Create Room
```bash
curl -X POST http://localhost:8000/api/rooms
```

### Get Room Info
```bash
curl http://localhost:8000/api/rooms/{roomId}
```

### Get Autocomplete
```bash
curl -X POST http://localhost:8000/api/autocomplete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def my_func",
    "cursor_position": 11,
    "language": "python"
  }'
```

### WebSocket Connect
```javascript
const ws = new WebSocket('ws://localhost:8000/api/ws/{roomId}');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "init",
    userId: "user-1"
  }));
};
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Next.js)            │
│  http://localhost:3000                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │  Home Page       │        │  Room Page       │     │
│  │  - Create Room   │───────→│  - Monaco Editor │     │
│  └──────────────────┘        │  - Status Bar    │     │
│                              │  - Autocomplete  │     │
│                              └──────────────────┘     │
│                                     │                │
│                    ┌────────────────┼───────────────┐
│                    │ Redux Store    │               │
│                    │ - Room State   │               │
│                    │ - Cursors      │               │
│                    │ - Typing       │               │
│                    └────────────────┼───────────────┘
│                                     │
└─────────────────────────────────────┼─────────────────┘
        REST (POST /rooms)            │  WebSocket
        REST (POST /autocomplete)     │  (WS /ws/{roomId})
                                      │
┌─────────────────────────────────────▼─────────────────┐
│                     BACKEND (FastAPI)                 │
│  http://localhost:8000                                │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │ REST Routes  │  │ WebSocket    │  │ Services    ││
│  │ - /rooms     │  │ - /ws/{id}   │  │ - Room Svc  ││
│  │ - /autocpl.  │  │ - Connection │  │ - Realtime  ││
│  └──────────────┘  │   Manager    │  └─────────────┘│
│                    └──────────────┘                  │
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │           SQLite Database                        ││
│  │  - Rooms table                                   ││
│  │  - Code snapshots                                ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
└───────────────────────────────────────────────────────┘
```

## File Organization

```
pair-programming/
├── backend/
│   ├── main.py
│   ├── core/
│   ├── db/
│   ├── schemas/
│   ├── services/
│   ├── routers/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── config/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── README.md
│
└── (root)
    ├── GETTING_STARTED.md (this file)
    ├── INTEGRATION_GUIDE.md (this file)
    └── README.md
```

## Next Steps

### For Development
1. Make backend changes → auto-reload
2. Make frontend changes → hot-reload
3. Test in browser → see changes immediately
4. Use Redux DevTools for state debugging

### For Testing
1. Test with multiple browser windows
2. Test network disconnect/reconnect
3. Test with slow network (DevTools)
4. Test autocomplete with different code

### For Deployment
1. Build frontend: `npm run build`
2. Deploy frontend to Vercel/Netlify
3. Deploy backend to Render/Railway
4. Update environment variables
5. Test end-to-end

## Performance Tips

### Backend
- Use `--reload` only in development
- Monitor WebSocket connections
- Check database queries with logs

### Frontend
- Clear `.next` folder if build issues
- Use Redux DevTools to monitor dispatches
- Profile with React DevTools

## Environment Variables

### Backend (`backend/.env` if using)
```
DATABASE_PATH=./backend/data/app.db
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

## Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Backend Copilot Guide**: See `backend/copilot-instructions.md`
- **Frontend Copilot Guide**: See `frontend/COPILOT_INSTRUCTIONS.md`

## Support & Help

### Common Questions

**Q: How do I connect multiple users?**
A: Open multiple browser windows/tabs with the same room URL. They'll sync automatically.

**Q: Why isn't WebSocket connecting?**
A: Check that backend is running and `.env.local` has correct URLs.

**Q: How do I clear the database?**
A: Delete `backend/data/app.db` and restart the backend.

**Q: Can I use a different port?**
A: 
- Backend: `python -m uvicorn backend.main:app --port 8001`
- Frontend: `npm run dev -- -p 3001`
- Update `.env.local` with new URLs

### Getting Help

1. Check the relevant README.md
2. Check COPILOT_INSTRUCTIONS.md
3. Review backend logs in Terminal 1
4. Check browser console in DevTools

## Next Steps

1. **Backend**: Start with `backend/QUICKSTART.md`
2. **Frontend**: Start with `frontend/QUICKSTART.md`
3. **Integration**: Follow this guide
4. **Development**: Use COPILOT_INSTRUCTIONS.md files

---

**You're all set! Start the servers and begin collaborating! 🚀**
