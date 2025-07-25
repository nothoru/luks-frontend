// src/components/Navbar.jsx (New "Sticky" Version)
import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Collapse, Button, Badge, Menu, MenuItem, useTheme, } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, AccountCircle, } from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { title: "About Us", path: "/about" },
  { title: "Menu", path: "/menu" },
  { title: "Contact", path: "/contact" },
  { title: "Feedback", path: "/feedback" },
  { title: "FAQ", path: "/faq" }, // <-- ADD THIS LINE
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate("/");
  };

  const isCustomer = isAuthenticated && user?.role === "customer";

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          Luk's by GoodChoice
        </Typography>

        {/* Desktop Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Badge badgeContent={totalItems} color="error">
            <IconButton
              component={Link}
              to="/cart"
              sx={{ color: "text.primary" }}
            >
              <ShoppingCart />
            </IconButton>
          </Badge>

          {isCustomer ? (
            <>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{ color: "text.primary", p: 0 }}
              >
                <AccountCircle sx={{ fontSize: "2rem" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleUserMenuClose();
                    navigate("/profile");
                  }}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleUserMenuClose();
                    navigate("/orders");
                  }}
                >
                  My Orders
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              disableElevation
            >
              LOGIN
            </Button>
          )}
        </Box>

        <IconButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          sx={{ display: { xs: "block", md: "none" }, color: "inherit" }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Collapsible Menu */}
      <Collapse in={mobileMenuOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            bgcolor: "background.paper",
            color: "text.primary",
            p: 2,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{ color: "inherit", justifyContent: "flex-start" }}
            >
              {item.title}
            </Button>
          ))}
          <Button
            component={Link}
            to="/cart"
            sx={{ color: "inherit", justifyContent: "flex-start" }}
          >
            🛒 Cart ({totalItems})
          </Button>
          {isCustomer ? (
            <>
              <Button
                component={Link}
                to="/profile"
                sx={{ color: "inherit", justifyContent: "flex-start" }}
              >
                My Profile
              </Button>
              <Button
                component={Link}
                to="/orders"
                sx={{ color: "inherit", justifyContent: "flex-start" }}
              >
                My Orders
              </Button>
              <Button
                onClick={handleLogout}
                sx={{ color: "inherit", justifyContent: "flex-start" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{ color: "inherit", justifyContent: "flex-start" }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Collapse>
    </AppBar>
  );
};

export default Navbar;
