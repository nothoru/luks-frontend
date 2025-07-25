// frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log("🔐 PrivateRoute check:");
  console.log("user:", user);
  console.log("allowedRoles:", allowedRoles);

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("🚫 Not logged in");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("🚫 Role not allowed:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
