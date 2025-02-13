import React, { useState } from "react";

const NewRequestForm = () => {
  const [formData, setFormData] = useState({
    requesterId: "",
    timeSlot: { startTime: "", endTime: "" }, // Plage pour la demande de remplacement
    requestType: "Replacement", // Valeur par défaut
    availableSlot: { startTime: "", endTime: "" }, // Fourchette proposée
    targetAgentId: "", // Identifiant de l'agent cible
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { timeSlot, availableSlot } = formData;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Supprime l'heure pour comparer uniquement les jours
  
    // Validation 1 : Vérifier que toutes les dates sont remplies
    if (!timeSlot.startTime || !timeSlot.endTime || !availableSlot.startTime || !availableSlot.endTime) {
      alert("Veuillez remplir toutes les dates avant d'envoyer la demande.");
      return;
    }
  
    // Validation 2 : Vérifier que les dates de chaque plage sont logiques
    if (new Date(timeSlot.startTime) >= new Date(timeSlot.endTime)) {
      alert("La date de début de la plage demandée doit être avant la date de fin.");
      return;
    }
    if (new Date(availableSlot.startTime) >= new Date(availableSlot.endTime)) {
      alert("La date de début de la fourchette doit être avant la date de fin.");
      return;
    }
  
    // Validation 3 : Vérifier que les dates sont dans le futur
    if (
      new Date(timeSlot.startTime) < today ||
      new Date(timeSlot.endTime) < today ||
      new Date(availableSlot.startTime) < today ||
      new Date(availableSlot.endTime) < today
    ) {
      alert("Les dates doivent être dans le futur.");
      return;
    }
  
    // Validation 4 : Vérifier que la plage demandée est incluse dans la fourchette disponible
    if (
      new Date(timeSlot.startTime) < new Date(availableSlot.startTime) ||
      new Date(timeSlot.endTime) > new Date(availableSlot.endTime)
    ) {
      alert("La plage demandée doit être incluse dans la fourchette proposée.");
      return;
    }
  
    // Si tout est valide, afficher les données
    console.log("Formulaire valide :", formData);
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

      {/* Champ requesterId */}
      <label>
        Identifiant du demandeur :
        <input
          type="text"
          name="requesterId"
          value={formData.requesterId}
          onChange={handleChange}
          placeholder="Entrez l'identifiant"
        />
      </label>
      <hr />

      {/* Plage demandée */}
      <h3>Plage à remplacer</h3>
      <label>
        Début de la plage :
        <input
          type="datetime-local"
          name="timeSlot.startTime"
          value={formData.timeSlot.startTime}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Fin de la plage :
        <input
          type="datetime-local"
          name="timeSlot.endTime"
          value={formData.timeSlot.endTime}
          onChange={handleChange}
        />
      </label>
      <hr />

      {/* Fourchette proposée */}
      <h3>Fourchette proposée pour l'échange</h3>
      <label>
        Début de la fourchette :
        <input
          type="datetime-local"
          name="availableSlot.startTime"
          value={formData.availableSlot.startTime}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Fin de la fourchette :
        <input
          type="datetime-local"
          name="availableSlot.endTime"
          value={formData.availableSlot.endTime}
          onChange={handleChange}
        />
      </label>
      <hr />
      <br />

      {/* Type de demande */}
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

      {/* Champ targetAgentId */}
      <label>
        Identifiant de l'agent cible (optionnel) :
        <input
          type="text"
          name="targetAgentId"
          value={formData.targetAgentId}
          onChange={(e) => setFormData({ ...formData, targetAgentId: e.target.value })}
          placeholder="Entrez l'identifiant de l'agent cible"
        />
      </label>
      <br />
      <br />

      {/* Bouton de soumission */}
      <button type="submit">Envoyer la demande</button>
    </form>
  );
};

export default NewRequestForm;
