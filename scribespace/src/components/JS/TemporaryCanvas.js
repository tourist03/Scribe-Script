import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, FileText, Palette, Trash2, Download } from 'lucide-react';
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
  const [strokeSize, setStrokeSize] = useState(2);
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [showToolbar, setShowToolbar] = useState(false);
  const [theme, setTheme] = useState('dark');

  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' }
  ];

  const strokeSizes = [
    { name: 'Fine', value: 1 },
    { name: 'Medium', value: 2 },
    { name: 'Thick', value: 4 },
    { name: 'Extra Thick', value: 6 }
  ];

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

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = strokeColor;
      contextRef.current.lineWidth = strokeSize;
    }
  }, [strokeColor, strokeSize]);

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

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
      const drawingData = canvasRef.current.toDataURL('image/jpeg', 0.5);
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
      const drawingData = canvasRef.current.toDataURL('image/jpeg', 0.5);
      
      const maxChunkSize = 5 * 1024 * 1024; // 5MB chunks
      if (drawingData.length > maxChunkSize) {
        showAlert("Drawing is too large. Try making it smaller or using fewer colors.", "warning");
        return;
      }

      const response = await fetch('http://localhost:5001/api/drawings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          drawingData,
          title: `Drawing ${new Date().toLocaleDateString()}`
        })
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Drawing is too large to save. Try making it smaller.');
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Please login again');
        }
        throw new Error('Failed to save drawing');
      }

      setHasChanges(false);
      showAlert("Drawing saved successfully!", "success");
      navigate('/drawings');
    } catch (error) {
      console.error('Error saving drawing:', error);
      showAlert(error.message || "Error saving drawing", "error");
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
    const isLoggedIn = !!localStorage.getItem('token');
    const targetPath = isLoggedIn ? '/notes' : '/tempNote';

    if (hasChanges) {
      setModalConfig({
        title: 'Switch to Note',
        message: 'You have unsaved changes. Are you sure you want to switch to note mode?',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate(targetPath);
        }
      });
      setIsModalOpen(true);
    } else {
      navigate(targetPath);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(17, 24, 39, 0.95)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasChanges(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `drawing-${new Date().toLocaleDateString()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className={`temp-drawing-container theme-${theme}`}>
      <div className="temp-drawing-content">
        <div className="temp-drawing-header">
          <div className="header-left">
            <button className="back-button" onClick={handleDiscard}>
              <ArrowLeft size={20} />
            </button>
            <h1>Create Drawing</h1>
          </div>
          
          <div className="header-right">
            <button className="feature-button" onClick={() => setShowToolbar(!showToolbar)}>
              <Palette size={20} />
              <span>Tools</span>
            </button>
            <button className="switch-button" onClick={handleSwitchToNote}>
              <FileText size={20} />
              <span>Switch to Note</span>
            </button>
          </div>
        </div>

        {showToolbar && (
          <div className="drawing-toolbar">
            <div className="toolbar-section">
              <select 
                value={strokeSize} 
                onChange={(e) => setStrokeSize(Number(e.target.value))}
                className="toolbar-select"
              >
                {strokeSizes.map(size => (
                  <option key={size.value} value={size.value}>{size.name}</option>
                ))}
              </select>
            </div>

            <div className="toolbar-section colors">
              {colors.map(color => (
                <button
                  key={color.value}
                  className={`color-btn ${strokeColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setStrokeColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>

            <div className="toolbar-section">
              <button className="tool-btn" onClick={clearCanvas}>
                <Trash2 size={18} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

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
          <div className="action-buttons-left">
            <button className="action-btn" onClick={handleDownload}>
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>

          <div className="action-buttons-right">
            <button className="save-btn" onClick={handleSave}>
              <Save size={18} />
              <span>Save Drawing</span>
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </div>
  );
};

export default TemporaryCanvas; 