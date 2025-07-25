// src/pages/Customers/About.jsx
import React from "react";
import { Box, Container, Typography, Grid, Button, Paper } from "@mui/material";
import Base from "../../components/Base";
import luksbg from "../../assets/restaurant/luksbg.jpg";
import OurValues from "../../components/customer/OurValues";
import { Link as RouterLink } from "react-router-dom";
import SignatureDishes from "../../components/customer/SignatureDishes";
import { colorTokens } from "../../theme";

const TEAM_PHOTO_URL = luksbg;

const About = () => {
  return (
    <Base>
      <Box
        sx={{
          bgcolor: colorTokens.grey[700],
          color: "white",
          py: 8,
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
            color="primary.main"
          >
            Our Story
          </Typography>
          <Typography variant="h5" color="#ED3649">
            Discover the family, passion and tradition in every dish we serve.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 10, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Box
            component="img"
            src={TEAM_PHOTO_URL}
            alt="The Luk's by GoodChoice Team"
            sx={{
              width: "100%",
              maxWidth: "900px",
              mx: "auto",
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              mb: 5,
            }}
          />

          <Box sx={{ maxWidth: "800px", mx: "auto" }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 600, mb: 3 }}
            >
              More Than Just a Meal
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                mb: 2,
                textAlign: "left",
              }}
            >
              Luk's by GoodChoice started with a simple dream: to share the
              authentic, comforting flavors of our hometown with the community
              we love. We believe that food is about more than just taste—it's
              about memory, comfort, and the joy of sharing.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8, textAlign: "left" }}
            >
              From our signature Batangas Lomi to our sizzling Sisig, every dish
              is prepared with care, using fresh, locally-sourced ingredients.
              We're a family-run business, and when you dine with us, you become
              part of our family. Thank you for being a part of our story.
            </Typography>
          </Box>
        </Container>
      </Box>

      <SignatureDishes />
      <OurValues />

      <Box sx={{ py: 8, bgcolor: "background.paper", textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Come and Say Hi!
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            size="large"
            color="primary"
          >
            Find Our Location
          </Button>
        </Container>
      </Box>
    </Base>
  );
};

export default About;
