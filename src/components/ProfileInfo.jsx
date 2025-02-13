import React from "react";
import { useAgent } from "../context/AgentContext";

const ProfileInfo = () => {
  const { agent, loading } = useAgent();

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (!agent) {
    return <p>Aucun agent connecté.</p>;
  }

  return (
    <>
      <h1>Bienvenue, {agent.username} !</h1>
      <p>Nom complet : {agent.name} {agent.surname}</p>
      <p>Code travailleur : {agent.code}</p>
    </>
  );
};

export default ProfileInfo;
