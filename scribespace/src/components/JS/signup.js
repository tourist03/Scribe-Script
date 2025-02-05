import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, GithubIcon } from 'lucide-react';
import '../CSS/Auth.css';

const Signup = (props) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const host = "http://localhost:5001";
    const { name, email, password, cpassword } = credentials;

    if (password !== cpassword) {
      props.showAlert("Passwords do not match", "danger");
      setIsLoading(false);
      return;
    }
    if (password.length < 5) {
      props.showAlert("Password must be at least 5 characters", "danger");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        props.showAlert("Account created successfully!", "success");
        navigate("/");
      } else {
        props.showAlert(json.error || "Invalid Credentials", "danger");
      }
    } catch (error) {
      console.error("Signup error:", error);
      props.showAlert("An error occurred during signup", "danger");
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
          <h1 className="auth-title">Join ScribeSpace</h1>
          <p className="auth-subtitle">Start your creative journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <User className="input-icon" size={20} />
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              name="cpassword"
              value={credentials.cpassword}
              onChange={onChange}
              required
              minLength={5}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
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
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
