# Getting Started

A pair programming application with real-time collaborative code editing.

## Prerequisites

- **Python 3.9 or higher**
- **pip** package manager
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### 1. Clone and Navigate to Project

```bash
cd pair-programming
```

### 2. Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

### Start Backend Server

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at `http://localhost:8000`

### Access Frontend

Once the backend is running, open your browser and navigate to:

```
http://localhost:8000/static/index.html
```

## API Documentation

After starting the backend, interactive API documentation is available at:

- **Swagger UI (Recommended)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive testing of all REST and WebSocket endpoints.

## Quick Test

### 1. Create a Room
```bash
curl -X POST http://localhost:8000/api/rooms
```

Response:
```json
{"room_id": "550e8400-e29b-41d4-a716-446655440000"}
```

### 2. Access the UI
Open two browser tabs with:
```
http://localhost:8000/static/index.html?room=550e8400-e29b-41d4-a716-446655440000
```
