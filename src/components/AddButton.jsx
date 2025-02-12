import React from "react";
import { useNavigate } from "react-router-dom";

const AddButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/newRequest"); // Redirige vers la page des indisponibilités
  };

  return (
    <button onClick={handleClick}>
      +
    </button>
  );
};

export default AddButton;
