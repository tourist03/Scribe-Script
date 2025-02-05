import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../CSS/ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  showAuthButtons 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        {showAuthButtons ? (
          <div className="modal-auth-buttons">
            <Link to="/login" className="modal-btn login">
              Login
            </Link>
            <Link to="/signup" className="modal-btn signup">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="modal-buttons">
            <button className="modal-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-btn confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal; 