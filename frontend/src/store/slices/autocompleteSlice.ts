import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { API_BASE_URL } from '@/config/api'

interface AutocompleteState {
  suggestion: string
  loading: boolean
  error: string | null
  lastCursorPosition: number
}

const initialState: AutocompleteState = {
  suggestion: '',
  loading: false,
  error: null,
  lastCursorPosition: 0,
}

export const fetchSuggestion = createAsyncThunk(
  'autocomplete/fetchSuggestion',
  async (
    {
      code,
      cursorPosition,
      language,
    }: { code: string; cursorPosition: number; language: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          cursor_position: cursorPosition,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete suggestion')
      }

      const data = await response.json()
      return data.suggestion
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState,
  reducers: {
    clearSuggestion: (state) => {
      state.suggestion = ''
    },
    setLastCursorPosition: (state, action: PayloadAction<number>) => {
      state.lastCursorPosition = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSuggestion.fulfilled, (state, action) => {
        state.loading = false
        state.suggestion = action.payload
      })
      .addCase(fetchSuggestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.suggestion = ''
      })
  },
})

export const { clearSuggestion, setLastCursorPosition } = autocompleteSlice.actions

export default autocompleteSlice.reducer
