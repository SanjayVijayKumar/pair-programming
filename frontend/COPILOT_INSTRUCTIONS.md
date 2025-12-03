# Frontend Development Guide

Build and extend the frontend with Copilot's help.

## Stack Overview

- **Framework**: Next.js 14 (React 18)
- **State Management**: Redux Toolkit
- **Editor**: Monaco Editor with @monaco-editor/react
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Real-time**: WebSockets (native)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory (pages)
│   │   ├── page.tsx           # / - Home page
│   │   ├── room/[roomId]/     # /room/{roomId} - Editor page
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── providers.tsx      # Redux provider wrapper
│   │   └── globals.css        # Global Tailwind CSS
│   ├── components/            # React components
│   │   ├── MonacoEditorWrapper.tsx  # Code editor wrapper
│   │   ├── StatusBar.tsx           # Status and info display
│   │   ├── Header.tsx              # Page header
│   │   ├── Button.tsx              # Reusable button
│   │   └── index.ts                # Component exports
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWebSocket.ts   # WebSocket management
│   │   ├── useDebounce.ts    # Debounce utility
│   │   ├── useMonacoCursors.ts  # Cursor sync
│   │   └── index.ts           # Hook exports
│   ├── store/                # Redux store
│   │   ├── store.ts          # Store configuration
│   │   └── slices/           # Redux slices
│   │       ├── roomSlice.ts       # Room state
│   │       ├── autocompleteSlice.ts  # Suggestions
│   │       ├── websocketSlice.ts  # Connection state
│   │       └── .gitkeep
│   └── config/              # Configuration
│       └── api.ts           # API endpoints and constants
├── public/                  # Static assets
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
├── postcss.config.js      # PostCSS config
└── .eslintrc.json         # ESLint config
```

## Key Architecture Decisions

### Redux Slices

**roomSlice** - Core application state
- `roomId`: Current room identifier
- `code`: Current code content
- `language`: Programming language (default: python)
- `usersCursors`: Record of all users' cursor positions with colors
- `usersTyping`: Record of all users' typing status
- `status`: Loading state for async operations
- `connectionStatus`: WebSocket connection status
- `activeUsersCount`: Number of connected users

**autocompleteSlice** - Autocomplete suggestions
- `suggestion`: Current suggestion text
- `loading`: API call in progress
- `error`: Error message if any
- `lastCursorPosition`: Position where last suggestion was fetched

**websocketSlice** - Real-time connection state
- `isConnected`: Boolean connection status
- `reconnectAttempts`: Current reconnection attempts
- `maxReconnectAttempts`: Maximum attempts before giving up

### Custom Hooks

**useWebSocket(roomId, userId)**
- Manages WebSocket lifecycle
- Handles message dispatching to Redux
- Implements exponential backoff reconnection
- Assigns colors to users
- Returns: `{ send, isReady, ws }`

**useDebounce(value, delay)**
- Debounces value changes
- Used for code updates (300ms) and cursor updates (500ms)
- Reduces WebSocket traffic

**useMonacoCursors(editor)**
- Syncs Redux cursor state to Monaco decorations
- Renders colored cursor lines for other users
- Updates on cursor position changes

### Component Architecture

**MonacoEditorWrapper**
- Wraps @monaco-editor/react
- Handles editor mounting and configuration
- Emits onChange and onCursorChange events
- Props: `code`, `language`, `onChange`, `onCursorChange`, `theme`, `readOnly`

**StatusBar**
- Displays connection info
- Shows typing indicators
- Shows active user count
- Shows room ID

**Header**
- Application title
- Quick links to docs
- Optional subtitle

**Button**
- Reusable with variants: primary, secondary, danger
- Sizes: sm, md, lg
- Loading state support

## Development Workflow

### Adding a Feature

1. **Add Redux Action** (if state needed)
   - Edit `src/store/slices/*.ts`
   - Add reducer or async thunk

2. **Create Component** (if UI needed)
   - Create in `src/components/`
   - Use Redux selector/dispatch hooks

3. **Add Custom Hook** (if logic is reusable)
   - Create in `src/hooks/`
   - Export from `src/hooks/index.ts`

4. **Integrate** (in page or component)
   - Import hook and component
   - Wire up events
   - Test integration

### Example: Adding Disconnect Button

1. **Page**: Import Button from components
2. **Handler**: Call WebSocket send with disconnect message
3. **Redux**: Add disconnect action to roomSlice
4. **Cleanup**: Clear room state on disconnect

## WebSocket Protocol Integration

### Client → Server

```typescript
// Initialize connection
{ type: "init", userId: "user-123" }

// Send code update
{ type: "code_update", userId: "user-123", code: "...", timestamp: 1701600000 }

// Update cursor position
{ type: "cursor_update", userId: "user-123", cursorPosition: 42 }

// Set typing status
{ type: "typing", userId: "user-123", isTyping: true }
```

### Server → Client

```typescript
// Initial state
{ type: "init", code: "...", language: "python" }

// Code broadcasted
{ type: "code_update", code: "...", user_id: "user-123", timestamp: 1701600000 }

// Cursor position
{ type: "cursor_update", user_id: "user-123", cursor_position: 42 }

// Typing indicator
{ type: "typing", user_id: "user-123", is_typing: true }

// User events
{ type: "user_joined", user_id: "user-123", active_users: 2 }
{ type: "user_left", user_id: "user-123", active_users: 1 }

// Errors
{ type: "error", message: "..." }
```

## Performance Tips

### Optimize Re-renders
- Use `useSelector` with specific selectors
- Memoize expensive components with `React.memo`
- Use `reselect` for complex selectors if needed

### Optimize WebSocket Traffic
- Debounce is already implemented (300ms code, 500ms cursor)
- Increase debounce delays if too much traffic
- Only send diffs, not full code (already done)

### Optimize Bundle Size
- Monaco Editor is lazy loaded by Next.js
- Code splitting happens automatically
- Dynamic imports for heavy components

## Styling Guide

### Tailwind Classes Used

```
bg-editor-bg      # Dark background (#1e1e1e)
bg-editor-fg      # Text color (#d4d4d4)
border-editor-border  # Border color (#2d2d30)

h-screen-minus-header  # 100vh - 64px
h-screen-minus-status  # 100vh - 120px
```

### Add Custom Styles

Edit `tailwind.config.ts` to extend theme:

```typescript
theme: {
  extend: {
    colors: {
      'custom': '#abcdef',
    },
  },
}
```

## Common Tasks

### Change Editor Theme
Edit `src/components/MonacoEditorWrapper.tsx`:
```typescript
theme={theme === 'dark' ? 'vs-dark' : 'vs'}
```

### Change Debounce Delays
Edit `src/app/room/[roomId]/page.tsx`:
```typescript
const debouncedCode = useDebounce(code, 500)  // Change from 300
const debouncedCursor = useDebounce(cursorPosition, 1000)  // Change from 500
```

### Add New API Endpoint
1. Update `src/config/api.ts`
2. Create async thunk in relevant slice
3. Use in component

### Add New Redux Slice
1. Create `src/store/slices/newSlice.ts`
2. Add to `src/store/store.ts`
3. Use selectors and dispatch in components

## Testing

### Manual Testing Checklist
- [ ] Create room works
- [ ] Room page loads with editor
- [ ] Code changes sync in real-time
- [ ] Cursor position shows for others
- [ ] Typing indicator displays
- [ ] Autocomplete suggestion appears
- [ ] Disconnect/reconnect works
- [ ] Multiple users can collaborate

### Testing with Multiple Windows
```bash
# Terminal 1
npm run dev

# Terminal 2 - Open two browser windows
# Window 1: http://localhost:3000
# Window 2: http://localhost:3000
# Create same room in both
```

## Debugging

### Redux DevTools
Install Redux DevTools browser extension to inspect state and actions.

### React DevTools
Use React profiler to check component re-renders.

### Network Tab
Check WebSocket messages in browser DevTools Network tab.

### Console Errors
Check browser console for detailed error messages.

## Deployment Checklist

- [ ] Set environment variables (API_URL, WS_URL)
- [ ] Run `npm run build` successfully
- [ ] Run `npm run type-check` passes
- [ ] Run `npm run lint` shows no errors
- [ ] Test in production build: `npm start`
- [ ] Test on Vercel/deployment platform

## Resources

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Monaco Editor React](https://github.com/suren-atoyan/monaco-react)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Common Issues & Solutions

### "Cannot find module 'uuid'"
```bash
npm install uuid
npm install --save-dev @types/uuid
```

### WebSocket connects but no messages
- Check backend WebSocket endpoint is working
- Check message format matches backend expectations
- Check Redux dispatches with DevTools

### Monaco Editor blank
- Check dependencies: `npm list @monaco-editor/react`
- Clear: `rm -rf .next node_modules && npm install`
- Restart dev server

---

**Happy coding! 🚀**
