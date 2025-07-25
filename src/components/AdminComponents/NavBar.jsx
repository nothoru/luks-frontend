// src/components/AdminComponents/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, useTheme, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate("/admin/profile");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}
          >
            <Typography variant="body2">
              {currentTime.toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar alt={user?.first_name || "Admin"} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            sx={{ mt: "45px" }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
