import { configureStore } from '@reduxjs/toolkit'
import roomReducer from './slices/roomSlice'
import autocompleteReducer from './slices/autocompleteSlice'
import websocketReducer from './slices/websocketSlice'

export const store = configureStore({
  reducer: {
    room: roomReducer,
    autocomplete: autocompleteReducer,
    websocket: websocketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
