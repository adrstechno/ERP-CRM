import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";


// --- Status Chip ---
const StatusChip = ({ status }) => {
  let color;
  if (status === "COMPLETED") color = "success";
  else if (status === "PENDING") color = "warning";
  else color = "error";

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: "bold" }}
    />
  );
};

export default function NewSales() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    saleToType: "",
    saleToEntity: "",
    entityId: "",
    salesItem: "",
    productId: "",
    date: dayjs(),
    quantity: 1,
    perUnit: 0,
  });

  const token = localStorage.getItem("authKey");
  const user = JSON.parse(localStorage.getItem("user"));
 const axiosConfig = useMemo(() => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}, [token]);

  const ADMIN_ID = 1;
  const LOGGED_IN_MARKETER = { id: user?._id || "5", name: user?.name || "marketer" };

  // --- Fetch Dropdown Data ---
  const fetchDropdownData = useCallback(async () => {
  try {
    console.log("Fetching dropdown data with config:", axiosConfig);

    const [dealerRes, customerRes, productRes] = await Promise.all([
      axios.get(`${VITE_API_BASE_URL}/user/dealers`, axiosConfig),
      axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
     axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
    ]);

    // ✅ Format dealers based on your actual API response
    const formattedDealers = (dealerRes.data || []).map((dealer) => ({
      id: dealer.userId, // from your API
      name: dealer.name,
      email: dealer.email,
      role: dealer.role?.name || "DEALER",
    }));

    console.log("✅ Dealers fetched:", formattedDealers);
    setDealers(formattedDealers);
    setCustomers(customerRes.data || []);
    setProducts(productRes.data || []);
  } catch (error) {
    console.error("❌ Error fetching dropdown data:", error);
    if (error.response && error.response.status === 401) {
      alert("Your session has expired. Please log in again.");
    }
  }
}, [axiosConfig]);
  // --- Fetch Sales Data ---
  // --- Fetch Sales Data ---
