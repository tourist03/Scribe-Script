import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Trash2, Image, Palette } from "lucide-react";
import "../CSS/TemporaryCanvas.css";

const TemporaryCanvas = ({ showAlert }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");
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

  const SavedDrawing = () => {
    navigate("/drawings")
  }

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

  const handleClose = () => {
    if (isLoggedIn) {
      navigate("/choose"); // Return to choice page for logged-in users
    } else {
      navigate("/about"); // Return to about page for non-logged-in users
    }
  };

  return (
    <div className="temporary-canvas-container">
      <div className="canvas-header">
        <h2>{isLoggedIn ? "Create Drawing" : "Create Temporary Drawing"}</h2>
        <p className="subtitle">Express your creativity freely</p>
      </div>

      <div className="canvas-controls">
        <input
          type="text"
          placeholder="Give your masterpiece a name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="drawing-title-input"
        />
        
        {/* Future feature placeholders */}
        <div className="tool-controls">
          <button className="tool-btn" title="Coming soon: Color picker">
            <Palette size={20} />
          </button>
          <button className="tool-btn" title="Coming soon: Brush size">
            <span className="brush-icon">●</span>
          </button>
        </div>
      </div>

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
        <div className="button-group">
          <button onClick={handleSave} className="action-button save-button">
            <Save size={20} />
            <span>{isLoggedIn ? "Save Drawing" : "Save Temporary"}</span>
          </button>
          
          <button onClick={clearCanvas} className="action-button clear-button">
            <Trash2 size={20} />
            <span>Clear Canvas</span>
          </button>
        </div>

        <div className="button-group">
          <button onClick={SavedDrawing} className="action-button view-button">
            <Image size={20} />
            <span>View Gallery</span>
          </button>

          <button onClick={handleClose} className="action-button close-button">
            <X size={20} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporaryCanvas;
