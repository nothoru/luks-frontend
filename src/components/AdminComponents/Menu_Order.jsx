// src/components/AdminComponents/Menu_Order.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Divider,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useNotification } from "../../context/Notifications";

const Menu_order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [diningOption, setDiningOption] = useState("dine-in");
  const [cashReceived, setCashReceived] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, categoryResponse] = await Promise.all([
          axiosInstance.get("/api/menu/items/"),
          axiosInstance.get("/api/menu/categories/"),
        ]);
        setMenuItems(menuResponse.data);
        setCategories([
          { id: "all", name: "All Meals" },
          ...categoryResponse.data,
        ]);
        setError(null);
      } catch (err) {
        setError("Failed to load menu data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToOrder = (variation, menuItem) => {
    const existingItem = orderItems.find((i) => i.variationId === variation.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((i) =>
          i.variationId === variation.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          variationId: variation.id,
          name: menuItem.name,
          size_name: variation.size_name,
          price: parseFloat(variation.price),
          quantity: 1,
        },
      ]);
    }
  };

  const handleItemClick = (item, event) => {
    const isUnavailable = !item.is_available || item.is_fully_out_of_stock;
    if (isUnavailable) {
      return;
    }
    if (item.variations.length === 1) {
      addToOrder(item.variations[0], item);
    } else {
      setSelectedMenuItem(item);
      setPopoverAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setSelectedMenuItem(null);
  };

  const handleVariationSelect = (variation) => {
    addToOrder(variation, selectedMenuItem);
    handlePopoverClose();
  };

  const isOpen = Boolean(popoverAnchorEl);

  const removeFromOrder = (variationId) => {
    const existingItem = orderItems.find((i) => i.variationId === variationId);
    if (existingItem?.quantity > 1) {
      setOrderItems(
        orderItems.map((i) =>
          i.variationId === variationId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setOrderItems(orderItems.filter((i) => i.variationId !== variationId));
    }
  };

  const deleteFromOrder = (variationId) => {
    setOrderItems(orderItems.filter((i) => i.variationId !== variationId));
  };

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = calculateTotal();
  const change = (parseFloat(cashReceived) || 0) - total;

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      showNotification("Cannot submit an empty order.");
      return;
    }

    if (diningOption === "dine-in" && !tableNumber.trim()) {
      showNotification("Error: Table Number is required for Dine-in orders.");
      return;
    }

    const amountReceived = parseFloat(cashReceived);
    const orderTotal = total;

    if (isNaN(amountReceived) || cashReceived.trim() === "") {
      showNotification("Error: Cash Received cannot be empty.");
      return;
    }

    if (amountReceived < orderTotal) {
      showNotification(
        `Error: Cash Received (₱${amountReceived.toFixed(
          2
        )}) must be greater than or equal to the total amount (₱${orderTotal.toFixed(
          2
        )}).`
      );
      return;
    }

    setIsSubmitting(true);

    const calculatedChange = amountReceived - orderTotal;

    const payload = {
      order_type: "walk-in",
      dining_method: diningOption,
      table_number: diningOption === "dine-in" ? tableNumber : null,
      amount_paid: cashReceived,
      change_given:
        calculatedChange >= 0 ? calculatedChange.toFixed(2) : "0.00",
      items: orderItems.map((item) => ({
        variation_id: item.variationId,
        quantity: item.quantity,
      })),
    };

    try {
      await axiosInstance.post("/api/orders/admin/create-pos/", payload);
      showNotification("POS Order created successfully!");
      setOrderItems([]);
      setTableNumber("");
      setCashReceived("");
    } catch (err) {
      showNotification(
        `Error creating POS order: ${
          err.response?.data?.error || "Please try again"
        }`
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenuItems =
    selectedCategory === "ALL"
      ? menuItems
      : menuItems.filter((item) => item.category.name === selectedCategory);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Menu Order (POS)
      </Typography>
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 2,
            overflow: "hidden",
          }}
        >
          <Paper elevation={2} sx={{ mb: 2, flexShrink: 0 }}>
            <Tabs
              value={selectedCategory}
              onChange={(e, val) => setSelectedCategory(val)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((cat) => (
                <Tab
                  key={cat.id}
                  label={cat.name}
                  value={cat.name === "All Meals" ? "ALL" : cat.name}
                />
              ))}
            </Tabs>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, height: "64vh", overflowY: "auto" }}>
            <Grid container spacing={2}>
              {filteredMenuItems.map((item) => {
                const isUnavailable =
                  !item.is_available || item.is_fully_out_of_stock;

                return (
                  <Grid item xs={6} sm={4} md={3} key={item.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        opacity: isUnavailable ? 0.5 : 1,
                        position: "relative",
                      }}
                    >
                      {isUnavailable && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Out of Stock
                          </Typography>
                        </Box>
                      )}
                      <CardActionArea
                        onClick={(event) =>
                          !isUnavailable && handleItemClick(item, event)
                        }
                        disabled={isUnavailable}
                      >
                        <CardMedia
                          component="img"
                          height="100"
                          image={item.image || "/path/to/default-image.png"}
                          alt={item.name}
                        />
                        <CardContent
                          sx={{ textAlign: "center", p: 1, width: "100%" }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {item.variations.length > 0
                              ? `₱${parseFloat(
                                  item.variations[0].price
                                ).toFixed(2)}`
                              : "N/A"}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Box>
        <Paper
          elevation={3}
          sx={{ width: 350, p: 2, display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Order Summary
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 1 }}>
            {orderItems.map((item) => (
              <Box
                key={item.variationId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box>
                  <Typography>{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.size_name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => removeFromOrder(item.variationId)}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      addToOrder({
                        id: item.variationId,
                        price: item.price,
                        menu_item: { name: item.name },
                      })
                    }
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <Typography noWrap>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    onClick={() => deleteFromOrder(item.variationId)}
                    size="small"
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Total: ₱{total.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Select
              value={diningOption}
              onChange={(e) => setDiningOption(e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="dine-in">Dine-in</MenuItem>
              <MenuItem value="take-out">Take-out</MenuItem>
            </Select>
            <TextField
              label="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label="Cash Received"
              type="number"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
            />
            <TextField
              fullWidth
              label="Change"
              disabled
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
              value={change >= 0 ? change.toFixed(2) : "0.00"}
            />
          </Box>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: "auto" }}
            disabled={orderItems.length === 0 || isSubmitting}
            onClick={handleSubmitOrder}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Order"}
          </Button>
        </Paper>
      </Box>
      <Popover
        open={isOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper>
          <Typography sx={{ p: 2, fontWeight: "bold" }}>
            Select Variation for {selectedMenuItem?.name}
          </Typography>
          <List dense>
            {selectedMenuItem?.variations.map((variation) => {
              const isVariationUnavailable =
                !variation.is_available || variation.stock_level <= 0;

              return (
                <ListItem key={variation.id} disablePadding>
                  <ListItemButton
                    disabled={isVariationUnavailable}
                    onClick={() => handleVariationSelect(variation)}
                    sx={{
                      "&.Mui-disabled": {
                        opacity: 0.5,
                        textDecoration: "line-through",
                      },
                    }}
                  >
                    <ListItemText
                      primary={variation.size_name}
                      secondary={
                        isVariationUnavailable
                          ? "Out of Stock"
                          : `₱${parseFloat(variation.price).toFixed(2)}`
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Popover>
    </Box>
  );
};

export default Menu_order;
