import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS//Login.css';

const Login = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

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
        navigate("/choose");
      } else {
        props.showAlert("Invalid Credentials", "danger");
      }
    } catch (error) {
      props.showAlert("Something went wrong", "danger");
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
      </form>
    </div>
  );
};

export default Login;