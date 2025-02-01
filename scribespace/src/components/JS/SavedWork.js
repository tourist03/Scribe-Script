import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/SavedWork.css';
import { Download, Edit, Trash2 } from 'lucide-react';

const SavedWork = ({ showAlert }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');
  const [editingNote, setEditingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchDrawings();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notes/fetchallnotes', {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchDrawings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/drawings/fetch', {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setDrawings(data);
      }
    } catch (error) {
      console.error('Error fetching drawings:', error);
    }
  };

  const handleDelete = (id, type) => {
    setItemToDelete(id);
    setItemType(type);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const endpoint = itemType === 'drawing' 
      ? `http://localhost:5001/api/drawings/delete/${itemToDelete}`
      : `http://localhost:5001/api/notes/deletenote/${itemToDelete}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        if (itemType === 'drawing') {
          setDrawings(drawings.filter(drawing => drawing._id !== itemToDelete));
        } else {
          setNotes(notes.filter(note => note._id !== itemToDelete));
        }
        showAlert(`${itemType} deleted successfully`, 'success');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('Error deleting item', 'error');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote({
      id: note._id,
      title: note.title,
      description: note.description,
      tag: note.tag
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/notes/updatenote/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          title: editingNote.title,
          description: editingNote.description,
          tag: editingNote.tag
        })
      });

      if (response.ok) {
        setNotes(notes.map(note => 
          note._id === editingNote.id 
            ? { ...note, ...editingNote } 
            : note
        ));
        setEditingNote(null);
        showAlert("Note updated successfully", "success");
      }
    } catch (error) {
      console.error('Error updating note:', error);
      showAlert("Error updating note", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (drawingData, title) => {
    const link = document.createElement('a');
    link.download = `${title || 'drawing'}.png`;
    link.href = drawingData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNoteDownload = (note) => {
    const noteContent = `${note.title}\n\n${note.description}\n\nCreated: ${formatDate(note.date)}`;
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${note.title || 'note'}.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderNoteCard = (note) => {
    const isEditing = editingNote?.id === note._id;

    if (isEditing) {
      return (
        <div key={note._id} className="card note-card editing">
          <input
            type="text"
            value={editingNote.title}
            onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
            className="edit-input title"
          />
          <textarea
            value={editingNote.description}
            onChange={(e) => setEditingNote({...editingNote, description: e.target.value})}
            className="edit-input description"
          />
          <div className="card-footer">
            <span className="date">{formatDate(note.date)}</span>
            <div className="actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setEditingNote(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={note._id} className="card note-card">
        <h3>{note.title}</h3>
        <p>{note.description}</p>
        <div className="card-footer">
          <span className="date">{formatDate(note.date)}</span>
          <div className="card-actions">
            <button 
              onClick={() => handleNoteDownload(note)}
              className="action-btn download-btn"
              title="Download Note"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => handleEdit(note)}
              className="action-btn edit-btn"
              title="Edit Note"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => handleDelete(note._id, 'note')}
              className="action-btn delete-btn"
              title="Delete Note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="saved-work-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`tab ${activeTab === 'drawings' ? 'active' : ''}`}
          onClick={() => setActiveTab('drawings')}
        >
          Drawings
        </button>
      </div>

      <div className="content-grid">
        {activeTab === 'notes' ? (
          notes.length > 0 ? (
            notes.map(note => renderNoteCard(note))
          ) : (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Create your first note to get started!</p>
            </div>
          )
        ) : (
          drawings.length > 0 ? (
            drawings.map((drawing) => (
              <div key={drawing._id} className="card drawing-card">
                <div className="drawing-preview">
                  <img src={drawing.drawingData} alt={drawing.title} />
                </div>
                <div className="card-content">
                  <h3 className="drawing-title">{drawing.title || 'Untitled Drawing'}</h3>
                  <div className="card-footer">
                    <span className="date">{formatDate(drawing.date)}</span>
                    <div className="card-actions">
                      <button 
                        onClick={() => handleDownload(drawing.drawingData, drawing.title)}
                        className="action-btn download-btn"
                        title="Download Drawing"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/draw/${drawing._id}`)} 
                        className="action-btn edit-btn"
                        title="Edit Drawing"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(drawing._id, 'drawing')}
                        className="action-btn delete-btn"
                        title="Delete Drawing"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <img 
                  src="/drawing-illustration.svg" 
                  alt="Create Drawing" 
                  className="empty-state-image" 
                />
                <h3>Start Creating!</h3>
                <p>Express your creativity with your first drawing</p>
                <button 
                  className="create-drawing-btn"
                  onClick={() => navigate('/draw')}
                >
                  + Create New Drawing
                </button>
              </div>
            </div>
          )
        )}
      </div>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
        title={itemType === 'drawing' ? 'Delete this Drawing' : 'Delete this Note'}
        message={`Are you sure you want to delete this ${itemType}?`}
      />
    </div>
  );
};

export default SavedWork; 