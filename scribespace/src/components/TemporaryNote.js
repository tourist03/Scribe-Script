import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import './TemporaryNote.css';

const TemporaryNote = () => {
  const navigate = useNavigate();
  const [tempNote, setTempNote] = useState({ title: "", description: "" });
  const [charCount, setCharCount] = useState({ title: 0, description: 0 });
  const [validationError, setValidationError] = useState("");
  const titleInputRef = useRef(null);
  const descriptionTextareaRef = useRef(null);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setTempNote(prev => ({ ...prev, [field]: value }));
    setCharCount(prev => ({ ...prev, [field]: value.length }));
    if (validationError) setValidationError("");
  };

  const handleSaveTempNote = () => {
    if (!tempNote.title.trim() && !tempNote.description.trim()) {
      setValidationError("Please enter a title or description");
      return;
    }
    localStorage.setItem('pendingTempNote', JSON.stringify({ ...tempNote, createdAt: new Date().toISOString() }));
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="temporary-note-container">
      <div className="note-header">
        <h2>Create Temporary Note</h2>
        <button onClick={handleCancel} className="close-button">
          <X size={24} />
        </button>
      </div>
      {validationError && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{validationError}</span>
        </div>
      )}
      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input
          ref={titleInputRef}
          type="text"
          id="title"
          className="input-field"
          placeholder="Enter note title"
          value={tempNote.title}
          onChange={(e) => handleInputChange(e, 'title')}
          maxLength={50}
        />
        <div className="char-count">{charCount.title}/50 characters</div>
      </div>
      <div className="input-group">
        <label htmlFor="description">Description</label>
        <textarea
          ref={descriptionTextareaRef}
          id="description"
          className="textarea-field"
          placeholder="Write your note here..."
          value={tempNote.description}
          onChange={(e) => handleInputChange(e, 'description')}
          maxLength={500}
        />
        <div className="char-count">{charCount.description}/500 characters</div>
      </div>
      <div className="note-footer">
        <p className="login-required">
          <CheckCircle size={16} /> Login required to permanently save notes
        </p>
        <button onClick={handleSaveTempNote} className="save-button">
          <Save size={18} /> Save Temporary Note
        </button>
      </div>
    </div>
  );
};

export default TemporaryNote;