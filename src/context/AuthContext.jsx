// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        return {
          ...decoded,
          role,
          id: user_id ? parseInt(user_id) : null,
        };
      } catch (e) {
        console.error("Invalid token found in localStorage", e);
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = (tokens) => {
    const accessToken = tokens.access;
    const refreshToken = tokens.refresh || null;
    const role = tokens.role;
    const userId = tokens.id;

    // Save to localStorage
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", userId);

    // Decode token
    const decoded = jwtDecode(accessToken);

    setUser({
      ...decoded,
      role,
      id: userId,
    });

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
