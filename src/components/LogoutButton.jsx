import React, { useEffect } from "react";
import { useAgent } from "../context/AgentContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { agent, logout, loading } = useAgent();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!loading && agent === null) {
      navigate("/login");
    }
  }, [agent, loading, navigate]);

  return (
    <button className="logout-button" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
