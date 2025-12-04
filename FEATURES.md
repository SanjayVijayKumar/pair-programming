# Features

Complete guide to using the Pair Programming application and its features.

## Getting Started with the App

### 1. Open the Application

Navigate to `http://localhost:8000/static/index.html` in your browser.

### 2. Create or Join a Room

- **Create New Room**: Click "Create New Room" button
  - A unique room ID is automatically generated
  - You can share the URL with others to collaborate

- **Join Existing Room**: 
  - Enter the room ID in the "Join Room" section
  - Or open the shared URL in another browser/tab

## Core Features

### 💻 Real-Time Code Editor

- **Live Editing**: Type code and see updates instantly
- **Multi-user Sync**: Changes from all users appear in real-time
- **Python Support**: Full Python syntax support with helpful suggestions
- **Auto-save**: Code is synchronized to all users as you type

**Usage:**
1. Click in the editor area
2. Start typing Python code
3. Changes appear in real-time to all connected users

### 🤖 AI-Powered Autocomplete

Get intelligent code suggestions as you type.

**Supported Patterns:**
- Function definitions: `def ` → suggests `__init__(self):`, `main():`, etc.
- Class definitions: `class ` → suggests `(object):`, `(Exception):`, etc.
- Import statements: `import ` → suggests `os`, `sys`, `json`, etc.
- Conditional blocks: `if `, `for `, `while ` → context-aware suggestions
- Method calls: `self.` → suggests attributes and methods

**How to Use:**
1. Type a keyword or pattern (e.g., `def `)
2. A gray suggestion appears next to your text
3. Press **Tab** or **Ctrl+Enter** to accept the suggestion
4. The code is automatically inserted at your cursor position

**Example:**
```python
# Type: def
# Suggestion appears: __init__(self):
# Press Tab to accept
def __init__(self):  # ← Auto-completed!
```

### 👥 Real-Time Collaboration

### User Presence
- **Users Online**: Shows total number of active users in the room
- **Active Users**: Displays all connected users
- **User Join/Leave**: Get notifications when users connect or disconnect

**Usage:**
Check the "Users Online" counter in the Room panel to see how many people are collaborating.

### 🎯 Cursor Position Tracking

See where other users are editing in the code.

**Display:**
- Each user gets a colored dot indicator
- Hover over the indicator to see the user's ID
- Shows which line/position the user is editing

**Benefits:**
- Know where others are working
- Avoid editing the same lines simultaneously
- Better coordination during pair programming

### ⌨️ Typing Indicators

Know when other users are actively typing.

**Display:**
- "Users Typing" section shows who is currently typing
- Animated text indicates active typing
- Clears automatically after 1 second of inactivity

**Usage:**
Monitor the "Users Typing" panel to see real-time typing activity from collaborators.

### 🔄 Code Synchronization

All code changes are synchronized instantly across all users.

**How It Works:**
1. User types code
2. Code is sent to backend (debounced by 300ms)
3. Backend broadcasts to all users
4. All users see the updated code in real-time

**Guarantees:**
- Last-write-wins strategy for conflict resolution
- No code loss due to simultaneous edits
- Consistent state across all users
- Code persists when users join/leave the room

## Room Management

### Create New Room

1. Click "Create New Room" button
2. Room ID is auto-generated and displayed
3. Room is automatically created and ready for collaboration

### Share Room

1. Click "Share" button next to the Room ID
2. Full shareable URL is copied to clipboard
3. Send the URL to collaborators
4. Others can click the link and join instantly

**Example Share Link:**
```
http://localhost:8000/static/index.html?room=550e8400-e29b-41d4-a716-446655440000
```

### Join Room

Option 1: Click the shared link (auto-fills room)

Option 2: Manual join
1. Copy the room ID
2. Paste into "Join Room" field
3. Click "Join Room" button
4. You'll connect to the room and see existing code

## Status Indicators

### Connection Status

**Header Status (Top Right):**
- 🟢 **Green dot**: Connected to server
- 🔴 **Red dot**: Disconnected or connecting

**Connection Status Bar (Bottom Right):**
- Shows "Connected" or "Disconnected"
- Updates automatically

### Sync Status

**Bottom Right Status Bar:**
- **Synced**: All changes are uploaded
- **Syncing...**: Changes are being sent to server
- Updates after each code change

### Cursor Position

**Bottom Left Status Bar:**
- Shows current cursor line and column
- Format: `Ln X, Col Y`
- Updates as you move cursor

## Best Practices

### Effective Collaboration

