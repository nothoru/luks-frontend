// src/components/AdminComponents/Feedback.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  TableFooter,
  TablePagination,
  Grid,
} from "@mui/material";
import {
  SentimentSatisfiedAlt,
  SentimentNeutral,
  SentimentDissatisfied,
  Close,
  RateReview,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

// --- Helper Components ---

const getSentimentIcon = (label) => {
  switch (label) {
    case "positive":
      return <SentimentSatisfiedAlt color="success" />;
    case "neutral":
      return <SentimentNeutral color="warning" />;
    case "negative":
      return <SentimentDissatisfied color="error" />;
    default:
      return <SentimentNeutral color="disabled" />;
  }
};

const FeedbackStatCard = ({ title, count, icon, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      borderLeft: `5px solid ${color}`,
    }}
  >
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {count}
      </Typography>
    </Box>
    <Box sx={{ color: color, opacity: 0.8 }}>{icon}</Box>
  </Paper>
);

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const listUrl = `/api/feedback/admin/all/?page=${
        page + 1
      }&page_size=${rowsPerPage}`;
      const listRes = await axiosInstance.get(listUrl);
      setFeedbacks(listRes.data.results);
      setTotalRows(listRes.data.count);

      const statsRes = await axiosInstance.get("/api/feedback/admin/stats/");
      setStats(statsRes.data);

      setError(null);
    } catch (err) {
      setError("Failed to fetch feedback data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Customer Feedback
      </Typography>

      {/* --- NEW: Summary Cards --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FeedbackStatCard
            title="Total Feedback"
            count={stats.total}
            icon={<RateReview fontSize="large" />}
            color="#1976d2" // Blue
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeedbackStatCard
            title="Positive"
            count={stats.positive}
            icon={<SentimentSatisfiedAlt fontSize="large" />}
            color="#2e7d32" // Green
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeedbackStatCard
            title="Neutral"
            count={stats.neutral}
            icon={<SentimentNeutral fontSize="large" />}
            color="#ed6c02" // Orange
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeedbackStatCard
            title="Negative"
            count={stats.negative}
            icon={<SentimentDissatisfied fontSize="large" />}
            color="#d32f2f" // Red
          />
        </Grid>
      </Grid>

      {/* --- Table Section --- */}
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sentiment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <TableRow
                  key={feedback.id}
                  onClick={() => setSelectedFeedback(feedback)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "grey.200" },
                  }}
                >
                  <TableCell>{feedback.id}</TableCell>
                  <TableCell>
                    {feedback.user.first_name} {feedback.user.last_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {feedback.comment}
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {getSentimentIcon(feedback.sentiment_label)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No feedback found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={5}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* --- Dialog for Details --- */}
      <Dialog
        open={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Feedback from {selectedFeedback?.user?.first_name}
          <IconButton
            onClick={() => setSelectedFeedback(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedFeedback && (
            <Box>
              <Typography variant="subtitle1">
                <strong>Customer:</strong> {selectedFeedback.user.first_name}{" "}
                {selectedFeedback.user.last_name} ({selectedFeedback.user.email}
                )
              </Typography>
              <Typography variant="subtitle1" mt={1}>
                <strong>Date:</strong>{" "}
                {new Date(selectedFeedback.created_at).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" mt={1} gap={1}>
                <strong>Sentiment:</strong>
                {getSentimentIcon(selectedFeedback.sentiment_label)}
                <Typography textTransform="capitalize">
                  {selectedFeedback.sentiment_label}
                </Typography>
              </Box>
              <Typography variant="h6" mt={2}>
                Comment:
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                {selectedFeedback.comment}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFeedback(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feedback;
