import React, { useEffect, useState } from "react";
import axios from "axios";

const ShiftSelector = ({ onSelectShift }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/shifts/me", {
          withCredentials: true,
        });
  
        // Trier les shifts par startDate (plus proche en premier)
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

  const handleChange = (e) => {
    const selectedValue = e.target.value === "" ? undefined : e.target.value;
    onSelectShift(selectedValue); // Transmet au parent
  };

  if (loading) {
    return <p>Chargement des shifts...</p>;
  }

  return (
    <select onChange={handleChange}>
      <option value="">Sélectionnez un shift</option>
      {shifts.map((shift) => (
        <option key={shift._id} value={shift._id}>
          {new Date(shift.startDate).toLocaleString()} - {new Date(shift.endDate).toLocaleString()}
        </option>
      ))}
    </select>
  );
};

export default ShiftSelector;
