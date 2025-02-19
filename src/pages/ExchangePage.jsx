import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Exchange from "../components/Exchange";
import Balance from "../components/Balance";
import "../styles/exchangePage.css"; // On garde tout dans Balance.css

const ExchangePage = () => {
  const [activeTab, setActiveTab] = useState("exchange");

  return (
    <div className="container">
      <Navigation />
      <div className="exchangePage">
        <h1>Exchange</h1>
        {/* ✅ Onglets style dossier */}
        <div className="tabs">
          <div
            className={`tab ${activeTab === "exchange" ? "active" : ""}`}
            onClick={() => setActiveTab("exchange")}
          >
            Échanges
          </div>
          <div
            className={`tab ${activeTab === "balance" ? "active" : ""}`}
            onClick={() => setActiveTab("balance")}
          >
            Balances
          </div>
        </div>

        {/* ✅ Affichage dynamique de la section active */}
        <div className="tab-content">
          {activeTab === "exchange" ? <Exchange /> : <Balance />}
        </div>
      </div>
      
    </div>
  );
};

export default ExchangePage;


