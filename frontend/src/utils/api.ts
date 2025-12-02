export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function createRoom(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/rooms/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to create room: ${response.statusText}`);
  }

  const data = await response.json();
  return data.room_id;
}
