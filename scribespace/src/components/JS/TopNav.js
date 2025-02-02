import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PenLine, FolderOpen, LogOut } from 'lucide-react';
import '../CSS/TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <FileText className="brand-icon" />
        <h1>ScribeSpace</h1>
      </div>
      
      <div className="nav-buttons">
        {isLoggedIn ? (
          <>
            <button 
              className="nav-button with-icon"
              onClick={() => navigate('/notes')}
            >
              <FileText size={18} />
              Notes
            </button>
            <button 
              className="nav-button with-icon"
              onClick={() => navigate('/drawing')}
            >
              <PenLine size={18} />
              Draw
            </button>
            <button 
              className="nav-button with-icon"
              onClick={() => navigate('/saved-work')}
            >
              <FolderOpen size={18} />
              Saved Work
            </button>
            <button 
              className="nav-button logout with-icon"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              className="nav-button login"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="nav-button signup"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav; 