import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../CSS/BetaBanner.css';

const BetaBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className="beta-banner">
      <div className="beta-banner-content">
        <Sparkles size={16} className="sparkle-icon" />
        <span>
          <strong>New!</strong> Try our Drawing feature in beta
        </span>
        <button 
          className="try-now-btn"
          onClick={() => navigate('/tempDraw')}
        >
          Try Now
        </button>
      </div>
      <button 
        className="close-btn"
        onClick={() => setIsVisible(false)}
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default BetaBanner; 