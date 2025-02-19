import React, { useEffect } from "react";
import { useAgent } from "../context/AgentContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { agent, logout, loading } = useAgent(); // 🔥 Ajoute `loading`
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  // 🔄 Corrige la redirection pour attendre `loading === false`
  useEffect(() => {
    if (!loading && agent === null) {
      navigate("/login");
    }
  }, [agent, loading, navigate]);

  return <button className="logout-button" onClick={handleLogout}>Déconnexion</button>;
};

export default LogoutButton;
