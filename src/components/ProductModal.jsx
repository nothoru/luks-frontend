// src/components/ProductModal.jsx (Corrected Price Alignment with Custom Component)
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Radio,
  ButtonGroup,
  DialogActions,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/Notifications";

const ProductModal = ({ open, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const firstAvailableVariant = product.variations?.find(
        (v) => v.is_available && v.stock_level > 0
      );
      setSelectedVariant(firstAvailableVariant || null);
    }
  }, [product]);

  if (!product) return null;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showNotification("Please select an available option.");
      return;
    }
    const cartId = `${product.id}-${selectedVariant.id}`;
    const cartItem = {
      cartId: cartId,
      productId: product.id,
      variationId: selectedVariant.id,
      name: product.name,
      variantName: selectedVariant.size_name,
      price: currentPrice,
      quantity: quantity,
      image: `${import.meta.env.VITE_API_BASE_URL}${product.image}`,
      totalPrice: totalPrice,
    };
    addToCart(cartItem);
    onClose();
  };

  const isAddToCartDisabled = !selectedVariant;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 1,
          color: "grey.500",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box
          component="img"
          src={
            `${import.meta.env.VITE_API_BASE_URL}${product.image}` ||
            "/path/to/default/image.png"
          }
          alt={product.name}
          sx={{
            width: "100%",
            height: { xs: 200, sm: 300 },
            objectFit: "cover",
          }}
        />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {product.name}
          </Typography>

          {product.variations && product.variations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5 }}>
                Size Options
              </Typography>
              <Grid container spacing={2}>
                {product.variations.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isVariationUnavailable =
                    !variant.is_available || variant.stock_level <= 0;
                  return (
                    <Grid item xs={12} sm={6} key={variant.id}>
                      {/* --- START OF THE NEW CUSTOM COMPONENT --- */}
                      <Box
                        onClick={() =>
                          !isVariationUnavailable &&
                          handleVariantChange(variant)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          border: 2,
                          borderColor: isSelected ? "primary.main" : "divider",
                          borderRadius: 2,
                          cursor: isVariationUnavailable
                            ? "not-allowed"
                            : "pointer",
                          opacity: isVariationUnavailable ? 0.5 : 1,
                        }}
                      >
                        <Radio
                          checked={isSelected}
                          value={variant.id}
                          name="size-options"
                          disabled={isVariationUnavailable}
                          sx={{ p: 0, mr: 1.5 }}
                        />
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography>{variant.size_name}</Typography>
                          <Typography sx={{ fontWeight: "bold" }}>
                            ₱{parseFloat(variant.price).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      {/* --- END OF THE NEW CUSTOM COMPONENT --- */}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Quantity
            </Typography>
            <ButtonGroup variant="outlined" size="large">
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <RemoveIcon fontSize="small" />
              </Button>
              <Button
                disabled
                sx={{ color: "text.primary !important", fontSize: "1.2rem" }}
              >
                {quantity}
              </Button>
              <Button onClick={() => setQuantity(quantity + 1)}>
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions
        sx={{ p: { xs: 2, sm: 3 }, justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          ₱{totalPrice.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          startIcon={<AddIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
