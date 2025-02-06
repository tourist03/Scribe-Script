import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, FileText } from "lucide-react";
import "../CSS/DrawingCanvas.css";
import PropTypes from 'prop-types';

const DrawingCanvas = ({ showAlert }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [title, setTitle] = useState("");

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
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    context?.closePath();
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert("Please add a title for your drawing", "error");
      return;
    }
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();
    try {
      const response = await fetch("http://localhost:5001/api/drawings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title,
          drawingData,
        }),
      });
      if (response.ok) {
        showAlert("Drawing saved successfully!", "success");
        navigate("/drawings");
      } else {
        showAlert("Failed to save drawing", "error");
      }
    } catch (error) {
      showAlert("Error saving drawing", "error");
    }
  };

  return (
    <div className="draw-container">
      <div className="draw-content">
        <h1 className="draw-title">Create Drawing</h1>
        <p className="draw-subtitle">Express your creativity</p>

        <div className="drawing-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Give your drawing a title..."
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
            <button className="action-btn save-btn" onClick={handleSave}>
              <Save size={20} />
              Save Drawing
            </button>
            <button className="action-btn close-btn" onClick={() => navigate('/drawings')}>
              <X size={20} />
              Close
            </button>
            <button className="action-btn view-drawings-btn" onClick={() => navigate('/drawings')}>
              <FileText size={20} />
              View My Drawings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DrawingCanvas.propTypes = {
  showAlert: PropTypes.func.isRequired
};

export default DrawingCanvas; 