// src/pages/Customers/Contact.jsx (With Square Map Image)
import React from "react";
import { Box, Container, Typography, Grid, Paper, Link, List, ListItem, ListItemIcon, ListItemText, } from "@mui/material";
import Base from "../../components/Base";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";

import mapImage from "../../assets/restaurant/map.jpg";
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/21+Samar+Ave,+Quezon+City,+Metro+Manila,+Philippines";

const contactDetails = [
  {
    icon: <LocationOnIcon color="primary" />,
    primary: "Address",
    secondary: "21 Samar Ave, South Triangle, Quezon City, Philippines",
  },
  {
    icon: <PhoneIcon color="primary" />,
    primary: "Phone",
    secondary: "0912 345 6789",
  },
  {
    icon: <EmailIcon color="primary" />,
    primary: "Email",
    secondary: "luksbygoodchoice@gmail.com",
  },
  {
    icon: <AccessTimeIcon color="primary" />,
    primary: "Operating Hours",
    secondary: "Open 24 Hours (Monday - Saturday) | Closed on Sundays",
  },
];

const Contact = () => {
  return (
    <Base>
      {/* Section 1: The Page Header */}
      <Box sx={{ bgcolor: "background.paper", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
            color="primary.main"
          >
            Get In Touch
          </Typography>
          <Typography variant="h5" color="text.secondary">
            We're always happy to hear from you. Here's how you can reach us.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4 }}>
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                  Contact Information
                </Typography>
                <List>
                  {contactDetails.map((item) => (
                    <ListItem key={item.primary} disablePadding sx={{ mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ fontWeight: "medium" }}
                        primary={item.primary}
                        secondary={item.secondary}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 3, pl: "40px" }}>
                  <Link
                    href="https://www.facebook.com/profile.php?id=61556375679543"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "text.primary",
                    }}
                  >
                    <FacebookIcon color="primary" sx={{ mr: 1 }} />
                    Follow us on Facebook
                  </Link>
                </Box>
              </Grid>

              {/*map*/}
              <Grid item xs={12} md={6}>
                <Link
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View location on Google Maps"
                >
                  <Box
                    component="img"
                    src={mapImage}
                    alt="Map location of Luk's by GoodChoice"
                    sx={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                      },
                    }}
                  />
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Base>
  );
};

export default Contact;
