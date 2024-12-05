import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // console.log('Login response:', json);

      if (json.success) {
        // Save the token first
        localStorage.setItem('token', json.authToken);
        
        // Show success message
        props.showAlert("Login successful!", "success");
        
        // Navigate after everything is done
        navigate("/");
      } else {
        props.showAlert("Invalid Credentials", "danger");
      }
    } catch (error) {
      // console.error('Login error:', error);
      props.showAlert("Something went wrong", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className = "container mt-3">
      <h2>Login to continue to ScribeSpace</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
          />
          <div id="password" className="form-text"></div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
