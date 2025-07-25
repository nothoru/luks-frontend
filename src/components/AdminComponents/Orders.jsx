// src/components/AdminComponents/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Button, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Table, TableBody, TableCell, TableRow, Tabs, Tab, Grid, TextField, TableHead, InputAdornment, CircularProgress, Alert, } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import SearchIcon from "@mui/icons-material/Search";
import { useNotification } from "../../context/Notifications";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState("pending");

  const [searchQuery, setSearchQuery] = useState("");

  const [tempTableNumber, setTempTableNumber] = useState("");
  const [tempAmountReceived, setTempAmountReceived] = useState("");

  const { showNotification } = useNotification();

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "ready_to_serve", label: "Ready to Serve" },
    { value: "completed", label: "Completed" },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/orders/admin/all/?status=${currentTab}&search=${searchQuery}`;
      const response = await axiosInstance.get(url);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders.");
      setOrders([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentTab, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setTempTableNumber(order.table_number || "");
    setTempAmountReceived("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const calculateChange = (amount, total) => {
    const received = parseFloat(amount) || 0;
    const orderTotal = parseFloat(total) || 0;
    const change = received - orderTotal;
    return change >= 0 ? change.toFixed(2) : "0.00";
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const payload = { status: newStatus };

    if (selectedOrder.status === "pending" && newStatus === "processing") {
      if (
        selectedOrder.dining_method === "dine-in" &&
        !tempTableNumber.trim()
      ) {
        showNotification("Error: Table Number is required for Dine-in orders.");
        return;
      }
      const amountReceived = parseFloat(tempAmountReceived);
      const totalAmount = parseFloat(selectedOrder.total_amount);
      if (isNaN(amountReceived) || tempAmountReceived.trim() === "") {
        showNotification("Error: Amount Received cannot be empty.");
        return;
      }
      if (amountReceived < totalAmount) {
        showNotification(
          `Error: Amount Received (₱${amountReceived.toFixed(
            2
          )}) must be >= total (₱${totalAmount.toFixed(2)}).`
        );
        return;
      }
      payload.table_number = tempTableNumber;
      payload.amount_paid = tempAmountReceived;
      payload.change_given = calculateChange(
        tempAmountReceived,
        selectedOrder.total_amount
      );
    }

    try {
      await axiosInstance.patch(
        `/api/orders/admin/${orderId}/update/`,
        payload
      );
      handleCloseDialog();
      setCurrentTab(newStatus);
    } catch (err) {
      showNotification(
        `Error updating order: ${
          err.response?.data?.error || "Please try again."
        }`
      );
      console.error(err);
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "ready_to_serve":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getDiningMethodChip = (diningMethod) => {
    const isDineIn = diningMethod === "dine-in";
    return (
      <Chip
        label={isDineIn ? "Dine-In" : "Take-Out"}
        color={isDineIn ? "primary" : "secondary"}
        size="small"
        sx={{ ml: 1, textTransform: "capitalize" }}
      />
    );
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Manage Orders
      </Typography>

      <Paper
        sx={{
          mb: 1,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ flexGrow: 1 }}
        >
          {statusOptions.map((option) => (
            <Tab key={option.value} label={option.label} value={option.value} />
          ))}
        </Tabs>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by Order # or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper
        elevation={1}
        sx={{ p: 2, height: "65vh", display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : orders.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No orders in this status
          </Typography>
        ) : (
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
            <List dense>
              {orders.map((order) => (
                <ListItem
                  key={order.id}
                  sx={{
                    display: "block",
                    mb: 1,
                    p: 2,
                    bgcolor: "#f0f0f0",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#e0e0e0" },
                  }}
                  onClick={() => handleOpenOrder(order)}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {order.order_number}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getDiningMethodChip(order.dining_method)}
                      <Chip
                        label={new Date(order.created_at).toLocaleTimeString()}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {order.user
                        ? `Customer: ${order.user.first_name || ""} ${
                            order.user.last_name || ""
                          }`.trim()
                        : order.processed_by_staff
                        ? `Staff: ${order.processed_by_staff.first_name}`
                        : "Walk-in Customer"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Total: ₱{parseFloat(order.total_amount).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* --- Order Details Dialog --- */}
      {selectedOrder && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              {selectedOrder.order_number}
              <Chip
                label={selectedOrder.status.toUpperCase().replace("_", " ")}
                color={getStatusChipColor(selectedOrder.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            <Typography variant="body2">
              {new Date(selectedOrder.created_at).toLocaleString()}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {selectedOrder.user
                  ? `Customer: ${selectedOrder.user.first_name || ""} ${
                      selectedOrder.user.last_name || ""
                    }`.trim()
                  : selectedOrder.processed_by_staff
                  ? `Staff: ${selectedOrder.processed_by_staff.first_name}`
                  : "Walk-in Customer"}
              </Typography>
              {getDiningMethodChip(selectedOrder.dining_method)}
            </Box>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Dish</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Qty
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrder.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.variation.menu_item_name} (
                      {item.variation.size_name})
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ₱{parseFloat(item.price_at_order).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ "& td": { borderBottom: "none" } }}>
                  <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    ₱{parseFloat(selectedOrder.total_amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" component="div" gutterBottom>
                Table No:
                {selectedOrder.status === "pending" &&
                selectedOrder.dining_method === "dine-in" ? (
                  <TextField
                    size="small"
                    variant="standard"
                    sx={{ width: "60px", ml: 1 }}
                    value={tempTableNumber}
                    onChange={(e) => setTempTableNumber(e.target.value)}
                  />
                ) : (
                  <span style={{ marginLeft: 8, fontWeight: "bold" }}>
                    {selectedOrder.table_number || "N/A"}
                  </span>
                )}
              </Typography>
            </Box>
            {selectedOrder.status === "pending" && (
              <Box
                p={1}
                mt={1}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Payment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Amount Received"
                      type="number"
                      value={tempAmountReceived}
                      onChange={(e) => setTempAmountReceived(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Change"
                      disabled
                      value={calculateChange(
                        tempAmountReceived,
                        selectedOrder.total_amount
                      )}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {selectedOrder.status !== "pending" && (
              <Box
                p={1}
                mt={1}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Payment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Amount Paid:{" "}
                      <strong>
                        ₱{parseFloat(selectedOrder.amount_paid || 0).toFixed(2)}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Change Given:{" "}
                      <strong>
                        ₱
                        {parseFloat(selectedOrder.change_given || 0).toFixed(2)}
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
            <Button onClick={handleCloseDialog}>Close</Button>
            {selectedOrder.status !== "completed" &&
              selectedOrder.status !== "cancelled" && (
                <Button
                  variant="contained"
                  onClick={() => {
                    const currentIndex = statusOptions.findIndex(
                      (opt) => opt.value === selectedOrder.status
                    );
                    const nextStatus = statusOptions[currentIndex + 1]?.value;
                    if (nextStatus) {
                      handleUpdateStatus(selectedOrder.id, nextStatus);
                    }
                  }}
                >
                  {selectedOrder.status === "pending" && "Process Order"}
                  {selectedOrder.status === "processing" &&
                    "Mark as Ready to Serve"}
                  {selectedOrder.status === "ready_to_serve" &&
                    "Complete Order"}
                </Button>
              )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Orders;
