import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PenLine, Lock, Cloud, LogIn, Sparkles, Save } from "lucide-react";
import "../CSS/About.css";
import { useAuth } from "../../context/AuthContext";

const About = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-container">
      {isAuthenticated ? (
        <>
          <div className="welcome-header">
            <h1>Create. Express. Inspire.</h1>
            <p>Your digital canvas for limitless creativity</p>
          </div>
          
          <div className="action-blocks">
            <div className="action-block notes" onClick={() => navigate('/notes')}>
              <div className="block-icon">
                <FileText size={40} />
              </div>
              <div className="block-content">
                <h2>Notes</h2>
                <p>Transform your thoughts into organized masterpieces</p>
                <span className="action-link">Open Notes →</span>
              </div>
            </div>

            <div className="action-block drawings" onClick={() => navigate('/drawings')}>
              <div className="block-icon">
                <PenLine size={40} />
              </div>
              <div className="block-content">
                <h2>Drawings</h2>
                <p>Unleash your artistic vision with powerful digital tools</p>
                <span className="action-link">Start Drawing →</span>
              </div>
            </div>

            <div className="action-block saved" onClick={() => navigate('/saved-work')}>
              <div className="block-icon">
                <Save size={40} />
              </div>
              <div className="block-content">
                <h2>Saved Work</h2>
                <p>Access your creative collection in one place</p>
                <span className="action-link">View All →</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="guest-container">
          <div className="hero-section">
            <h1>Create. Express. Inspire.</h1>
            <p>Your digital canvas for limitless creativity</p>
          </div>

          <div className="main-features">
            <div className="feature-card" onClick={() => navigate('/tempNote')}>
              <div className="card-header">
                <div className="icon-wrapper blue">
                  <FileText size={24} />
                </div>
                <h3>Take Notes</h3>
              </div>
              <p>Transform your thoughts into organized masterpieces. Smart features, beautiful organization, unlimited potential.</p>
            </div>

            <div className="feature-card" onClick={() => navigate('/tempDraw')}>
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

          <div className="secondary-features">
            <div className="mini-card">
              <Cloud size={24} />
              <h3>Smart Sync</h3>
              <p>Access your work anywhere</p>
            </div>

            <div className="mini-card">
              <Sparkles size={24} />
              <h3>Easy to Use</h3>
              <p>Intuitive interface</p>
            </div>

            <div className="mini-card">
              <Lock size={24} />
              <h3>Secure Storage</h3>
              <p>Your work is protected</p>
            </div>
          </div>

          <div className="cta-section">
            <button 
              className="cta-button primary"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => navigate('/login')}
            >
              <LogIn size={20} />
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
