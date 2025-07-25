// src/components/Base/index.jsx (Reminder)

import PropTypes from "prop-types";
import { Box, Toolbar } from "@mui/material"; // Make sure Toolbar is imported
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function Base({ children, showFooter = true }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
}

Base.propTypes = {
  children: PropTypes.node.isRequired,
  showFooter: PropTypes.bool,
};

Base.defaultProps = {
  showFooter: true,
};
