import React from "react";
import "../../styles/confirmModal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-text">{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Oui
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
