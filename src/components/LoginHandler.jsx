import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAgent } from "../context/AgentContext";
import LoginForm from "./LoginForm";

const LoginHandler = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAgent();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password });
      navigate("/calendar");
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
      error={error}
    />
  );
};

export default LoginHandler;
