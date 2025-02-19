import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/ShiftSelector.css'

const ShiftSelector = ({ onSelectShift, selectedShiftId }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/shifts/me", {
          withCredentials: true,
        });

        // Trier les shifts par date de début
        const sortedShifts = response.data.sort((a, b) =>
          new Date(a.startDate) - new Date(b.startDate)
        );

        setShifts(sortedShifts);
      } catch (error) {
        console.error("Erreur lors de la récupération des shifts :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  // Fonction pour convertir une date UTC en format local lisible
  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
  
    const formattedDate = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  
  
    return `${formattedDate} `; // ${formattedTime}
  };

  const handleChange = (e) => {
    const selectedShift = shifts.find(shift => shift._id === e.target.value);

    console.log("📌 Shift sélectionné :", selectedShift); // Ajoute ce log pour voir si ça fonctionne

    if (selectedShift) {
      onSelectShift({
        id: selectedShift._id,
        startTime: selectedShift.startDate,
        endTime: selectedShift.endDate,
      });
    } else {
      onSelectShift(null);
    }
  };

  if (loading) {
    return <p>Chargement des shifts...</p>;
  }

  return (
    <select id="shiftId" onChange={handleChange} value={selectedShiftId || ""} className="shift-input">
      
      <option value="">Sélectionnez un shift</option>
      {shifts.map((shift) => (
        <option key={shift._id} value={shift._id}>
          {formatDateForDisplay(shift.startDate)} - {formatDateForDisplay(shift.endDate)}
        </option>
      ))}
    </select>
  );
};

export default ShiftSelector;


