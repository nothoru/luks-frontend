// src/components/customer/SignatureDishes.jsx (With Sized Images & Smaller Container)
import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const dishes = [
  {
    name: "Lomi Batangas",
    description:
      "Our pride and joy. A thick, hearty noodle soup made from a traditional family recipe, brimming with rich flavors and generous toppings. It's the ultimate comfort in a bowl.",
    image:
      "https://www.foodies.ph/_recipeimage/236943/pancit-lomi-1-2x-1124.jpeg",
  },
  {
    name: "Gotong Batangas",
    description:
      "Not your ordinary porridge. This is a savory, rich beef innard soup that captures the authentic and bold taste of Batangas cuisine. A true local delicacy.",
    image:
      "https://kusinasecrets.com/wp-content/uploads/2024/12/u3317447599_httpss.mj_.runHaNCgvTONCs_top_down_view_of_A_steam_ead4b2fe-d36e-4993-b50f-18b2fbf60d88_3.jpg",
  },
];

const SignatureDishes = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="md">
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "background.default",
            border: "2px solid",
            borderColor: "primary.light",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: "center", mb: 6, fontWeight: 600 }}
          >
            Our Specialties
          </Typography>

          {dishes.map((dish, index) => (
            <Grid
              container
              spacing={{ xs: 3, md: 6 }}
              alignItems="center"
              key={dish.name}
              sx={{ mb: index === dishes.length - 1 ? 0 : 6 }}
              direction={index % 2 === 0 ? "row" : "row-reverse"}
            >
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={dish.image}
                  alt={dish.name}
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 300 },
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  {dish.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
                >
                  {dish.description}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SignatureDishes;
