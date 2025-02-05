import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, PenLine } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/TemporaryNote.css';

const TemporaryNote = ({ showAlert }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    showAuthButtons: false
  });
  const isLoggedIn = !!localStorage.getItem('token');

  // Track changes
  useEffect(() => {
    if (title || description) {
      setHasChanges(true);
    }
  }, [title, description]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Store note data temporarily
      localStorage.setItem('pendingTempNote', JSON.stringify({ title, description }));
      
      setModalConfig({
        title: 'Login Required',
        message: 'Please login or create an account to save your note.',
        showAuthButtons: true,
        onConfirm: () => {
          navigate('/login');
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
      return;
    }

    // Handle save logic for logged-in users
    try {
      // Your existing save logic
      setHasChanges(false);
      showAlert("Note saved successfully!", "success");
      navigate('/notes');
    } catch (error) {
      showAlert("Error saving note", "error");
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes? This cannot be undone.',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate('/');
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleSwitchToDrawing = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Switch to Drawing',
        message: 'You have unsaved changes. Are you sure you want to switch to drawing mode?',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate('/tempDraw');
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/tempDraw');
    }
  };

  return (
    <div className="temp-note-container">
      <div className="temp-note-content">
        <div className="temp-note-header">
          <button 
            className="back-button"
            onClick={handleDiscard}
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Create New Note</h1>
          <button 
            className="switch-button"
            onClick={handleSwitchToDrawing}
            title="Switch to Drawing"
          >
            <PenLine size={20} />
          </button>
        </div>

        <form className="temp-note-form" onSubmit={handleSave}>
          <input
            type="text"
            className="temp-note-input"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <textarea
            className="temp-note-input temp-note-textarea"
            placeholder="Write your note here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="action-buttons">
            <button 
              type="submit" 
              className="action-btn save-btn"
            >
              <Save size={20} />
              Save Note
            </button>
            
            <button 
              type="button" 
              className="action-btn discard-btn"
              onClick={handleDiscard}
            >
              <X size={20} />
              Discard
            </button>
          </div>
        </form>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          showAuthButtons={modalConfig.showAuthButtons}
        />
      </div>
    </div>
  );
};

export default TemporaryNote;