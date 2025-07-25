// src/components/Footer.jsx (Corrected with Address)
import React from "react";
import { Typography, Box, Grid, Container, Link, IconButton, } from "@mui/material";
import { Facebook, Phone, Email, LocationOn } from "@mui/icons-material"; // <-- 1. IMPORT LocationOn ICON
import { Link as RouterLink } from "react-router-dom";
import { colorTokens } from "../theme";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colorTokens.grey[700],
        color: colorTokens.grey[200],
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Column 1: Brand & Slogan */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "white",
                textDecoration: "none",
              }}
            >
              Luk's by GoodChoice
            </Typography>
            <Typography variant="body2">
              The true taste of Batangas comfort food, served with heart. Your
              stop for authentic Lomi, Silog, and more.
            </Typography>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Explore
            </Typography>
            <Link
              component={RouterLink}
              to="/menu"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              Menu
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              Contact
            </Link>
            <Link
              component={RouterLink}
              to="/faq"
              color="inherit"
              display="block"
              sx={{
                mb: 1,
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              FAQ
            </Link>
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Get In Touch
            </Typography>

            {/* --- 2. ADD THIS NEW ADDRESS BLOCK --- */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <LocationOn sx={{ mr: 1.5, mt: 0.5, fontSize: "1.2rem" }} />
              <Typography variant="body2">
                21 Samar Ave, South Triangle, Quezon City, Philippines
              </Typography>
            </Box>
            {/* --- END OF NEW BLOCK --- */}

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1.5, fontSize: "1.2rem" }} />
              <Typography variant="body2">0912 345 6789</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Email sx={{ mr: 1.5, fontSize: "1.2rem" }} />
              <Typography variant="body2">
                luksbygoodchoice@gmail.com
              </Typography>
            </Box>
            <IconButton
              href="https://www.facebook.com/profile.php?id=61556375679543"
              target="_blank"
              aria-label="Facebook"
              sx={{
                color: colorTokens.grey[700],
                bgcolor: "white",
                "&:hover": { bgcolor: colorTokens.grey[300] },
              }}
            >
              <Facebook />
            </IconButton>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            pt: 3,
            mt: 4,
            borderTop: `1px solid ${colorTokens.grey[600]}`,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Luk’s by GoodChoice. All Rights
            Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
