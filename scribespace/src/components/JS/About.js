import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PenLine, Lock, Users } from "lucide-react";
import "../CSS/About.css";

const About = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const features = [
    {
      icon: <FileText className="feature-icon text-blue-500" />,
      title: "Text Notes",
      description:
        "Create and organize your thoughts with rich text formatting. Access your notes anytime, anywhere with cloud storage.",
    },
    {
      icon: <PenLine className="feature-icon text-purple-500" />,
      title: "Drawing Canvas",
      description:
        "Express your creativity with our digital canvas. Create, save, and share your artwork seamlessly.",
      comingSoon: true,
    },
    {
      icon: <Lock className="feature-icon text-green-500" />,
      title: "Secure Storage",
      description:
        "Your data is protected with industry-standard security. Rest easy knowing your work is safe and private.",
    },
    {
      icon: <Users className="feature-icon text-orange-500" />,
      title: "User Accounts",
      description:
        "Personalized accounts for syncing your work across devices. Access your content from anywhere, anytime.",
    },
  ];

  const handleGetStarted = () => navigate("/login");
  const handleCreateTemporaryNote = () => navigate("/tempNote");
  const handleCreateTemporaryDrawing = () => navigate("/tempDraw");
  const handleAddNoteButtonClick = () => navigate("/notes");
  const handleTitleClick = () => navigate('/');

  return (
    <div className="about-container">
      <div className="hero-section">
        <h1 className="hero-title" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
          Scribescape
        </h1>
        <p className="hero-subtitle">
          Your creative digital canvas for notes and drawings
        </p>
      </div>

      <div className="features-section">
        <h2 className="features-title">Why Choose Scribescape?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <div className="feature-content">
                <h3 className="feature-title">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="beta-badge">BETA</span>
                  )}
                </h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        {!isLoggedIn ? (
          <>
            <div className="temp-actions">
              <button
                onClick={handleCreateTemporaryNote}
                className="action-button note-button"
              >
                <FileText size={20} />
                Create Temporary Note
              </button>
              <button
                onClick={handleCreateTemporaryDrawing}
                className="action-button draw-button"
              >
                <PenLine size={20} />
                Create Temporary Drawing
              </button>
            </div>
            <button onClick={handleGetStarted} className="get-started-button">
              Get Started (Login Required)
            </button>
          </>
        ) : (
          <div className="logged-in-actions">
            <button
              onClick={handleAddNoteButtonClick}
              className="action-button note-button"
            >
              <FileText size={20} />
              Add New Note
            </button>
            <button
              onClick={() => navigate('/drawing')}
              className="action-button draw-button"
            >
              <PenLine size={20} />
              Create Drawing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
