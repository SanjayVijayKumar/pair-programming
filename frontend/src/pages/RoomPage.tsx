import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setRoomId, setCursorPosition } from "../redux/roomSlice";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { Editor } from "../components/Editor";
import { StatusPanel } from "../components/StatusPanel";
import "../styles/Room.css";

export function RoomPage() {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();
  const roomId = useAppSelector((state) => state.room.roomId);
  const code = useAppSelector((state) => state.room.code);
  const wsStatus = useAppSelector((state) => state.room.wsStatus);
  const suggestion = useAppSelector((state) => state.autocomplete.suggestion);

  const { sendCodeUpdate } = useWebSocket();
  const { triggerAutocomplete } = useAutocomplete();

  useEffect(() => {
    if (paramRoomId && paramRoomId !== roomId) {
      dispatch(setRoomId(paramRoomId));
    }
  }, [paramRoomId, roomId, dispatch]);

  const handleCodeChange = (newCode: string, cursorPosition: number) => {
    dispatch(setCursorPosition(cursorPosition));
    sendCodeUpdate(newCode, cursorPosition);
    triggerAutocomplete(newCode, cursorPosition);
  };

  return (
    <div className="room-container">
      <StatusPanel roomId={roomId} wsStatus={wsStatus} />
      <div className="editor-section">
        <Editor code={code} onChange={handleCodeChange} suggestion={suggestion} />
      </div>
    </div>
  );
}
