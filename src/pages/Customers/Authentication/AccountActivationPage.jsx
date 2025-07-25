// src/pages/Customers/Authentication/AccountActivationPage.jsx
import React, { useEffect } from "react";
import { Box, Container, Typography, Paper, CircularProgress, } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import Base from "../../../components/Base";

const AccountActivationPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axiosInstance.get(`/api/users/activate/${uid}/${token}/`);
        navigate("/login?activated=true");
      } catch (error) {
        console.error("Activation failed:", error);
        navigate("/login?error=activation_failed");
      }
    };

    if (uid && token) {
      activateAccount();
    }
  }, [uid, token, navigate]);

  return (
    <Base>
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 5, textAlign: "center" }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
            Activating Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Please wait a moment while we verify your account...
          </Typography>
          <Box sx={{ my: 3 }}>
            <CircularProgress size={60} />
          </Box>
        </Paper>
      </Container>
    </Base>
  );
};

export default AccountActivationPage;
