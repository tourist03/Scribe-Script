import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, PenLine, ArrowLeft } from 'lucide-react';
import '../CSS/TemporaryNote.css';

const TemporaryNote = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="temp-note-container">
      <div className="temp-note-header">
        <button className="header-btn back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <button className="header-btn switch-btn" onClick={() => navigate('/tempDraw')}>
          <PenLine size={20} />
          Switch to Drawing
        </button>
      </div>

      <div className="temp-note-content">
        <h1 className="temp-note-title">Create Quick Note</h1>
        <p className="temp-note-subtitle">Capture your thoughts instantly - no account needed</p>

        <div className="note-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-wrapper">
            <textarea
              placeholder="Start writing your note here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-input"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn save-btn" onClick={() => {}}>
            <Save size={20} />
            Save Note
          </button>
          <button className="action-btn close-btn" onClick={() => navigate('/')}>
            <X size={20} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporaryNote;