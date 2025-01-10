import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/Drawings.css';

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
        <h2 className="drawings-title">My Drawings</h2>
        <button 
          className="create-drawing-btn"
          onClick={() => navigate('/drawing')}
        >
          <Plus size={20} />
          Create New Drawing
        </button>
      </div>

      {drawings.length === 0 ? (
        <div className="no-drawings">
          <p>No drawings yet. Start creating!</p>
          <button onClick={() => navigate('/drawing')} className="create-drawing-btn">
            Create New Drawing
          </button>
        </div>
      ) : (
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