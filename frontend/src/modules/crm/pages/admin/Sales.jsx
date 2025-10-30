// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Divider,
//   Stack,
//   Button,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   InputAdornment,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { VITE_API_BASE_URL } from "../../utils/State";
// import toast from "react-hot-toast";

// // --- Custom Tooltip for Charts ---
// const CustomTooltip = ({ active, payload, label }) => {
//   // const theme = useTheme();
//   if (active && payload && payload.length) {
//     return (
//       <Card sx={{ p: 1 }}>
//         <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
//           {label}
//         </Typography>
//         {payload.map((entry, index) => (
//           <Typography
//             key={`item-${index}`}
//             sx={{ color: entry.color, fontWeight: "bold" }}
//           >
//             {`${entry.name}: ${entry.value.toLocaleString("en-IN")}${
//               entry.unit || ""
//             }`}
//           </Typography>
//         ))}
//       </Card>
//     );
//   }
//   return null;
// };

// export default function SalesManagement() {
//   const theme = useTheme();
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for Create Sale Dialog
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // State for View Details Dialog
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
//   const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
//   const [isDetailsLoading, setIsDetailsLoading] = useState(false);

//   // State for dialog dropdowns
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);

//   // State for the new sale form
//   const [form, setForm] = useState({
//     entityId: "",
//     date: dayjs(),
//     items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
//   });

//   const token = localStorage.getItem("authKey");
//   const axiosConfig = useMemo(
//     () => ({
//       headers: { Authorization: `Bearer ${token}` },
//     }),
//     [token]
//   );

//   const fetchSales = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${VITE_API_BASE_URL}/sales/get-all-sales`,
//         axiosConfig
//       );
//       setSalesData(response.data);
//     } catch (error) {
//       console.error("Error fetching sales:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [axiosConfig]);

//   const fetchDropdownData = useCallback(async () => {
//     try {
//       const [customerRes, productRes] = await Promise.all([
//         axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
//         axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
//       ]);
//       setCustomers(customerRes.data || []);
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("Error fetching dropdown data:", error);
//     }
//   }, [axiosConfig]);

//   useEffect(() => {
//     fetchSales();
//     fetchDropdownData();
//   }, [fetchSales, fetchDropdownData]);

//   const handleApproveSale = async (saleId) => {
//     try {
//       const response = await axios.patch(
//         `${VITE_API_BASE_URL}/sales/${saleId}/status`,
//         { saleStatus: "APPROVED" },
//         axiosConfig
//       );
//       if (response.status === 200) {
//         fetchSales(); // Refresh data
//       }
//     } catch (error) {
//       console.error(`Error approving sale ${saleId}:`, error);
//     }
//   };

//   // --- View Details Handlers ---
//   const handleViewDetails = async (saleId) => {
//     setIsDetailsDialogOpen(true);
//     setIsDetailsLoading(true);
//     try {
//       const response = await axios.get(
//         `${VITE_API_BASE_URL}/sales/get-sale/${saleId}`,
//         axiosConfig
//       );
//       setSelectedSaleDetails(response.data);
//     } catch (error) {
//       console.error(`Error fetching details for sale ${saleId}:`, error);
//       setSelectedSaleDetails(null); 
//     } finally {
//       setIsDetailsLoading(false);
//     }
//   };

//   const handleCloseDetailsDialog = () => {
//     setIsDetailsDialogOpen(false);
//     setSelectedSaleDetails(null);
//   };

//   // --- Create Dialog and Form Handlers ---
//   const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
//   const handleCloseCreateDialog = () => {
//     setIsCreateDialogOpen(false);
//     setForm({
//       entityId: "",
//       date: dayjs(),
//       items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!form.entityId) {
//       toast.success("Please select a customer before submitting.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const payload = {
//         customerId: Number(form.entityId),
//         totalAmount: form.items
//           .reduce((sum, item) => sum + item.quantity * item.perUnit, 0)
//           .toFixed(0),
//         items: form.items.map((item) => ({
//           productId: Number(item.productId),
//           quantity: Number(item.quantity),
//         })),
//       };

//       const response = await axios.post(
//         `${VITE_API_BASE_URL}/sales/create-sale`,
//         payload,
//         axiosConfig
//       );

