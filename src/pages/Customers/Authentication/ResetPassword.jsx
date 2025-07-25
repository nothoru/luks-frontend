// src/pages/Customers/Authentication/ResetPassword.jsx
import React, { useState } from "react";
import { Box, Container, Typography, Paper, Button, TextField, Alert, } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import Base from "../../../components/Base";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { uid, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `/api/users/password-reset/confirm/${uid}/${token}/`,
        {
          password: password,
          confirm_password: confirmPassword,
        }
      );

      setSuccess(
        "Your password has been reset successfully! You will be redirected to the login page shortly."
      );
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      let specificErrorMessage =
        "Failed to reset password. The link may be invalid or expired.";

      if (err.response && err.response.data) {
        if (err.response.data.error) {
          specificErrorMessage = err.response.data.error;
        } else {
          const errorValues = Object.values(err.response.data);
          if (
            errorValues.length > 0 &&
            Array.isArray(errorValues[0]) &&
            errorValues[0].length > 0
          ) {
            specificErrorMessage = errorValues[0][0];
          }
        }
      }

      setError(specificErrorMessage);
      console.error(
        "Password reset confirmation error:",
        err.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Base>
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
            Set New Password
          </Typography>

          {success ? (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success}
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                helperText="Password must be at least 8 characters long."
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Base>
  );
};

export default ResetPassword;
