import React, { useState, useEffect } from "react";
import axios from 'axios';
import AgentSelector from "./AgentSelector";
import ShiftSelector from "./ShiftSelector";
import { useAgent } from "../context/AgentContext";

const NewRequestForm = () => {
  const { agent } = useAgent();

  const [formData, setFormData] = useState({
    timeSlot: { startTime: "", endTime: "" },
    requestType: "Replacement",
    availableSlots: [], // 🔄 Initialisation avec un tableau vide
  });

  const [errors, setErrors] = useState({}); // 🔹 Gestion des erreurs

  useEffect(() => {
    if (agent && agent._id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requesterId: agent._id,
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
    } else if (name.includes("availableSlots")) {
      const key = name.split(".")[1];

      // 🔄 Ajout d'un slot si aucun n'existe
      setFormData((prevFormData) => {
        const updatedSlots = [...prevFormData.availableSlots];

        if (updatedSlots.length === 0) {
          updatedSlots.push({ startTime: "", endTime: "" });
        }

        updatedSlots[0] = { ...updatedSlots[0], [key]: value };

        return { ...prevFormData, availableSlots: updatedSlots };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" }); // Supprime l'erreur une fois corrigé
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newErrors = {};

    if (!formData.timeSlot.startTime || !formData.timeSlot.endTime) {
      newErrors.timeSlot = "Veuillez remplir toutes les dates de la plage à remplacer.";
    }

    if (!formData.availableSlots.length || !formData.availableSlots?.[0]?.startTime || !formData.availableSlots?.[0]?.endTime) {
      newErrors.availableSlots = "Veuillez remplir la fourchette de disponibilité.";
    }    

    if (new Date(formData.timeSlot.startTime) >= new Date(formData.timeSlot.endTime)) {
      newErrors.timeSlot = "La date de début doit être avant la date de fin.";
    }

    if (new Date(formData.availableSlots[0].startTime) >= new Date(formData.availableSlots[0].endTime)) {
      newErrors.availableSlots = "La date de début de la fourchette doit être avant la date de fin.";
    }

    if (
      new Date(formData.timeSlot.startTime) < today ||
      new Date(formData.timeSlot.endTime) < today ||
      new Date(formData.availableSlots[0].startTime) < today ||
      new Date(formData.availableSlots[0].endTime) < today
    ) {
      newErrors.date = "Toutes les dates doivent être dans le futur.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const requestData = {
        ...formData,
        availableSlots: formData.availableSlots.length > 0 ? formData.availableSlots : [{ startTime: "", endTime: "" }],
      };

      const response = await axios.post("http://localhost:3000/api/requests", requestData, {
        withCredentials: true,
      });

      alert("Demande envoyée avec succès !");
      setFormData({
        requesterId: "",
        shiftId: "",
        timeSlot: { startTime: "", endTime: "" },
        requestType: "Replacement",
        availableSlots: [],
        targetAgentId: undefined,
      });

      setErrors({});
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
      setErrors({ submit: "Erreur lors de l'envoi. Veuillez réessayer." });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

      <h3>Shift</h3>
      <label htmlFor="shiftId">Choisir un shift :</label>
      <ShiftSelector onSelectShift={(id) => setFormData({ ...formData, shiftId: id })} />
      <hr />

      <h3>Type de demande</h3>
      <label>Choisir une demande :</label>
      <select name="requestType" value={formData.requestType} onChange={handleChange}>
        <option value="Replacement">Remplacement</option>
        <option value="Swap">Échange</option>
      </select>
      <hr />

      <h3>Absence</h3>
      <label>Début :</label>
      <input
        type="datetime-local"
        name="timeSlot.startTime"
        value={formData.timeSlot.startTime}
        onChange={handleChange}
        required
      />
      {errors.timeSlot && <p className="error">{errors.timeSlot}</p>}
      <br />
      <label>Fin :</label>
      <input
        type="datetime-local"
        name="timeSlot.endTime"
        value={formData.timeSlot.endTime}
        onChange={handleChange}
        required
      />
      <hr />

      <h3>Disponibilité</h3>
      <label>Début :</label>
      <input
        type="datetime-local"
        name="availableSlots.startTime"
        value={formData.availableSlots.length > 0 ? formData.availableSlots[0].startTime : ""}
        onChange={handleChange}
      />
      {errors.availableSlots && <p className="error">{errors.availableSlots}</p>}
      <br />
      <label>Fin :</label>
      <input
        type="datetime-local"
        name="availableSlots.endTime"
        value={formData.availableSlots.length > 0 ? formData.availableSlots[0].endTime : ""}
        onChange={handleChange}
      />
      <hr />

      <h3>Destinataire</h3>
      <label htmlFor="agentId">Choisir un destinataire :</label>
      <AgentSelector onSelectAgent={(id) => setFormData({ ...formData, targetAgentId: id })} />
      <br />
      <br />

      {errors.submit && <p className="error">{errors.submit}</p>}
      <button type="submit">Envoyer la demande</button>
    </form>
  );
};

export default NewRequestForm;
