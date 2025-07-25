// src/components/AdminComponents/Profile.jsx

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Grid, Button, Paper, CircularProgress, Alert, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Webcam from "react-webcam";
import { useNotification } from "../../context/Notifications";

const Profile = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFacialEnabled, setIsFacialEnabled] = useState(false);
  const { showNotification } = useNotification();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const webcamRef = useRef(null);
  const [faceStatus, setFaceStatus] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/users/profile/");
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to load profile data.");
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

  const handleAddFace = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot)
      return setFaceStatus("Face capture failed. Please try again.");

    try {
      await axiosInstance.post("/api/facial/upload_face/", {
        image: screenshot,
      });
      setFaceStatus("Face added successfully.");
    } catch (err) {
      setFaceStatus("Failed to add face.");
      console.error(err);
    }
  };

  const handleDeleteFace = async () => {
    try {
      await axiosInstance.delete("/api/facial/delete_face/");
      setFaceStatus("Face deleted successfully.");
    } catch (err) {
      setFaceStatus("Failed to delete face.");
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  fullWidth
                  value={profileData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  fullWidth
                  value={profileData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={profileData.email}
                  disabled
                />
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-start"
                gap={2}
                sx={{ mt: 2 }}
              >
                {isEditing ? (
                  <>
                    <Button variant="contained" onClick={handleSave}>
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
                  >
                    Edit Profile
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </Box>

            <Box
              sx={{ mt: 2, p: 2, border: "1px dashed grey", borderRadius: 1 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isFacialEnabled}
                    onChange={(e) => setIsFacialEnabled(e.target.checked)}
                  />
                }
                label="Enable Facial Recognition"
              />
              <Typography variant="caption" display="block">
                Enable login with your face
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Face Recognition
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => setOpenDialog(true)}
              >
                Edit Face Data
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Face Data Management</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
          />
          {faceStatus && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {faceStatus}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="success" onClick={handleAddFace}>
              Add Face
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteFace}>
              Delete Face
            </Button>
          </Box>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
