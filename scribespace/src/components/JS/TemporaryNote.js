import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/TemporaryNote.css';

const TemporaryNote = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Logic to save the note
    // After saving, you can navigate or show a success message
  };

  return (
    <div className="temp-note-container">
      <div className="temp-note-header">
        <button className="header-btn back-btn" onClick={() => navigate('/')}>
          Back
        </button>
      </div>

      <div className="temp-note-content">
        <h1 className="temp-note-title">Create Quick Note</h1>
        <p className="temp-note-subtitle">Capture your thoughts instantly - no account needed</p>

        <div className="note-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter title (minimum 4 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-wrapper">
            <textarea
              placeholder="Enter description (minimum 5 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-input"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn save-btn" onClick={handleSave}>
            Save Note
          </button>
          <button className="action-btn close-btn" onClick={() => navigate('/')}>
            Close
          </button>
        </div>

        {isEditing && (
          <div className="edit-note-container">
            <h3>Edit Note</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-input title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="edit-input description"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemporaryNote;