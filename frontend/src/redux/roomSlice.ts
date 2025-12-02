import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
  roomId: string | null;
  code: string;
  cursorPosition: number;
  language: string;
  status: "idle" | "connecting" | "connected" | "error";
  wsStatus: "disconnected" | "connecting" | "connected";
}

const initialState: RoomState = {
  roomId: null,
  code: "",
  cursorPosition: 0,
  language: "python",
  status: "idle",
  wsStatus: "disconnected",
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"idle" | "connecting" | "connected" | "error">
    ) => {
      state.status = action.payload;
    },
    setWsStatus: (
      state,
      action: PayloadAction<"disconnected" | "connecting" | "connected">
    ) => {
      state.wsStatus = action.payload;
    },
    updateCodeFromRemote: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    resetRoom: (state) => {
      return initialState;
    },
  },
});

export const {
  setRoomId,
  setCode,
  setCursorPosition,
  setLanguage,
  setStatus,
  setWsStatus,
  updateCodeFromRemote,
  resetRoom,
} = roomSlice.actions;

export default roomSlice.reducer;
