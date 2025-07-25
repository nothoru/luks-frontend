// src/pages/Customers/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box, Tabs, Tab, Paper, Grid, Divider, Chip, CircularProgress, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, } from "@mui/material";
import Base from "../../components/Base";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNotification } from "../../context/Notifications";

// --- Redesigned OrderTicket Component ---
const OrderTicket = ({ order, onOrderCancel }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const { showNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCancelClick = () => {
    setConfirmOpen(true);
  };

  const confirmCancel = async () => {
    setConfirmOpen(false);
    setIsCancelling(true);
    try {
      await axiosInstance.post(`/api/orders/${order.id}/cancel/`);
      showNotification("Your order has been cancelled successfully.");
      onOrderCancel(order.id);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Please try again.";
      showNotification(`Failed to cancel order: ${errorMsg}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case "pending":
        return { label: "Pending", color: "warning" };
      case "processing":
        return { label: "Processing", color: "info" };
      case "ready_to_serve":
        return { label: "Ready to Serve", color: "success" };
      case "completed":
        return { label: "Completed", color: "default", variant: "outlined" };
      case "cancelled":
        return { label: "Cancelled", color: "error", variant: "outlined" };
      default:
        return { label: status, color: "default" };
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {order.order_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(order.created_at).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={order.dining_method
              .replace("-", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
            variant="outlined"
            size="small"
          />
          <Chip {...getStatusChipProps(order.status)} />
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Item List */}
      {order.order_items.map((item) => (
        <Grid container key={item.id} sx={{ mb: 1.5 }} alignItems="center">
          <Grid item xs={8}>
            <Typography sx={{ fontWeight: "medium" }}>
              {item.variation.menu_item_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.variation.size_name}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <Typography>
              ₱{parseFloat(item.price_at_order).toFixed(2)}
            </Typography>
            <Chip label={`x${item.quantity}`} size="small" sx={{ mt: 0.5 }} />
          </Grid>
        </Grid>
      ))}

      {/* Footer */}
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          ₱{parseFloat(order.total_amount).toFixed(2)}
        </Typography>
      </Box>

      {order.status === "pending" && (
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCancelClick}
            disabled={isCancelling}
          >
            {isCancelling ? <CircularProgress size={20} /> : "Cancel Order"}
          </Button>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>No</Button>
          <Button color="error" onClick={confirmCancel} autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

const Orders = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = useCallback(async (url = "/api/orders/my-orders/") => {
    const isInitialFetch = url === "/api/orders/my-orders/";

    if (isInitialFetch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await axiosInstance.get(url);

      if (isInitialFetch) {
        setOrders(response.data.results);
      } else {
        setOrders((prevOrders) => [...prevOrders, ...response.data.results]);
      }

      setNextPageUrl(response.data.next);
    } catch (err) {
      setError("Failed to fetch your orders.");
      console.error(err);
    } finally {
      if (isInitialFetch) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleLoadMore = () => {
    if (nextPageUrl) {
      fetchOrders(nextPageUrl);
    }
  };

  const handleOrderCancelled = (cancelledOrderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === cancelledOrderId
          ? { ...order, status: "cancelled" }
          : order
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <Base>
        <Container sx={{ py: 5, textAlign: "center" }}>
          <Typography variant="h6">
            Please log in to view your orders.
          </Typography>
        </Container>
      </Base>
    );
  }

  const currentOrders = orders.filter((o) =>
    ["pending", "processing", "ready_to_serve"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["completed", "cancelled"].includes(o.status)
  );

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Base>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          My Orders
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
              "& .Mui-selected": { color: "primary.main" },
              "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
            }}
          >
            <Tab label="Current Orders" />
            <Tab label="Past Orders" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <OrderTicket
                    key={`current-${order.id}`}
                    order={order}
                    onOrderCancel={handleOrderCancelled}
                  />
                ))
              ) : (
                <Typography
                  sx={{ textAlign: "center", py: 5, color: "text.secondary" }}
                >
                  You have no current orders.
                </Typography>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {pastOrders.length > 0 ? (
                pastOrders.map((order) => (
                  <OrderTicket
                    key={`past-${order.id}`}
                    order={order}
                    onOrderCancel={handleOrderCancelled}
                  />
                ))
              ) : (
                <Typography
                  sx={{ textAlign: "center", py: 5, color: "text.secondary" }}
                >
                  You have no past orders.
                </Typography>
              )}

              {tabValue === 1 && nextPageUrl && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Load More Orders"
                    )}
                  </Button>
                </Box>
              )}
            </TabPanel>
          </>
        )}
      </Container>
    </Base>
  );
};

export default Orders;
