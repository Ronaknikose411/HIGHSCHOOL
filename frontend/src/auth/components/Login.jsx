import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const { identifier, password } = credentials;

      // Determine the type of identifier
      const loginData = {
        email: identifier.includes("@") ? identifier : undefined, // For superadmin or email-based login
        studentID: identifier.startsWith("STD") ? identifier : undefined,
        teacherID: identifier.startsWith("TECH") ? identifier : undefined,
        adminID: identifier.startsWith("ADMIN_") ? identifier : undefined, // Add adminID check
        password,
      };

      const user = await loginUser(loginData);
      navigate(`/${user.role}/dashboard`); // Navigate based on role (e.g., /admin/dashboard, /superadmin/dashboard)
    } catch (error) {
      setError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Login (Email, Student ID, Teacher ID, or Admin ID)</label>
          <input
            type="text"
            name="identifier"
            className="form-control"
            value={credentials.identifier}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;