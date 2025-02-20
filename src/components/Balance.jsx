import React, { useEffect, useState } from "react";
import "../styles/Balance.css";
import BalanceBar from "./BalanceBar"; // Ajout de l'import correct
import {API_URL} from '../config/api.config'

const Balance = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/agents`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des agents");

        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAgents();
  }, []);

  // Calcul du max pour normaliser l'échelle des jauges
  const maxBalance = Math.max(...agents.map(a => Math.abs(a.balance)), 1);

  return (
    <div className="balance-container">
      <h2>Balance des agents</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent._id}>
            <p>{agent.name} {agent.surname} : {Math.round(agent.balance)} heures</p>
            <BalanceBar balance={agent.balance} maxBalance={maxBalance} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Balance;
