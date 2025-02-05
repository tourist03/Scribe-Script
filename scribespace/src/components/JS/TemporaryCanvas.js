import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, FileText } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const TemporaryCanvas = ({ showAlert }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const navigate = useNavigate();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    showAuthButtons: false
  });
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    
    canvas.width = container.clientWidth * 2;
    canvas.height = container.clientHeight * 2;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    contextRef.current = context;

    // Clear canvas with dark background
    context.fillStyle = 'rgba(17, 24, 39, 0.95)';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasChanges(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Touch events support
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasChanges(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleSave = async () => {
    if (!hasChanges) {
      showAlert("Make some changes before saving!", "warning");
      return;
    }

    if (!isLoggedIn) {
      // Store drawing data temporarily
      const drawingData = canvasRef.current.toDataURL();
      localStorage.setItem('pendingTempDrawing', drawingData);
      
      setModalConfig({
        title: 'Login Required',
        message: 'Please login or create an account to save your drawing.',
        showAuthButtons: true,
        onConfirm: () => {
          navigate('/login');
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
      return;
    }

    try {
      const drawingData = canvasRef.current.toDataURL();
      const response = await fetch("http://localhost:5001/api/drawings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          drawingData,
          title: `Drawing ${new Date().toLocaleDateString()}`,
        }),
      });

      if (response.ok) {
        setHasChanges(false);
        showAlert("Drawing saved successfully!", "success");
        navigate("/drawings");
      } else {
        showAlert("Failed to save drawing", "error");
      }
    } catch (error) {
      console.error("Error saving drawing:", error);
      showAlert("Error saving drawing", "error");
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your drawing? This cannot be undone.',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate('/');
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleSwitchToNote = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Switch to Note',
        message: 'You have unsaved changes. Are you sure you want to switch to note mode?',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate('/tempNote');
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/tempNote');
    }
  };

  return (
    <div className="temp-drawing-container">
      <div className="temp-drawing-content">
        <div className="temp-drawing-header">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={handleDiscard}
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1>Create Drawing</h1>
          </div>
          
          <button 
            className="switch-button"
            onClick={handleSwitchToNote}
          >
            <FileText size={20} />
            Switch to Note
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
          className="drawing-canvas"
        />

        <div className="action-buttons">
          <button 
            className="action-btn save-btn"
            onClick={handleSave}
          >
            <Save size={20} />
            Save Drawing
          </button>
          
          <button 
            className="action-btn discard-btn"
            onClick={handleDiscard}
          >
            <X size={20} />
            Discard
          </button>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          showAuthButtons={modalConfig.showAuthButtons}
        />
      </div>
    </div>
  );
};

export default TemporaryCanvas; 