import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();

  const handleDrawing = () => {
    navigate("/tempDraw");
  };

  const handleNotes = () => {
    navigate("/");
  };

  return (
    <div className="toggle-route-container">
      <h2>Welcome to ScribeSpace</h2>
      <p>Choose what you'd like to create:</p>
      
      <div className="button-container">
        <button 
          className="toggle-button notes-button" 
          onClick={handleNotes}
        >
          <i className="fa-solid fa-note-sticky"></i>
          Create Notes
        </button>

        <button 
          className="toggle-button draw-button" 
          onClick={handleDrawing}
        >
          <i className="fa-solid fa-pencil"></i>
          Draw Canvas
        </button>
      </div>
    </div>
  );
};

export default ToggleRoute;
 