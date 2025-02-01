import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PenLine, FolderOpen, Info } from 'lucide-react';
import '../CSS/ToggleRoute.css';

const ToggleRoute = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [showAbout, setShowAbout] = useState(false);

  const features = [
    {
      icon: <FileText className="feature-icon" />,
      title: "Smart Notes",
      description: "Create and organize your thoughts with rich text formatting."
    },
    {
      icon: <PenLine className="feature-icon" />,
      title: "Drawing Canvas",
      description: "Express your creativity with our digital canvas.",
      isBeta: true
    },
    {
      icon: <FolderOpen className="feature-icon" />,
      title: "Cloud Storage",
      description: "Access your work from anywhere, anytime."
    }
  ];

  return (
    <div className="toggle-route-container">
      <div className="hero-section">
        <h1 className="main-title">ScribeSpace</h1>
        <p className="subtitle">Your creative digital canvas for notes and drawings</p>
        
        <button 
          className="about-toggle"
          onClick={() => setShowAbout(!showAbout)}
        >
          <Info size={20} />
          {showAbout ? 'Hide Details' : 'About ScribeSpace'}
        </button>

        <div className={`about-section ${showAbout ? 'show' : ''}`}>
          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>
                  {feature.title}
                  {feature.isBeta && <span className="beta-badge">BETA</span>}
                </h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="login-prompt">
            <p>Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login here</span></p>
          </div>
        )}
      </div>

      <div className="action-section">
        <h2>{isLoggedIn ? 'What would you like to do?' : 'Try it out:'}</h2>
        
        <div className="button-container">
          <button 
            className="action-button notes-button" 
            onClick={() => navigate(isLoggedIn ? '/notes' : '/tempNote')}
          >
            <FileText size={24} />
            {isLoggedIn ? 'Create Notes' : 'Try Taking Notes'}
          </button>

          <button 
            className="action-button draw-button" 
            onClick={() => navigate('/tempDraw')}
          >
            <PenLine size={24} />
            {isLoggedIn ? 'Create Drawing' : 'Try Drawing'}
          </button>

          {isLoggedIn && (
            <button 
              className="action-button view-button" 
              onClick={() => navigate('/saved-work')}
            >
              <FolderOpen size={24} />
              View Saved Work
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToggleRoute;
 