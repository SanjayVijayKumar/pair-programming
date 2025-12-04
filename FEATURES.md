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
