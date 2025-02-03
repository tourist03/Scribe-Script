import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PenLine, Cloud, MousePointerClick, Users, Sparkles } from 'lucide-react';
import '../CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="page-container">
      <div className="gradient-bg" />
      
      <div className="hero-section">
        <h2>Create. Express. Inspire.</h2>
        <p>Your digital canvas for limitless creativity</p>

        <div className="feature-cards">
          <div className="feature-card" onClick={() => navigate(isLoggedIn ? '/notes' : '/tempNote')}>
            <div className="card-header">
              <div className="icon-wrapper blue">
                <FileText size={24} />
              </div>
              <h3>Take Notes</h3>
            </div>
            <p>Transform your thoughts into organized masterpieces. Smart features, beautiful organization, unlimited potential.</p>
          </div>

          <div className="feature-card" onClick={() => navigate(isLoggedIn ? '/drawings' : '/tempDraw')}>
            <div className="card-header">
              <div className="icon-wrapper purple">
                <PenLine size={24} />
              </div>
              <h3>Draw & Sketch</h3>
              <span className="beta-badge">BETA</span>
            </div>
            <p>Unleash your artistic vision with powerful digital tools. From quick sketches to elaborate artwork.</p>
          </div>
        </div>

        <div className="mini-features">
          <div className="mini-feature">
            <Cloud size={20} />
            <div>
              <h4>Smart Sync</h4>
              <p>Access your work anywhere</p>
            </div>
          </div>
          <div className="mini-feature">
            <MousePointerClick size={20} />
            <div>
              <h4>Easy to Use</h4>
              <p>Intuitive interface</p>
            </div>
          </div>
          <div className="mini-feature">
            <Sparkles size={20} />
            <div>
              <h4>Creative Freedom</h4>
              <p>No limits, just creativity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleRoute;
 