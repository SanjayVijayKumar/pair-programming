# Quick Start - Vanilla HTML/CSS/JS UI

Get the HTML/CSS/JS version running in 2 minutes!

## Step 1: Start the Backend

```bash
cd backend
python -m uvicorn backend.main:app --reload
```

Backend will run at: `http://localhost:8000`

## Step 2: Open the UI

### Option A: Direct (No Server Needed)
```
Double-click index.html
(or right-click → Open with Browser)
```

### Option B: With Local Server
```bash
# In frontend directory
python -m http.server 8080
```
Then visit: `http://localhost:8080`

## Step 3: Use It

1. **Create Room**
   - Click "Create New Room" button
   - UI displays room ID

2. **Share Room**
   - Copy room ID
   - Share with others or open in another window

3. **Start Collaborating**
   - Type code in editor
   - See real-time synchronization
   - Watch cursor tracking
   - See typing indicators

## What You Get

✨ **Real-time Features**
- Live code sync
- Cursor tracking
- Typing indicators
- User presence

🎨 **Beautiful UI**
- Dark theme
- Responsive design
- Smooth animations
- Status indicators

⚡ **No Dependencies**
- Pure HTML/CSS/JS
- No build process
- Works immediately
- Perfect for demos

## Files

| File | Size | Purpose |
|------|------|---------|
| `index.html` | ~3KB | HTML structure |
| `styles.css` | ~8KB | Styling |
| `script.js` | ~10KB | Logic |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Configuration

If backend is on different port/host, edit `script.js`:

```javascript
const CONFIG = {
    apiUrl: 'http://your-host:port/api',
    wsUrl: 'ws://your-host:port/api',
};
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to create room" | Backend not running |
| WebSocket error | Check backend URL in script.js |
| Editor blank | Try refreshing page |
| No sync | Check browser WebSocket in DevTools |

## Next Steps

1. ✅ Backend running
2. ✅ HTML UI open
3. ✅ Create room and test
4. 📖 Check `VANILLA_UI_README.md` for details

---

**That's it! Start collaborating! 🚀**
