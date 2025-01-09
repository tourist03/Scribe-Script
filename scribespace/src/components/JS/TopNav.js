import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, FileText, PenLine, FolderOpen, LogOut } from 'lucide-react';
import '../CSS/TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="top-nav">
      <div className="nav-left">
        {location.pathname !== '/' && (
          <button className="nav-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <h1 className="nav-title" onClick={() => navigate('/')}>ScribeSpace</h1>
      </div>

      {isLoggedIn && (
        <div className="nav-right">
          <button className="nav-btn" onClick={() => navigate('/notes')}>
            <FileText size={20} />
            Notes
          </button>
          <button className="nav-btn" onClick={() => navigate('/drawings')}>
            <PenLine size={20} />
            Drawings
          </button>
          <button className="nav-btn" onClick={() => navigate('/saved-work')}>
            <FolderOpen size={20} />
            Saved Work
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default TopNav; 