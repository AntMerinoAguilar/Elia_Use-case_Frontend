import React, { useState, useEffect } from "react";
import AgentSelector from "./AgentSelector";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure pour ne comparer que les jours

    const { timeSlot, availableSlot } = formData;
    if (!timeSlot.startTime || !timeSlot.endTime || !availableSlot.startTime || !availableSlot.endTime) {
      alert("Veuillez remplir toutes les dates avant d'envoyer la demande.");
      setLoading(false);
      return;
    }

    if (new Date(timeSlot.startTime) >= new Date(timeSlot.endTime)) {
      alert("La date de début doit être avant la date de fin.");
      setLoading(false);
      return;
    }

    if (
      new Date(timeSlot.startTime) < today ||
      new Date(timeSlot.endTime) < today ||
      new Date(availableSlot.startTime) < today ||
      new Date(availableSlot.endTime) < today
    ) {
      alert("Les dates doivent être dans le futur.");
      setLoading(false);
      return;
    }

    if (
      new Date(timeSlot.startTime) < new Date(availableSlot.startTime) ||
      new Date(timeSlot.endTime) > new Date(availableSlot.endTime)
    ) {
      alert("La plage demandée doit être incluse dans la fourchette proposée.");
      return;
    }

    console.log("Formulaire valide :", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

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

      <label>
        Type de demande :
        <select name="requestType" value={formData.requestType} onChange={handleChange}>
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
