// src/components/customer/FinalCTA.jsx
import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const FinalCTA = () => {
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "primary.main",
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Ready to Eat?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, maxWidth: "600px", mx: "auto", opacity: 0.9 }}
          >
            Browse our full menu to find your next favorite meal. Your order
            will be ready for you to pay and pick up at the counter.
          </Typography>
          <Button
            component={RouterLink}
            to="/menu"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              px: 6,
              fontSize: "1.1rem",
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            View Full Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FinalCTA;
