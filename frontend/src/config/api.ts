export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api'

export const API_ENDPOINTS = {
  createRoom: `${API_BASE_URL}/rooms`,
  getRoom: (roomId: string) => `${API_BASE_URL}/rooms/${roomId}`,
  autocomplete: `${API_BASE_URL}/autocomplete`,
}

export const WS_ENDPOINTS = {
  room: (roomId: string) => `${WS_BASE_URL}/ws/${roomId}`,
}
