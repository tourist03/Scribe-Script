import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, FileText, ArrowLeft, Sparkles } from "lucide-react";
import "../CSS/TemporaryCanvas.css";

const TemporaryCanvas = ({ showAlert }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [title, setTitle] = useState("");
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
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
        offsetY: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY,
    };
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setIsTitleModalOpen(true);
      return;
    }
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();

    if (localStorage.getItem("token")) {
      try {
        const response = await fetch("http://localhost:5001/api/drawings/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            drawingData,
            title: title || `Drawing ${new Date().toLocaleDateString()}`,
          }),
        });

        if (response.ok) {
          showAlert("Drawing saved successfully!", "success");
          navigate("/drawings");
        } else {
          console.error("Failed to save drawing");
          showAlert("Failed to save drawing", "error");
        }
      } catch (error) {
        console.error("Error saving drawing:", error);
        showAlert("Error saving drawing", "error");
      }
    } else {
      localStorage.setItem("pendingTempDrawing", drawingData);
      navigate("/login");
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    draw(e.touches[0]);
  };

  return (
    <div className="drawing-workspace">
      <div className="beta-corner-badge">
        <Sparkles size={14} />
        <span>BETA</span>
      </div>

      {showTips && (
        <div className="feature-tips">
          <div className="tips-header">
            <h3>Beta Features</h3>
            <button onClick={() => setShowTips(false)}><X size={16} /></button>
          </div>
          <ul>
            <li>💡 Use scroll to adjust brush size</li>
            <li>🎨 Double-click color to open custom picker</li>
            <li>↩️ Ctrl+Z for undo</li>
            <li>💾 Title required to save your artwork</li>
          </ul>
          <div className="beta-notice">
            Beta version - We're continuously improving!
          </div>
        </div>
      )}

      <div className="temp-draw-container">
        <div className="temp-draw-header">
          <button className="header-btn back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back
          </button>
          <button className="header-btn switch-btn" onClick={() => navigate('/tempNote')}>
            <FileText size={20} />
            Switch to Notes
          </button>
        </div>

        <div className="temp-draw-content">
          <h1 className="temp-draw-title">Create Quick Drawing</h1>
          <p className="temp-draw-subtitle">Express yourself through art - no account needed</p>

          <div className="drawing-form">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Give your masterpiece a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
              />
            </div>

            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn clear-btn" onClick={clearCanvas}>
              Clear Canvas
            </button>
            <div className="right-buttons">
              <button 
                className={`action-btn save-btn ${!title.trim() ? 'disabled' : ''}`}
                onClick={handleSave}
                disabled={!title.trim()}
              >
                <Save size={20} />
                Save Drawing
              </button>
              <button className="action-btn close-btn" onClick={() => navigate('/')}>
                <X size={20} />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title Required Modal */}
      {isTitleModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Title Required</h3>
            <p>Please give your artwork a title before saving.</p>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setIsTitleModalOpen(false)}>Cancel</button>
              <button 
                onClick={async () => {
                  if (title.trim()) {
                    setIsTitleModalOpen(false);
                    await handleSave();
                  }
                }}
                disabled={!title.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryCanvas;
