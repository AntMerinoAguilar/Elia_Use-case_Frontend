import React from "react";
import logo from "../assets/logo Elia.png";
import "../styles/LoginForm.css";

const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  error,
}) => {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <img src={logo} alt="logo Elia" className="logo" />
      <div className="inputs">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          className="username-input"
          value={username}
          onChange={onUsernameChange}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="password-input"
          value={password}
          onChange={onPasswordChange}
          required
        />
      </div>

      {error && (
        <p className="erreur-login" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <button type="submit" className="login-btn">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
