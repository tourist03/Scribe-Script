import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PenLine, Cloud, MousePointerClick, Users } from 'lucide-react';
import '../CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="page-container">
      <div className="hero-section">
        <h2>Your Creative Digital Canvas for Notes and Drawings</h2>
        <p>Capture ideas, sketch concepts, and create seamlessly in one place</p>

        <div className="feature-cards">
          <div className="feature-card" onClick={() => navigate(isLoggedIn ? '/notes' : '/tempNote')}>
            <div className="card-header">
              <div className="icon-wrapper blue">
                <FileText />
              </div>
              <h3>Take Notes</h3>
            </div>
            <p>Capture your thoughts and ideas instantly with our intuitive note-taking interface.</p>
            <button className="card-button blue">
              {isLoggedIn ? 'Create Notes' : 'Start Writing'}
            </button>
          </div>

          <div className="feature-card" onClick={() => navigate('/tempDraw')}>
            <div className="card-header">
              <div className="icon-wrapper purple">
                <PenLine />
              </div>
              <div className="title-with-badge">
                <h3>Draw & Sketch</h3>
                <span className="beta-badge">BETA</span>
              </div>
            </div>
            <p>Express yourself through digital art with our powerful drawing tools.</p>
            <button className="card-button purple">
              {isLoggedIn ? 'Create Drawing' : 'Start Drawing'}
            </button>
          </div>
        </div>

        <div className="features-grid">
          <div className="mini-feature">
            <Cloud />
            <div>
              <h4>Cloud Storage</h4>
              <p>Your work is automatically saved and synced</p>
            </div>
          </div>
          <div className="mini-feature">
            <MousePointerClick />
            <div>
              <h4>Easy to Use</h4>
              <p>Intuitive interface that works right in your browser</p>
            </div>
          </div>
          <div className="mini-feature">
            <Users />
            <div>
              <h4>Offline Support</h4>
              <p>Keep working even when you're not connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleRoute;
 