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
  Paper,
  FormHelperText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";

export default function SalesManagement() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Backgrounds
  const sectionBg = isDark ? "#0a0e1a" : "#f8f9fc";
  const miniCardBg = isDark ? "#0f1629" : "#ffffff";
  const inputBg = isDark ? "#1a1f2e" : "#fff";
  const filledBg = isDark ? "#2d3748" : "#f7fafc";

  // States
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

const openViewDialog = (sale) => {
  setSelectedSale(sale);
  setIsViewDialogOpen(true);
};

const closeViewDialog = () => {
  setIsViewDialogOpen(false);
  setSelectedSale(null);
};


  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const initialForm = {
    entityId: "",
    date: dayjs(),
    items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
  };
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // Fetch Data
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/sales/get-all-sales`, axiosConfig);
      setSalesData(res.data);
    } catch {
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [axiosConfig]);

  const fetchDropdowns = useCallback(async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
      ]);
      setCustomers(custRes.data || []);
      setProducts(prodRes.data || []);
    } catch {
      toast.error("Failed to load form data");
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchSales();
    fetchDropdowns();
  }, [fetchSales, fetchDropdowns]);

  // Total Amount
  const totalAmount = form.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.perUnit || 0),
    0
  );

  // Handlers
  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setForm(initialForm);
    setFormErrors({});
  };

  const handleProductChange = (e, idx) => {
    const productId = e.target.value;
    const product = products.find(p => p.productId === productId);
    if (!product) return;

    const updated = [...form.items];
    updated[idx] = {
      ...updated[idx],
      productId,
      productName: product.name,
      perUnit: product.price || 0,
    };
    setForm(prev => ({ ...prev, items: updated }));
    clearItemError(idx, "productId");
  };

  const handleQuantityChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const updated = [...form.items];
    updated[idx].quantity = value === "" ? "" : Number(value);
    setForm(prev => ({ ...prev, items: updated }));
    clearItemError(idx, "quantity");
  };

  const handleQuantityBlur = (idx) => {
    const updated = [...form.items];
    if (!updated[idx].quantity || updated[idx].quantity < 1) {
      updated[idx].quantity = 1;
    }
    setForm(prev => ({ ...prev, items: updated }));
  };

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", productName: "", quantity: 1, perUnit: 0 }],
    }));
  };

  const handleRemoveItem = (idx) => {
    if (form.items.length === 1) return;
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const clearItemError = (idx, field) => {
    setFormErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.items?.[idx]) {
        delete newErrors.items[idx][field];
        if (Object.keys(newErrors.items[idx]).length === 0) {
          delete newErrors.items[idx];
        }
      }
      return newErrors;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.entityId) errors.entityId = "Customer is required";

    const itemErrors = [];
    form.items.forEach((item, idx) => {
      const err = {};
      if (!item.productId) err.productId = "Product is required";
      if (!item.quantity || item.quantity < 1) err.quantity = "Quantity must be ≥ 1";
      if (itemErrors.length <= idx) itemErrors.push(err);
      else itemErrors[idx] = { ...itemErrors[idx], ...err };
    });

    if (itemErrors.some(e => Object.keys(e).length > 0)) {
      errors.items = itemErrors;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Object.values(errors).flatMap(Object.values).forEach(toast.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(form.entityId),
        totalAmount: Math.round(totalAmount).toFixed(0),
        items: form.items
          .filter(i => i.productId && i.quantity > 0)
          .map(i => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity),
          })),
      };

      const res = await axios.post(`${VITE_API_BASE_URL}/sales/create-sale`, payload, axiosConfig);
      toast.success(`Sale #${res.data.saleId} created!`);
      fetchSales();
      closeCreateDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Stack spacing={3}>
          {/* Sales Table */}
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Sales Entry Table</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openCreateDialog}>
                  Create New Sale
                </Button>
              </Stack>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status", "Action"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
                    ) : salesData.length > 0 ? (
                      salesData.map(sale => (
                        <TableRow key={sale.saleId} hover>
                          <TableCell>#{sale.saleId}</TableCell>
                          <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.createdBy}</TableCell>
                          <TableCell>₹{sale.totalAmount.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <Chip label={sale.saleStatus} color={sale.saleStatus === "APPROVED" ? "success" : "warning"} size="small" />
                          </TableCell>
                          <TableCell>
                          <IconButton size="small" color="primary" onClick={() => openViewDialog(sale)}>
  <VisibilityIcon fontSize="small" />
</IconButton>

                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={7} align="center">No sales found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>

        {/* === NEW SALE DIALOG === */}
        <Dialog
          open={isCreateDialogOpen}
          onClose={closeCreateDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
          <form id="new-sale-form" onSubmit={handleSubmit}>
            <DialogTitle sx={{ py: 3, px: 4, background: sectionBg }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>New Sale Entry</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Live Total: <strong>₹{Math.round(totalAmount).toLocaleString("en-IN")}</strong>
                </Typography>
              </Stack>
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                background: sectionBg,
                py: 3,
                px: 4,
                maxHeight: "65vh",
                overflowY: "auto",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: isDark ? "#444" : "#ccc",
                  borderRadius: 3,
                },
              }}
            >
              <Stack spacing={3}>

                {/* Customer + Date */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <FormControl
                        fullWidth
                        required
                        error={!!formErrors.entityId}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: inputBg,
                            '& fieldset': { borderColor: isDark ? '#444' : '#ddd' },
                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? '#aaa' : '#666',
                            transform: 'translate(14px, -9px) scale(0.75)', // Force shrink
                            backgroundColor: miniCardBg, // Prevent overlap
                            padding: '0 4px',
                            zIndex: 1,
                          },
                          '& .MuiSelect-select': {
                            color: isDark ? '#fff' : '#000',
                            paddingTop: '16px', // Label ke liye space
                          },
                        }}
                      >
                        <InputLabel
                          shrink
                          sx={{
                            transform: 'translate(14px, -9px) scale(0.75)',
                            backgroundColor: miniCardBg,
                            padding: '0 4px',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        >
                          Select Customer
                        </InputLabel>

                        <Select
                          value={form.entityId}
                          onChange={(e) => {
                            setForm(prev => ({ ...prev, entityId: e.target.value }));
                            setFormErrors(prev => ({ ...prev, entityId: "" }));
                          }}
                          disabled={isSubmitting}
                          displayEmpty
                          sx={{ minWidth: { xs: 280, md: 320 } }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                minWidth: 400,
                                maxHeight: 350,
                                backgroundColor: inputBg,
                                color: isDark ? '#fff' : '#000',
                              }
                            },
                          }}
                          renderValue={(selected) => {
                            if (!selected) return <span style={{ color: isDark ? '#777' : '#aaa' }}>Select a customer</span>;
                            const c = customers.find(c => c.customerId === selected);
                            return c?.customerName || "";
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select a customer</em>
                          </MenuItem>
                          {customers.map(c => (
                            <MenuItem key={c.customerId} value={c.customerId} sx={{ py: 2 }}>
                              <Typography noWrap={false}>{c.customerName}</Typography>
                            </MenuItem>
                          ))}
                        </Select>
                        {formErrors.entityId && <FormHelperText>{formErrors.entityId}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label="Sale Date"
                        value={form.date}
                        onChange={(d) => setForm(prev => ({ ...prev, date: d }))}
                        disabled={isSubmitting}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: inputBg,
                                '& fieldset': { borderColor: isDark ? '#444' : '#ddd' },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                              },
                              '& .MuiInputLabel-root': { color: isDark ? '#aaa' : '#666' },
                              '& input': { color: isDark ? '#fff' : '#000' },
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Products */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Products to Sell</Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    {form.items.map((item, idx) => {
                      const itemErr = (formErrors.items && formErrors.items[idx]) || {};
                      return (
                        <Paper
                          key={idx}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            background: isDark ? "#071027" : "#fff",
                            boxShadow: "0 6px 18px rgba(15,15,15,0.04)",
                            border: 1,
                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                          }}
                        >
                          <Grid container spacing={2.5} alignItems="center">
                            {/* Product Select */}
                            <Grid item xs={12} md={5}>
                              <FormControl
                                fullWidth
                                size="small"
                                error={!!itemErr.productId}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: inputBg,
                                    '& fieldset': { borderColor: isDark ? '#444' : '#ddd' },
                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                  },
                                  '& .MuiInputLabel-root': { color: isDark ? '#aaa' : '#666' },
                                  '& .MuiSelect-select': { color: isDark ? '#fff' : '#000' },
                                }}
                              >
                                <InputLabel
                                  shrink
                                  sx={{
                                    transform: 'translate(14px, -9px) scale(0.75)',
                                    backgroundColor: isDark ? '#071027' : '#fff',
                                    padding: '0 4px',
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                  }}
                                >
                                  Product
                                </InputLabel>
                                <Select
                                  value={item.productId || ""}
                                  onChange={(e) => {
                                    const existing = form.items.findIndex(
                                      (it, i) => i !== idx && it.productId === e.target.value
                                    );
                                    if (existing !== -1) {
                                      toast.error("Product already added!");
                                      return;
                                    }
                                    handleProductChange(e, idx);
                                  }}
                                  disabled={isSubmitting}
                                  sx={{ minWidth: 280 }}
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        minWidth: 400,
                                        maxHeight: 350,
                                        backgroundColor: inputBg,
                                        color: isDark ? '#fff' : '#000',
                                      }
                                    },
                                  }}
                                  renderValue={(selected) => {
                                    if (!selected) return <em style={{ color: isDark ? '#777' : '#aaa' }}>Select Product</em>;
                                    const p = products.find(p => p.productId === selected);
                                    return p?.name || "";
                                  }}
                                >
                                  <MenuItem value="" disabled><em>Select Product</em></MenuItem>
                                  {products.map(p => {
                                    const isUsed = form.items.some((it, i) => i !== idx && it.productId === p.productId);
                                    return (
                                      <MenuItem
                                        key={p.productId}
                                        value={p.productId}
                                        disabled={isUsed}
                                        sx={{ py: 2, opacity: isUsed ? 0.4 : 1 }}
                                      >
                                        {p.name} {isUsed && "(Added)"}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                {itemErr.productId && <FormHelperText>{itemErr.productId}</FormHelperText>}
                              </FormControl>
                            </Grid>

                            {/* Quantity */}
                            <Grid item xs={5} md={2.5}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Quantity"
                                type="text"
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 1 }}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(e, idx)}
                                onBlur={() => handleQuantityBlur(idx)}
                                disabled={!item.productId || isSubmitting}
                                error={!!itemErr.quantity}
                                helperText={itemErr.quantity}
                                placeholder="0"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: inputBg,
                                    '& fieldset': { borderColor: isDark ? '#444' : '#ddd' },
                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                  },
                                  '& .MuiInputLabel-root': { color: isDark ? '#aaa' : '#666' },
                                  '& input': { color: isDark ? '#fff' : '#000' },
                                }}
                              />
                            </Grid>

                            {/* Unit Price */}
                            <Grid item xs={5} md={3}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Unit Price"
                                value={item.perUnit ? `₹${Number(item.perUnit).toLocaleString("en-IN")}` : ""}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                                disabled
                                sx={{
                                  '& .MuiFilledInput-root': {
                                    backgroundColor: filledBg,
                                    '&:hover': { backgroundColor: filledBg },
                                    '&.Mui-focused': { backgroundColor: filledBg },
                                  },
                                  '& .MuiInputLabel-root': { color: isDark ? '#aaa' : '#666' },
                                  '& input': { color: isDark ? '#fff' : '#000', fontWeight: 600 },
                                }}
                              />
                            </Grid>

                            {/* Delete Button */}
                            <Grid item xs={2} md={1.5} sx={{ display: "flex", justifyContent: "center" }}>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(idx)}
                                disabled={isSubmitting || form.items.length === 1}
                                sx={{
                                  border: 2,
                                  borderColor: 'error.main',
                                  width: 36,
                                  height: 36,
                                  '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    transform: 'scale(1.05)',
                                  },
                                  transition: 'all 0.2s',
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      );
                    })}
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddItem} disabled={isSubmitting} sx={{ fontWeight: 600 }}>
                      Add Product
                    </Button>
                  </Box>
                </Paper>

                {/* Summary */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>Summary</Typography>

                  {form.items.some(it => it.productId && Number(it.quantity) > 0) && (
                    <>
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {form.items.map((item, idx) => {
                          if (!item.productId || !item.quantity) return null;
                          const subtotal = Number(item.quantity) * Number(item.perUnit);
                          return (
                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.productName} × {item.quantity}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ₹{subtotal.toLocaleString("en-IN")}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                      <Divider sx={{ mb: 2.5 }} />
                    </>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount:</Typography>
                    <Box sx={{
                      background: isDark ? "rgba(255,255,255,0.06)" : "#e8f0fe",
                      px: 4, py: 2, borderRadius: 2
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        ₹{Math.round(totalAmount).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 4, py: 3, background: sectionBg }}>
              <Button onClick={closeCreateDialog} disabled={isSubmitting} sx={{ fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="new-sale-form"
                variant="contained"
                disabled={isSubmitting || totalAmount === 0 || !form.entityId}
                sx={{ fontWeight: 600, px: 4 }}
              >
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit Sale"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* === VIEW SALE DIALOG === */}
<Dialog
  open={isViewDialogOpen}
  onClose={closeViewDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
>
  {selectedSale && (
    <>
      <DialogTitle
        sx={{
          py: 3,
          px: 4,
          background: sectionBg,
          borderBottom: 1,
          borderColor: isDark ? "#222" : "#ddd",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Sale Details — #{selectedSale.saleId}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          background: sectionBg,
          py: 3,
          px: 4,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark ? "#444" : "#ccc",
            borderRadius: 3,
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Date:{" "}
            <strong>{dayjs(selectedSale.saleDate).format("DD MMM YYYY")}</strong>
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Customer: <strong>{selectedSale.customerName}</strong>
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Created By: <strong>{selectedSale.createdBy}</strong>
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Status:{" "}
            <Chip
              label={selectedSale.saleStatus}
              color={
                selectedSale.saleStatus === "APPROVED" ? "success" : "warning"
              }
              size="small"
            />
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Sold Items
          </Typography>

          {selectedSale.items && selectedSale.items.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                background: miniCardBg,
                borderRadius: 2,
                boxShadow: "none",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Qty
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Unit Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSale.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ₹{item.perUnit?.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell align="right">
                        ₹
                        {(
                          (item.quantity || 0) * (item.perUnit || 0)
                        ).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No items found for this sale.</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total:
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: theme.palette.primary.main }}
            >
              ₹{selectedSale.totalAmount.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2, background: sectionBg }}>
        <Button onClick={closeViewDialog} variant="contained" sx={{ fontWeight: 600 }}>
          Close
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>

      </Box>
    </LocalizationProvider>
  );
}