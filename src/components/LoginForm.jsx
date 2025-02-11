import React from "react";

const LoginForm = ({ username, password, onUsernameChange, onPasswordChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>Connexion</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={onUsernameChange}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={onPasswordChange}
        required
      />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
