import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import './TemporaryNote.css';

const TemporaryNote = () => {
  const navigate = useNavigate();
  const [tempNote, setTempNote] = useState({ title: "", description: "" });
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setTempNote(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTempNote = () => {
    if (!tempNote.title.trim() && !tempNote.description.trim()) {
      alert("Please enter a title or description");
      return;
    }
    localStorage.setItem('pendingTempNote', JSON.stringify({ 
      ...tempNote, 
      createdAt: new Date().toISOString() 
    }));
    navigate("/login");
  };

  const handleClose = () => {
    navigate("/about");
  };

  return (
    <div className="temporary-note-container">
      <h2 style={{ marginBottom: '25px', marginTop: '-150px' }}>Create Temporary Note</h2>
      <div className="input-group">
        <input
          ref={titleInputRef}
          type="text"
          placeholder="Title"
          value={tempNote.title}
          onChange={(e) => handleInputChange(e, 'title')}
          className="input-field"
        />
      </div>
      <div className="input-group">
        <textarea 
          placeholder="Description"
          value={tempNote.description}
          onChange={(e) => handleInputChange(e, 'description')}
          className="textarea-field"
        />
      </div>
      <div className="note-footer">
        <button onClick={handleSaveTempNote} className="save-button">
          <Save size={18} /> Save
        </button>
        <button onClick={handleClose} className="close-button">
          <X size={18} /> Close
        </button>
      </div>
    </div>
  );
};

export default TemporaryNote;