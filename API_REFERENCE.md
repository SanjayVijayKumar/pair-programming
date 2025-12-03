# API Reference Guide

Complete reference for all endpoints in the pair-programming backend.

## Base URL

```
http://localhost:8000  (development)
https://your-render-url.onrender.com  (production)
```

## Health & Info Endpoints

### Health Check
**Check if the server is running and healthy.**

```http
GET /health
```

**Response** (200 OK):
```json
{
  "status": "healthy"
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

---

### Root Endpoint
**Get API information.**

```http
GET /
```

**Response** (200 OK):
```json
{
  "message": "Welcome to Pair Programming Backend",
  "version": "1.0.0",
  "docs": "/docs"
}
```

**Example:**
```bash
curl http://localhost:8000/
```

---

## Room Management Endpoints

### Create Room
**Create a new collaboration room.**

```http
POST /api/rooms
```

**Request:**
No body required.

**Response** (201 Created):
```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/rooms

# Response
{"room_id":"550e8400-e29b-41d4-a716-446655440000"}
```

**JavaScript/Frontend:**
```javascript
const response = await fetch('http://localhost:8000/api/rooms', {
  method: 'POST'
});
const data = await response.json();
const roomId = data.room_id;
```

---

### Get Room
**Retrieve information about a specific room.**

```http
GET /api/rooms/{room_id}
```

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| room_id | string | Yes | The UUID of the room |

**Response** (200 OK):
```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-12-03T10:30:00.000Z",
  "last_updated": "2024-12-03T10:35:00.000Z"
}
```

**Response** (404 Not Found):
```json
{
  "detail": "Room 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

**Example:**
```bash
curl http://localhost:8000/api/rooms/550e8400-e29b-41d4-a716-446655440000

# Response
{
  "room_id":"550e8400-e29b-41d4-a716-446655440000",
  "created_at":"2024-12-03T10:30:00",
  "last_updated":"2024-12-03T10:35:00"
}
```

---

## Autocomplete Endpoint

### Get Code Suggestion
**Get autocomplete suggestions for the given code position.**

```http
POST /api/autocomplete
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "def my_function",
  "cursor_position": 15,
  "language": "python"
}
```

**Request Parameters:**
| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| code | string | Yes | The current code content | "def foo" |
| cursor_position | integer | Yes | The cursor position in the code | 7 |
| language | string | No | Programming language (default: "python") | "python" |

**Response** (200 OK):
```json
{
  "suggestion": "(self):\n    pass",
  "context": "Context for python"
}
```

**Examples:**

```bash
# Python function
curl -X POST http://localhost:8000/api/autocomplete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def my_func",
    "cursor_position": 11,
    "language": "python"
  }'

# Response: {"suggestion":"(self):\n    pass","context":"Context for python"}
```

```bash
# Python class
curl -X POST http://localhost:8000/api/autocomplete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "class MyClass",
    "cursor_position": 13,
    "language": "python"
  }'

# Response: {"suggestion":":\n    pass","context":"Context for python"}
```

**JavaScript/Frontend:**
```javascript
const suggestion = await fetch('http://localhost:8000/api/autocomplete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: "def my_func",
    cursor_position: 11,
    language: "python"
  })
});
const data = await suggestion.json();
console.log(data.suggestion);
```

---

## WebSocket Endpoint

### Real-time Collaboration
**Establish WebSocket connection for real-time collaborative editing.**

```
ws://localhost:8000/api/ws/{room_id}
wss://your-render-url.onrender.com/api/ws/{room_id}  (production)
```

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| room_id | string | Yes | The UUID of the room to connect to |

### Connection Workflow

1. **Connect** to WebSocket
2. **Send init message** with user ID
3. **Receive initial state** (code, language)
4. **Send/receive messages** as needed
5. **On disconnect** room state is automatically saved

### Message Types

#### **Client → Server Messages**

##### Init (On Connection)
Send this immediately after connecting to initialize the session.

```json
{
  "type": "init",
  "userId": "user-123"
}
```

**Fields:**
- `type` (string, required): Always `"init"`
- `userId` (string, required): Unique identifier for the user

---

##### Code Update
Send updated code to all users in the room.

```json
{
  "type": "code_update",
  "userId": "user-123",
  "code": "def hello():\n    print('Hello World')",
  "timestamp": 1701600600000
}
```

**Fields:**
- `type` (string, required): Always `"code_update"`
- `userId` (string, required): The user sending the update
- `code` (string, required): The complete new code
- `timestamp` (integer, optional): Timestamp of the update

---

##### Cursor Update
Send cursor position to other users.

```json
{
  "type": "cursor_update",
  "userId": "user-123",
  "cursorPosition": 42
}
```

**Fields:**
- `type` (string, required): Always `"cursor_update"`
- `userId` (string, required): The user
- `cursorPosition` (integer, required): Position of cursor (0-indexed)

---

##### Typing Indicator
Send typing status to other users.

```json
{
  "type": "typing",
  "userId": "user-123",
  "isTyping": true
}
```

**Fields:**
- `type` (string, required): Always `"typing"`
- `userId` (string, required): The user
- `isTyping` (boolean, required): `true` when typing, `false` when stopped

---

#### **Server → Client Messages**

##### Init (Initial State)
Sent immediately after connection. Contains the room's current state.

```json
{
  "type": "init",
  "code": "# Welcome to the pair programming room!\n# Start typing here...\n",
  "language": "python"
}
```

**Fields:**
- `type` (string): Always `"init"`
- `code` (string): Current code in the room
- `language` (string): Programming language

---

##### Code Update Broadcast
Broadcasted when any user updates code.

```json
{
  "type": "code_update",
  "code": "def hello():\n    print('Hello World')",
  "user_id": "user-123",
  "timestamp": 1701600600000
}
```

**Fields:**
- `type` (string): Always `"code_update"`
- `code` (string): The updated code
- `user_id` (string): User who made the update
- `timestamp` (integer): When the update occurred

---

##### Cursor Update Broadcast
Broadcasted when a user updates their cursor position.

```json
{
  "type": "cursor_update",
  "user_id": "user-123",
  "cursor_position": 42
}
```

**Fields:**
- `type` (string): Always `"cursor_update"`
- `user_id` (string): The user
- `cursor_position` (integer): New cursor position

---

##### Typing Status Broadcast
Broadcasted when a user's typing status changes.

```json
{
  "type": "typing",
  "user_id": "user-123",
  "is_typing": true
}
```

**Fields:**
- `type` (string): Always `"typing"`
- `user_id` (string): The user
- `is_typing` (boolean): Whether they're typing

---

##### User Joined
Broadcasted when a user connects to the room.

```json
{
  "type": "user_joined",
  "user_id": "user-123",
  "active_users": 2
}
```

**Fields:**
- `type` (string): Always `"user_joined"`
- `user_id` (string): The user who joined
- `active_users` (integer): Total active users in room

---

##### User Left
Broadcasted when a user disconnects.

```json
{
  "type": "user_left",
  "user_id": "user-123",
  "active_users": 1
}
```

**Fields:**
- `type` (string): Always `"user_left"`
- `user_id` (string): The user who left
- `active_users` (integer): Total remaining users

---

##### Error
Sent when there's an error processing a message.

```json
{
  "type": "error",
  "message": "Invalid message format"
}
```

**Fields:**
- `type` (string): Always `"error"`
- `message` (string): Description of the error

---

### WebSocket Example (JavaScript)

```javascript
// Connect to WebSocket
const roomId = "550e8400-e29b-41d4-a716-446655440000";
const ws = new WebSocket(
  `ws://localhost:8000/api/ws/${roomId}`
);

