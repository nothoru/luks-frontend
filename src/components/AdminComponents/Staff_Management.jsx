// src/components/AdminComponents/Staff_Management.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, TableFooter, TablePagination, } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useNotification } from "../../context/Notifications";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { showNotification } = useNotification();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/users/admin/staff/?page=${
        page + 1
      }&page_size=${rowsPerPage}`;
      const response = await axiosInstance.get(url);
      setStaffList(response.data.results);
      setTotalRows(response.data.count);
      setError(null);
    } catch (err) {
      setError("Failed to fetch staff data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDialogOpen = (staff = null) => {
    if (staff) {
      setIsEditing(true);
      setCurrentStaff({
        id: staff.id,
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
      });
    } else {
      setIsEditing(false);
      setCurrentStaff({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentStaff(null);
  };

  const handleInputChange = (e) => {
    setCurrentStaff({ ...currentStaff, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      !currentStaff.email ||
      !currentStaff.first_name ||
      !currentStaff.last_name
    ) {
      showNotification("Email and name fields are required.");
      return;
    }
    if (!isEditing && !currentStaff.password) {
      showNotification("Password is required for new staff members.");
      return;
    }

    try {
      if (isEditing) {
        await axiosInstance.patch(
          `/api/users/admin/staff/${currentStaff.id}/`,
          {
            email: currentStaff.email,
            first_name: currentStaff.first_name,
            last_name: currentStaff.last_name,
          }
        );
      } else {
        await axiosInstance.post("/api/users/admin/staff/", currentStaff);
      }
      fetchStaff();
      handleDialogClose();
    } catch (err) {
      showNotification(
        "Error saving staff member: " +
          (err.response?.data?.email ||
            err.response?.data?.password ||
            err.message)
      );
      console.error(err);
    }
  };

  const handleDelete = (staffId) => {
    setStaffIdToDelete(staffId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/users/admin/staff/${staffIdToDelete}/`);
      fetchStaff();
      showNotification("Staff member deleted.", "success");
    } catch (err) {
      showNotification("Error deleting staff member.", "error");
      console.error(err);
    } finally {
      setDeleteConfirmOpen(false);
      setStaffIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setStaffIdToDelete(null);
  };

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
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold">
          Staff Management
        </Typography>
        <Button variant="contained" onClick={() => handleDialogOpen()}>
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    {staff.first_name} {staff.last_name}
                  </TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {staff.role}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDialogOpen(staff)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(staff.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
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

      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this staff member? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {currentStaff && (
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              name="first_name"
              fullWidth
              value={currentStaff.first_name || ""}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="last_name"
              fullWidth
              value={currentStaff.last_name || ""}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={currentStaff.email || ""}
              onChange={handleInputChange}
            />

            {!isEditing && (
              <TextField
                margin="dense"
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={currentStaff.password || ""}
                onChange={handleInputChange}
                helperText="Staff can change this later."
              />
            )}

            {!isEditing && (
              <Alert severity="info" sx={{ mt: 2 }}>
                An activation link will be sent to the staff member's email.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default StaffManagement;
