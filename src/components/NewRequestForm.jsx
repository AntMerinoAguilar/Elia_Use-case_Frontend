import React, { useState } from "react";
import axios from "axios"; // Import pour gérer les requêtes HTTP

const NewRequestForm = () => {
  const [formData, setFormData] = useState({
    requesterId: "",
    timeSlot: { startTime: "", endTime: "" },
    requestType: "Replacement",
    availableSlot: { startTime: "", endTime: "" },
    targetAgentId: "",
  });

  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("timeSlot")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        timeSlot: { ...formData.timeSlot, [key]: value },
      });
    } else if (name.includes("availableSlot")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        availableSlot: { ...formData.availableSlot, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Évite la double soumission
    setLoading(true);

    const { timeSlot, availableSlot } = formData;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Validations
    if (!timeSlot.startTime || !timeSlot.endTime) {
      alert("Veuillez remplir toutes les dates avant d'envoyer la demande.");
      setLoading(false);
      return;
    }

    if (new Date(timeSlot.startTime) >= new Date(timeSlot.endTime)) {
      alert("La date de début doit être avant la date de fin.");
      setLoading(false);
      return;
    }

    if (new Date(timeSlot.startTime) < today || new Date(timeSlot.endTime) < today) {
      alert("Les dates doivent être dans le futur.");
      setLoading(false);
      return;
    }

    try {
      // **Envoi de la requête POST au backend**
      const response = await axios.post("http://localhost:3000/api/requests", formData, {
        withCredentials: true, // Envoi des cookies si nécessaire
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Demande envoyée avec succès !");
      console.log("Réponse du serveur :", response.data);

      // **Réinitialisation du formulaire**
      setFormData({
        requesterId: "",
        timeSlot: { startTime: "", endTime: "" },
        requestType: "Replacement",
        availableSlot: { startTime: "", endTime: "" },
        targetAgentId: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
      alert("❌ Échec de l'envoi. Vérifiez les informations et réessayez.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

      {/* Identifiant du demandeur */}
      <label>
        Identifiant du demandeur :
        <input
          type="text"
          name="requesterId"
          value={formData.requesterId}
          onChange={handleChange}
          placeholder="Entrez l'identifiant"
          required
        />
      </label>
      <hr />

      {/* Plage demandée */}
      <h3>Plage à remplacer</h3>
      <label>
        Début :
        <input
          type="datetime-local"
          name="timeSlot.startTime"
          value={formData.timeSlot.startTime}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Fin :
        <input
          type="datetime-local"
          name="timeSlot.endTime"
          value={formData.timeSlot.endTime}
          onChange={handleChange}
          required
        />
      </label>
      <hr />

      {/* Fourchette proposée */}
      <h3>Fourchette proposée</h3>
      <label>
        Début :
        <input
          type="datetime-local"
          name="availableSlot.startTime"
          value={formData.availableSlot.startTime}
          onChange={handleChange}
        />
      </label>
      <label>
        Fin :
        <input
          type="datetime-local"
          name="availableSlot.endTime"
          value={formData.availableSlot.endTime}
          onChange={handleChange}
        />
      </label>
      <hr />

      {/* Type de demande */}
      <label>
        Type de demande :
        <select name="requestType" value={formData.requestType} onChange={handleChange}>
          <option value="Replacement">Remplacement</option>
          <option value="Swap">Échange</option>
        </select>
      </label>
      <hr />

      {/* Agent cible */}
      <label>
        Identifiant de l'agent cible (optionnel) :
        <input
          type="text"
          name="targetAgentId"
          value={formData.targetAgentId}
          onChange={handleChange}
          placeholder="Agent cible (optionnel)"
        />
      </label>
      <br />

      {/* Bouton de soumission */}
      <button type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
};

export default NewRequestForm;

