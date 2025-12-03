# Frontend Setup Guide

Get the pair-programming frontend running in 5 minutes!

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Backend URL
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local if needed (defaults to localhost:8000)
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:3000
```

## Features

✨ **Real-time Collaboration**
- Live code synchronization
- Live cursor tracking
- Typing indicators
- User presence

🎨 **Monaco Editor**
- Python syntax highlighting
- Full editor features
- Dark theme

🤖 **Autocomplete**
- Smart suggestions
- Real-time display

## Project Structure

```
src/
├── app/                # Next.js pages
├── components/        # React components
├── hooks/            # Custom hooks
├── store/            # Redux state management
└── config/           # Configuration
```

## Important Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page (create room) |
| `src/app/room/[roomId]/page.tsx` | Room page (editor) |
| `src/store/store.ts` | Redux store setup |
| `src/hooks/useWebSocket.ts` | WebSocket connection |
| `src/components/MonacoEditorWrapper.tsx` | Editor component |

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

## Configuration

### Environment Variables

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

### For Production

Update environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_WS_URL=wss://your-backend.com/api
```

## How It Works

### 1. Create Room
- Click "Create New Room" button
- Makes POST request to backend
- Redirects to `/room/{roomId}`

### 2. Connect WebSocket
- Component mounts with roomId
- Establishes WebSocket connection
- Receives initial code state

### 3. Edit Code
- Type in Monaco Editor
- Debounced updates sent via WebSocket
- Other users' code synchronized

### 4. See Cursors
- Cursor position tracked
- Redux updates other users' cursors
- Monaco decorations show cursor lines

### 5. Get Suggestions
- Autocomplete API called after typing stops
- Suggestion displayed above editor
- Can dismiss or ignore

## Architecture

### Redux Slices

**Room** - Code, language, cursors, typing, connection status
**Autocomplete** - Suggestions, loading state
**WebSocket** - Connection state, reconnection attempts

### Custom Hooks

**useWebSocket** - Connection management and message handling
**useDebounce** - Debounce code and cursor updates
**useMonacoCursors** - Sync cursors to editor decorations

### Components

**MonacoEditorWrapper** - Code editor
**StatusBar** - Connection status and info
**Header** - Navigation
**Button** - Reusable button

## Deployment

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
See README.md for Docker, Railway, Fly.io, etc.

## Troubleshooting

### WebSocket Connection Failed
- Check backend is running
- Verify URL in `.env.local`
- Check browser console for errors

### Monaco Editor Not Showing
- Check node_modules exists
- Rebuild: `rm -rf .next && npm run build`
- Try restarting dev server

### Type Errors
- Run `npm run type-check`
- Install missing types: `npm install --save-dev @types/...`

## Next Steps

1. Start frontend: `npm run dev`
2. Start backend: `cd ../backend && python -m uvicorn backend.main:app --reload`
3. Visit `http://localhost:3000`
4. Create room and start collaborating!

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Monaco Editor](https://github.com/suren-atoyan/monaco-react)
- [Tailwind CSS](https://tailwindcss.com)

---

**Enjoy pair programming! 🚀**
