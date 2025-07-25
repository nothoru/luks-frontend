// src/components/customer/Specialties.jsx
import React from "react";
import { Box, Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, Button, } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const specialtiesData = [
  {
    name: "Batangas Lomi",
    description: "Masarap sarap na lomi",
    image:
      "https://www.foodies.ph/_recipeimage/236943/pancit-lomi-1-2x-1124.jpeg",
  },
  {
    name: "Sizzling Sisig",
    description: "Sisig na nag sisizzling",
    image:
      "https://pilipinasrecipes.com/wp-content/uploads/2018/01/Sizzling-Pork-Sisig.jpg",
  },
  {
    name: "Goto Batangas",
    description: "Maasim asim na goto.",
    image:
      "https://kusinasecrets.com/wp-content/uploads/2024/12/u3317447599_httpss.mj_.runHaNCgvTONCs_top_down_view_of_A_steam_ead4b2fe-d36e-4993-b50f-18b2fbf60d88_3.jpg",
  },
];

const Specialties = () => {
  return (
    <Box sx={{ py: 8, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{ textAlign: "center", mb: 6, fontWeight: 600 }}
        >
          Our Specialties
        </Typography>

        <Grid container spacing={4}>
          {specialtiesData.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish.name}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea component={RouterLink} to="/menu">
                  <CardMedia
                    component="img"
                    height="240"
                    image={dish.image}
                    alt={dish.name}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {dish.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {dish.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            component={RouterLink}
            to="/menu"
            variant="outlined"
            color="primary"
            size="large"
          >
            Explore The Full Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Specialties;
