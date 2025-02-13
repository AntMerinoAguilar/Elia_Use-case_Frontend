import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Créer le Context
const AgentContext = createContext();

// Créer le Provider
export const AgentProvider = ({ children }) => {
  const [agent, setAgent] = useState(null); // Stocker les infos de l'agent connecté
  const [loading, setLoading] = useState(true); // Indiquer si les données sont en cours de chargement

  useEffect(() => {
    // Appeler l'API pour récupérer l'agent connecté
    const fetchAgent = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/agents/me", {
          withCredentials: true, // Nécessaire pour inclure les cookies
        });
        setAgent(response.data); // Stocker les infos dans le state
      } catch (error) {
        console.error("Erreur lors de la récupération de l'agent connecté :", error);
      } finally {
        setLoading(false); // Chargement terminé
      }
    };

    fetchAgent();
  }, []);

  return (
    <AgentContext.Provider value={{ agent, loading }}>
      {children}
    </AgentContext.Provider>
  );
};

// Exporter le Context pour l'utiliser dans d'autres composants
export const useAgent = () => React.useContext(AgentContext);
