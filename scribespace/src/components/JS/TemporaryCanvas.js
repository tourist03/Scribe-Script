import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, FileText, ArrowLeft } from "lucide-react";
import "../CSS/TemporaryCanvas.css";

const TemporaryCanvas = ({ showAlert }) => {
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
            <button className="action-btn save-btn" onClick={handleSave}>
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
  );
};

export default TemporaryCanvas;
