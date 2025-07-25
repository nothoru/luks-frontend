// src/components/AdminComponents/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, useTheme, } from "@mui/material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        height: "100%",
        borderRadius: "12px",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 10px 20px -5px ${
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.4)"
              : "rgba(2,2,2,0.1)"
          }`,
        },
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
            background: `linear-gradient(135deg, ${color} 30%, ${
              theme.palette.augmentColor({ color: { main: color } }).light
            } 90%)`,
            color: "white",
            boxShadow: `0 4px 12px -2px ${color}`,
          }}
        >
          {icon}
        </Box>
      </motion.div>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
    },
  },
};

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("daily");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/analytics/?report_type=${filter}`
        );
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load analytics data for this period.");
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filter]);

  const formatDateRange = () => {
    if (!analyticsData) return "";
    const { start_date, end_date } = analyticsData;
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedStartDate = new Date(
      start_date + "T00:00:00"
    ).toLocaleDateString("en-US", options);
    const formattedEndDate = new Date(
      end_date + "T00:00:00"
    ).toLocaleDateString("en-US", options);
    if (start_date === end_date) return formattedStartDate;
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  const orderTypeData = [
    { id: 0, value: analyticsData?.online_order_count || 0, label: "Online" },
    { id: 1, value: analyticsData?.walkin_order_count || 0, label: "Walk-in" },
  ];

  const hourlyChart = {
    data: analyticsData?.avg_hourly_orders.map((item) => item.orders) || [],
    labels: analyticsData?.avg_hourly_orders.map((item) => item.hour) || [],
  };

  const dishPerformanceChart = {
    data:
      analyticsData?.dish_performance.map((item) => ({
        x: item.dish_name,
        y: item.sold,
      })) || [],
  };

  return (
    <Box>
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {loading ? "Loading..." : formatDateRange()}
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Period</InputLabel>
            <Select
              value={filter}
              label="Period"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </motion.div>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Total Revenue"
                  value={`₱${parseFloat(
                    analyticsData?.total_sales_revenue || 0
                  ).toLocaleString()}`}
                  icon={<MonetizationOnIcon />}
                  color="#2e7d32"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Total Orders"
                  value={analyticsData?.total_order_count || 0}
                  icon={<ReceiptLongIcon />}
                  color="#1976d2"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <StatCard
                  title="Avg Items Per Order"
                  value={analyticsData?.avg_items_per_order || 0}
                  icon={<ShoppingCartIcon />}
                  color="#ed6c02"
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, height: "400px", borderRadius: "12px" }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Hourly Orders
                  </Typography>
                  <LineChart
                    series={[
                      {
                        data: hourlyChart.data,
                        label: "Orders",
                        area: true,
                        showMark: false,
                        color: "#1976d2",
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: hourlyChart.labels }]}
                    sx={{
                      "& .MuiLineElement-root": { strokeWidth: 3 },
                      "& .MuiAreaElement-root": { opacity: 0.2 },
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, height: "400px", borderRadius: "12px" }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Order Types
                  </Typography>
                  {(analyticsData?.total_order_count || 0) > 0 ? (
                    <PieChart
                      series={[
                        {
                          data: orderTypeData,
                          innerRadius: 50,
                          outerRadius: 90,
                          paddingAngle: 2,
                          cornerRadius: 5,
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                        },
                      ]}
                      height={300}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Typography color="text.secondary">No data</Typography>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, height: "400px", borderRadius: "12px" }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Top Selling Dishes
                  </Typography>
                  <BarChart
                    dataset={dishPerformanceChart.data}
                    yAxis={[{ scaleType: "band", dataKey: "x" }]}
                    series={[
                      { dataKey: "y", label: "Units Sold", color: "#2e7d32" },
                    ]}
                    layout="horizontal"
                    margin={{ left: 120 }}
                  />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </Box>
  );
};

export default Dashboard;