const fetchSales = useCallback(async () => {
  try {
    setIsLoading(true);

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/sales/get-all-sales`,
      axiosConfig
    );

    console.log("✅ All Sales Response:", response.data);

    const formattedSales = (response.data || []).map((sale) => ({
      id: `#S${sale.saleId}`,
      date: sale.saleDate,
      dealer: sale.customerType === "DEALER" ? sale.customerName : "N/A",
      customer: sale.customerType === "CUSTOMER" ? sale.customerName : "N/A",
      marketer: sale.marketerName || "N/A",
      amount: sale.totalAmount || 0,
      status: sale.saleStatus || "PENDING",
    }));

    setSales(formattedSales);
  } catch (error) {
    console.error("❌ Error fetching all sales:", error);
    alert("Failed to load sales list. Please check console for details.");
  } finally {
    setIsLoading(false);
  }
}, [axiosConfig]);

  useEffect(() => {
    fetchDropdownData();
    fetchSales();
  }, [fetchDropdownData, fetchSales]);

  // --- Form Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEntitySelect = (value) => {
  if (form.saleToType === "Dealer") {
    const dealer = dealers.find((d) => d.id === value);
    if (dealer) {
      setForm((prev) => ({
        ...prev,
        saleToEntity: dealer.name,
        entityId: dealer.id,
      }));
    }
  } else {
    const customer = customers.find((c) => c.customerId === value);
    if (customer) {
      setForm((prev) => ({
        ...prev,
        saleToEntity: customer.customerName,
        entityId: customer.customerId,
      }));
    }
  }
};

  const handleProductSelect = (value) => {
    const product = products.find((p) => p.name === value);
    setForm((prev) => ({
      ...prev,
      salesItem: product?.name || "",
      productId: product?.productId || "",
      perUnit: product?.price || 0,
    }));
  };

  const handleDateChange = (d) => {
    setForm((prev) => ({ ...prev, date: d }));
  };

  const amount = useMemo(() => {
    const qty = parseFloat(form.quantity);
    const price = parseFloat(form.perUnit);
    return isNaN(qty) || isNaN(price) ? 0 : qty * price;
  }, [form.quantity, form.perUnit]);

  // --- Submit Sale ---
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!form.saleToType || !form.entityId) {
    alert("Please select Dealer or Customer before submitting.");
    setIsSubmitting(false);
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Logged-in user object:", user);

    // ✅ FIX HERE — use numeric fallback if user.userId is missing
    const ADMIN_ID = 1;
    const MARKETER_ID =
      typeof user?.userId === "number"
        ? user.userId
        : user?.id && !isNaN(user.id)
        ? Number(user.id)
        : 2; // fallback marketer id (update to actual numeric id if needed)

    const payload = {
      adminId: Number(ADMIN_ID),
      marketerId: Number(MARKETER_ID),
      dealerId: form.saleToType === "Dealer" ? Number(form.entityId) : null,
      customerId: form.saleToType === "Customer" ? Number(form.entityId) : null,
      totalAmount: amount,
      items: [
        {
          productId: Number(form.productId),
          productName: form.salesItem,
          quantity: Number(form.quantity),
          price: Number(form.perUnit),
        },
      ],
    };

    console.log("🧾 Final Sale Payload:", payload);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/sales/create-sale`,
      payload,
      axiosConfig
    );

    console.log("✅ Sale created successfully:", response.data);
    handleCloseDialog();
  } catch (error) {
    console.error("❌ Error creating sale:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to create sale.");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setForm({
      saleToType: "",
      saleToEntity: "",
      entityId: "",
      salesItem: "",
      productId: "",
      date: dayjs(),
      quantity: 1,
      perUnit: 0,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Card
          sx={{
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
              mb={2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PointOfSaleIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Sales Entries
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenDialog}
              >
                Create New Sale
              </Button>
            </Stack>
          </CardContent>

          {/* --- Sales Table --- */}
          <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Sale ID",
                    "Date",
                    "Dealer",
                    "Customer",
                    "Marketer",
                    "Amount",
                    "Status",
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from(new Array(5)).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))
                  : sales.map((sale) => (
                      <TableRow key={sale.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {sale.id}
                        </TableCell>
                        <TableCell>
                          {dayjs(sale.date).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell>{sale.dealer || "N/A"}</TableCell>
                        <TableCell>{sale.customer || "N/A"}</TableCell>
                        <TableCell>{sale.marketer}</TableCell>
                        <TableCell>
                          ₹{sale.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={sale.status} />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* --- Dialog --- */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>New Sale Entry</DialogTitle>
          <DialogContent>
            <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Stack spacing={2.5}>
                {/* Sale To */}
                <FormControl fullWidth>
                  <InputLabel>Sale To</InputLabel>
                  <Select
                    name="saleToType"
                    label="Sale To"
                    value={form.saleToType}
                    onChange={handleChange}
                  >
                    <MenuItem value="Dealer">Dealer</MenuItem>
                    <MenuItem value="Customer">Customer</MenuItem>
                  </Select>
                </FormControl>

                {/* Entity Dropdown */}
                {form.saleToType && (
  <FormControl fullWidth>
    <InputLabel>{`Select ${form.saleToType}`}</InputLabel>
    <Select
      value={form.entityId}
      label={`Select ${form.saleToType}`}
      onChange={(e) => handleEntitySelect(e.target.value)}
    >
      {form.saleToType === "Dealer"
        ? dealers.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {`${d.name} (${d.role})`}
            </MenuItem>
          ))
        : customers.map((c) => (
            <MenuItem key={c.customerId} value={c.customerId}>
              {c.customerName}
            </MenuItem>
          ))}
    </Select>
  </FormControl>
)}

                {/* Product */}
                <FormControl fullWidth>
                  <InputLabel>Sales Item</InputLabel>
                  <Select
                    value={form.salesItem}
                    label="Sales Item"
                    onChange={(e) => handleProductSelect(e.target.value)}
                  >
                    {products.map((p) => (
                      <MenuItem key={p.productId} value={p.name}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DatePicker
                  label="Sale Date"
                  value={form.date}
                  onChange={handleDateChange}
                  sx={{ width: "100%" }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="quantity"
                      label="Quantity"
                      type="number"
                      value={form.quantity}
                      onChange={handleChange}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="perUnit"
                      label="Per Unit (₹)"
                      type="number"
                      value={form.perUnit}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  name="amount"
                  label="Total Amount (₹)"
                  value={amount.toLocaleString("en-IN")}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
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