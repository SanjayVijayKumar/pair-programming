import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import autocompleteReducer from "./autocompleteSlice";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    autocomplete: autocompleteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