//       toast.success(`Sale Created Successfully for ${response.data.customerName}`);
//       fetchSales(); // Refresh the table
//       handleCloseCreateDialog();
//     } catch (error) {
//       console.error("Error creating sale:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to create sale.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const PIE_CHART_COLORS = [
//     theme.palette.primary.main,
//     theme.palette.success.main,
//     theme.palette.warning.main,
//     theme.palette.error.main,
//   ];

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box>
//         <Stack spacing={3}>
//           {/* Charts */}
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={7}>
//               <Card sx={{ height:  '100%' , width: 500}}>
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>Dealer-wise Sales</Typography>
//                   <Divider sx={{ mb: 2 }} />
//                   <Box sx={{ height: 250 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                         <XAxis dataKey="customerName" stroke={theme.palette.text.secondary} />
//                         <YAxis stroke={theme.palette.text.secondary} />
//                         <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
//                         <Legend />
//                         <Bar dataKey="totalAmount" fill={theme.palette.primary.main} barSize={30} radius={[5, 5, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Card sx={{ height:  '100%' , width: 400}}>
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>Sale Status Distribution</Typography>
//                   <Divider sx={{ mb: 2 }} />
//                   <Box sx={{ height: 250 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie data={[ { name: "Pending", value: salesData.filter((s) => s.saleStatus === "PENDING").length, }, { name: "Approved", value: salesData.filter((s) => s.saleStatus === "APPROVED").length, }, { name: "Cancelled", value: salesData.filter((s) => s.saleStatus === "CANCELLED").length, }, ]} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={5} dataKey="value" >
//                           {["PENDING", "COMPLETED", "CANCELLED"].map((_, i) => (<Cell key={`cell-${i}`} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]}/> ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Sales Table */}
//           <Card>
//             <CardContent>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>Sales Entry Table</Typography>
//                 <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenCreateDialog}>Create New Sale</Button>
//               </Stack>
//               <TableContainer sx={{ maxHeight: 440, overflowY: "auto" }}>
//                 <Table stickyHeader size="small">
//                   <TableHead>
//                     <TableRow>
//                       {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status", "Action"].map((head) => (
//                         <TableCell key={head}>{head}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {loading ? ( <TableRow><TableCell colSpan={7} align="center"><CircularProgress/></TableCell></TableRow> ) : 
//                     salesData.length > 0 ? (
//                       salesData.map((sale) => (
//                         <TableRow key={sale.saleId} hover>
//                           <TableCell>{sale.saleId}</TableCell>
//                           <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
//                           <TableCell>{sale.customerName}</TableCell>
//                           <TableCell>{sale.createdBy}</TableCell>
//                           <TableCell>₹{sale.totalAmount.toLocaleString("en-IN")}</TableCell>
//                           <TableCell>
//                             {sale.saleStatus === "PENDING" ? (
//                               <Button variant="contained" size="small" onClick={() => handleApproveSale(sale.saleId)}>Approve</Button>
//                             ) : (
//                               <Chip label={sale.saleStatus} color={sale.saleStatus === "APPROVED" ? "success" : "default"} size="small" icon={sale.saleStatus === "APPROVED" ? <CheckCircleIcon /> : null} variant="outlined"/>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <IconButton size="small" color="primary" onClick={() => handleViewDetails(sale.saleId)}>
//                               <VisibilityIcon fontSize="small" />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : ( <TableRow><TableCell colSpan={7} align="center">No sales found</TableCell></TableRow> )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </Stack>

//         {/* --- Sale Details Dialog --- */}
//         <Dialog open={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
//           <DialogTitle>Sale Details</DialogTitle>
//           <DialogContent>
//             {isDetailsLoading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//               </Box>
//             ) : selectedSaleDetails ? (
//               <Stack spacing={2} sx={{ mt: 1 }}>
//                 <Grid container spacing={1.5}>
//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Sale ID:</Typography></Grid>
//                   <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.saleId}</Typography></Grid>

//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Customer Name:</Typography></Grid>
//                   <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.customerName}</Typography></Grid>

//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Sale Date:</Typography></Grid>
//                   <Grid item xs={6}><Typography fontWeight="bold">{dayjs(selectedSaleDetails.saleDate).format("DD MMM YYYY")}</Typography></Grid>

//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Created By:</Typography></Grid>
//                   <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.createdBy}</Typography></Grid>

//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Approved By:</Typography></Grid>
//                   <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.approvedBy}</Typography></Grid>

