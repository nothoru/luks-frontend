// src/components/customer/OurValues.jsx
import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";

const valuesData = [
  {
    icon: <FavoriteBorderIcon color="primary" sx={{ fontSize: 40 }} />,
    title: "Made with Love",
    description:
      "Every dish is prepared with the same care and attention we give to our own family meals.",
  },
  {
    icon: <SpaOutlinedIcon color="primary" sx={{ fontSize: 40 }} />,
    title: "Fresh & Local",
    description:
      "We believe in quality you can taste, which is why we source our ingredients fresh daily.",
  },
  {
    icon: <AccessAlarmOutlinedIcon color="primary" sx={{ fontSize: 40 }} />,
    title: "Always Open for You",
    description:
      "Craving comfort food at 3 AM? We've got you covered. We're here for you 24 hours, 6 days a week.",
  },
];

const OurValues = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{ textAlign: "center", mb: 6, fontWeight: 600 }}
        >
          Our Promise to You
        </Typography>
        <Grid container spacing={4}>
          {valuesData.map((value) => (
            <Grid item xs={12} md={4} key={value.title}>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ mb: 2 }}>{value.icon}</Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {value.title}
                </Typography>
                <Typography color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OurValues;
