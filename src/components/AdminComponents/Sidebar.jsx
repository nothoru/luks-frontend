// src/components/AdminComponents/Sidebar.jsx
import React, { useState } from "react";
import { Box, Drawer, List, Typography, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, useTheme, Avatar, Collapse, } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GridView, ReceiptLong, BarChart, Restaurant, RateReview, MenuBook, Group, ChevronLeft, ChevronRight, Logout, ExpandLess, ExpandMore, Insights, Summarize, } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;
const collapsedDrawerWidth = 80;

const menuItems = [
  { text: "Dashboard", icon: <GridView />, path: "/admin/dashboard" },
  { text: "Orders", icon: <ReceiptLong />, path: "/admin/orders" },
  {
    text: "Sales Insights",
    icon: <BarChart />,
    subItems: [
      { text: "Sales Reports", icon: <Summarize />, path: "/admin/sales" },
      {
        text: "Business Insights",
        icon: <Insights />,
        path: "/admin/sales-recommendation",
      },
    ],
  },
  { text: "POS", icon: <Restaurant />, path: "/admin/menu_order" },
  { text: "Feedback", icon: <RateReview />, path: "/admin/feedback" },
  { text: "Menu", icon: <MenuBook />, path: "/admin/menu_management" },
  { text: "Staff", icon: <Group />, path: "/admin/staff_management" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const theme = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [salesOpen, setSalesOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSalesClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSalesOpen(!salesOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : collapsedDrawerWidth,
          overflowX: "hidden",
          boxSizing: "border-box",
          bgcolor: "#1F2A40",
          color: "#e0e0e0",
          borderRight: "none",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            px: 2.5,
            py: 2,
          }}
        >
          {isOpen && (
            <Typography variant="h6" fontWeight="bold" color="#FFA726">
              LUK'S ADMIN
            </Typography>
          )}
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{ color: "#e0e0e0" }}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />

        <List sx={{ flexGrow: 1, p: 1 }}>
          {menuItems.map((item) => {
            if (item.subItems) {
              const isSalesActive = item.subItems.some(
                (sub) => location.pathname === sub.path
              );
              return (
                <React.Fragment key={item.text}>
                  <ListItemButton
                    onClick={handleSalesClick}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      borderRadius: "8px",
                      mb: 0.5,
                      backgroundColor:
                        isSalesActive && !isOpen ? "#FFA726" : "transparent",
                      "&:hover": { backgroundColor: "rgba(255, 167, 38, 0.1)" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isOpen ? 3 : "auto",
                        justifyContent: "center",
                        color: isSalesActive && !isOpen ? "#1F2A40" : "#e0e0e0",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: isOpen ? 1 : 0 }}
                    />
                    {isOpen && (salesOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                  <Collapse
                    in={salesOpen && isOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.text}
                          component={Link}
                          to={subItem.path}
                          selected={location.pathname === subItem.path}
                          sx={{
                            pl: 4,
                            "&:hover": {
                              backgroundColor: "rgba(255, 167, 38, 0.1)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#FFA726",
                              color: "#1F2A40",
                              fontWeight: "bold",
                              "& .MuiListItemIcon-root": { color: "#1F2A40" },
                              "&:hover": { backgroundColor: "#FB8C00" },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 3,
                              justifyContent: "center",
                              color: "#e0e0e0",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    mb: 0.5,
                    "&:hover": { backgroundColor: "rgba(255, 167, 38, 0.1)" },
                    "&.Mui-selected": {
                      backgroundColor: "#FFA726",
                      color: "#1F2A40",
                      fontWeight: "bold",
                      "& .MuiListItemIcon-root": { color: "#1F2A40" },
                      "&:hover": { backgroundColor: "#FB8C00" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : "auto",
                      justifyContent: "center",
                      color: "#e0e0e0",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* User Profile & Logout Section */}
        <Box>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />
          <ListItemButton
            onClick={() => navigate("/admin/profile")}
            sx={{
              minHeight: 48,
              justifyContent: isOpen ? "initial" : "center",
              px: 2.5,
              py: 1.5,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt={user?.first_name || "User"}
              />
            </ListItemIcon>
            {isOpen && (
              <Box>
                <ListItemText
                  primary={`${user?.first_name || "Admin"} ${
                    user?.last_name || ""
                  }`}
                  sx={{ opacity: isOpen ? 1 : 0 }}
                />
                <Typography
                  variant="caption"
                  color="grey.400"
                  sx={{ display: "block" }}
                >
                  {user?.role}
                </Typography>
              </Box>
            )}
          </ListItemButton>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? "initial" : "center",
                px: 2.5,
                "&:hover": { backgroundColor: "rgba(229, 57, 53, 0.2)" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "#e0e0e0",
                }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: isOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
