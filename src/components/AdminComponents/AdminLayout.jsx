// src/components/AdminComponents/AdminLayout.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* The old Navbar component is now completely removed from the layout */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;