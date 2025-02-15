import React, { useState, useEffect } from "react";
import axios from 'axios';
import AgentSelector from "./AgentSelector";
import ShiftSelector from "./ShiftSelector";
import { useAgent } from "../context/AgentContext";

const NewRequestForm = () => {
  // Accéder à l'agent connecté via useAgent
  const { agent, loading } = useAgent();

  const [formData, setFormData] = useState({
    timeSlot: { startTime: "", endTime: "" }, // Plage pour la demande de remplacement
    requestType: "Replacement", // Valeur par défaut
    availableSlot: { startTime: "", endTime: "" }, // Fourchette proposée
  });

  useEffect(() => {
    if (agent && agent._id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requesterId: agent._id, // Injecter automatiquement l'ID de l'agent connecté
      }));
    }
  }, [agent]);

  const handleShiftSelect = (selectedShift) => {
    if (selectedShift) {
      setFormData({ ...formData, shiftId: selectedShift });
    } else {
      const updatedFormData = { ...formData };
      delete updatedFormData.shiftId;
      setFormData(updatedFormData);
    }
  };
  
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

  const handleAgentSelect = (selectedAgent) => {
    if (selectedAgent) {
      setFormData({ ...formData, targetAgentId: selectedAgent });
    } else {
      const updatedFormData = { ...formData };
      delete updatedFormData.targetAgentId; // Supprime le champ si Public
      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure pour ne comparer que les jours
  
    const { timeSlot, availableSlot } = formData;
  
    // ✅ Validation 1 : Vérifier que toutes les dates sont remplies
    if (
      !timeSlot.startTime ||
      !timeSlot.endTime ||
      !availableSlot.startTime ||
      !availableSlot.endTime
    ) {
      alert("Veuillez remplir toutes les dates avant d'envoyer la demande.");
      return;
    }
  
    // ✅ Validation 2 : Vérifier que les dates de début précèdent les dates de fin
    if (new Date(timeSlot.startTime) >= new Date(timeSlot.endTime)) {
      alert("La date de début de la plage à remplacer doit être avant la date de fin.");
      return;
    }
    if (new Date(availableSlot.startTime) >= new Date(availableSlot.endTime)) {
      alert("La date de début de la fourchette doit être avant la date de fin.");
      return;
    }
  
    // ✅ Validation 3 : Vérifier que toutes les dates sont dans le futur
    if (
      new Date(timeSlot.startTime) < today ||
      new Date(timeSlot.endTime) < today ||
      new Date(availableSlot.startTime) < today ||
      new Date(availableSlot.endTime) < today
    ) {
      alert("Toutes les dates doivent être dans le futur.");
      return;
    }
  
    // ✅ Envoi des données au backend
    try {
      const response = await axios.post("http://localhost:3000/api/requests", formData, {
        withCredentials: true, // Envoi des cookies pour l'authentification
      });
  
      // ✅ Succès
      alert("Demande envoyée avec succès !");
      console.log("Réponse du backend :", response.data);
  
      // ✅ Réinitialisation du formulaire
      setFormData({
        requesterId: "", // Automatiquement injecté par le contexte
        shiftId: "",
        timeSlot: { startTime: "", endTime: "" },
        requestType: "Replacement",
        availableSlot: { startTime: "", endTime: "" },
        targetAgentId: undefined,
      });
    } catch (error) {
      // ❌ Gestion des erreurs
      console.error("Erreur lors de l'envoi de la demande :", error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };
  
  
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

      <label htmlFor="shiftId">Choisir un shift :</label>
      <ShiftSelector onSelectShift={handleShiftSelect} />
      <hr />

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
      <br />
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

      <h3>Fourchette proposée pour l'échange</h3>
      <label>
        Début :
        <input
          type="datetime-local"
          name="availableSlot.startTime"
          value={formData.availableSlot.startTime}
          onChange={handleChange}
        />
      </label>
      <br />
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
      <br />

      <label>
        Type de demande :
        <select
          name="requestType"
          value={formData.requestType}
          onChange={handleChange}
        >
          <option value="Replacement">Remplacement</option>
          <option value="Swap">Échange</option>
        </select>
      </label>
      <hr />

      <h3>Choisir un destinataire :</h3>
      <AgentSelector onSelectAgent={handleAgentSelect} />
      <br />

      <button type="submit">Envoyer la demande</button>
    </form>
  );
};

export default NewRequestForm;
