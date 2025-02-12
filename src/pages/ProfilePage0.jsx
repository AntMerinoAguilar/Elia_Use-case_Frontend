import { useEffect, useState } from "react";

function Profile() {
  const [error, setError] = useState(null);
  const [agent, setAgent] = useState(null); // Stocker les infos de l'agent

  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/agents`, {
          method: "GET",
          credentials: "include", // Envoie les cookies
        });

        console.log("🛜 Réponse reçue :", response);
  
        if (!response.ok) {
          throw new Error("Erreur d'authentification");
        }

        const data = await response.json();
        console.log("✅ Utilisateur authentifié :", data);
        setAgent(data); // Met à jour l'utilisateur
      } catch (err) {
        console.error("❌ Erreur d'authentification :", err.message);
        setError(err.message); // Mise à jour de l'état d'erreur
      }
    };
  

    checkAuth();
  }, []);
  
  return (
    <>
      <h1>Bienvenue sur ton profil !</h1>
      {error ? (
        <p>Erreur d'authentification ❌</p>
      ) : agent ? (
        <p>Tu es connecté en tant que {agent.name}.</p>
      ) : (
        <p>Chargement...</p>
      )}
    </>
  );
}

export default Profile;

