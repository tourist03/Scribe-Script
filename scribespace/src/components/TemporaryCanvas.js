import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import './CSS/TemporaryCanvas.css';

const TemporaryCanvas = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) * scaleX,
        offsetY: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY
    };
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();

    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:5001/api/drawings/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ drawingData })
        });

        if (response.ok) {
          navigate('/drawings'); // Navigate to drawings list page
        } else {
          alert('Failed to save drawing');
        }
      } catch (error) {
        console.error('Error saving drawing:', error);
        alert('Error saving drawing');
      }
    } else {
      // For non-logged-in users, maintain existing behavior
      localStorage.setItem('pendingTempDrawing', drawingData);
      navigate("/login");
    }
  };

  const handleClose = () => {
    if (isLoggedIn) {
      navigate("/choose"); // Return to choice page for logged-in users
    } else {
      navigate("/about"); // Return to about page for non-logged-in users
    }
  };

  return (
    <div className="temporary-canvas-container">
      <h2>{isLoggedIn ? 'Create Drawing' : 'Create Temporary Drawing'}</h2>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="canvas-footer">
        <button onClick={handleSave} className="save-button">
          <Save size={18} /> {isLoggedIn ? 'Save Drawing' : 'Save Temporary Drawing'}
        </button>
        <button onClick={handleClose} className="close-button">
          <X size={18} /> Close
        </button>
      </div>
    </div>
  );
};

export default TemporaryCanvas; 