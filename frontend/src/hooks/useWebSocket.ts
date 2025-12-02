import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setWsStatus,
  updateCodeFromRemote,
  setCode,
} from "../redux/roomSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "ws://localhost:8000";

export function useWebSocket() {
  const dispatch = useAppDispatch();
  const roomId = useAppSelector((state) => state.room.roomId);
  const code = useAppSelector((state) => state.room.code);
  const wsRef = useRef<WebSocket | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomId) {
      dispatch(setWsStatus("disconnected"));
      return;
    }

    // Connect to WebSocket
    dispatch(setWsStatus("connecting"));
    const protocol = BACKEND_URL.startsWith("wss") ? "wss" : "ws";
    const wsUrl = `${BACKEND_URL}/api/ws/ws/${roomId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      dispatch(setWsStatus("connected"));

      // Request initial state
      ws.send(JSON.stringify({ type: "init_request" }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "init_state") {
        // Load initial code from server
        dispatch(setCode(message.code));
      } else if (message.type === "code_update") {
        // Update code from remote user
        dispatch(updateCodeFromRemote(message.code));
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      dispatch(setWsStatus("disconnected"));
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      dispatch(setWsStatus("disconnected"));
    };

    wsRef.current = ws;

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, dispatch]);

  const sendCodeUpdate = (newCode: string, cursorPosition: number) => {
    // Debounce sending updates
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "code_update",
            code: newCode,
            cursorPosition,
            userId: "user-" + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          })
        );
      }
    }, 100);
  };

  return { sendCodeUpdate };
}
