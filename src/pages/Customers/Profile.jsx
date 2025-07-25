// src/pages/Customers/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  // --- NEW: Imports for Dialog ---
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Base from "../../components/Base";
import axiosInstance from "../../api/axiosInstance";
import { useNotification } from "../../context/Notifications";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { showNotification } = useNotification();
  // --- NEW: State for Change Password Dialog ---
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  // --- END NEW ---

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/users/profile/");
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to load your profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.patch("/api/users/profile/", {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      });
      showNotification("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };

  // --- NEW: Handlers for Change Password ---
  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordData({
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    try {
      await axiosInstance.put("/api/users/change-password/", passwordData);
      setPasswordSuccess("Password updated successfully!");
      setTimeout(handlePasswordDialogClose, 2000);
    } catch (err) {
      const apiError = err.response?.data;
      if (apiError) {
        const messages = Object.values(apiError).flat().join(" ");
        setPasswordError(messages || "Failed to update password.");
      } else {
        setPasswordError("An unexpected error occurred.");
      }
      console.error(err);
    }
  };
  // --- END NEW ---

  if (loading)
    return (
      <Base>
        <Container sx={{ py: 5, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      </Base>
    );
  if (error)
    return (
      <Base>
        <Container sx={{ py: 5 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Base>
    );

  return (
    <Base>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          My Profile
        </Typography>
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={profileData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={profileData.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        bgcolor: "#e4002b",
                        "&:hover": { bgcolor: "#c4001b" },
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      bgcolor: "#e4002b",
                      "&:hover": { bgcolor: "#c4001b" },
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
                {/* --- NEW: Change Password Button --- */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* --- NEW: Change Password Dialog --- */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            name="old_password"
            type="password"
            fullWidth
            value={passwordData.old_password}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            label="New Password"
            name="new_password"
            type="password"
            fullWidth
            value={passwordData.new_password}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            name="confirm_new_password"
            type="password"
            fullWidth
            value={passwordData.confirm_new_password}
            onChange={handlePasswordInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Cancel</Button>
          <Button onClick={handlePasswordSave} variant="contained">
            Save Password
          </Button>
        </DialogActions>
      </Dialog>
    </Base>
  );
};

export default Profile;
