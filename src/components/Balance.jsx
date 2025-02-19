import React, { useEffect, useState } from "react";
import "../styles/Balance.css";

const Balance = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/agents", {
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
    <div>
      <div className="balance-container">
        <h2>Balance des agents</h2>
        <ul>
          {agents.map((agent) => {
            const balancePercentage = (Math.abs(agent.balance) / maxBalance) * 50;

            return (
              <li key={agent._id}>
                <p>{agent.name} {agent.surname} : {agent.balance} heures</p>
                <div className="balance-bar">
                  <div
                    className={`balance-fill ${agent.balance >= 0 ? "positive" : "negative"}`}
                    style={{
                      width: `${balancePercentage}%`,
                      left: agent.balance < 0 ? `${50 - balancePercentage}%` : "50%"
                    }}
                  ></div>
                  <div className="balance-midline"></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      

      
    </div>
  );
};

export default Balance;
