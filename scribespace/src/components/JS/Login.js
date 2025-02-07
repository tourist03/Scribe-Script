import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, GithubIcon } from 'lucide-react';
import '../CSS/Auth.css';
import { useAuth } from '../../context/AuthContext';
import config from '../../config/config';

const Login = ({ showAlert }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const error = params.get('error');
    
    if (error) {
      showAlert("Authentication failed. Please try again.", "error");
      return;
    }
    
    if (token) {
      let userData;
      if (userParam) {
        try {
          userData = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      login(token, userData);
      window.history.replaceState({}, document.title, '/login');
      showAlert("Successfully logged in!", "success");
      
      // Handle any pending items before redirecting
      savePendingItems(token).then(redirectPath => {
        navigate(redirectPath || '/about');
      });
    }
  }, [login, navigate, showAlert]);

  const savePendingItems = async (token) => {
    // Check for pending drawing
    const pendingDrawing = localStorage.getItem('pendingTempDrawing');
    if (pendingDrawing) {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/drawings/add`, {
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
        const response = await fetch(`${config.BACKEND_URL}/api/notes/addnote`, {
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
      const response = await fetch(`${config.BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.authtoken, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
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
            onClick={() => window.location.href=`${config.BACKEND_URL}/api/auth/github`} 
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