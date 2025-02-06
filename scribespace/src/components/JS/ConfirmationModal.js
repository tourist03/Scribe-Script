import React from 'react';
import '../CSS/ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button 
            className="modal-btn cancel-btn" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="modal-btn confirm-btn" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 