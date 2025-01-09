import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, PenLine, FolderOpen, LogOut } from 'lucide-react';
import '../CSS/TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();
  const isRoot = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {!isRoot && (
        <div className="nav-container">
          <h1 className="app-logo" onClick={() => navigate('/')}>ScribeSpace</h1>
          
          {isLoggedIn && (
            <div className="nav-actions">
              <button className="nav-icon-btn" onClick={() => navigate('/notes')} title="Notes">
                <FileText size={20} />
              </button>
              <button className="nav-icon-btn" onClick={() => navigate('/drawings')} title="Drawings">
                <PenLine size={20} />
              </button>
              <button className="nav-icon-btn" onClick={() => navigate('/saved-work')} title="Saved Work">
                <FolderOpen size={20} />
              </button>
              <button className="nav-icon-btn logout" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TopNav; 