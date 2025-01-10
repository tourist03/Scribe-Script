import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../CSS/Signup.css';

const Signup = (props) => {
  let navigate = useNavigate();
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
    <div className="signup-container">
      <div className="signup-left">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to ScribeSpace</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Your creative journey starts here. Join our community of creators and bring your ideas to life.
        </p>
      </div>
      
      <div className="signup-right">
        <div className="signup-card">
          <div className="brand-logo">
            {/* Add your logo here */}
          </div>
          
          <h2 className="signup-title">Create your account</h2>
          <p className="signup-subtitle">Start your journey with ScribeSpace</p>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={credentials.name}
                onChange={onChange}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={credentials.email}
                onChange={onChange}
                required
              />
              <p className="email-hint">We'll never share your email with anyone else.</p>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={credentials.password}
                onChange={onChange}
                required
                minLength={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpassword">Confirm Password</label>
              <input
                type="password"
                id="cpassword"
                name="cpassword"
                className="form-input"
                placeholder="Confirm your password"
                value={credentials.cpassword}
                onChange={onChange}
                required
                minLength={5}
              />
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="login-link">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
