# Frontend - Pair Programming Application

A real-time pair programming frontend built with Next.js, React, Redux Toolkit, and Monaco Editor.

## Features

✨ **Real-time Collaboration**
- Live code synchronization via WebSockets
- Live cursor tracking for all users
- Typing indicators
- User presence tracking

🎨 **Monaco Editor Integration**
- Python syntax highlighting
- Full editor features (formatting, autocomplete suggestions)
- Dark theme matching VS Code
- Cursor position tracking

🤖 **AI Autocomplete**
- Smart code suggestions
- Debounced API calls
- Ghost text display

📊 **Redux State Management**
- Centralized state for room, autocomplete, and WebSocket
- Async thunks for API calls
- Clean slice architecture

🎯 **TypeScript Support**
- Full type safety
- Better IDE support
- Improved developer experience

## Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **State Management**: Redux Toolkit
- **Code Editor**: Monaco Editor
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP**: Axios/Fetch API

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (room creation)
│   │   ├── room/[roomId]/     # Room page
│   │   ├── globals.css        # Global styles
│   │   └── providers.tsx      # Redux provider
│   ├── components/            # React components
│   │   ├── MonacoEditorWrapper.tsx
│   │   ├── StatusBar.tsx
│   │   ├── Header.tsx
│   │   └── Button.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWebSocket.ts   # WebSocket connection management
│   │   ├── useDebounce.ts    # Debounce hook
│   │   └── useMonacoCursors.ts # Cursor synchronization
│   ├── store/                 # Redux store
│   │   ├── store.ts          # Store configuration
│   │   └── slices/
│   │       ├── roomSlice.ts
│   │       ├── autocompleteSlice.ts
│   │       └── websocketSlice.ts
│   └── config/               # Configuration
│       └── api.ts            # API endpoints
├── public/                   # Static assets
├── .env.local.example        # Environment variables template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Running backend server (see backend README)

### Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## Development

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000` with hot reload enabled.

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Architecture

### Redux Store

**Room Slice** (`roomSlice`)
- Manages room state
- Tracks users' cursors and typing status
- Handles connection status
- Stores code and language

**Autocomplete Slice** (`autocompleteSlice`)
- Manages autocomplete suggestions
- Handles async API calls
- Tracks loading state

**WebSocket Slice** (`websocketSlice`)
- Manages WebSocket connection state
- Tracks reconnection attempts

### Custom Hooks

**useWebSocket**
- Manages WebSocket connection lifecycle
- Handles message parsing and dispatching
- Implements exponential backoff reconnection
- Tracks color assignment for user cursors

**useDebounce**
- Debounces code and cursor position updates
- Reduces WebSocket traffic

**useMonacoCursors**
- Synchronizes other users' cursors to Monaco decorations
- Updates cursor positions in real-time

### Components

**MonacoEditorWrapper**
- Wraps @monaco-editor/react
- Handles code changes
- Tracks cursor position
- Manages editor configuration

**StatusBar**
- Displays room info
- Shows connection status
- Displays typing indicators
- Shows user count

**Header**
- Application title
- Quick links

**Button**
- Reusable button component
- Multiple variants and sizes

## API Integration

### REST Endpoints

**Create Room**
```typescript
POST /api/rooms
// Returns: { room_id: "uuid" }
```

**Get Autocomplete**
```typescript
POST /api/autocomplete
// Body: { code: string, cursor_position: number, language: string }
// Returns: { suggestion: string, context: string }
```

### WebSocket Protocol

**Connect**
```
ws://localhost:8000/api/ws/{room_id}
```

**Messages** (see backend documentation for details)
- `init` - Initialize connection
- `code_update` - Code synchronization
- `cursor_update` - Cursor position
- `typing` - Typing status
- `user_joined` / `user_left` - Presence
- `error` - Error notification

## Key Features

### Real-time Code Synchronization
1. User edits code locally
2. Debounced send via WebSocket
3. Redux state updates
4. Monaco Editor updates
5. All users receive update

### Live Cursor Tracking
1. Cursor position tracked on change
2. Debounced send to WebSocket
3. Redux state updated
4. Monaco decorations render colored cursors

### Typing Indicators
1. Typing starts → send `typing: true`
2. After 600ms inactivity → send `typing: false`
3. Redux tracks typing status
4. Status bar displays "X is typing..."

### Autocomplete Integration
1. Code change → debounce 300ms
2. After typing stops → fetch suggestion
3. Display as ghost text
4. User can dismiss

## Configuration

### Environment Variables

Create `.env.local` with:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api

# For production:
# NEXT_PUBLIC_API_URL=https://your-backend.com/api
# NEXT_PUBLIC_WS_URL=wss://your-backend.com/api
```

### Monaco Editor Options

Edit `src/components/MonacoEditorWrapper.tsx` to customize:
- Font size
- Theme
- Language support
- Editor features

### Tailwind Customization

Edit `tailwind.config.ts` to customize:
- Colors
- Spacing
- Custom utilities

## Performance Optimization

### Debouncing
- Code updates: 300ms
- Cursor updates: 500ms
- Reduces WebSocket traffic

### Memoization
- Component memoization for expensive renders
- Selector memoization in Redux

### Code Splitting
- Next.js automatic code splitting
- Dynamic imports for Monaco Editor

## Troubleshooting

### WebSocket Connection Failed
- Verify backend is running on configured URL
- Check CORS headers from backend
- Verify WebSocket URL in `.env.local`

### Editor Not Rendering
- Check Monaco Editor is installed: `npm list @monaco-editor/react`
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

### Slow Performance
- Check Redux DevTools for frequent dispatches
- Verify debounce delays in hooks
- Profile with React DevTools

### Deployment Issues
- Build locally first: `npm run build`
- Check build errors: `npm run build 2>&1`
- Verify environment variables are set

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.com/api`
   - `NEXT_PUBLIC_WS_URL=wss://your-backend.com/api`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Other Platforms

Supports any platform that runs Node.js 18+:
- Netlify
- Railway
- Fly.io
- Self-hosted

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern browsers with ES2020 support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Monaco Editor React](https://github.com/suren-atoyan/monaco-react)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT

---

**Happy Pair Programming! 🚀**
