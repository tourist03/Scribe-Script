import React from 'react';
import '../CSS/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 