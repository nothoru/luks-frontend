// src/components/AdminComponents/Sales.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  TablePagination,
  TableFooter,
  Menu,
  MenuItem,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PollIcon from "@mui/icons-material/Poll";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axiosInstance from "../../api/axiosInstance";
import { subDays } from "date-fns";
import { useNotification } from "../../context/Notifications";
import DateRangePicker from "./DateRangePicker";
import {
  exportPerformanceToPDF,
  exportPerformanceToCSV,
  exportTransactionsToPDF,
  exportTransactionsToCSV,
} from "./exportUtils";

const toLocalDateString = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: "flex", alignItems: "center", height: "100%" }}
  >
    <Box sx={{ bgcolor: color, p: 1.5, borderRadius: "50%", mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const TransactionHistory = ({ dateRange }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { showNotification } = useNotification();

  const fetchSalesData = useCallback(async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    try {
      setLoading(true);
      const startDateStr = toLocalDateString(dateRange.startDate);
      const endDateStr = toLocalDateString(dateRange.endDate);

      const url = `/api/orders/admin/sales-report/?page=${
        page + 1
      }&page_size=${rowsPerPage}&start_date=${startDateStr}&end_date=${endDateStr}`;

      const response = await axiosInstance.get(url);
      setSalesData(response.data.results);
      setTotalRows(response.data.count);
      setError(null);
    } catch (error) {
      setError("Failed to load transaction records.");
      setSalesData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, dateRange]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = async (format) => {
    handleClose();
    setIsExporting(true);
    try {
      const startDateStr = toLocalDateString(dateRange.startDate);
      const endDateStr = toLocalDateString(dateRange.endDate);

      const response = await axiosInstance.get(
        `/api/orders/admin/sales-report/all/?start_date=${startDateStr}&end_date=${endDateStr}`
      );
      const allTransactions = response.data;

      if (format === "pdf") {
        exportTransactionsToPDF(
          allTransactions,
          dateRange.startDate,
          dateRange.endDate
        );
      } else if (format === "csv") {
        exportTransactionsToCSV(allTransactions);
      }
    } catch (err) {
      showNotification("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={totalRows === 0 || isExporting}
          endIcon={<ArrowDropDownIcon />}
        >
          {isExporting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Export"
          )}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => handleExport("pdf")}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport("csv")}>Export as CSV</MenuItem>
        </Menu>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order #</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer/Staff</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : salesData.length > 0 ? (
              salesData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.order_number}</TableCell>
                  <TableCell>{formatDate(row.processed_at)}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    {row.user
                      ? `${row.user.first_name} ${row.user.last_name}`
                      : row.processed_by_staff
                      ? row.processed_by_staff.first_name
                      : "Walk-in"}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.items_summary}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(row.total_amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transaction records found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={6}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

const PerformanceReport = ({ dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const startDateStr = toLocalDateString(dateRange.startDate);
        const endDateStr = toLocalDateString(dateRange.endDate);

        const response = await axiosInstance.get(
          `/api/analytics/performance-report/?start_date=${startDateStr}&end_date=${endDateStr}`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load performance report.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [dateRange]);

  const handleExport = (format) => {
    handleClose();
    if (format === "pdf") {
      exportPerformanceToPDF(data, dateRange.startDate, dateRange.endDate);
    } else if (format === "csv") {
      exportPerformanceToCSV(data);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value || 0);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Typography>No data for this period.</Typography>;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        mb={3}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={!data || data.item_performance.length === 0}
          endIcon={<ArrowDropDownIcon />}
        >
          Export
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => handleExport("pdf")}>Export as PDF</MenuItem>
          <MenuItem onClick={() => handleExport("csv")}>Export as CSV</MenuItem>
        </Menu>
      </Stack>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(data.summary.total_revenue)}
            icon={<MonetizationOnIcon sx={{ color: "white" }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={data.summary.total_orders || 0}
            icon={<ReceiptLongIcon sx={{ color: "white" }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Items Sold"
            value={data.summary.total_items_sold || 0}
            icon={<ShoppingCartIcon sx={{ color: "white" }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Order Value"
            value={formatCurrency(data.summary.average_order_value)}
            icon={<PollIcon sx={{ color: "white" }} />}
            color="secondary.main"
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Variation</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Units Sold
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Avg. Price
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Total Revenue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.item_performance.length > 0 ? (
              data.item_performance.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.variation_name}</TableCell>
                  <TableCell align="right">{item.units_sold}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.average_price)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.total_revenue)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No item performance data for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Sales = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(), // Default start date is today
    endDate: new Date(), // Default end date is today
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Sales Reports
        </Typography>
        <DateRangePicker onDateChange={handleDateChange} />
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Transaction History" />
          <Tab label="Performance Report" />
        </Tabs>
      </Box>

      {currentTab === 0 && <TransactionHistory dateRange={dateRange} />}
      {currentTab === 1 && <PerformanceReport dateRange={dateRange} />}
    </Box>
  );
};

export default Sales;
