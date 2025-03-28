import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext"; // Ensure this file exports createContext()
import { login } from "../../api/authApi"; // Adjust the import path as necessary

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User data (e.g., { name, role })
  const [token, setToken] = useState(null); // Separate token state
  const [loading, setLoading] = useState(true);

  // Load user and token from local storage when the component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Function to log in the user
  const loginUser = async (credentials) => {
    try {
      const data = await login(credentials); // Call your login API
      const userData = { name: data.name, role: data.role }; // User info without token
      const authToken = data.token; // Token separately

      setUser(userData); // Set user state
      setToken(authToken); // Set token state
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data
      localStorage.setItem("token", authToken); // Store token separately
      return { ...userData, token: authToken }; // Return combined data for convenience
    } catch (error) {
      throw new Error("Login failed: " + error.message); // Include error details
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null); // Clear user state
    setToken(null); // Clear token state
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("token"); // Remove token
  };

  // Provide the user, token, and functions to the context
  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;