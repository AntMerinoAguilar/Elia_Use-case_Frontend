import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Exchange from "../components/Exchange";
import Balance from "../components/Balance"; // Import du nouveau composant

const ExchangePage = () => {
  const [view, setView] = useState("exchange"); // État pour gérer l'affichage

  return (
    <div className="container">
      <Navigation />
      <h1>Exchange Page</h1>
      <p>Bienvenue sur la page des échanges d'horaires.</p>

      {/* Boutons de navigation */}
      <div>
        <button onClick={() => setView("exchange")}>Voir les échanges</button>
        <button onClick={() => setView("balance")}>Voir les balances</button>
      </div>

      {/* Affichage conditionnel */}
      {view === "exchange" ? <Exchange /> : <Balance />}
    </div>
  );
};

export default ExchangePage;

