import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, GithubIcon } from 'lucide-react';
import '../CSS/Auth.css';
import { useAuth } from '../../context/AuthContext';

const Login = ({ showAlert }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      login(token);
      window.history.replaceState({}, document.title, '/login');
      showAlert("Successfully logged in!", "success");
      navigate('/');
    }
  }, [login, navigate, showAlert]);

  const savePendingItems = async (token) => {
    // Check for pending drawing
    const pendingDrawing = localStorage.getItem('pendingTempDrawing');
    if (pendingDrawing) {
      try {
        const response = await fetch('http://localhost:5001/api/drawings/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({ 
            drawingData: pendingDrawing,
            title: `Drawing ${new Date().toLocaleDateString()}`
          })
        });

        if (response.ok) {
          localStorage.removeItem('pendingTempDrawing');
          showAlert("Drawing saved successfully!", "success");
          return '/drawings'; // Return the redirect path
        }
      } catch (error) {
        console.error('Error saving pending drawing:', error);
      }
    }

    // Check for pending note
    const pendingNote = localStorage.getItem('pendingTempNote');
    if (pendingNote) {
      try {
        const noteData = JSON.parse(pendingNote);
        const response = await fetch('http://localhost:5001/api/notes/addnote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            title: noteData.title,
            description: noteData.description,
            tag: "General"
          })
        });

        if (response.ok) {
          localStorage.removeItem('pendingTempNote');
          showAlert("Note saved successfully!", "success");
          return '/notes'; // Return the redirect path
        }
      } catch (error) {
        console.error('Error saving pending note:', error);
      }
    }

    return '/'; // Default redirect path if no pending items
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authToken);
        showAlert("Logged in successfully!", "success");

        // Handle pending temporary note
        const pendingNote = localStorage.getItem('pendingTempNote');
        if (pendingNote) {
          try {
            const { title, content } = JSON.parse(pendingNote);
            const noteResponse = await fetch("http://localhost:5001/api/notes/addnote", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": json.authToken,
              },
              body: JSON.stringify({ 
                title: title,
                description: content,
                tag: "General"
              }),
            });

            if (noteResponse.ok) {
              localStorage.removeItem('pendingTempNote');
              showAlert("Your note has been saved!", "success");
              navigate('/notes');
              return;
            }
          } catch (error) {
            console.error('Error saving pending note:', error);
          }
        }

        // Handle pending temporary drawing
        const pendingDrawing = localStorage.getItem('pendingTempDrawing');
        if (pendingDrawing) {
          try {
            const { drawingData, title } = JSON.parse(pendingDrawing);
            const drawingResponse = await fetch("http://localhost:5001/api/drawings/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": json.authToken,
              },
              body: JSON.stringify({
                drawingData,
                title: title || `Drawing ${new Date().toLocaleDateString()}`
              }),
            });

            if (drawingResponse.ok) {
              localStorage.removeItem('pendingTempDrawing');
              showAlert("Your drawing has been saved!", "success");
              navigate('/drawings');
              return;
            }
          } catch (error) {
            console.error('Error saving pending drawing:', error);
          }
        }

        navigate('/');
      } else {
        showAlert(json.error || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert("An error occurred during login", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Continue your creative journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <button 
            type="button"
            onClick={() => window.location.href='http://localhost:5001/api/auth/github'} 
            className="social-button"
          >
            <GithubIcon size={20} />
            Continue with GitHub
          </button>

          <div className="auth-link">
            Don't have an account?
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;