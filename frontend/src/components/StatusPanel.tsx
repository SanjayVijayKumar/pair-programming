import React from "react";

interface StatusPanelProps {
  roomId: string | null;
  wsStatus: "disconnected" | "connecting" | "connected";
}

export function StatusPanel({ roomId, wsStatus }: StatusPanelProps) {
  const getStatusColor = () => {
    switch (wsStatus) {
      case "connected":
        return "green";
      case "connecting":
        return "orange";
      case "disconnected":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="status-panel">
      <div className="status-item">
        <strong>Room ID:</strong>
        <code>{roomId || "Loading..."}</code>
      </div>
      <div className="status-item">
        <strong>Status:</strong>
        <span style={{ color: getStatusColor() }} className="status-badge">
          {wsStatus}
        </span>
      </div>
    </div>
  );
}
