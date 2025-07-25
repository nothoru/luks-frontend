// src/components/AdminComponents/SalesRecommendation.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, CircularProgress, Alert, Chip, Stack, Divider, } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import ReactMarkdown from "react-markdown";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNotification } from "../../context/Notifications";

const SalesRecommendation = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Manages loading for the whole component
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();


  // We only need one function to get the latest state from the backend.
  const fetchLatestRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/api/analytics/recommendation/"
      );
      setReport(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // This is a normal state if no report is generated yet.
        setReport(null);
      } else {
        setError("An error occurred while fetching the recommendation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRecommendation();
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axiosInstance.patch("/api/analytics/recommendation/", {
        report_id: report.id,
        status: newStatus,
      });
      // After updating, just refetch to get the latest state
      fetchLatestRecommendation();
    } catch (err) {
      showNotification("Failed to update status.");
    }
  };

  const getStatusChipColor = (status) => {
    if (status === "implemented") return "success";
    if (status === "dismissed") return "error";
    return "warning";
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" fontWeight="bold">
          Business Insights
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          This tool analyzes your latest weekly sales data to provide actionable
          recommendations, helping you identify trends and opportunities for
          growth.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* --- THE CORE LOGIC CHANGE --- */}
        {/* If a report exists AND it has been viewed, show the details. */}
        {report && report.is_viewed ? (
          <Box>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
              mb={2}
            >
              <Typography variant="overline" color="text.secondary">
                Report for week:{" "}
                {new Date(report.start_date + "T00:00:00").toLocaleDateString()}{" "}
                to{" "}
                {new Date(report.end_date + "T00:00:00").toLocaleDateString()}
              </Typography>
              <Chip
                label={report.recommendation_status_display}
                color={getStatusChipColor(report.recommendation_status)}
              />
            </Box>

            <Box
              className="markdown-content"
              sx={{
                "& h2": { mt: 3, mb: 1 },
                "& li": { mb: 0.5 },
                lineHeight: 1.7,
              }}
            >
              <ReactMarkdown>{report.recommendation}</ReactMarkdown>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleStatusUpdate("implemented")}
                disabled={report.recommendation_status === "implemented"}
                fullWidth={{ xs: true, sm: false }}
              >
                Implemented
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleStatusUpdate("dismissed")}
                disabled={report.recommendation_status === "dismissed"}
                fullWidth={{ xs: true, sm: false }}
              >
                Dismiss
              </Button>
            </Stack>
          </Box>
        ) : (
          // Otherwise (no report OR report is not viewed yet), show the button.
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {report
                ? "A new weekly insight is ready for you!"
                : "No new recommendation is available yet."}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={fetchLatestRecommendation} // The button now just fetches/unlocks
              disabled={!report} // Disable if no report exists
            >
              Show Latest Recommendation
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SalesRecommendation;
