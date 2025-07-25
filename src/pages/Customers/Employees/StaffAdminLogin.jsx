import React, { useState } from "react";
import { Container, TextField, Button, Typography, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/AuthContext";

export default function StaffAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/api/users/token/", {
        email,
        password,
      });

      const token = res.data.access;
      const role = jwtDecode(token).role;

      if (role === "staff" || role === "admin") {
        login(res.data); // handles token and state
        navigate("/admin/dashboard");
      } else {
        setAlert("Only staff and admin can log in here.");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setAlert("Invalid credentials or server error.");
    }
  };

  const redirectToFaceLogin = () => {
    navigate("/face-login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Staff / Admin Login
      </Typography>

      {alert && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {alert}
        </Alert>
      )}

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="contained" color="primary" onClick={redirectToFaceLogin}>
          Face Login
        </Button>
      </Box>
    </Container>
  );
}