//                   <Grid item xs={6}><Typography variant="body2" color="text.secondary">Status:</Typography></Grid>
//                   <Grid item xs={6}><Chip label={selectedSaleDetails.saleStatus} color={selectedSaleDetails.saleStatus === "APPROVED" ? "success" : "warning"} size="small" /></Grid>

//                   <Grid item xs={6}><Typography variant="h6" color="text.secondary">Total Amount:</Typography></Grid>
//                   <Grid item xs={6}><Typography variant="h6" fontWeight="bold">₹{selectedSaleDetails.totalAmount.toLocaleString("en-IN")}</Typography></Grid>
//                 </Grid>

//                 <Divider sx={{ my: 2 }}/>

//                 <Typography variant="subtitle1" fontWeight="bold">Items Sold</Typography>
//                 <TableContainer>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Product</TableCell>
//                         <TableCell align="right">Qty</TableCell>
//                         <TableCell align="right">Unit Price</TableCell>
//                         <TableCell align="right">Subtotal</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedSaleDetails.items.map((item) => (
//                         <TableRow key={item.productId}>
//                           <TableCell>{item.productName}</TableCell>
//                           <TableCell align="right">{item.quantity}</TableCell>
//                           <TableCell align="right">₹{item.unitPrice.toLocaleString("en-IN")}</TableCell>
//                           <TableCell align="right" sx={{ fontWeight: 'bold'}}>₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Stack>
//             ) : ( <Typography>Could not load sale details.</Typography> )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDetailsDialog}>Close</Button>
//           </DialogActions>
//         </Dialog>

//         {/* --- New Sale Dialog --- */}
//         <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth >
//           <DialogTitle>New Sale Entry</DialogTitle>
//           <DialogContent>
//             <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }} >
//               <Stack spacing={2.5}>
//                 <FormControl fullWidth>
//                   <InputLabel>Select Customer</InputLabel>
//                   <Select value={form.entityId} label="Select Customer" onChange={(e) => setForm((prev) => ({...prev, entityId: e.target.value,}))}>
//                     {customers.map((c) => ( <MenuItem key={c.customerId} value={c.customerId}>{c.customerName}</MenuItem> ))}
//                   </Select>
//                 </FormControl>

//                 <Typography variant="subtitle1" fontWeight="bold">Products</Typography>

//                 {form.items?.map((item, index) => (
//                   <Grid container spacing={2} key={index} alignItems="center">
//                     <Grid item xs={5}>
//                       <FormControl fullWidth>
//                         <InputLabel>Product</InputLabel>
//                         <Select value={item.productId || ""} label="Product" onChange={(e) => {
//                             const selected = products.find((p) => p.productId === e.target.value);
//                             const updated = [...form.items];
//                             updated[index] = { ...updated[index], productId: selected.productId, productName: selected.name, perUnit: selected.price, };
//                             setForm((prev) => ({ ...prev, items: updated }));
//                           }} >
//                           {products.map((p) => (<MenuItem key={p.productId} value={p.productId}>{p.name}</MenuItem> ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={3}>
//                       <TextField fullWidth type="number" label="Quantity" value={item.quantity} onChange={(e) => {
//                           const updated = [...form.items]; updated[index].quantity = Number(e.target.value);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }} inputProps={{ min: 1 }} />
//                     </Grid>
//                     <Grid item xs={3}>
//                       <TextField fullWidth type="number" label="Price (₹)" value={item.perUnit} onChange={(e) => {
//                           const updated = [...form.items]; updated[index].perUnit = Number(e.target.value);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }} inputProps={{ min: 0 }} />
//                     </Grid>
//                     <Grid item xs={1}>
//                       <Button color="error" onClick={() => {
//                           const updated = form.items.filter((_, i) => i !== index);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }} > ❌ </Button>
//                     </Grid>
//                   </Grid>
//                 ))}

//                 <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setForm((prev) => ({...prev, items: [...(prev.items || []), { productId: "", productName: "", quantity: 1, perUnit: 0 },],}))}>
//                   Add Product
//                 </Button>

