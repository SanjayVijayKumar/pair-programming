# Vanilla HTML/CSS/JavaScript UI

A simple, lightweight pair-programming showcase UI built with vanilla HTML, CSS, and JavaScript.

## Features

✨ **Real-time Collaboration**
- Live code synchronization
- Live cursor tracking
- Typing indicators
- User presence

🎨 **Clean Dark Theme**
- Modern dark interface
- Responsive design
- Smooth animations

⚡ **No Build Process Required**
- Just open `index.html` in a browser
- No npm install needed
- Perfect for quick demos

## Getting Started

### Quick Start

1. **Make sure backend is running**:
   ```bash
   cd backend
   python -m uvicorn backend.main:app --reload
   ```

2. **Open the UI**:
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8080
     
     # Python 2
     python -m SimpleHTTPServer 8080
     ```
   - Then visit: `http://localhost:8080`

3. **Create or Join a Room**:
   - Click "Create New Room" to start a new room
   - Or paste a room ID and click "Join Room"

4. **Collaborate**:
   - Type code in the editor
   - See real-time synchronization
   - Watch cursor positions and typing indicators

## Files

| File | Purpose |
|------|---------|
| `index.html` | HTML structure |
| `styles.css` | Styling and animations |
| `script.js` | WebSocket and state management |

## Architecture

### HTML Structure
- **Header**: Status and title
- **Sidebar**: Room controls, user info, typing status
- **Editor**: Code textarea with live feedback
- **Status Bar**: Cursor position and connection status

### CSS Features
- CSS custom properties for theming
- Flexbox layouts
- Smooth transitions and animations
- Responsive design
- Dark theme optimized for coding

### JavaScript Features
- WebSocket client implementation
- Debouncing for performance
- State management object
- Event handling
- Toast notifications

## How It Works

### Create Room
```
User clicks "Create New Room"
  ↓
POST /api/rooms
  ↓
Backend returns room_id
  ↓
UI displays room_id and connects WebSocket
```

### Real-time Sync
```
User types code
  ↓
Debounced (300ms)
  ↓
Send code_update via WebSocket
  ↓
Other users receive update
  ↓
Editor updates in real-time
```

### Cursor Tracking
```
User moves cursor
  ↓
Debounced (500ms)
  ↓
Send cursor_update via WebSocket
  ↓
Server broadcasts to all users
  ↓
Cursors legend updates
```

### Typing Indicator
```
User types
  ↓
Send typing: true
  ↓
After 600ms inactivity
  ↓
Send typing: false
  ↓
Status bar shows "X is typing..."
```

## WebSocket API

### Messages Sent

**Initialize Connection**
```javascript
{
  type: "init",
  userId: "user-abc123"
}
```

**Code Update**
```javascript
{
  type: "code_update",
  userId: "user-abc123",
  code: "print('hello')",
  timestamp: 1701600000
}
```

**Cursor Position**
```javascript
{
  type: "cursor_update",
  userId: "user-abc123",
  cursorPosition: 42
}
```

**Typing Status**
```javascript
{
  type: "typing",
  userId: "user-abc123",
  isTyping: true
}
```

### Messages Received

**Initial State**
```javascript
{
  type: "init",
  code: "# Initial code",
  language: "python"
}
```

**Code Broadcast**
```javascript
{
  type: "code_update",
  code: "print('hello')",
  user_id: "user-abc123",
  timestamp: 1701600000
}
```

**Cursor Broadcast**
```javascript
{
  type: "cursor_update",
  user_id: "user-abc123",
  cursor_position: 42
}
```

**Typing Status**
```javascript
{
  type: "typing",
  user_id: "user-abc123",
  is_typing: true
}
```

**Presence Events**
```javascript
{
  type: "user_joined",
  user_id: "user-abc123",
  active_users: 2
}

{
  type: "user_left",
  user_id: "user-abc123",
  active_users: 1
}
```

## Configuration

Edit `script.js` to change:

```javascript
const CONFIG = {
    apiUrl: 'http://localhost:8000/api',
    wsUrl: 'ws://localhost:8000/api',
};
```

For production:
```javascript
const CONFIG = {
    apiUrl: 'https://your-backend.com/api',
    wsUrl: 'wss://your-backend.com/api',
};
```

## Customization

### Change Colors

Edit `styles.css` CSS variables:

```css
:root {
    --primary-color: #2563eb;
    --background: #0f172a;
    --success: #10b981;
    /* ... more colors */
}
```

### Change Editor Font

```css
.code-editor {
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.95rem;
}
```

### Change User Colors

```javascript
const userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#FFA07A', '#98D8C8', '#F7DC6F'
];
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with WebSocket support

## Performance

- **Debouncing**: Code updates (300ms), cursor updates (500ms)
- **Efficient redraws**: Only necessary DOM updates
- **Minimal dependencies**: Pure vanilla JavaScript
- **Small bundle**: ~50KB total (HTML + CSS + JS)

## Testing

### Test with Multiple Windows

1. Open `index.html` in multiple browser windows
2. Create room in first window
3. Join room in second window with room ID
4. Start typing in one window
5. See updates in real-time in other window

### Test Cursor Tracking

1. Click in different positions in the code editor
2. Watch cursor legend update
3. See cursor positions update in real-time

### Test Typing Indicators

1. Start typing in one window
2. Watch "User X is typing..." appear in other windows
3. After 600ms of inactivity, indicator disappears

## Debugging

### Open DevTools
- Press `F12` or `Ctrl+Shift+I`
- Check Console tab for messages
- Check Network tab for WebSocket traffic

### View State

In console:
```javascript
console.log(state);  // Current application state
console.log(state.userCursors);  // All user cursors
console.log(state.usersTyping);  // Typing status
```

### Clear Data

To reset the application:
```javascript
state.roomId = null;
state.code = '';
state.ws.close();
location.reload();
```

## Troubleshooting

### WebSocket Connection Failed
- Check backend is running on `localhost:8000`
- Check browser console for specific error
- Verify network tab shows WebSocket connection attempt

### Backend API Not Responding
- Ensure `CONFIG.apiUrl` points to correct backend
- Check backend is running
- Check CORS is enabled in backend

### No Real-time Updates
- Verify WebSocket is connected (green dot in header)
- Check browser Network tab for WebSocket messages
- Check browser console for errors

## Limitations

This vanilla JavaScript implementation is designed for demonstration. For production:
- Use a framework like React, Vue, or Svelte
- Add proper error handling and retry logic
- Implement authentication/authorization
- Add state persistence
- Add unit and integration tests

## Next Steps

1. **For Development**: Use the Next.js frontend in `frontend/` folder
2. **For Learning**: Study this code to understand WebSocket basics
3. **For Customization**: Modify HTML/CSS/JS to match your brand
4. **For Production**: Migrate to React or Vue frontend

## Resources

- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [ES6 Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript)

---

**Simple, Fast, and Works! 🚀**

Open `index.html` and start collaborating immediately!
