#!/bin/bash
# Unix/macOS startup script for the pair programming backend

echo ""
echo "========================================"
echo "Pair Programming Backend - Startup"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "Virtual environment found. Activating..."
    source venv/bin/activate
else
    echo "Virtual environment not found."
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo ""
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "Starting FastAPI server..."
echo ""
echo "The application will be available at:"
echo "  - API: http://localhost:8000"
echo "  - Docs: http://localhost:8000/docs"
echo "  - ReDoc: http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
