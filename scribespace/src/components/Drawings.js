import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Download } from 'lucide-react';
import './CSS/Drawings.css';

const Drawings = ({ showAlert }) => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/drawings/fetch', {
        method: 'GET',
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrawings(data);
      } else {
        showAlert('Failed to fetch drawings', 'error');
      }
    } catch (error) {
      console.error('Error fetching drawings:', error);
      showAlert('Error loading drawings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this drawing?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/drawings/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          setDrawings(drawings.filter(drawing => drawing._id !== id));
          showAlert('Drawing deleted successfully', 'success');
        }
      } catch (error) {
        console.error('Error deleting drawing:', error);
        showAlert('Failed to delete drawing', 'error');
      }
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
      <h2>My Drawings</h2>
      
      {drawings.length === 0 ? (
        <div className="no-drawings">
          <p>No drawings yet. Start creating!</p>
          <button onClick={() => navigate('/tempDraw')} className="create-drawing-btn">
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
              <div className="drawing-date">
                {new Date(drawing.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drawings; 