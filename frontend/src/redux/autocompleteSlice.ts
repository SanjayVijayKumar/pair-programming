import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AutocompleteState {
  suggestion: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AutocompleteState = {
  suggestion: null,
  loading: false,
  error: null,
};

const autocompleteSlice = createSlice({
  name: "autocomplete",
  initialState,
  reducers: {
    setSuggestion: (state, action: PayloadAction<string | null>) => {
      state.suggestion = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSuggestion: (state) => {
      state.suggestion = null;
      state.error = null;
    },
  },
});

export const { setSuggestion, setLoading, setError, clearSuggestion } =
  autocompleteSlice.actions;

export default autocompleteSlice.reducer;
