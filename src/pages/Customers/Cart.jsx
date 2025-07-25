// src/pages/Customers/Cart.jsx (Refactored)
import React, { useState } from "react";
import { Box, Typography, Container, Grid, Paper, Button, IconButton, Radio, RadioGroup, FormControlLabel, useMediaQuery, CircularProgress, Link, } from "@mui/material";
import { useCart } from "../../context/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Base from "../../components/Base";
import { useAuth } from "../../context/AuthContext";
import { colorTokens } from "../../theme";
import { useNotification } from "../../context/Notifications";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [diningOption, setDiningOption] = useState("dine-in");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { showNotification } = useNotification();

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      showNotification("Your cart is empty and cannot be submitted.");
      return;
    }

    if (!isAuthenticated) {
      showNotification("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const orderData = {
      dining_method: diningOption,
      items: items.map((item) => ({
        variation_id: item.variationId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axiosInstance.post(
        "/api/orders/create/",
        orderData
      );
      if (response.status === 201) {
        showNotification(
          "Order submitted successfully! You will be redirected to your orders page."
        );
        clearCart();
        navigate("/orders");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";

      if (errorMessage.toLowerCase().includes("not enough stock")) {
        showNotification(
          "Action failed: An item in your cart just went out of stock. Please review your cart and try again."
        );
      } else {
        showNotification(`Error: ${errorMessage}`);
      }

      setError(errorMessage);
      console.error("Failed to submit order:", error.response || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const EmptyCart = () => (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <ShoppingBasketOutlinedIcon
        sx={{ fontSize: "100px", color: "grey.300", mb: 2 }}
      />
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Your cart seems to be empty
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add items to get started
      </Typography>
      <Button
        component={RouterLink}
        to="/menu"
        variant="contained"
        size="large"
      >
        Browse Menu
      </Button>
    </Box>
  );

  return (
    <Base>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
          Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </Typography>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <Grid
            container
            spacing={4}
            direction={isMobile ? "column-reverse" : "row"}
          >
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((item) => (
                  <Paper
                    key={item.cartId}
                    elevation={2}
                    sx={{
                      display: "flex",
                      p: 2,
                      borderRadius: 3,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image || "/path/to/default/image.png"}
                      alt={item.name}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 2,
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.variantName}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", my: 1 }}
                      >
                        ₱{item.price.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <IconButton
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => removeFromCart(item.cartId)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteOutlineIcon color="error" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  position: "sticky",
                  top: "88px",
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  Order Summary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    ₱{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mt: 3, mb: 1, fontWeight: "medium" }}
                >
                  Select Dining Option:
                </Typography>
                <RadioGroup
                  row
                  value={diningOption}
                  onChange={(e) => setDiningOption(e.target.value)}
                >
                  <FormControlLabel
                    value="dine-in"
                    control={<Radio />}
                    label="Dine-In"
                  />
                  <FormControlLabel
                    value="take-out"
                    control={<Radio />}
                    label="Take-out"
                  />
                </RadioGroup>

                {error && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  size="large"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: "1.1rem",
                    bgcolor: colorTokens.red[500],
                    "&:hover": { bgcolor: "#c4001b" },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    "Submit Order"
                  )}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Base>
  );
};

export default Cart;
