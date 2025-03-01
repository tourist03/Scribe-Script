import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Trash2, Sparkles, Info, PenLine } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/Drawings.css';
import { EMPTY_DRAWING_SVG } from '../../constants/illustrations';
import config from '../../config/config';

const Drawings = ({ showAlert }) => {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [drawingToDelete, setDrawingToDelete] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  // Fetch drawings
  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/drawings/fetch`, {
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDrawings(data);
      }
    } catch (error) {
      console.error('Error fetching drawings:', error);
      showAlert('Error fetching drawings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDrawingToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/drawings/delete/${drawingToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state to remove the deleted drawing
        setDrawings(prevDrawings => 
          prevDrawings.filter(drawing => drawing._id !== drawingToDelete)
        );
        showAlert('Drawing deleted successfully!', 'success');
      } else {
        console.error('Server response:', data);
        showAlert(data.message || 'Failed to delete drawing', 'error');
      }
    } catch (error) {
      console.error('Error deleting drawing:', error);
      showAlert('Error deleting item', 'error');
    } finally {
      setModalOpen(false);
      setDrawingToDelete(null);
    }
  };

  const handleDownload = (drawingData, index) => {
    const link = document.createElement('a');
    link.download = `drawing_${index + 1}.png`;
    link.href = drawingData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditTitle = async (drawingId, updatedTitle) => {
    if (!updatedTitle.trim()) {
      showAlert("Title cannot be empty", "error");
      setEditingTitle(null);
      return;
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/drawings/update/${drawingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ title: updatedTitle })
      });

      if (response.ok) {
        setDrawings(drawings.map(drawing => 
          drawing._id === drawingId 
            ? { ...drawing, title: updatedTitle }
            : drawing
        ));
        setEditingTitle(null);
        showAlert("Title updated successfully", "success");
      } else {
        showAlert("Failed to update title", "error");
      }
    } catch (error) {
      console.error('Error updating drawing title:', error);
      showAlert("Error updating title", "error");
    }
  };

  const refreshDrawings = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/drawings/fetch`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDrawings(data);
      }
    } catch (error) {
      console.error('Error refreshing drawings:', error);
    }
  };

  const handleSave = async (drawingData, title) => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/drawings/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ drawingData, title }),
      });

      if (response.ok) {
        showAlert("Drawing saved successfully!", "success");
        await refreshDrawings();  // Refresh after saving
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      showAlert("Error saving drawing", "error");
    }
  };

  if (loading) {
    return <div className="loading">Loading drawings...</div>;
  }

  return (
    <div className="drawings-container">
      <div className="drawings-header">
        <div className="header-left">
          <h1>My Drawings</h1>
          <div className="beta-badge">
            <Sparkles size={16} />
            BETA
          </div>
        </div>
        {drawings.length > 0 && (
          <button 
            className="create-drawing-btn"
            onClick={() => navigate('/tempDraw')}
          >
            + Create New Drawing
          </button>
        )}
      </div>

      <div className="features-banner">
        <div className="feature">
          <Info size={20} />
          <div className="feature-text">
            <h3>Beta Features Available!</h3>
            <p>Try our new drawing tools with enhanced features</p>
            <ul className="feature-list">
              <li>Free-form drawing</li>
              <li>Multiple colors and brush sizes</li>
              <li>Save and download your artwork</li>
            </ul>
          </div>
        </div>
        <div className="beta-features">
          <div className="coming-soon">More features coming soon!</div>
          <button 
            className="feedback-btn"
            onClick={() => window.open('your-feedback-form-url', '_blank')}
          >
            Give Feedback
          </button>
        </div>
      </div>

      {drawings.length > 0 ? (
        <div className="drawings-grid">
          {drawings.map((drawing, index) => (
            <div key={drawing._id} className="drawing-card">
              <div className="drawing-title-container">
                {editingTitle === drawing._id ? (
                  <div className="edit-title-form">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => {
                        if (newTitle.trim()) {
                          handleEditTitle(drawing._id, newTitle);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTitle.trim()) {
                          handleEditTitle(drawing._id, newTitle);
                        } else if (e.key === 'Escape') {
                          setEditingTitle(null);
                        }
                      }}
                      autoFocus
                      placeholder="Enter title"
                    />
                  </div>
                ) : (
                  <div className="drawing-title">
                    <h3>{drawing.title || 'Untitled Drawing'}</h3>
                    <button 
                      className="edit-title-btn"
                      onClick={() => {
                        setEditingTitle(drawing._id);
                        setNewTitle(drawing.title || '');
                      }}
                    >
                      <PenLine size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="drawing-preview">
                <img src={drawing.drawingData} alt={`Drawing ${index + 1}`} />
              </div>
              <div className="drawing-actions">
                <button
                  onClick={() => handleDownload(drawing.drawingData, index)}
                  className="action-btn download-btn"
                  title="Download"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => handleDelete(drawing._id)}
                  className="action-btn delete-btn"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-content">
            <div 
              className="empty-state-image"
              dangerouslySetInnerHTML={{ __html: EMPTY_DRAWING_SVG }}
            />
            <h2>Start Creating!</h2>
            <p>Express your creativity with your first drawing</p>
            <button 
              className="create-drawing-btn"
              onClick={() => navigate('/tempDraw')}
            >
              + Create New Drawing
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setDrawingToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Drawing"
        message="Are you sure you want to delete this drawing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Drawings; 