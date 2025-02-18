import React, { useState, useEffect } from "react";
import axios from 'axios';
import AgentSelector from "./AgentSelector";
import ShiftSelector from "./ShiftSelector";
import { useAgent } from "../context/AgentContext";



const NewRequestForm = () => {
  const { agent } = useAgent();

  const [formData, setFormData] = useState({
    timeSlot: { startTime: "", endTime: "" }, // Stocke les dates d'ABSENCE pour les remplacements (Replacement)
    requestType: "Replacement",
    availableSlots: [], // Stocke les dates de DISPONIBILITÉ pour les échanges (Swap)
    isUrgent: false,
  });

  const [dateLimits, setDateLimits] = useState({ min: "", max: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent && agent._id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requesterId: agent._id,
      }));
    }
  }, [agent]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Gestion du type de demande
    if (name === "requestType") {
      const isReplacement = value === "Replacement";

      setFormData((prev) => ({
        ...prev,
        requestType: isReplacement && prev.isUrgent ? "Urgent Replacement" : value,
        isUrgent: isReplacement ? prev.isUrgent : false,
        availableSlots: isReplacement ? [] : prev.availableSlots,
      }));

    // Gestion de la case "Urgent"
    } else if (name === "isUrgent") {
      setFormData((prev) => ({
        ...prev,
        isUrgent: checked,
        requestType: checked ? "Urgent Replacement" : "Replacement",
      }));

    // Gestion des dates d'ABSENCE (timeSlot)
    } else if (name.includes("timeSlot")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        timeSlot: { ...formData.timeSlot, [key]: value },
      });

    // Gestion des dates de DISPONIBILITÉ (availableSlots)
    } else if (name.includes("availableSlots")) {
      const key = name.split(".")[1];

      setFormData((prevFormData) => {
        const updatedSlots = prevFormData.availableSlots.length > 0
          ? [...prevFormData.availableSlots]
          : [{ startTime: "", endTime: "" }];

        updatedSlots[0] = { ...updatedSlots[0], [key]: value };

        return { ...prevFormData, availableSlots: updatedSlots };
      });

    // Gestion des autres champs
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newErrors = {};

    if (!formData.timeSlot.startTime || !formData.timeSlot.endTime) {
      newErrors.timeSlot = "Veuillez remplir toutes les dates de la plage à remplacer.";
    }

    if (formData.requestType === "Swap") {
      if (!formData.availableSlots.length || !formData.availableSlots?.[0]?.startTime || !formData.availableSlots?.[0]?.endTime) {
        newErrors.availableSlots = "Veuillez remplir la fourchette de disponibilité.";
      }

      if (new Date(formData.availableSlots[0].startTime) >= new Date(formData.availableSlots[0].endTime)) {
        newErrors.availableSlots = "La date de début de la fourchette doit être avant la date de fin.";
      }

      if (
        new Date(formData.availableSlots[0].startTime) < today ||
        new Date(formData.availableSlots[0].endTime) < today
      ) {
        newErrors.date = "Toutes les dates doivent être dans le futur.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { isUrgent, ...requestData } = formData;

      console.log("📤 Données envoyées à l'API :", requestData);

      const response = await axios.post("http://localhost:3000/api/requests", requestData, {
        withCredentials: true,
      });

      alert("Demande envoyée avec succès !");
      setFormData({
        requesterId: agent._id,
        shiftId: "",
        timeSlot: { startTime: "", endTime: "" },
        requestType: "Replacement",
        availableSlots: [],
        targetAgentId: undefined,
        isUrgent: false, // Réinitialisation de la case Urgent
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
      <ShiftSelector
        selectedShiftId={formData.shiftId}
        onSelectShift={(shift) => {
          const formatDateForInput = (isoString) => {
            if (!isoString) return "";
            const date = new Date(isoString);
            return date.toISOString().slice(0, 16); // Format requis: yyyy-MM-ddTHH:mm
          };

          setDateLimits({
            min: formatDateForInput(shift.startTime),
            max: formatDateForInput(shift.endTime),
          });

          setFormData(prev => {
            return {
              ...prev,
              shiftId: shift.id,
              availableSlots: prev.requestType === "Swap" 
                ? [{ startTime: formatDateForInput(shift.endTime), endTime: "" }]
                : [], // Si ce n'est pas un échange, on vide le tableau
            };
          });
        }} 
      />
      <hr />

      <h3>Type de demande</h3>
      <label>Choisir une demande :</label>
      <select name="requestType" value={formData.requestType} onChange={handleChange}>
        <option value="Replacement">Remplacement</option>
        <option value="Swap">Échange</option>
      </select>

      {formData.requestType === "Replacement" || formData.requestType === "Urgent Replacement" ? (
        <div>
          <input
            type="checkbox"
            id="isUrgent"
            name="isUrgent"
            checked={formData.isUrgent}
            onChange={handleChange}
          />
          <label htmlFor="isUrgent">Urgent</label>
        </div>
      ) : null}
      <hr />

      <h3>Absence</h3>
      <label>Début :</label>
      <input 
        type="datetime-local" 
        name="timeSlot.startTime" 
        value={formData.timeSlot.startTime} 
        onChange={handleChange} 
        min={dateLimits.min} 
        max={dateLimits.max} 
        required 
      />
      <br />
      <label>Fin :</label>
      <input 
        type="datetime-local" 
        name="timeSlot.endTime" 
        value={formData.timeSlot.endTime} 
        onChange={handleChange} 
        min={dateLimits.min} 
        max={dateLimits.max} 
        required 
      /><hr />

      {formData.requestType === "Swap" && (
        <>
          <h3>Disponibilités</h3>
          <label>Début :</label>
          <input
            type="datetime-local"
            name="availableSlots.startTime"
            value={formData.availableSlots[0]?.startTime || ""}
            onChange={handleChange}
            min={dateLimits.max} // Empêche la sélection de dates avant la fin du shift
          />
          <br />
          <label>Fin :</label>
          <input
            type="datetime-local"
            name="availableSlots.endTime"
            value={formData.availableSlots[0]?.endTime || ""}
            onChange={handleChange}
            min={dateLimits.max} // Empêche la sélection de dates avant la fin du shift
          />
          <hr />
        </>
      )}


      <h3>Destinataire</h3>
      <label htmlFor="agentId">Choisir un destinataire :</label>
      <AgentSelector onSelectAgent={(id) => setFormData({ ...formData, targetAgentId: id })} />
      <br /><br />

      {errors.submit && <p className="error">{errors.submit}</p>}

      <button type="submit">Envoyer la demande</button>
    </form>
  );
};

export default NewRequestForm;
