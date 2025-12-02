import React from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../utils/api";
import "../styles/Home.css";

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreateRoom = async () => {
    setLoading(true);
    setError(null);

    try {
      const roomId = await createRoom();
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Pair Programming App</h1>
        <p>Real-time collaborative code editor</p>

        {error && <div className="error-message">{error}</div>}

        <button onClick={handleCreateRoom} disabled={loading} className="btn">
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
}
