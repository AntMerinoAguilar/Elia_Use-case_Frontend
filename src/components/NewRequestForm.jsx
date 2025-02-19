import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentSelector from "./AgentSelector";
import ShiftSelector from "./ShiftSelector";
import { useAgent } from "../context/AgentContext";
import '../styles/NewRequestForm.css'

const NewRequestForm = () => {
  const { agent } = useAgent();

  const [formData, setFormData] = useState({
    requesterId: agent?._id || "",
    shiftId: "",
    timeSlot: { startTime: "", endTime: "" },
    requestType: "Replacement",
    availableSlots: [],
    isUrgent: false,
  });

  const [dateLimits, setDateLimits] = useState({ min: "", max: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent?._id) {
      setFormData((prev) => ({ ...prev, requesterId: agent._id }));
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "requestType") {
        const isReplacement = value === "Replacement";
        return {
          ...prev,
          requestType: isReplacement && prev.isUrgent ? "Urgent Replacement" : value,
          isUrgent: isReplacement ? prev.isUrgent : false,
          availableSlots: isReplacement ? [] : prev.availableSlots,
        };
      }

      if (name === "isUrgent") {
        return {
          ...prev,
          isUrgent: checked,
          requestType: checked ? "Urgent Replacement" : "Replacement",
        };
      }

      if (name.startsWith("timeSlot")) {
        return {
          ...prev,
          timeSlot: { ...prev.timeSlot, [name.split(".")[1]]: value },
        };
      }

      if (name.startsWith("availableSlots")) {
        const key = name.split(".")[1];
        return {
          ...prev,
          availableSlots: prev.availableSlots.length
            ? [{ ...prev.availableSlots[0], [key]: value }]
            : [{ startTime: "", endTime: "" }],
        };
      }

      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.timeSlot.startTime || !formData.timeSlot.endTime) {
      newErrors.timeSlot = "Veuillez remplir toutes les dates de la plage à remplacer.";
    }

    if (formData.requestType === "Swap") {
      if (!formData.availableSlots.length || !formData.availableSlots[0]?.startTime || !formData.availableSlots[0]?.endTime) {
        newErrors.availableSlots = "Veuillez remplir la fourchette de disponibilité.";
      } else if (new Date(formData.availableSlots[0].startTime) >= new Date(formData.availableSlots[0].endTime)) {
        newErrors.availableSlots = "La date de début doit être avant la date de fin.";
      } else if (
        new Date(formData.availableSlots[0].startTime) < today ||
        new Date(formData.availableSlots[0].endTime) < today
      ) {
        newErrors.date = "Toutes les dates doivent être dans le futur.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { isUrgent, ...requestData } = formData;

      await axios.post("http://localhost:3000/api/requests", requestData, {
        withCredentials: true,
      });

      alert("Demande envoyée avec succès !");
      setFormData({
        requesterId: agent._id,
        shiftId: "",
        timeSlot: { startTime: "", endTime: "" },
        requestType: "Replacement",
        availableSlots: [],
        isUrgent: false,
      });

      setErrors({});
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
      setErrors({ submit: "Erreur lors de l'envoi. Veuillez réessayer." });
    }
  };


  return (
    <div className="form-container">
    <form onSubmit={handleSubmit}>
      <h2>Créer une demande</h2>

      <h3>Shift</h3>
      <label htmlFor="shiftId">Choisir un shift :</label>
      <ShiftSelector
        selectedShiftId={formData.shiftId}
        onSelectShift={(shift) => {
          const formatDateForInput = (isoString) => isoString ? new Date(isoString).toISOString().slice(0, 16) : "";

          setDateLimits({
            min: formatDateForInput(shift.startTime),
            max: formatDateForInput(shift.endTime),
          });

          setFormData((prev) => ({
            ...prev,
            shiftId: shift.id,
            availableSlots: prev.requestType === "Swap"
              ? [{ startTime: formatDateForInput(shift.endTime), endTime: "" }]
              : [],
          }));
        }}
      />
      <hr />

      <h3>Type de demande</h3>
      <label>Choisir une demande :</label>
      <select name="requestType" value={formData.requestType} onChange={handleChange}>
        <option value="Replacement">Remplacement</option>
        <option value="Swap">Échange</option>
      </select>

      {formData.requestType.includes("Replacement") && (
        <div>
          <input type="checkbox" id="isUrgent" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} />
          <label htmlFor="isUrgent">Urgent</label>
        </div>
      )}
      <hr />

      <h3>Absence</h3>
      <label>Début :</label>
      <input type="datetime-local" name="timeSlot.startTime" value={formData.timeSlot.startTime} onChange={handleChange} min={dateLimits.min} max={dateLimits.max} required />
      <br />
      <label>Fin :</label>
      <input type="datetime-local" name="timeSlot.endTime" value={formData.timeSlot.endTime} onChange={handleChange} min={dateLimits.min} max={dateLimits.max} required />
      <hr />

      {formData.requestType === "Swap" && (
        <>
          <h3>Disponibilités</h3>
          <label>Début :</label>
          <input type="datetime-local" name="availableSlots.startTime" value={formData.availableSlots[0]?.startTime || ""} onChange={handleChange} min={dateLimits.max} />
          <br />
          <label>Fin :</label>
          <input type="datetime-local" name="availableSlots.endTime" value={formData.availableSlots[0]?.endTime || ""} onChange={handleChange} min={dateLimits.max} />
          <hr />
        </>
      )}

      <h3>Destinataire</h3>
      <label htmlFor="agentId">Choisir un destinataire :</label>
      <AgentSelector onSelectAgent={(id) => setFormData((prev) => ({ ...prev, targetAgentId: id }))} />

      {errors.submit && <p className="error">{errors.submit}</p>}

      <button type="submit">Envoyer la demande</button>
    </form>
    </div>
  );
};

export default NewRequestForm;


