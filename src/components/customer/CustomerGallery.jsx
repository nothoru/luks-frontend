// src/components/customer/CustomerGallery.jsx
import React from "react";
import Slider from "react-slick";
import { Box, Container, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import customer1 from "../../assets/customers/customer1.jpg";
import customer2 from "../../assets/customers/customer2.jpg";
import customer3 from "../../assets/customers/customer3.jpg";
import customer4 from "../../assets/customers/customer4.jpg";
import customer5 from "../../assets/customers/customer5.jpg";
import customer6 from "../../assets/customers/customer6.jpg";

const customerImages = [
  customer1,
  customer2,
  customer3,
  customer4,
  customer5,
  customer6,
];

const arrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  bgcolor: "white",
  color: "black",
  boxShadow: 3,
  "&:hover": {
    bgcolor: "grey.200",
  },
  display: { xs: "none", md: "inline-flex" },
};

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton onClick={onClick} sx={{ ...arrowStyles, right: -20 }}>
      <ArrowForwardIosIcon />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton onClick={onClick} sx={{ ...arrowStyles, left: -20 }}>
      <ArrowBackIosNewIcon />
    </IconButton>
  );
}

const CustomerGallery = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ py: 8, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 600 }}>
            Certified Ka-Luks!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: "600px", mx: "auto" }}
          >
            We love our community! Here are some of the happy faces we've had
            the pleasure of serving.
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 0, md: 5 } }}>
          <Slider {...settings}>
            {customerImages.map((image, index) => (
              <Box key={index} sx={{ p: 1.5 }}>
                <Box
                  component="img"
                  src={image}
                  alt={`Customer photo ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerGallery;
