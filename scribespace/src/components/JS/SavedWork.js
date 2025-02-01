import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/SavedWork.css';

const SavedWork = ({ showAlert }) => {
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
          <div className="actions">
            <button onClick={() => handleEdit(note)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(note._id, 'note')} className="delete-btn">Delete</button>
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
                <img src={drawing.drawingData} alt={drawing.title} />
                <div className="card-footer">
                  <span className="date">{formatDate(drawing.date)}</span>
                  <button onClick={() => handleDelete(drawing._id, 'drawing')} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No drawings yet</h3>
              <p>Create your first drawing to get started!</p>
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