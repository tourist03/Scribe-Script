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
  const [title, setTitle] = useState('');
  const [lastPoint, setLastPoint] = useState(null);

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
    
    // Make canvas fill the available space
    const updateCanvasSize = () => {
      const headerHeight = 80; // Height of the header
      const footerHeight = 80; // Height of the action buttons
      const availableHeight = window.innerHeight - headerHeight - footerHeight;
      
      canvas.width = container.clientWidth * 2; // Double for retina
      canvas.height = availableHeight * 2;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${availableHeight}px`;

      const context = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
      context.scale(2, 2);
      context.lineCap = 'round';
      context.lineJoin = 'round'; // Add this for smoother line joins
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeSize;
      
      // Enable image smoothing
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      
      contextRef.current = context;
      
      // Clear canvas with dark background
      context.fillStyle = 'rgba(17, 24, 39, 0.95)';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = strokeColor;
      contextRef.current.lineWidth = strokeSize;
    }
  }, [strokeColor, strokeSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setLastPoint({ x: offsetX, y: offsetY });
    setIsDrawing(true);
    setHasChanges(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    
    if (lastPoint) {
      // Draw a line from last point to current point
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
    
    setLastPoint({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    contextRef.current.beginPath(); // Start fresh path
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
    
    if (lastPoint) {
      const context = contextRef.current;
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
    
    setLastPoint({ x: offsetX, y: offsetY });
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
      localStorage.setItem('pendingTempDrawing', JSON.stringify({
        drawingData,
        title: title.trim() || 'Untitled Drawing'
      }));
      
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
      
      const maxChunkSize = 5 * 1024 * 1024;
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
          title: title.trim() || 'Untitled Drawing'
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
    const performClear = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Reset the canvas completely
      canvas.width = canvas.width; // This clears the canvas
      
      // Reapply necessary context settings
      context.scale(2, 2);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeSize;
      
      // Fill with background color
      context.fillStyle = 'rgba(17, 24, 39, 0.95)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      setHasChanges(false);
    };

    if (hasChanges) {
      setModalConfig({
        title: 'Clear Canvas',
        message: 'Are you sure you want to clear the canvas? This action cannot be undone.',
        showAuthButtons: false,
        onConfirm: () => {
          performClear();
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
    } else {
      performClear();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `drawing-${new Date().toLocaleDateString()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // First, let's create a common button style object
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(145deg, #8b5cf6 0%, #ec4899 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  // Add useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      const toolbarElement = document.getElementById('drawing-toolbar');
      const toolButton = document.getElementById('tool-button');
      
      if (showToolbar && 
          toolbarElement && 
          !toolbarElement.contains(event.target) &&
          !toolButton.contains(event.target)) {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbar]);

  return (
    <div className="temp-drawing-container" style={{
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: '39px 0 0',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(17, 24, 39, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div className="drawing-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 2rem',
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        height: '70px'
      }}>
        <input
          type="text"
          placeholder="Enter drawing title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '500',
            width: '300px',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.1)';
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            id="tool-button"
            style={{
              ...buttonStyle,
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
            onClick={() => setShowToolbar(!showToolbar)}
          >
            <Palette size={18} />
            <span>Tools</span>
          </button>

          <button 
            style={{
              ...buttonStyle,
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
            onClick={handleSwitchToNote}
          >
            <FileText size={18} />
            <span>Switch to Note</span>
          </button>
        </div>
      </div>

      {/* Tools Panel - Floating */}
      {showToolbar && (
        <div 
          id="drawing-toolbar"
          style={{
            position: 'absolute',
            top: '80px',
            left: '2rem',
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 100,
            minWidth: '250px'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              color: '#94a3b8', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.9rem'
            }}>
              Brush Size
            </label>
            <select 
              value={strokeSize} 
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {strokeSizes.map(size => (
                <option key={size.value} value={size.value}>{size.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              color: '#94a3b8', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.9rem'
            }}>
              Colors
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem' 
            }}>
              {colors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setStrokeColor(color.value)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: color.value,
                    border: strokeColor === color.value 
                      ? '2px solid white'
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: strokeColor === color.value ? 'scale(1.1)' : 'scale(1)'
                  }}
                  title={color.name}
                />
              ))}
            </div>
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
        style={{
          flex: 1,
          width: '100%',
          height: 'calc(100vh - 130px)', // Adjusted for new header/footer heights
          display: 'block',
          cursor: 'crosshair',
          touchAction: 'none',
          margin: 0,
          padding: 0
        }}
      />

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        padding: '0.75rem 2rem',
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        height: '60px'
      }}>
        <button 
          style={{
            ...buttonStyle,
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }} 
          onClick={handleDownload}
        >
          <Download size={18} />
          <span>Download</span>
        </button>
        <button 
          style={{
            ...buttonStyle,
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }} 
          onClick={clearCanvas}
        >
          <Trash2 size={18} />
          <span>Clear</span>
        </button>
        <button 
          style={{
            ...buttonStyle,
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }} 
          onClick={handleSave}
        >
          <Save size={18} />
          <span>Save Drawing</span>
        </button>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        showAuthButtons={modalConfig.showAuthButtons}
      />
    </div>
  );
};

export default TemporaryCanvas; 