import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import {API_URL} from '../config/api.config'
import '../styles/AgentSelector.css'

const AgentSelector = ({ onSelectAgent }) => {
  // Récupération de l'agent connecté et de l'état de chargement via useAgent
  const { agent: currentAgent, loading: loadingCurrentAgent } = useAgent();

  // État local pour gérer la liste des agents et l'état de chargement
  const [agents, setAgents] = useState([]); // Stocker les autres agents
  const [loading, setLoading] = useState(true); // État de chargement
  const [selectedAgent, setSelectedAgent] = useState(""); // Valeur sélectionnée

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Appel API pour récupérer tous les agents
        const response = await axios.get(`${API_URL}/agents`, {
          withCredentials: true, // Inclure les cookies pour l'authentification si nécessaire
        });

        // Exclure l'agent connecté de la liste
        const otherAgents = response.data.filter(
          (agent) => agent._id !== currentAgent._id
        );

        // Mise à jour de la liste des agents
        setAgents(otherAgents);
      } catch (error) {
        console.error("Erreur lors de la récupération des agents :", error);
      } finally {
        setLoading(false);
      }
    };

    // Appeler fetchAgents uniquement si currentAgent est défini et prêt
    if (!loadingCurrentAgent && currentAgent) {
      fetchAgents();
    }
  }, [currentAgent, loadingCurrentAgent]);

  // Gestion de la sélection dans la liste déroulante
  const handleChange = (e) => {
    const selectedValue = e.target.value === "" ? undefined : e.target.value; // "" (Public) => undefined
    setSelectedAgent(e.target.value); // Met à jour l'état local pour le <select>
    onSelectAgent(selectedValue); // Transmet la valeur sélectionnée au parent
  };

  // Afficher un message de chargement tant que les données ne sont pas prêtes
  if (loading || loadingCurrentAgent) {
    return <p>Chargement des options...</p>;
  }

  return (
    <select id="agentId" value={selectedAgent} onChange={handleChange} className="agent-input">
      <option value="">Public (tous les agents)</option>
      {agents.map((agent) => (
        <option key={agent._id} value={agent._id}>
          {agent.name} {agent.surname} ({agent.code})
        </option>
      ))}
    </select>
  );
};

export default AgentSelector;
