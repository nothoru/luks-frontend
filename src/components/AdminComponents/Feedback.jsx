// src/components/AdminComponents/Feedback.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, TableFooter, TablePagination, } from "@mui/material";
import { SentimentSatisfiedAlt, SentimentNeutral, SentimentDissatisfied, Close, } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

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

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/feedback/admin/all/?page=${page + 1}&page_size=${rowsPerPage}`;
      const response = await axiosInstance.get(url);
      setFeedbacks(response.data.results);
      setTotalRows(response.data.count);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h4" fontWeight="bold">
          Feedback
        </Typography>
      </Box>

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
                  sx={{ cursor: "pointer", "&:hover": { bgcolor: "grey.200" } }}
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