import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Home, PenLine, LogOut, FolderOpen } from 'lucide-react';
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
      <div className="nav-left">
        <h1 onClick={() => navigate('/')}>ScribeSpace</h1>
      </div>
      
      <div className="nav-center">
        {isLoggedIn && (
          <>
            <button 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              <Home size={18} />
              Home
            </button>
            <button 
              className={`nav-item ${location.pathname === '/notes' ? 'active' : ''}`}
              onClick={() => navigate('/notes')}
            >
              <FileText size={18} />
              Notes
            </button>
            <button 
              className={`nav-item ${location.pathname === '/drawings' ? 'active' : ''}`}
              onClick={() => navigate('/drawings')}
            >
              <PenLine size={18} />
              Drawings
            </button>
            <button 
              className={`nav-item ${location.pathname === '/saved-work' ? 'active' : ''}`}
              onClick={() => navigate('/saved-work')}
            >
              <FolderOpen size={18} />
              Saved Work
            </button>
          </>
        )}
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <>
            <button className="nav-item" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-item signup" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav; 