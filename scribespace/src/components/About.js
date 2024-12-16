import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PenLine, Lock, Users } from "lucide-react";
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      title: "Text Notes",
      description: "Effortlessly create and organize your notes in the cloud with rich text formatting. Access your thoughts anytime, anywhere."
    },
    {
      icon: <PenLine className="w-6 h-6 text-blue-500" />,
      title: "Drawing Canvas",
      description: "Unlock your creativity with our upcoming drawing feature. Create stunning artwork and save your drawings directly to the cloud.",
      comingSoon: true
    },
    {
      icon: <Lock className="w-6 h-6 text-green-500" />,
      title: "Secure Storage",
      description: "Rest assured that your notes and drawings are securely stored in the cloud, keeping your information private and protected."
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: "User Accounts",
      description: "Create an account to sync your notes and drawings across devices, ensuring you can access your work from anywhere."
    }
  ];

  const handleGetStarted = () => {
    navigate("/add-note");
  };

  return (
    <div className="about-container">
      <h1 className="text-4xl font-bold mb-4">Scribescape</h1>
      <p className="text-lg mb-8">Your creative digital canvas for notes and drawings</p>
      
      <div className="features-grid">
        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>
            {feature.comingSoon && (
              <span className="coming-soon-badge">Coming Soon</span>
            )}
            {feature.icon}
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      <button onClick={handleGetStarted} className="get-started">
        Get Started
      </button>
    </div>
  );
};

export default About;