1. **Use Typing Indicators**: Glance at "Users Typing" to avoid conflicting edits
2. **Watch Cursor Positions**: Use cursor legend to know where others are working
3. **Communicate**: Use typing indicators as visual feedback of activity
4. **Accept Suggestions**: Use Tab key to quickly incorporate autocomplete suggestions

### Code Organization

1. **Consistent Style**: Follow Python conventions (PEP 8)
2. **Comments**: Add comments to clarify complex logic
3. **Indentation**: Use 4 spaces (Python standard)
4. **Function Definitions**: Use autocomplete for consistent function signatures

### Performance

1. **Avoid Long Sessions**: Best used for focused pair programming (30min - 2 hours)
2. **One Typist at a Time**: While collaborative, best results when one person types at a time
3. **Share Control**: Pass the metaphorical "keyboard" regularly

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Accept autocomplete suggestion |
| **Ctrl+Enter** | Accept autocomplete suggestion (alternative) |
| **Ctrl+A** | Select all code |
| **Ctrl+Z** | Browser undo (if supported) |
| **Ctrl+Y** | Browser redo (if supported) |

## Troubleshooting

### Code Not Syncing

**Problem:** Changes aren't appearing in other tabs

**Solutions:**
1. Check "Connected" status in bottom right (should be green)
2. Verify same room ID in URL: `?room=xxx`
3. Refresh the page: `Ctrl+R` or `Cmd+R`
4. Check browser console for errors (`F12`)

### Autocomplete Not Working

**Problem:** No suggestions appearing

**Solutions:**
1. Wait 300ms after typing (debounce time)
2. Try typing a Python keyword: `def `, `class `, `import `
3. Check backend is running: `http://localhost:8000/docs`
4. Verify autocomplete API is accessible

### Users Not Visible

**Problem:** "Users Online" shows incorrect count

**Solutions:**
1. Refresh the page
2. Close unused tabs in the same room
3. Restart the backend server

### Room Not Found

**Problem:** "Room not found" error when connecting

**Solutions:**
1. Verify room ID is correct
2. Check backend is running
3. Create a new room and try again
4. Ensure room ID matches in URL parameter

## Example Workflow

### Scenario: Two developers writing a function together

1. **Developer 1** creates a room
2. **Developer 2** joins using shared link
3. **Dev 1** starts typing: `def calculate_sum(`
4. **Autocomplete** suggests: `self, values):`
5. **Dev 1** presses Tab → code auto-completes
6. **Dev 1** continues: `return sum(values)`
7. **Dev 2** sees cursor at end of function
8. **Dev 1** types `# Testing:` on next line
9. **Autocomplete** suggests Python testing patterns
10. **Dev 2** adds test code
11. **Both** see real-time updates
12. **Team** has complete function with tests

## Limitations

### Current Version

- **Last-Write-Wins**: Simultaneous edits at same location may overwrite
- **Python Only**: Currently focused on Python language
- **No Authentication**: No user login required (local network only)
- **No Persistence**: Code clears when all users leave room
- **Single File**: Only one file per room (no multi-file support)

### Scaling

- **Best for Small Teams**: 2-5 people per room
- **Not for Large Groups**: Not tested with 10+ simultaneous users
- **Local Network**: Designed for localhost or single network

## Advanced Usage

### Using the Swagger API

Access full API documentation:
- Navigate to `http://localhost:8000/docs`
- Interactive endpoint testing
- Full request/response examples
- Autocomplete endpoint for testing suggestions

### WebSocket Protocol

For developers building custom clients:
- WebSocket URL: `ws://localhost:8000/api/ws/{room_id}`
- See GETTING_STARTED.md for protocol details
- All message formats documented

## Support & Help

### Common Questions

**Q: Can I save my code?**
A: Code is stored in the room and persists as long as one user is connected. Copy/paste to save externally.

**Q: Is my code encrypted?**
A: No. This is for local/internal networks only. Don't use on untrusted networks.

**Q: Can I use other languages?**
A: Currently Python only. Autocomplete is Python-specific.

**Q: What happens when everyone leaves?**
A: Room state is saved to database. Next user who joins gets the old code.

### Getting Help

1. Check this file for feature details
2. See GETTING_STARTED.md for setup issues
3. Test API at `http://localhost:8000/docs`
4. Check browser console (`F12`) for errors
5. Restart backend and frontend

## Feedback & Improvements

Potential future enhancements:
- Multi-language support (JavaScript, Go, Rust, etc.)
- User authentication and permissions
- Code history and version control
- Multiple files per room
- Real-time terminal/execution
- Code review features
- Persistent room storage
- Mobile app support
