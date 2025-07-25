// src/components/customer/HowItWorks.jsx
import React from "react";
import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const stepsData = [
  {
    icon: <MenuBookIcon sx={{ fontSize: 40 }} color="primary" />,
    title: "1. Build Your Order",
    description:
      "Browse our menu online and add your favorite items to the cart. Take your time, no rush!",
  },
  {
    icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} color="primary" />,
    title: "2. Get Your Ticket",
    description:
      "Submit your order to get your unique order number. IMPORTANT: No payment is needed online.",
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 40 }} color="primary" />,
    title: "3. Pay At The Counter",
    description:
      "Visit us at the restaurant. Show your order number to the cashier to pay and confirm your order.",
  },
  {
    icon: <FastfoodIcon sx={{ fontSize: 40 }} color="primary" />,
    title: "4. Pick Up & Enjoy!",
    description:
      "We’ll prepare your food fresh. Listen for your number, pick up your meal, and enjoy!",
  },
];

const HowItWorks = () => {
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{ textAlign: "center", mb: 6, fontWeight: 600 }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {stepsData.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ mb: 2 }}>{step.icon}</Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
