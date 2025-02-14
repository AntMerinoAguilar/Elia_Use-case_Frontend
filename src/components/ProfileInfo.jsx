import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import "../styles/ProfileInfo.css";
import moment from "moment";

const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY HH:mm");
};

const AgentProfile = () => {
  const { agent } = useAgent(); // Récupérer l'agent connecté
  const [agentData, setAgentData] = useState(null);
  const [history, setHistory] = useState([]); // Stocke l'historique de l'agent

  // Charger les informations de l'agent
  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`http://localhost:3000/api/agents/me`, { withCredentials: true })
      .then((response) => setAgentData(response.data))
      .catch((error) => console.error("Erreur chargement agent :", error));
  }, [agent]);

  // Charger l'historique de l'agent
  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`http://localhost:3000/api/history/${agent._id}`, { withCredentials: true })
      .then((response) => setHistory(response.data))
      .catch((error) => console.error("Erreur chargement historique :", error));
  }, [agent]);

  if (!agentData) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div className="agent-profile">
      {/* Bannière avec la couleur de l'agent */}
      <div className="banner" style={{ backgroundColor: agentData.color }}></div>

      {/* Image de profil */}
      <div className="profile-pic-container">
        <img
          src={agentData.profile_pic || "/default-profile.png"} // Image par défaut si pas de photo
          crossOrigin="anonymous"
          alt="Profil"
          className="profile-pic"
        />
      </div>

      {/* Informations de l'agent */}
      <div className="agent-info">
        <h2>{agentData.name} {agentData.surname}</h2>
        <p><strong>Code :</strong> {agentData.code}</p>
        <p><strong>Secteur :</strong> {agentData.sector || "Non défini"}</p>
        <p><strong>Téléphone :</strong> {agentData.telephone || "Non renseigné"}</p>
      </div>

      {/* Balance de l'agent */}
      <div className="agent-balance">
        <p><strong>Balance :</strong> <br />{agentData.balance} heures</p>
      </div>

      {/* Historique de l'agent */}
      <div className="agent-history">
        <h3>Historique</h3>
        {history.length === 0 ? (
          <p>Aucune activité récente.</p>
        ) : (
          <ul>
            {history.map((entry) => (
              <li key={entry._id}>
                <strong>{entry.type}</strong> - {entry.requestType} <br />
                <small>{formatDate(entry.dateArchived)}</small>
              </li>
            ))}

          </ul>
        )}
      </div>
      
    </div>
  );
};

export default AgentProfile;
