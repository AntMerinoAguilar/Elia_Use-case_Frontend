import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddButton.css";

const AddButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/newRequest");
  };

  return (
    <div className="addbtn">
      <button onClick={handleClick}>+</button>
    </div>
  );
};

export default AddButton;
