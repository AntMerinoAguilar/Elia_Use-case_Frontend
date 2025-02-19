import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgent = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/agents/me", {
        withCredentials: true,
      });

      setAgent(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn("⚠ Aucun utilisateur connecté après un refresh.");
      } else {
        console.error("❌ Erreur lors de la récupération de l'agent :", error);
      }
      setAgent(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", credentials, {
        withCredentials: true,
      });
      await fetchAgent(); // 🔥 Recharge l'agent après connexion
      return response.data;
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
    setAgent(null); // 🔥 Réinitialise l'agent après déconnexion
    await fetchAgent(); // 🔄 Vérifie immédiatement après si l'agent est bien null
  };
  

  useEffect(() => {
    fetchAgent(); // Récupère l'agent au démarrage
  }, []);

  return (
    <AgentContext.Provider value={{ agent, loading, login, logout, fetchAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

// ✅ Vérification si `useAgent()` est appelé en dehors de `AgentProvider`
export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
