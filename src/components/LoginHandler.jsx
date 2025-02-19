import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAgent } from "../context/AgentContext"; // Import du contexte
import LoginForm from "./LoginForm";

const LoginHandler = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAgent(); // Utilise la fonction login du contexte
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password }); // 🔥 Appelle la nouvelle fonction login()
      navigate("/calendar"); // Redirige après connexion
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <LoginForm
      username={username}
      password={password}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
    />
  );
};

export default LoginHandler;
