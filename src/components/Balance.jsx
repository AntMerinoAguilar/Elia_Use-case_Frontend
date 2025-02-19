import React, { useEffect, useState } from "react";

const Balance = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/agents", {
          method: "GET",
          credentials: "include", // 🔥 Permet l'envoi des cookies
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

  return (
    <div>
      <h2>Balance des agents</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent._id}>
            {agent.name} {agent.surname} : {agent.balance} heures
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Balance;
