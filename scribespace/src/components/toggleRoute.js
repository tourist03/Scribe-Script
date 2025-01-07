import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleNotes = () => {
    if (isLoggedIn) {
      navigate("/notes"); // Go to notes page if logged in
    } else {
      navigate("/tempNote"); // Go to temporary note if not logged in
    }
  };

  const handleDrawing = () => {
    if (isLoggedIn) {
      navigate("/tempDraw"); // Go to drawing page if logged in
      // After saving, it will go to /drawings instead of /login
    } else {
      navigate("/tempDraw"); // Go to temporary drawing if not logged in
      // Will redirect to login when trying to save
    }
  };

  return (
    <div className="toggle-route-container">
      <h2>Welcome to ScribeSpace</h2>
      <p>{isLoggedIn ? 'Choose what you\'d like to create:' : 'Try it out:'}</p>
      
      <div className="button-container">
        <button 
          className="toggle-button notes-button" 
          onClick={handleNotes}
        >
          <i className="fa-solid fa-note-sticky"></i>
          {isLoggedIn ? 'Create Notes' : 'Try Taking Notes'}
        </button>

        <button 
          className="toggle-button draw-button" 
          onClick={handleDrawing}
        >
          <i className="fa-solid fa-pencil"></i>
          {isLoggedIn ? 'Create Drawing' : 'Try Drawing'}
        </button>
      </div>

      {!isLoggedIn && (
        <div className="login-prompt">
          <p>Want to save your work?</p>
          <div className="auth-buttons">
            <button 
              className="auth-button login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="auth-button signup-button"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleRoute;
 