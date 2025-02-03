import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenLine } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/TemporaryNote.css';

const TemporaryNote = ({ showAlert }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const handleInputChange = (e, field) => {
    if (field === 'title') {
      setTitle(e.target.value);
    } else {
      setDescription(e.target.value);
    }
    setHasChanges(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Leave Page',
        message: 'You have unsaved changes. Are you sure you want to leave? Your note will be lost.',
        onConfirm: () => {
          navigate('/');
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleSwitch = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Switch to Drawing',
        message: 'You have unsaved changes. Are you sure you want to switch? Your note will be lost.',
        onConfirm: () => {
          navigate(isLoggedIn ? '/drawings' : '/tempDraw');
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
    } else {
      navigate(isLoggedIn ? '/drawings' : '/tempDraw');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... existing submit logic ...
    setHasChanges(false);
  };

  return (
    <div className="temp-note-container">
      <div className="temp-note-header">
        <button className="header-btn back-btn" onClick={handleClose}>
          <ArrowLeft size={18} />
          Back
        </button>
        <button 
          className="header-btn switch-btn" 
          onClick={handleSwitch}
        >
          <PenLine size={18} />
          Switch to Drawing
        </button>
      </div>

      <div className="temp-note-content">
        <h1 className="temp-note-title">Create Quick Note</h1>
        <p className="temp-note-subtitle">Express your thoughts - no account needed</p>
        
        <form onSubmit={handleSubmit} className="note-form">
          <div className="input-wrapper">
            <input
              type="text"
              className="title-input"
              placeholder="Title"
              value={title}
              onChange={(e) => handleInputChange(e, 'title')}
              required
            />
          </div>
          <div className="input-wrapper">
            <textarea
              className="description-input"
              placeholder="Start writing..."
              value={description}
              onChange={(e) => handleInputChange(e, 'description')}
              required
              rows={10}
            />
          </div>
          {/* ... rest of the form ... */}
        </form>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default TemporaryNote;