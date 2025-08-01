// src/pages/Customers/Menu.jsx (New Compact Version)
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Container,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  AppBar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductModal from "../../components/ProductModal";
import Base from "../../components/Base";

const MenuCard = ({ item, onProductClick }) => {
  const isUnavailable = !item.is_available || item.is_fully_out_of_stock;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
        position: "relative",
        opacity: isUnavailable ? 0.5 : 1,
        cursor: isUnavailable ? "not-allowed" : "pointer",
      }}
      onClick={() => !isUnavailable && onProductClick(item)}
    >
      {isUnavailable && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            borderRadius: 2,
          }}
        >
          <Typography sx={{ color: "text.primary", fontWeight: "bold" }}>
            Out of Stock
          </Typography>
        </Box>
      )}
      <CardMedia
        component="img"
        sx={{ height: 160, objectFit: "cover" }}
        image={
          `${import.meta.env.VITE_API_BASE_URL}${item.image}` ||
          "/path/to/default/image.png"
        }
        alt={item.name}
      />
      <CardContent
        sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1rem", flexGrow: 1 }}
        >
          {item.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ fontWeight: "bold" }}
          >
            {item.variations && item.variations.length > 0
              ? `₱${parseFloat(item.variations[0].price).toFixed(2)}`
              : "N/A"}
          </Typography>
          <IconButton
            size="medium"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            disabled={isUnavailable}
          >
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, categoryResponse] = await Promise.all([
          axiosInstance.get("/api/menu/items/"),
          axiosInstance.get("/api/menu/categories/"),
        ]);
        setMenuItems(menuResponse.data);
        setCategories(categoryResponse.data);
        categoryRefs.current = categoryResponse.data.map(() =>
          React.createRef()
        );
        setError(null);
      } catch (err) {
        setError("Failed to load menu. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event, newIndex) => {
    setSelectedCategory(newIndex);
    categoryRefs.current[newIndex]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  return (
    <Base showFooter={false}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <AppBar
              position="sticky"
              elevation={1}
              sx={{
                top: 64,
                bgcolor: "background.paper",
                zIndex: 10,
              }}
            >
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="menu categories"
                sx={{
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
                  "& .Mui-selected": { color: "primary.main" },
                  "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
                }}
              >
                {categories.map((category, index) => (
                  <Tab key={category.id} label={category.name} />
                ))}
              </Tabs>
            </AppBar>

            <Box sx={{ pt: 4 }}>
              {categories.map((category, index) => (
                <Box
                  key={category.id}
                  ref={categoryRefs.current[index]}
                  sx={{ mb: 5 }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    {category.name}
                  </Typography>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {menuItems
                      .filter((item) => item.category.name === category.name)
                      .map((item) => (
                        <Grid item xs={6} sm={4} md={3} key={item.id}>
                          <MenuCard
                            item={item}
                            onProductClick={handleProductClick}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>

      {selectedProduct && (
        <ProductModal
          open={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </Base>
  );
};

export default Menu;
