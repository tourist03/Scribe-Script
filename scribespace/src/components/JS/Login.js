import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../CSS//Login.css';

const Login = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

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
          props.showAlert("Drawing saved successfully!", "success");
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
          props.showAlert("Note saved successfully!", "success");
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
    const host = "http://localhost:5001";
    
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('token', json.authToken);
        props.showAlert("Login successful!", "success");
        
        // Check and save any pending items, then navigate
        const redirectPath = await savePendingItems(json.authToken);
        navigate(redirectPath);
      } else {
        props.showAlert("Invalid credentials", "danger");
      }
    } catch (error) {
      props.showAlert("An error occurred", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <h2>Welcome to ScribeSpace</h2>
      <p>Login to continue to your account</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={onChange}
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={onChange}
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-dark"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="mt-3">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Create one
          </button>
        </div>

        <div className="social-login">
          <button 
            onClick={() => window.location.href='http://localhost:5001/api/auth/google'} 
            className="social-button google"
          >
            Continue with Google
          </button>
          <button 
            onClick={() => window.location.href='http://localhost:5001/api/auth/github'} 
            className="social-button github"
          >
            Continue with GitHub
          </button>
          <button 
            onClick={() => window.location.href='http://localhost:5001/api/auth/microsoft'} 
            className="social-button microsoft"
          >
            Continue with Microsoft
          </button>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;