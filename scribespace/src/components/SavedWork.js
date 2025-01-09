import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Download, FileText, PenLine, Plus } from 'lucide-react';
import './CSS/SavedWork.css';

const SavedWork = ({ showAlert }) => {
  const [drawings, setDrawings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'notes', 'drawings'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllWork();
  }, []);

  const fetchAllWork = async () => {
    setLoading(true);
    try {
      // Fetch both drawings and notes in parallel
      const [drawingsRes, notesRes] = await Promise.all([
        fetch('http://localhost:5001/api/drawings/fetch', {
          headers: { 'auth-token': localStorage.getItem('token') }
        }),
        fetch('http://localhost:5001/api/notes/fetchallnotes', {
          headers: { 'auth-token': localStorage.getItem('token') }
        })
      ]);

      if (drawingsRes.ok && notesRes.ok) {
        const drawingsData = await drawingsRes.json();
        const notesData = await notesRes.json();
        setDrawings(drawingsData);
        setNotes(notesData);
      }
    } catch (error) {
      console.error('Error fetching saved work:', error);
      showAlert('Error loading saved work', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (drawingData, index) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = drawingData;
      link.download = `drawing-${index + 1}.png`;
      
      // Programmatically click the link to trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading drawing:', error);
      showAlert('Error downloading drawing', 'error');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint = type === 'drawing' 
        ? 'http://localhost:5001/api/drawings/delete'
        : 'http://localhost:5001/api/notes/deletenote';

      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        // Update local state based on type
        if (type === 'drawing') {
          setDrawings(drawings.filter(drawing => drawing._id !== id));
        } else {
          setNotes(notes.filter(note => note._id !== id));
        }
        showAlert(`${type} deleted successfully`, 'success');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('Error deleting item', 'error');
    }
  };

  const handleEdit = (noteId) => {
    // Navigate to the edit page with the note ID
    navigate(`/notes?edit=${noteId}`);
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

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading your work...</div>;
    }

    const filteredContent = activeTab === 'all' 
      ? [...notes, ...drawings].sort((a, b) => new Date(b.date) - new Date(a.date))
      : activeTab === 'notes' ? notes : drawings;

    if (filteredContent.length === 0) {
      return (
        <div className="no-content">
          <p>No saved work found</p>
          <div className="create-buttons">
            <button onClick={() => navigate('/notes')} className="create-btn">
              <Plus size={20} /> Create Note
            </button>
            <button onClick={() => navigate('/tempDraw')} className="create-btn">
              <Plus size={20} /> Create Drawing
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="work-grid">
        {filteredContent.map((item, index) => (
          <div key={item._id} className="work-card">
            {item.drawingData ? (
              // Drawing card
              <>
                <div className="work-preview drawing-preview">
                  <img 
                    src={item.drawingData} 
                    alt={`Drawing ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
                <div className="work-actions">
                  <button 
                    onClick={() => handleDownload(item.drawingData, index)}
                    className="action-btn"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id, 'drawing')}
                    className="action-btn delete"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            ) : (
              // Note card
              <>
                <div className="work-preview note-preview">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="work-actions">
                  <button 
                    onClick={() => handleEdit(item._id)}
                    className="action-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id, 'note')}
                    className="action-btn delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            )}
            <div className="work-date">
              {formatDate(item.date)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="saved-work-container">
      <h2>Your Saved Work</h2>
      
      <div className="work-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Work
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'drawings' ? 'active' : ''}`}
          onClick={() => setActiveTab('drawings')}
        >
          Drawings
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default SavedWork; 