import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Typography,
  Snackbar,
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FaceIcon from "@mui/icons-material/Face";
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
      const response = await axiosInstance.post("/api/facial/verify_face/", {
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

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);

      login({ access: token, role, id: user_id });

      setSnackbar({
        open: true,
        type: "success",
        message: "✅ Face recognized! Logging in...",
      });

      setTimeout(() => {
        navigate(role === "admin" ? "/admin/dashboard" : "/admin/orders");
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
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: "#faf7f2",
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        {/* Left: Instructions */}
        <Grid item xs={12} md={6} sx={{ p: 6, overflowY: "auto" }}>
          <Box sx={{ maxWidth: 500 }}>
            <FaceIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" gutterBottom>
              Face Login
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
              Use your face to securely log in to your account.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Instructions:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Face should be clearly visible inside the frame." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Look directly at the camera with proper lighting." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Avoid wearing face masks, sunglasses, or blocking face with hands." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Do not move too fast during capture." />
              </ListItem>
            </List>
          </Box>
        </Grid>

        {/* Right: Webcam + Buttons */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 400,
              height: 300,
              border: "3px solid #1976d2",
              borderRadius: 2,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              videoConstraints={{
                width: 400,
                height: 300,
                facingMode: "user",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleFaceLogin}
              disabled={loading}
            >
              {loading ? "Processing..." : "Login with Face"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Staff Login
            </Button>
          </Box>

          {loading && <CircularProgress sx={{ mt: 3 }} />}
        </Grid>

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
      </Grid>
    </Box>
  );
}
