"""Example WebSocket client for testing the backend."""
import asyncio
import json
import websockets
from typing import Optional


class PairProgrammingClient:
    """Simple WebSocket client for the pair programming backend."""
    
    def __init__(self, base_url: str = "ws://localhost:8000"):
        """Initialize the client.
        
        Args:
            base_url: The base WebSocket URL
        """
        self.base_url = base_url
        self.websocket = None
        self.room_id = None
        self.user_id = None
    
    async def connect(self, room_id: str, user_id: str) -> None:
        """Connect to a room.
        
        Args:
            room_id: The room ID to connect to
            user_id: The user ID
        """
        self.room_id = room_id
        self.user_id = user_id
        
        url = f"{self.base_url}/api/ws/{room_id}"
        print(f"Connecting to {url}...")
        
        self.websocket = await websockets.connect(url)
        print(f"Connected! Sending init message...")
        
        # Send init message
        await self.send_message({
            "type": "init",
            "userId": user_id,
        })
        
        # Receive initial state
        message = await self.websocket.recv()
        initial_state = json.loads(message)
        print(f"Initial state received: {initial_state}")
    
    async def send_message(self, message: dict) -> None:
        """Send a message to the server.
        
        Args:
            message: The message to send
        """
        if not self.websocket:
            raise RuntimeError("Not connected")
        
        await self.websocket.send(json.dumps(message))
        print(f"Sent: {message}")
    
    async def receive_message(self) -> dict:
        """Receive a message from the server.
        
        Returns:
            The received message
        """
        if not self.websocket:
            raise RuntimeError("Not connected")
        
        message_text = await self.websocket.recv()
        message = json.loads(message_text)
        print(f"Received: {message}")
        return message
    
    async def update_code(self, code: str, timestamp: int = 0) -> None:
        """Update the code in the room.
        
        Args:
            code: The new code
            timestamp: The timestamp of the update
        """
        await self.send_message({
            "type": "code_update",
            "userId": self.user_id,
            "code": code,
            "timestamp": timestamp,
        })
    
    async def update_cursor(self, position: int) -> None:
        """Update cursor position.
        
        Args:
            position: The cursor position
        """
        await self.send_message({
            "type": "cursor_update",
            "userId": self.user_id,
            "cursorPosition": position,
        })
    
    async def set_typing(self, is_typing: bool) -> None:
        """Set typing status.
        
        Args:
            is_typing: Whether the user is typing
        """
        await self.send_message({
            "type": "typing",
            "userId": self.user_id,
            "isTyping": is_typing,
        })
    
    async def close(self) -> None:
        """Close the connection."""
        if self.websocket:
            await self.websocket.close()
            print("Connection closed")


async def example_session():
    """Example: Two users collaborating in real-time."""
    import aiohttp
    
    # First, create a room via REST API
    async with aiohttp.ClientSession() as session:
        async with session.post("http://localhost:8000/api/rooms") as resp:
            room_data = await resp.json()
            room_id = room_data["room_id"]
    
    print(f"\nCreated room: {room_id}\n")
    
    # Create two clients
    client1 = PairProgrammingClient()
    client2 = PairProgrammingClient()
    
    # Connect both clients
    await client1.connect(room_id, "user1")
    print()
    await client2.connect(room_id, "user2")
    print()
    
    # User 1 updates code
    print("User 1 updating code...")
    await client1.update_code("print('Hello from user 1')", 1000)
    print()
    
    # User 2 receives the update
    print("User 2 waiting for updates...")
    message = await asyncio.wait_for(client2.receive_message(), timeout=2)
    print()
    
    # User 2 updates cursor
    print("User 2 updating cursor...")
    await client2.update_cursor(25)
    print()
    
    # User 2 starts typing
    print("User 2 starts typing...")
    await client2.set_typing(True)
    print()
    
    # User 1 receives cursor and typing updates
    print("User 1 receiving updates...")
    for _ in range(2):
        message = await asyncio.wait_for(client1.receive_message(), timeout=2)
        print()
    
    # Clean up
    await client1.close()
    await client2.close()


async def test_autocomplete():
    """Example: Testing autocomplete endpoint."""
    import aiohttp
    
    url = "http://localhost:8000/api/autocomplete"
    
    test_cases = [
        {
            "code": "def my_func",
            "cursor_position": 11,
            "language": "python",
        },
        {
            "code": "class MyClass",
            "cursor_position": 13,
            "language": "python",
        },
        {
            "code": "import ",
            "cursor_position": 7,
            "language": "python",
        },
    ]
    
    async with aiohttp.ClientSession() as session:
        for test_case in test_cases:
            print(f"\nTesting: {test_case}")
            async with session.post(url, json=test_case) as resp:
                data = await resp.json()
                print(f"Suggestion: {data['suggestion']}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "autocomplete":
        asyncio.run(test_autocomplete())
    else:
        asyncio.run(example_session())
