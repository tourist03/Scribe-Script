import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Trash2, Sparkles, Info } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/Drawings.css';
import { EMPTY_DRAWING_SVG } from '../../constants/illustrations';

const Drawings = ({ showAlert }) => {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [drawingToDelete, setDrawingToDelete] = useState(null);

  // Fetch drawings
  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/drawings/fetch', {
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
      console.log('Attempting to delete drawing:', drawingToDelete);
      
      const response = await fetch(`http://localhost:5001/api/drawings/delete/${drawingToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
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
      showAlert('Error deleting drawing', 'error');
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
      />
    </div>
  );
};

export default Drawings; 