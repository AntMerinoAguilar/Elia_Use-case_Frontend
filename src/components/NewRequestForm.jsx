import React, { useState, useEffect } from "react";
import axios from "axios";

const NewRequestForm = () => {
  const [shifts, setShifts] = useState([]); // Liste des shifts disponibles
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    requesterId: "",
    shiftId: "",
    timeSlot: { startTime: "", endTime: "" },
    requestType: "Replacement",
    availableSlot: { startTime: "", endTime: "" },
    targetAgentId: "",
  });

  //Récupérer et trier les shifts chronologiquement
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/shifts", { withCredentials: true })
      .then((response) => {
        const sortedShifts = response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setShifts(sortedShifts);
      })
      .catch((error) => console.error("Erreur lors du chargement des shifts :", error));
  }, []);

  // Met à jour les champs en fonction de l'input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "shiftId") {
      //Quand un shift est sélectionné, on pré-remplit la plage à remplacer
      const selectedShift = shifts.find((shift) => shift._id === value);
      if (selectedShift) {
        const startDate = new Date(selectedShift.startDate);
        const endDate = new Date(selectedShift.endDate);
        
        //On propose les 2 premières heures du shift comme plage par défaut
        const defaultStart = startDate.toISOString().slice(0, 16);
        const defaultEnd = new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);

        setFormData({
          ...formData,
          shiftId: value,
          timeSlot: { startTime: defaultStart, endTime: defaultEnd },
        });
      }
    } else if (name.includes("timeSlot")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, timeSlot: { ...formData.timeSlot, [key]: value } });
    } else if (name.includes("availableSlot")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, availableSlot: { ...formData.availableSlot, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!formData.shiftId) {
      alert("Veuillez sélectionner un shift avant d'envoyer la demande.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/requests", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Demande envoyée avec succès !");
      console.log("Réponse du serveur :", response.data);

      setFormData({
        requesterId: "",
        shiftId: "",
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
        <input type="text" name="requesterId" value={formData.requesterId} onChange={handleChange} required />
      </label>
      <hr />

      {/* Sélection du shift */}
      <label>
        Sélectionnez un shift :
        <select name="shiftId" value={formData.shiftId} onChange={handleChange} required>
          <option value="">-- Sélectionnez un shift --</option>
          {shifts.map((shift) => (
            <option key={shift._id} value={shift._id}>
              {`${shift.agentCode} | ${new Date(shift.startDate).toLocaleString()} - ${new Date(shift.endDate).toLocaleString()}`}
            </option>
          ))}
        </select>
      </label>
      <hr />

      {/* Plage demandée */}
      <h3>Plage à remplacer</h3>
      <label>
        Début :
        <input type="datetime-local" name="timeSlot.startTime" value={formData.timeSlot.startTime} onChange={handleChange} required />
      </label>
      <label>
        Fin :
        <input type="datetime-local" name="timeSlot.endTime" value={formData.timeSlot.endTime} onChange={handleChange} required />
      </label>
      <hr />

      {/* Fourchette proposée */}
      <h3>Fourchette proposée pour l'échange</h3>
      <label>
        Début :
        <input type="datetime-local" name="availableSlot.startTime" value={formData.availableSlot.startTime} onChange={handleChange} />
      </label>
      <label>
        Fin :
        <input type="datetime-local" name="availableSlot.endTime" value={formData.availableSlot.endTime} onChange={handleChange} />
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
        <input type="text" name="targetAgentId" value={formData.targetAgentId} onChange={handleChange} placeholder="Agent cible (optionnel)" />
      </label>
      <br />

      {/* Bouton de soumission */}
      <button type="submit" disabled={loading}>{loading ? "Envoi en cours..." : "Envoyer la demande"}</button>
    </form>
  );
};

export default NewRequestForm;


