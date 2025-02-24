import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import LogoutButton from "../components/LogoutButton";
import "../styles/ProfileInfo.css";
import moment from "moment";
import BalanceBar from "../components/BalanceBar";
import { API_URL } from "../config/api.config";

const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY HH:mm");
};

const AgentProfile = () => {
  const { agent } = useAgent();
  const [agentData, setAgentData] = useState(null);
  const [history, setHistory] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [maxBalance, setMaxBalance] = useState(1);

  // Charger les informations de l'agent
  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`${API_URL}/agents/me`, { withCredentials: true })
      .then((response) => setAgentData(response.data))
      .catch((error) => console.error("Erreur chargement agent :", error));
  }, [agent]);

  // Charger l'historique de l'agent
  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`${API_URL}/history/${agent._id}`, { withCredentials: true })
      .then((response) => setHistory(response.data))
      .catch((error) => console.error("Erreur chargement historique :", error));
  }, [agent]);

  useEffect(() => {
    axios
      .get(`${API_URL}/agents`, { withCredentials: true })
      .then((response) => {
        setAllAgents(response.data);
        const max = Math.max(
          ...response.data.map((a) => Math.abs(a.balance)),
          1
        );
        setMaxBalance(max);
      })
      .catch((error) => console.error("Erreur chargement agents :", error));
  }, []);

  if (!agentData) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div className="profile-container">
      <div className="agent-profile">
        {/* Bannière avec la couleur de l'agent */}
        <div className="banner" style={{ backgroundColor: agentData.color }}>
          <LogoutButton />
        </div>

        {/* Image de profil */}
        <div className="profile-pic-container">
          <img
            src={agentData.profile_pic}
            crossOrigin="anonymous"
            alt="Profil"
            className="profile-pic"
          />
        </div>

        {/* Informations de l'agent */}
        <div className="agent-info">
          <h2>
            {agentData.name} {agentData.surname}
          </h2>
          <p>
            <strong>Code :</strong> {agentData.code}
          </p>
          <p>
            <strong>Secteur :</strong> {agentData.sector || "Non défini"}
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            {agentData.telephone || "Non renseigné"}
          </p>
        </div>

        {/* Balance de l'agent */}
        <div className="agent-balance">
          <p>
            <strong>Balance :</strong> {agentData.balance} heures
          </p>
          <BalanceBar balance={agentData.balance} maxBalance={maxBalance} />
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
    </div>
  );
};

export default AgentProfile;
