import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Container, Typography, Snackbar, Alert, Box, Button, CircularProgress, Paper, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function FaceLogin() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleFaceLogin = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot || loading) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/facial/verify_face/", {
        image: screenshot,
      });

      const { verified, token, role, user_id, error } = response.data;

      if (!verified) {
        setSnackbar({
          open: true,
          type: "error",
          message: error || "❌ Face not recognized.",
        });
        setLoading(false);
        return;
      }

      if (!["admin", "staff"].includes(role)) {
        setSnackbar({
          open: true,
          type: "error",
          message: "❌ Unauthorized role for facial login.",
        });
        setLoading(false);
        return;
      }

      // Save to localStorage (optional, for persistence)
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);

      // Set user context
      login({ access: token, role, id: user_id });

      setSnackbar({
        open: true,
        type: "success",
        message: "✅ Face recognized! Logging in...",
      });

      // Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "staff") {
          navigate("/staff/orders");
        } else {
          navigate("/");
        }
      }, 1500);

    } catch (err) {
      console.error("Face login error:", err);
      setSnackbar({
        open: true,
        type: "error",
        message: err.response?.data?.error || "Server error.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/staff-login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Face Login</Typography>
        <Typography mb={2}>
          Align your face in the box and click the button to verify your identity.
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: 400,
            height: 300,
            mx: "auto",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid #1976d2",
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={400}
            height={300}
            videoConstraints={{
              width: 400,
              height: 300,
              facingMode: "user",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={handleFaceLogin} disabled={loading}>
            {loading ? "Processing..." : "Login with Face"}
          </Button>

          <Button variant="contained" color="primary" onClick={handleBack}>
            Back to Staff Login
          </Button>
        </Box>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.type}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
