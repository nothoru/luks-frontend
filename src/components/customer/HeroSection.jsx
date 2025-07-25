// src/components/customer/HeroSection.jsx (New Layered Design)
import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import heroBackground from "../../assets/restaurant/Heading.png";
import lomiImage from "../../assets/restaurant/lomi.png";

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "70vh", md: "90vh" },
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "50%" },
            py: { xs: 6, md: 0 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h6"
            color="primary.main"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            The True Taste of Batangas
          </Typography>

          <Typography
            component="h1"
            sx={{
              my: 2,
              fontWeight: 900,
              fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem" },
              lineHeight: 1.1,
            }}
          >
            ITS LUKS-ING TIME!
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
          >
            Tara mga ka-luks! Your favorite comfort food, ready when you are.
          </Typography>

          <Button
            component={RouterLink}
            to="/menu"
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, px: 5, fontSize: "1.1rem", borderRadius: "12px" }}
          >
            Start Your Order
          </Button>
        </Box>
      </Container>

      <Box
        component="img"
        src={lomiImage}
        alt="Authentic Batangas Lomi"
        sx={{
          position: "absolute",
          display: { xs: "none", md: "block" },
          width: { md: "48%", lg: "42%" },
          top: "50%",
          right: "5%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default HeroSection;
