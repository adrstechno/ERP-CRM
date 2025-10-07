import React, { useState, useMemo, useCallback, useEffect } from "react";
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

// --- Mock Data ---
const mockSalesData = [
  {
    id: "#S001",
    date: "2025-09-26",
    dealer: "CoolAir Traders",
    customer: "Lal Singh Chaddha",
    marketer: "Rajesh Kumar",
    amount: 38000,
    status: "Completed",
  },
  {
    id: "#S002",
    date: "2025-09-25",
    dealer: "Arctic Systems",
    customer: "ACME Corp",
    marketer: "Priya Singh",
    amount: 4500,
    status: "Pending",
  },
];
const ADMIN_ID = "1"; // Example Admin ID
const mockDealers = ["CoolAir Traders", "Arctic Systems", "Zenith Corp"];
const mockCustomers = ["Lal Singh Chaddha", "ACME Corp", "Global Tech"];
const mockProducts = [
  { id: "1", name: "Voltas Split AC 1.5 Ton", price: 32999 },
  { id: "2", name: "1.5 Ton 5 Star AC", price: 38000 },
  { id: "3", name: "Cooling Coils (Set)", price: 4500 },
  { id: "4", name: "Digital Thermostat", price: 1200 },
];

const user = JSON.parse(localStorage.getItem("user"));
const LOGGED_IN_MARKETER = { id: user?._id, name: user?.name };
console.log("Logged in Marketer:", LOGGED_IN_MARKETER);
LOGGED_IN_MARKETER.id = "2"; // Fallback ID

// --- Status Chip ---
const StatusChip = ({ status }) => {
  let color;
  if (status === "Completed") color = "success";
  else if (status === "Pending") color = "warning";
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

// --- Main Component ---
export default function NewSales() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [dealers, setDealers] = useState([]);
const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    saleToType: "", // Dealer or Customer
    saleToEntity: "", // selected name
    salesItem: "",
    date: dayjs(),
    quantity: 1,
    perUnit: 0,
  });
  const token = localStorage.getItem("authKey");
  console.log("token ->", token);
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch mock data (replace with real GET API if available)
  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSales(mockSalesData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  useEffect(() => {
  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("authKey");
      const headers = { Authorization: `Bearer ${token}` };

      const [dealerRes, customerRes, productRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/dealers",axiosConfig),
        axios.get("http://localhost:8080/api/customer",axiosConfig),
        axios.get("http://localhost:8080/api/products/all",axiosConfig),
      ]);

      setDealers(dealerRes.data);
      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  fetchDropdownData();
}, []);


  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setForm({
      saleToType: "",
      saleToEntity: "",
      salesItem: "",
      date: dayjs(),
      quantity: 1,
      perUnit: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };

    if (name === "saleToType") newForm.saleToEntity = "";

    if (name === "salesItem") {
      const product = mockProducts.find((p) => p.name === value);
      newForm.perUnit = product ? product.price : 0;
    }
    if (name === "quantity" && value !== "" && Number(value) < 1)
      newForm.quantity = 1;

    setForm(newForm);
  };

  const handleDateChange = (d) => {
    setForm({ ...form, date: d });
  };

  const amount = useMemo(() => {
    const qty = parseFloat(form.quantity);
    const price = parseFloat(form.perUnit);
    return isNaN(qty) || isNaN(price) ? 0 : qty * price;
  }, [form.quantity, form.perUnit]);

  // --- API Submission ---
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);


      try {
        const product = mockProducts.find(
          (p) => p.name === form.salesItem
        ) || { id: "1", name: form.salesItem };

        const payload = {
          adminId: ADMIN_ID,
          marketerId: LOGGED_IN_MARKETER.id,
          dealerId: form.saleToType === "Dealer" ? "3" : "2", // Example ID
          totalAmount: amount,
          items: [
            {
              productId: product.id,
              productName: product.name,
              quantity: form.quantity,
              price: form.perUnit,
            },
          ],
        };

        

        console.log("Creating Sale with Payload:", payload);

        const response = await axios.post(
          "http://localhost:8080/api/sales/create-sale",
          payload,
          axiosConfig
        );

        console.log("Sale created successfully:", response.data);

        const newSale = {
          id: `#S00${sales.length + 1}`,
          date: response.data.saleDate || dayjs().format("YYYY-MM-DD"),
          dealer:
            form.saleToType === "Dealer" ? form.saleToEntity : "N/A",
          customer:
            form.saleToType === "Customer" ? form.saleToEntity : "N/A",
          marketer: response.data.marketerName || LOGGED_IN_MARKETER.name,
          amount: response.data.totalAmount || amount,
          status: response.data.saleStatus || "Pending",
        };

        setSales((prev) => [newSale, ...prev]);
        handleCloseDialog();
      } catch (error) {
        console.error(
          "Error creating sale:",
          error.response?.data || error.message
        );
        alert("Failed to create sale. Check console for details.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, amount, sales]
  );

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

        {/* --- New Sale Dialog --- */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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

                {form.saleToType && (
                  <FormControl fullWidth>
                    <InputLabel>{`Select ${form.saleToType}`}</InputLabel>
                    <Select
  name="saleToEntity"
  label={`Select ${form.saleToType}`}
  value={form.saleToEntity}
  onChange={(e) => {
    const selectedList = form.saleToType === "Dealer" ? dealers : customers;
    const selectedUser = selectedList.find(u => u.name === e.target.value);
    setForm({
      ...form,
      saleToEntity: selectedUser?.name || "",
      userId: selectedUser?.userId || "",
      role: selectedUser?.role || "",
    });
  }}
>
  {(form.saleToType === "Dealer" ? dealers : customers).map((user) => (
    <MenuItem key={user.userId} value={user.name}>
      {user.name} ({user.role})
    </MenuItem>
  ))}
</Select>

                  </FormControl>
                )}

                <FormControl fullWidth>
                  <InputLabel>Sales Item</InputLabel>
                  <Select
  name="salesItem"
  label="Sales Item"
  value={form.salesItem}
  onChange={(e) => {
    const selectedProduct = products.find(p => p.productName === e.target.value);
    setForm({
      ...form,
      salesItem: selectedProduct?.productName || "",
      productId: selectedProduct?.productId || "",
      perUnit: selectedProduct?.price || 0,
    });
  }}
>
  {products.map((p) => (
    <MenuItem key={p.productId} value={p.productName}>
      {p.productName}
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
