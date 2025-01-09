import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, FileText, FolderOpen } from 'lucide-react';
import '../CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleNotes = () => {
    if (isLoggedIn) {
      navigate("/notes");
    } else {
      navigate("/tempNote");
    }
  };

  const handleDrawing = () => {
    if (isLoggedIn) {
      navigate("/tempDraw");
    } else {
      navigate("/tempDraw");
    }
  };

  const handleViewSaved = () => {
    navigate("/saved-work");
  };

  return (
    <div className="toggle-route-container">
      <h2>Welcome to ScribeSpace</h2>
      <p>{isLoggedIn ? 'Choose what you\'d like to do:' : 'Try it out:'}</p>
      
      <div className="button-container">
        <button 
          className="toggle-button notes-button" 
          onClick={handleNotes}
        >
          <FileText size={24} />
          {isLoggedIn ? 'Create Notes' : 'Try Taking Notes'}
        </button>

        <button 
          className="toggle-button draw-button" 
          onClick={handleDrawing}
        >
          <PenLine size={24} />
          {isLoggedIn ? 'Create Drawing' : 'Try Drawing'}
        </button>

        {isLoggedIn && (
          <button 
            className="toggle-button view-saved-button" 
            onClick={handleViewSaved}
          >
            <FolderOpen size={24} />
            View Saved Work
          </button>
        )}
      </div>

      {!isLoggedIn && (
        // <div className="login-prompt">
        //   <p>Want to save your work?</p>
        //   <div className="auth-buttons">
        //     <button 
        //       className="auth-button login-button"
        //       onClick={() => navigate('/login')}
        //     >
        //       Login
        //     </button>
        //     <button 
        //       className="auth-button signup-button"
        //       onClick={() => navigate('/signup')}
        //     >
        //       Sign Up
        //     </button>
        //   </div>
        // </div>
        <div className="mt-3">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Create one
          </button>
        </div>
      )}
    </div>
  );
};

export default ToggleRoute;
 