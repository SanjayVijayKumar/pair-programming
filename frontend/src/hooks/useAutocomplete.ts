import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setSuggestion,
  setLoading,
  setError,
  clearSuggestion,
} from "../redux/autocompleteSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function useAutocomplete() {
  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.room.code);
  const language = useAppSelector((state) => state.room.language);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestion = async (
    codeContent: string,
    cursorPosition: number
  ) => {
    dispatch(setLoading(true));
    dispatch(clearSuggestion());

    try {
      const response = await fetch(`${BACKEND_URL}/api/autocomplete/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeContent,
          cursor_position: cursorPosition,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setSuggestion(data.suggestion));
      dispatch(setError(null));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      dispatch(setError(errorMessage));
      dispatch(setSuggestion(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const triggerAutocomplete = (codeContent: string, cursorPosition: number) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce: wait 600ms after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestion(codeContent, cursorPosition);
    }, 600);
  };

  return { triggerAutocomplete };
}
