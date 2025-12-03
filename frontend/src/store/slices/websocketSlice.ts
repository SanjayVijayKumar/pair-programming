import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WebsocketState {
  isConnected: boolean
  reconnectAttempts: number
  maxReconnectAttempts: number
}

const initialState: WebsocketState = {
  isConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
}

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
      if (action.payload) {
        state.reconnectAttempts = 0
      }
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts = Math.min(
        state.reconnectAttempts + 1,
        state.maxReconnectAttempts
      )
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0
    },
  },
})

export const {
  setConnected,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} = websocketSlice.actions

export default websocketSlice.reducer
