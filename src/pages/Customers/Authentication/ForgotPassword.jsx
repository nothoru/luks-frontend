// src/pages/Customers/Authentication/ForgotPassword.jsx
import React, { useState } from "react";
import { Box, Container, Typography, Paper, Button, TextField, Alert, } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import Base from "../../../components/Base";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosInstance.post("/api/users/password-reset/", { email });
      setMessage(
        "If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder."
      );
    } catch (error) {
      setMessage(
        "If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder."
      );
      console.error("Password reset request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Base>
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Enter your email address below, and we'll send you a link to reset
            your password.
          </Typography>

          {message ? (
            <Alert severity="success" sx={{ mt: 3, textAlign: "left" }}>
              {message}
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>
          )}

          <Button component={RouterLink} to="/login" sx={{ mt: 2 }}>
            Back to Login
          </Button>
        </Paper>
      </Container>
    </Base>
  );
};

export default ForgotPassword;
