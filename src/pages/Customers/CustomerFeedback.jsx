// src/pages/Customers/CustomerFeedback.jsx (Refactored)
import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, Alert, Paper, } from "@mui/material";
import Base from "../../components/Base";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { colorTokens } from "../../theme";
import { useNotification } from "../../context/Notifications";

const CustomerFeedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(false);

    if (!isAuthenticated) {
      setError("Please log in to submit your feedback.");
      showNotification("You must be logged in to leave feedback.");
      return;
    }

    if (!feedbackText.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/feedback/submit/", {
        comment: feedbackText,
      });

      if (response.status === 201) {
        setIsSubmitted(true);
        setFeedbackText("");
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      setError("Failed to submit feedback. Please try again later.");
      console.error("Feedback submission error:", err);
    }
  };

  return (
    <Base>
      <Box sx={{ bgcolor: "background.paper", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Leave Feedback
          </Typography>
          <Typography variant="h5" color="text.secondary">
            We value your opinion! Let us know how we're doing.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>
          )}
          {isSubmitted && (
            <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
              Thank you for your feedback!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Your Feedback"
              variant="outlined"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1.1rem",
                bgcolor: colorTokens.red[500],
                "&:hover": {
                  bgcolor: "#c4001b",
                },
              }}
            >
              Submit Feedback
            </Button>
          </form>
        </Paper>
      </Container>
    </Base>
  );
};

export default CustomerFeedback;
