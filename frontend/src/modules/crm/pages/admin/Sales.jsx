import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";

// --- Custom Tooltip for Charts ---
const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={`item-${index}`}
            sx={{ color: entry.color, fontWeight: "bold" }}
          >
            {`${entry.name}: ${entry.value.toLocaleString("en-IN")}${
              entry.unit || ""
            }`}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

export default function SalesManagement() {
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dialog dropdowns
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // State for the new sale form
  const [form, setForm] = useState({
    entityId: "",
    date: dayjs(),
    items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
  });

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_API_BASE_URL}/sales/get-all-sales`,
        axiosConfig
      );
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  }, [axiosConfig]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [customerRes, productRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
      ]);
      setCustomers(customerRes.data || []);
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchSales();
    fetchDropdownData();
  }, [fetchSales, fetchDropdownData]);

  const handleApproveSale = async (saleId) => {
    try {
      const response = await axios.patch(
        `${VITE_API_BASE_URL}/sales/${saleId}/status`,
        { saleStatus: "APPROVED" },
        axiosConfig
      );
      if (response.status === 200) {
        setSalesData((prevSales) =>
          prevSales.map((sale) =>
            sale.saleId === saleId ? { ...sale, saleStatus: "APPROVED" } : sale
          )
        );
      }
    } catch (error) {
      console.error(`Error approving sale ${saleId}:`, error);
    }
  };

  // --- Dialog and Form Handlers ---
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setForm({
      entityId: "",
      date: dayjs(),
      items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.entityId) {
      alert("Please select a customer before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        customerId: Number(form.entityId),
        totalAmount: form.items
          .reduce((sum, item) => sum + item.quantity * item.perUnit, 0)
          .toFixed(0),
        items: form.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      const response = await axios.post(
        `${VITE_API_BASE_URL}/sales/create-sale`,
        payload,
        axiosConfig
      );

      alert(`Sale Created Successfully for ${response.data.customerName}`);
      fetchSales(); // Refresh the table
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating sale:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const PIE_CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            {/* ... Chart Grid Items ... */}
            <Grid item xs={12} md={6}>
            <Card sx={{ height: 300, width: 600 }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  Dealer-wise Sales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="customerName"
                        stroke={theme.palette.text.secondary}
                      />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: theme.palette.action.hover }}
                      />
                      <Legend />
                      <Bar
                        dataKey="totalAmount"
                        fill={theme.palette.primary.main}
                        barSize={30}
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 300, width: 500 }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  Sale Status Distribution
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value: salesData.filter(
                              (s) => s.saleStatus === "PENDING"
                            ).length,
                          },
                          {
                            name: "APPROVED",
                            value: salesData.filter(
                              (s) => s.saleStatus === "APPROVED"
                            ).length,
                          },
                          {
                            name: "Cancelled",
                            value: salesData.filter(
                              (s) => s.saleStatus === "CANCELLED"
                            ).length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {["PENDING", "COMPLETED", "CANCELLED"].map((_, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={
                              PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sales Entry Table
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpenDialog}
                >
                  Create New Sale
                </Button>
              </Stack>
              <TableContainer sx={{ maxHeight: 440, overflowY: "auto" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {[
                        "Sale ID", "Date", "Customer", "Created By", "Amount", "Status", "Action",
                      ].map((head) => (
                        <TableCell key={head}>{head}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          Loading sales...
                        </TableCell>
                      </TableRow>
                    ) : salesData.length > 0 ? (
                      salesData.map((sale) => (
                        <TableRow key={sale.saleId} hover>
                          <TableCell>{sale.saleId}</TableCell>
                          <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.createdBy}</TableCell>
                          <TableCell>
                            ₹{sale.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            {sale.saleStatus === "PENDING" ? (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleApproveSale(sale.saleId)}
                              >
                                Approve
                              </Button>
                            ) : (
                              <Chip
                                label={sale.saleStatus}
                                color={
                                  sale.saleStatus === "APPROVED"
                                    ? "success"
                                    : "default"
                                }
                                size="small"
                                icon={
                                  sale.saleStatus === "APPROVED" ? (
                                    <CheckCircleIcon />
                                  ) : null
                                }
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No sales found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>

        {/* --- New Sale Dialog --- */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>New Sale Entry</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              id="new-sale-form"
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Stack spacing={2.5}>
                <FormControl fullWidth>
                  <InputLabel>Select Customer</InputLabel>
                  <Select
                    value={form.entityId}
                    label="Select Customer"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        entityId: e.target.value,
                      }))
                    }
                  >
                    {customers.map((c) => (
                      <MenuItem key={c.customerId} value={c.customerId}>
                        {c.customerName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Typography variant="subtitle1" fontWeight="bold">Products</Typography>

                {form.items?.map((item, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel>Product</InputLabel>
                        <Select
                          value={item.productId || ""}
                          label="Product"
                          onChange={(e) => {
                            const selected = products.find((p) => p.productId === e.target.value);
                            const updated = [...form.items];
                            updated[index] = {
                              ...updated[index],
                              productId: selected.productId,
                              productName: selected.name,
                              perUnit: selected.price,
                            };
                            setForm((prev) => ({ ...prev, items: updated }));
                          }}
                        >
                          {products.map((p) => (
                            <MenuItem key={p.productId} value={p.productId}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth type="number" label="Quantity" value={item.quantity}
                        onChange={(e) => {
                          const updated = [...form.items];
                          updated[index].quantity = Number(e.target.value);
                          setForm((prev) => ({ ...prev, items: updated }));
                        }}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth type="number" label="Price (₹)" value={item.perUnit}
                        onChange={(e) => {
                          const updated = [...form.items];
                          updated[index].perUnit = Number(e.target.value);
                          setForm((prev) => ({ ...prev, items: updated }));
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button color="error" onClick={() => {
                          const updated = form.items.filter((_, i) => i !== index);
                          setForm((prev) => ({ ...prev, items: updated }));
                        }}
                      > ❌ </Button>
                    </Grid>
                  </Grid>
                ))}

                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      items: [
                        ...(prev.items || []),
                        { productId: "", productName: "", quantity: 1, perUnit: 0 },
                      ],
                    }))
                  }
                >
                  Add Product
                </Button>

                <DatePicker
                  label="Sale Date"
                  value={form.date}
                  onChange={(d) => setForm((prev) => ({ ...prev, date: d }))}
                />
                <TextField
                  fullWidth
                  label="Total Amount (₹)"
                  value={(form.items || []).reduce(
                      (sum, item) => sum + item.quantity * item.perUnit, 0
                    ).toLocaleString("en-IN")
                  }
                  InputProps={{ readOnly: true, startAdornment: (
                      <InputAdornment position="start">
                        <Typography fontWeight="bold">₹</Typography>
                      </InputAdornment>
                    ),
                  }}
                  variant="filled"
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="new-sale-form"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Sale"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}