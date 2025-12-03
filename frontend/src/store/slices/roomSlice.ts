import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserCursor {
  userId: string
  position: number
  color: string
}

interface UserTyping {
  userId: string
  isTyping: boolean
}

interface RoomState {
  roomId: string | null
  code: string
  language: string
  usersCursors: Record<string, UserCursor>
  usersTyping: Record<string, UserTyping>
  status: 'idle' | 'loading' | 'error'
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  errorMessage: string | null
  activeUsersCount: number
}

const initialState: RoomState = {
  roomId: null,
  code: '# Welcome to pair programming!\n# Start typing here...\n',
  language: 'python',
  usersCursors: {},
  usersTyping: {},
  status: 'idle',
  connectionStatus: 'disconnected',
  errorMessage: null,
  activeUsersCount: 0,
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setInitialState: (
      state,
      action: PayloadAction<{ code: string; language: string }>
    ) => {
      state.code = action.payload.code
      state.language = action.payload.language
    },
    updateUserCursor: (state, action: PayloadAction<UserCursor>) => {
      state.usersCursors[action.payload.userId] = action.payload
    },
    removeUserCursor: (state, action: PayloadAction<string>) => {
      delete state.usersCursors[action.payload]
    },
    updateUserTyping: (state, action: PayloadAction<UserTyping>) => {
      state.usersTyping[action.payload.userId] = action.payload
    },
    removeUserTyping: (state, action: PayloadAction<string>) => {
      delete state.usersTyping[action.payload]
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<'disconnected' | 'connecting' | 'connected' | 'error'>
    ) => {
      state.connectionStatus = action.payload
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'error'>) => {
      state.status = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    },
    setActiveUsersCount: (state, action: PayloadAction<number>) => {
      state.activeUsersCount = action.payload
    },
    clearRoom: (state) => {
      state.roomId = null
      state.code = initialState.code
      state.language = initialState.language
      state.usersCursors = {}
      state.usersTyping = {}
      state.connectionStatus = 'disconnected'
    },
  },
})

export const {
  setRoomId,
  setCode,
  setLanguage,
  setInitialState,
  updateUserCursor,
  removeUserCursor,
  updateUserTyping,
  removeUserTyping,
  setConnectionStatus,
  setStatus,
  setErrorMessage,
  setActiveUsersCount,
  clearRoom,
} = roomSlice.actions

export default roomSlice.reducer