// Handle connection opened
ws.onopen = () => {
  console.log("Connected!");
  
  // Send init message
  ws.send(JSON.stringify({
    type: "init",
    userId: "user-1"
  }));
};

// Handle incoming messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case "init":
      console.log("Initial code:", message.code);
      break;
    
    case "code_update":
      console.log("Code updated by", message.user_id);
      updateEditor(message.code);
      break;
    
    case "cursor_update":
      console.log(`${message.user_id} cursor at ${message.cursor_position}`);
      showCursor(message.user_id, message.cursor_position);
      break;
    
    case "typing":
      console.log(`${message.user_id} is ${message.is_typing ? "typing" : "not typing"}`);
      break;
    
    case "user_joined":
      console.log(`${message.user_id} joined (${message.active_users} total)`);
      break;
    
    case "user_left":
      console.log(`${message.user_id} left (${message.active_users} total)`);
      break;
    
    case "error":
      console.error("Error:", message.message);
      break;
  }
};

// Handle errors
ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// Handle connection closed
ws.onclose = () => {
  console.log("Disconnected");
};

// Send code update
function sendCodeUpdate(newCode) {
  ws.send(JSON.stringify({
    type: "code_update",
    userId: "user-1",
    code: newCode,
    timestamp: Date.now()
  }));
}

// Send cursor position
function sendCursorUpdate(position) {
  ws.send(JSON.stringify({
    type: "cursor_update",
    userId: "user-1",
    cursorPosition: position
  }));
}

// Send typing indicator
function sendTypingStatus(isTyping) {
  ws.send(JSON.stringify({
    type: "typing",
    userId: "user-1",
    isTyping: isTyping
  }));
}
```

---

## HTTP Status Codes

| Code | Meaning | Used In |
|------|---------|---------|
| 200 | OK | All successful GET/POST responses |
| 201 | Created | POST /api/rooms |
| 400 | Bad Request | Invalid JSON or missing required fields |
| 404 | Not Found | Room doesn't exist |
| 500 | Server Error | Unexpected server error |
| 1008 | Policy Violation | Invalid room ID in WebSocket connection |

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Example:**
```json
{
  "detail": "Room 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- IP-based rate limiting
- User-based rate limiting
- WebSocket connection limits per user

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Edit `backend/core/config.py` to add more origins.

---

## Interactive Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive testing of all REST endpoints.

---

## Common Integration Patterns

### Create Room and Connect
```javascript
// 1. Create room
const roomResponse = await fetch('http://localhost:8000/api/rooms', {
  method: 'POST'
});
const { room_id } = await roomResponse.json();

// 2. Connect WebSocket
const ws = new WebSocket(
  `ws://localhost:8000/api/ws/${room_id}`
);

// 3. Initialize
ws.send(JSON.stringify({
  type: "init",
  userId: "user-1"
}));
```

### Handle Multiple Users
```javascript
const users = new Map(); // userId -> user info

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  
  if (msg.type === "user_joined") {
    users.set(msg.user_id, { joined: Date.now() });
  } else if (msg.type === "user_left") {
    users.delete(msg.user_id);
  }
  
  updateUI(users);
};
```

### Real-time Editor Integration
```javascript
const editor = document.getElementById('code-editor');

// Send updates on change (debounced)
let updateTimeout;
editor.addEventListener('input', (e) => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    ws.send(JSON.stringify({
      type: "code_update",
      userId: currentUserId,
      code: editor.value,
      timestamp: Date.now()
    }));
  }, 300); // 300ms debounce
});

// Receive updates
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "code_update") {
    editor.value = msg.code;
  }
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-03 | Initial release with core features |

---

**Last Updated**: 2024-12-03
