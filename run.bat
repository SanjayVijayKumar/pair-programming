@echo off
REM Windows startup script for the pair programming backend

echo.
echo ========================================
echo Pair Programming Backend - Startup
echo ========================================
echo.

REM Check if virtual environment exists
if exist venv\ (
    echo Virtual environment found. Activating...
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found.
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo.
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting FastAPI server...
echo.
echo The application will be available at:
echo   - API: http://localhost:8000
echo   - Docs: http://localhost:8000/docs
echo   - ReDoc: http://localhost:8000/redoc
echo.
echo Press Ctrl+C to stop the server.
echo.

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