//                 <DatePicker label="Sale Date" value={form.date} onChange={(d) => setForm((prev) => ({ ...prev, date: d }))} />
//                 <TextField fullWidth label="Total Amount (₹)" value={(form.items || []).reduce( (sum, item) => sum + item.quantity * item.perUnit, 0 ).toLocaleString("en-IN")} InputProps={{ readOnly: true, startAdornment: ( <InputAdornment position="start"><Typography fontWeight="bold">₹</Typography></InputAdornment> ), }} variant="filled" />
//               </Stack>
//             </Box>
//           </DialogContent>
//           <DialogActions sx={{ p: "16px 24px" }}>
//             <Button onClick={handleCloseCreateDialog} disabled={isSubmitting}>Cancel</Button>
//             <Button type="submit" form="new-sale-form" variant="contained" disabled={isSubmitting}>
//               {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Sale"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </LocalizationProvider>
//   );
// }


// SalesManagement.jsx
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
  Paper,
  FormHelperText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
import toast from "react-hot-toast";

/* ---------------- Custom tooltip ---------------- */
const CustomTooltip = ({ active, payload, label }) => {
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
            {`${entry.name}: ${entry.value.toLocaleString("en-IN")}${entry.unit || ""}`}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

/* ---------------- Main component ---------------- */
export default function SalesManagement() {
  const theme = useTheme();

  // data
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // dialogs / loading
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // dropdowns
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // form: quantity stored as string to allow free typing
  const [form, setForm] = useState({
    entityId: "",
    date: dayjs(),
    items: [{ productId: "", productName: "", quantity: "", perUnit: 0 }],
  });

  // field-level errors: entityId and items parallel array
  const [formErrors, setFormErrors] = useState({ entityId: "", items: [] });

  // axios config
  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // helper: find product object
  const findProduct = useCallback(
    (productId) => products.find((p) => String(p.productId) === String(productId)),
    [products]
  );

  // total amount computed from fixed perUnit and quantity
  const totalAmount = useMemo(() => {
    return (form.items || []).reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const unit = Number(item.perUnit) || 0;
      return sum + qty * unit;
    }, 0);
  }, [form.items]);

  /* ---------------- Data fetching ---------------- */
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${VITE_API_BASE_URL}/sales/get-all-sales`, axiosConfig);
      setSalesData(res.data || []);
    } catch (err) {
      console.error("Fetch sales error:", err);
      toast.error("Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  }, [axiosConfig]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
      ]);
      setCustomers(custRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error("Fetch dropdowns error:", err);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchSales();
    fetchDropdownData();
  }, [fetchSales, fetchDropdownData]);

  /* ---------------- Sale actions ---------------- */
  const handleApproveSale = async (saleId) => {
    try {
      const res = await axios.patch(
        `${VITE_API_BASE_URL}/sales/${saleId}/status`,
        { saleStatus: "APPROVED" },
        axiosConfig
      );
      if (res.status === 200) {
        toast.success(`Sale ${saleId} Approved Successfully!`);
        fetchSales();
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve sale.");
    }
  };

  const handleViewDetails = async (saleId) => {
    setIsDetailsDialogOpen(true);
    setIsDetailsLoading(true);
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/sales/get-sale/${saleId}`, axiosConfig);
      setSelectedSaleDetails(res.data);
    } catch (err) {
      console.error("Details error:", err);
      setSelectedSaleDetails(null);
      toast.error("Failed to fetch sale details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedSaleDetails(null);
  };

  /* ---------------- Create dialog handlers ---------------- */
  const openCreateDialog = () => {
    setForm({
      entityId: "",
      date: dayjs(),
      items: [{ productId: "", productName: "", quantity: "", perUnit: 0 }],
    });
    setFormErrors({ entityId: "", items: [] });
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setIsSubmitting(false);
    setFormErrors({ entityId: "", items: [] });
  };

  /* ---------------- Form field handlers ---------------- */
  // Product selection: set perUnit fixed (read-only)
  const handleProductChange = (e, index) => {
    const newProductId = e.target.value;
    const product = findProduct(newProductId);
    const updated = form.items.map((it, i) =>
      i === index
        ? {
          ...it,
          productId: String(newProductId),
          productName: product ? product.name : "",
          perUnit: product ? Number(product.price) : 0,
        }
        : it
    );
    setForm((prev) => ({ ...prev, items: updated }));

    // clear product error for this row
    setFormErrors((prev) => {
      const items = prev.items ? [...prev.items] : [];
      items[index] = { ...(items[index] || {}), productId: "" };
      return { ...prev, items };
    });
  };

  // Quantity typing: allow free edit (digits only), prevent 0 and negative
  const handleQuantityChange = (e, index) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d]/g, ""); // keep digits only

    // Don't allow starting with 0
    if (cleaned === "0" || (cleaned.length > 1 && cleaned[0] === "0")) {
      return;
    }

    const updated = form.items.map((it, i) => (i === index ? { ...it, quantity: cleaned } : it));
    setForm((prev) => ({ ...prev, items: updated }));

    // clear qty error while typing
    setFormErrors((prev) => {
      const items = prev.items ? [...prev.items] : [];
      items[index] = { ...(items[index] || {}), quantity: "" };
      return { ...prev, items };
    });
  };

  // On blur, ensure minimum 1 if empty
  const handleQuantityBlur = (index) => {
    const updated = form.items.map((it, i) => {
      if (i !== index) return it;
      const qtyNum = Number(it.quantity) || 0;
      // If empty or 0, leave empty (validation will catch it)
      if (!it.quantity || qtyNum < 1) {
        return { ...it, quantity: "" };
      }
      return { ...it, quantity: String(qtyNum) };
    });
    setForm((prev) => ({ ...prev, items: updated }));
  };

  // Add / Remove item rows
  const handleAddItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), { productId: "", productName: "", quantity: "", perUnit: 0 }],
    }));

  const handleRemoveItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      items: updated.length ? updated : [{ productId: "", productName: "", quantity: "", perUnit: 0 }]
    }));
    setFormErrors((prev) => {
      const items = prev.items ? [...prev.items] : [];
      items.splice(index, 1);
      return { ...prev, items };
    });
  };

  /* ---------------- Validation ---------------- */
  const validateForm = () => {
    let ok = true;
    const errors = { entityId: "", items: [] };

    if (!form.entityId) {
      errors.entityId = "Please select a customer.";
      ok = false;
    }

    if (!form.items || form.items.length === 0) {
      toast.error("Add at least one product.");
      ok = false;
    } else {
      form.items.forEach((it, idx) => {
        errors.items[idx] = { productId: "", quantity: "" };

        if (!it.productId) {
          errors.items[idx].productId = "Please select a product.";
          ok = false;
        }

        const qty = Number(it.quantity) || 0;
        if (!it.quantity || qty < 1) {
          errors.items[idx].quantity = "Quantity must be at least 1.";
          ok = false;
        }

        if (!it.perUnit || Number(it.perUnit) <= 0) {
          errors.items[idx].productId = errors.items[idx].productId || "Selected product has invalid price.";
          ok = false;
        }
      });
    }

    setFormErrors(errors);
    return ok;
  };

  /* ---------------- Submit handler ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(form.entityId),
        totalAmount: Math.round(totalAmount),
        items: form.items
          .filter((it) => it.productId && Number(it.quantity) >= 1)
          .map((it) => ({
            productId: Number(it.productId),
            quantity: Number(it.quantity),
            unitPrice: Number(it.perUnit),
          })),
        saleDate: form.date ? dayjs(form.date).toISOString() : undefined,
      };

      const res = await axios.post(`${VITE_API_BASE_URL}/sales/create-sale`, payload, axiosConfig);
      toast.success(`Sale Created Successfully for ${res.data.customerName || "customer"}`);
      fetchSales();
      closeCreateDialog();
    } catch (err) {
      console.error("Create sale error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to create sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const PIE_CHART_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  /* ---------------- Dialog style: invoice feel ---------------- */
  const dialogPaperSx = {
    width: "100%",
    maxWidth: 920,
    m: 1,
  };

  /* ---------------- Theme-based card background ---------------- */
  const cardBgLight = "#f5f7fb";
  const cardBgDark = "#0b1220";
  const isDark = theme.palette.mode === "dark";
  const sectionBg = isDark ? cardBgDark : cardBgLight;
  const miniCardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Charts */}
          <Grid container spacing={8}>
            <Grid item xs={12} md={7}>
              <Card sx={{ height: "100%", minHeight: 260 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Dealer-wise Sales
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="customerName" stroke={theme.palette.text.secondary} />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                        <Legend />
                        <Bar dataKey="totalAmount" fill={theme.palette.primary.main} barSize={30} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ height: "100%", minHeight: 260 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Sale Status Distribution
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Pending", value: salesData.filter((s) => s.saleStatus === "PENDING").length },
                            { name: "Approved", value: salesData.filter((s) => s.saleStatus === "APPROVED").length },
                            { name: "Cancelled", value: salesData.filter((s) => s.saleStatus === "CANCELLED").length },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1, 2].map((_, i) => (
                            <Cell key={`cell-${i}`} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />
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

          {/* Sales table */}
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Sales Entry Table
                </Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openCreateDialog}>
                  Create New Sale
                </Button>
              </Stack>

              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status", "Action"].map((head) => (
                        <TableCell key={head}>{head}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : salesData.length > 0 ? (
                      salesData.map((sale) => (
                        <TableRow key={sale.saleId} hover>
                          <TableCell>{sale.saleId}</TableCell>
                          <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.createdBy}</TableCell>
                          <TableCell>₹{sale.totalAmount.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            {sale.saleStatus === "PENDING" ? (
                              <Button variant="contained" size="small" onClick={() => handleApproveSale(sale.saleId)}>
                                Approve
                              </Button>
                            ) : (
                              <Chip label={sale.saleStatus} color={sale.saleStatus === "APPROVED" ? "success" : "default"} size="small" icon={sale.saleStatus === "APPROVED" ? <CheckCircleIcon /> : null} variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary" onClick={() => handleViewDetails(sale.saleId)}>
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


        {/* Sale details dialog */}
       {/* Sale details dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onClose={closeDetails}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxWidth: 800
            }
          }}
        >
          <DialogTitle sx={{ pb: 2, pt: 3, px: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                Sale Invoice
              </Typography>
              {selectedSaleDetails && (
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.5,
                    background: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5",
                    borderRadius: 1.5,
                    fontWeight: 600,
                    color: "text.secondary"
                  }}
                >
                  ID: #{selectedSaleDetails.saleId}
                </Typography>
              )}
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3, pb: 3, px: 4 }}>
            {isDetailsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : selectedSaleDetails ? (
              <Stack spacing={3}>
                {/* Header Info Section - Professional Layout */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    background: isDark ? "rgba(255,255,255,0.02)" : "#fafbfc",
                    border: 1,
                    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Row 1: Customer Name and Status */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontSize: "0.65rem",
                          display: "block",
                          mb: 0.75
                        }}
                      >
                        Customer Name
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                        {selectedSaleDetails.customerName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontSize: "0.65rem",
                          display: "block",
                          mb: 0.75
                        }}
                      >
                        Status
                      </Typography>
                      <Chip
                        label={selectedSaleDetails.saleStatus}
                        color={
                          selectedSaleDetails.saleStatus === "APPROVED"
                            ? "success"
                            : selectedSaleDetails.saleStatus === "PENDING"
                              ? "warning"
                              : "default"
                        }
                        size="small"
                        icon={selectedSaleDetails.saleStatus === "APPROVED" ? <CheckCircleIcon /> : null}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          px: 2,
                          height: 30
                        }}
                      />
                    </Grid>

                    {/* Row 2: Sale Date and Approved By */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontSize: "0.65rem",
                          display: "block",
                          mb: 0.75
                        }}
                      >
                        Sale Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {dayjs(selectedSaleDetails.saleDate).format("DD MMMM YYYY")}
                      </Typography>
                    </Grid>

                    {selectedSaleDetails.approvedBy && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                            fontSize: "0.65rem",
                            display: "block",
                            mb: 0.75
                          }}
                        >
                          Approved By
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                          {selectedSaleDetails.approvedBy}
                        </Typography>
                      </Grid>
                    )}

                    {/* Row 3: Created By */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontSize: "0.65rem",
                          display: "block",
                          mb: 0.75
                        }}
                      >
                        Created By
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {selectedSaleDetails.createdBy}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Items Sold Section */}
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                      Items Sold
                    </Typography>
                    <Chip
                      label={`${selectedSaleDetails.items.length} ${selectedSaleDetails.items.length === 1 ? 'Item' : 'Items'}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 26,
                        px: 1.5,
                        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
                      }}
                    />
                  </Stack>

                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                      borderRadius: 2.5,
                      overflow: "hidden"
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background: isDark
                              ? "rgba(255,255,255,0.04)"
                              : "linear-gradient(180deg, #f8f9fa 0%, #f1f3f5 100%)"
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", py: 2, letterSpacing: 0.5 }}>
                            PRODUCT
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.75rem", py: 2, letterSpacing: 0.5 }}>
                            QTY
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.75rem", py: 2, letterSpacing: 0.5 }}>
                            UNIT PRICE
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.75rem", py: 2, letterSpacing: 0.5 }}>
                            SUBTOTAL
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSaleDetails.items.map((item, idx) => (
                          <TableRow
                            key={item.productId}
                            sx={{
                              '&:last-child td': { border: 0 },
                              '&:hover': {
                                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"
                              },
                              transition: 'background 0.2s ease'
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                {item.productName}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 2.5 }}>
                              <Chip
                                label={item.quantity}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  minWidth: 50,
                                  height: 28,
                                  fontSize: "0.85rem",
                                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                                  border: 1,
                                  borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                                }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ py: 2.5 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                ₹{item.unitPrice.toLocaleString("en-IN")}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 2.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                                ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Total Amount Section - Professional */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    background: isDark
                      ? "linear-gradient(135deg, rgba(46, 125, 50, 0.12) 0%, rgba(27, 94, 32, 0.08) 100%)"
                      : "linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)",
                    border: 1.5,
                    borderColor: isDark ? "rgba(76, 175, 80, 0.25)" : "#a5d6a7"
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                          display: "block",
                          mb: 0.75
                        }}
                      >
                        Total Amount
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.success.main,
                          letterSpacing: -0.5,
                          fontSize: "2rem"
                        }}
                      >
                        ₹{selectedSaleDetails.totalAmount.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: isDark
                          ? "rgba(76, 175, 80, 0.2)"
                          : "rgba(76, 175, 80, 0.15)",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 2,
                        borderColor: isDark ? "rgba(76, 175, 80, 0.3)" : "rgba(76, 175, 80, 0.25)"
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          fontSize: 32,
                          color: theme.palette.success.main
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary" variant="h6">
                  Could not load sale details.
                </Typography>
              </Box>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 4, py: 2.5, background: isDark ? "rgba(255,255,255,0.01)" : "#fafbfc" }}>
            <Button
              onClick={closeDetails}
              variant="contained"
              size="medium"
              sx={{
                px: 4,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem"
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create New Sale dialog - Invoice style with mini-cards */}
        <Dialog
          open={isCreateDialogOpen}
          onClose={closeCreateDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: dialogPaperSx }}
        >
          <form id="new-sale-form" onSubmit={handleSubmit}>
            <DialogTitle sx={{ py: 3, px: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>New Sale Entry</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Live Total: <strong>₹{Math.round(totalAmount).toLocaleString("en-IN")}</strong>
                </Typography>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ background: sectionBg, py: 3, px: 4 }}>
              <Stack spacing={3}>

                {/* Customer + Date Area (section card) */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth required error={!!formErrors.entityId}>
                        <InputLabel>Select Customer</InputLabel>
                        <Select
                          value={form.entityId}
                          label="Select Customer"
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, entityId: e.target.value }));
                            setFormErrors((prev) => ({ ...prev, entityId: "" }));
                          }}
                          disabled={isSubmitting}
                          sx={{
                            minWidth: 280
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                minHeight: 48,
                                minWidth: 400,
                                maxHeight: 350,
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (!selected) return <em>Select Customer</em>;
                            const customer = customers.find(c => c.customerId === selected);
                            return customer ? customer.customerName : "";
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select Customer</em>
                          </MenuItem>
                          {customers.map((c) => (
                            <MenuItem
                              key={c.customerId}
                              value={c.customerId}
                              sx={{
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                minHeight: '56px',
                                minWidth: '400px',
                                py: 2
                              }}
                            >
                              <Typography noWrap={false} sx={{ maxWidth: '100%' }}>
                                {c.customerName}
                              </Typography>
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
                        onChange={(d) => setForm((prev) => ({ ...prev, date: d }))}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Items area */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Products to Sell</Typography>
                  <Divider sx={{ mb: 2 }} />

                  {/* Each item as mini-card */}
                  <Stack spacing={2}>
                    {(form.items || []).map((item, idx) => {
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
                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                          }}
                        >
                          <Grid container spacing={2.5} alignItems="center">
                            <Grid item xs={12} md={5}>
                              <FormControl fullWidth size="small" error={!!itemErr.productId}>
                                <InputLabel>Product</InputLabel>
                                <Select
                                  value={item.productId || ""}
                                  label="Product"
                                  onChange={(e) => {
                                    const selectedProductId = e.target.value;
                                    
                                    // Check if product already exists in form items
                                    const existingItemIndex = form.items.findIndex(
                                      (it, i) => i !== idx && String(it.productId) === String(selectedProductId)
                                    );
                                    
                                    if (existingItemIndex !== -1) {
                                      // Product already exists, show alert and don't add
                                      alert("This product is already added. Please update the quantity of the existing item.");
                                      return;
                                    }
                                    
                                    // If product doesn't exist, proceed with normal product change
                                    handleProductChange(e, idx);
                                  }}
                                  disabled={isSubmitting}
                                  sx={{
                                    minWidth: 200
                                  }}
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        minWidth: 400,
                                        maxHeight: 350,
                                      },
                                    },
                                  }}
                                  renderValue={(selected) => {
                                    if (!selected) return <em>Select Product</em>;
                                    const product = products.find(p => String(p.productId) === String(selected));
                                    return product ? product.name : "";
                                  }}
                                >
                                  <MenuItem value="" disabled>
                                    <em>Select Product</em>
                                  </MenuItem>
                                  {products.map((p) => {
                                    // Check if this product is already selected in any other row
                                    const isAlreadySelected = form.items.some(
                                      (it, i) => i !== idx && String(it.productId) === String(p.productId)
                                    );
                                    
                                    return (
                                      <MenuItem
                                        key={p.productId}
                                        value={p.productId}
                                        disabled={isAlreadySelected}
                                        sx={{
                                          whiteSpace: 'normal',
                                          wordWrap: 'break-word',
                                          minHeight: '56px',
                                          minWidth: '400px',
                                          py: 2,
                                          opacity: isAlreadySelected ? 0.4 : 1
                                        }}
                                      >
                                        <Typography noWrap={false} sx={{ maxWidth: '100%' }}>
                                          {p.name} {isAlreadySelected && "(Already added)"}
                                        </Typography>
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                {itemErr.productId && <FormHelperText>{itemErr.productId}</FormHelperText>}
                              </FormControl>
                            </Grid>

                            <Grid item xs={5} md={2.5}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Quantity"
                                type="text"
                                required
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                  min: 1
                                }}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(e, idx)}
                                onBlur={() => handleQuantityBlur(idx)}
                                disabled={!item.productId || isSubmitting}
                                error={!!itemErr.quantity || (!item.quantity && item.productId)}
                                helperText={itemErr.quantity || (!item.quantity && item.productId ? "Required" : "")}
                                placeholder="0"
                              />
                            </Grid>

                            <Grid item xs={5} md={3}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Unit Price"
                                value={item.perUnit ? `₹${Number(item.perUnit).toLocaleString("en-IN")}` : ""}
                                InputProps={{
                                  readOnly: true
                                }}
                                variant="filled"
                                disabled
                              />
                            </Grid>

                            <Grid item xs={2} md={1.5} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(idx)}
                                disabled={isSubmitting || form.items.length === 1}
                                size="medium"
                                sx={{
                                  border: 1.5,
                                  borderColor: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                  },
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
                    <Button 
                      startIcon={<AddCircleOutlineIcon />} 
                      onClick={handleAddItem} 
                      disabled={isSubmitting}
                      sx={{ fontWeight: 600 }}
                    >
                      Add Product
                    </Button>
                  </Box>
                </Paper>

                {/* Summary */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, background: miniCardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>Summary</Typography>

                  {/* Show breakdown only if at least one product is selected */}
                  {form.items.some(it => it.productId && Number(it.quantity) > 0) && (
                    <>
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {form.items.map((item, idx) => {
                          if (!item.productId || !item.quantity || Number(item.quantity) <= 0) return null;
                          const qty = Number(item.quantity) || 0;
                          const price = Number(item.perUnit) || 0;
                          const subtotal = qty * price;

                          return (
                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.productName} × {qty}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ₹{subtotal.toLocaleString("en-IN")}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>

                      <Divider sx={{ mb: 2.5 }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Total items: {(form.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0)}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total Amount:
                    </Typography>
                    <Box sx={{ 
                      background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "#e8f0fe", 
                      px: 4, 
                      py: 2, 
                      borderRadius: 2 
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        ₹{Math.round(totalAmount).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 4, py: 3 }}>
              <Button onClick={closeCreateDialog} disabled={isSubmitting} sx={{ fontWeight: 600 }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="new-sale-form" 
                variant="contained" 
                disabled={isSubmitting || Math.round(totalAmount) === 0 || !form.entityId}
                sx={{ fontWeight: 600, px: 4 }}
              >
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit Sale"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}