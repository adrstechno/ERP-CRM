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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; // Added for product removal
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

// --- Custom Tooltip for Charts (UNMODIFIED) ---
const CustomTooltip = ({ active, payload, label }) => {
  // const theme = useTheme();
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

  // State for Create Sale Dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for View Details Dialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // State for dialog dropdowns
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // State for the new sale form
  const [form, setForm] = useState({
    entityId: "",
    date: dayjs(),
    // Initial perUnit is now 0 by default, it will be set upon product selection
    items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
  });

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // --- Utility for Product Price Lookup ---
  const getProductPrice = useCallback(
    (productId) => {
      const product = products.find((p) => p.productId === productId);
      // Return the price if found, otherwise 0
      return product ? product.price : 0;
    },
    [products]
  );
  
  // --- Calculation: Memoized Total Amount (IMPROVED) ---
  // Recalculates total amount whenever form items change
  const totalAmount = useMemo(() => {
    return (form.items || []).reduce((sum, item) => {
      const price = getProductPrice(item.productId);
      return sum + item.quantity * price;
    }, 0);
  }, [form.items, getProductPrice]);


  // --- Data Fetching (UNMODIFIED) ---
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
      // Ensure products state is set for lookup
      setProducts(productRes.data || []); 
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchSales();
    fetchDropdownData();
  }, [fetchSales, fetchDropdownData]);
  
  // --- Approve Sale Handler (UNMODIFIED) ---
  const handleApproveSale = async (saleId) => {
    try {
      const response = await axios.patch(
        `${VITE_API_BASE_URL}/sales/${saleId}/status`,
        { saleStatus: "APPROVED" },
        axiosConfig
      );
      if (response.status === 200) {
        toast.success(`Sale ${saleId} Approved Successfully!`);
        fetchSales(); // Refresh data
      }
    } catch (error) {
      console.error(`Error approving sale ${saleId}:`, error);
      toast.error("Failed to approve sale.");
    }
  };

  // --- View Details Handlers (UNMODIFIED) ---
  const handleViewDetails = async (saleId) => {
    setIsDetailsDialogOpen(true);
    setIsDetailsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_API_BASE_URL}/sales/get-sale/${saleId}`,
        axiosConfig
      );
      setSelectedSaleDetails(response.data);
    } catch (error) {
      console.error(`Error fetching details for sale ${saleId}:`, error);
      setSelectedSaleDetails(null);
      toast.error("Failed to fetch sale details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedSaleDetails(null);
  };

  // --- Create Dialog and Form Handlers (MODIFIED) ---
  const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setForm({
      entityId: "",
      date: dayjs(),
      items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
    });
  };

  // --- Form Field Change Handler for New Sale (NEW/MODIFIED) ---
  const handleProductChange = (e, index) => {
    const newProductId = e.target.value;
    const selectedProduct = products.find((p) => p.productId === newProductId);

    const updatedItems = form.items.map((item, i) => {
      if (i === index) {
        // Set perUnit from the selected product's price, and make it fixed
        return {
          ...item,
          productId: newProductId,
          productName: selectedProduct ? selectedProduct.name : "",
          perUnit: selectedProduct ? selectedProduct.price : 0, 
        };
      }
      return item;
    });

    setForm((prev) => ({ ...prev, items: updatedItems }));
  };
  
  const handleQuantityChange = (e, index) => {
    const newQuantity = Number(e.target.value);
    const updatedItems = form.items.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity >= 1 ? newQuantity : 1 }; // Min quantity is 1
      }
      return item;
    });

    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { productId: "", productName: "", quantity: 1, perUnit: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: updated }));
  };


  // --- Form Submission (MODIFIED for correct total amount logic) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validItems = form.items.filter(item => item.productId && item.quantity > 0);
    
    if (!form.entityId) {
      toast.error("Please select a customer before submitting.");
      setIsSubmitting(false);
      return;
    }
    
    if (validItems.length === 0) {
      toast.error("Please add at least one valid product with quantity.");
      setIsSubmitting(false);
      return;
    }


    try {
      const payload = {
        customerId: Number(form.entityId),
        // Calculate total amount based on current fixed prices from state/lookup
        totalAmount: totalAmount.toFixed(0), 
        items: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          // Price should not be sent in item payload if not required by API, 
          // or derive it from product list if API expects it. 
          // Assuming API uses product ID and quantity, and calculates total from that.
          // If API strictly needs the unit price, we include the fixed price:
          unitPrice: getProductPrice(item.productId),
        })),
      };

      const response = await axios.post(
        `${VITE_API_BASE_URL}/sales/create-sale`,
        payload,
        axiosConfig
      );

      toast.success(`Sale Created Successfully for ${response.data.customerName}`);
      fetchSales(); // Refresh the table
      handleCloseCreateDialog();
    } catch (error) {
      console.error("Error creating sale:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create sale.");
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
          {/* Charts (UNMODIFIED) */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ height: '100%', width: 500 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>Dealer-wise Sales</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 250 }}>
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
              <Card sx={{ height: '100%', width: 400 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>Sale Status Distribution</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[ { name: "Pending", value: salesData.filter((s) => s.saleStatus === "PENDING").length, }, { name: "Approved", value: salesData.filter((s) => s.saleStatus === "APPROVED").length, }, { name: "Cancelled", value: salesData.filter((s) => s.saleStatus === "CANCELLED").length, }, ]} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={5} dataKey="value" >
                          {["PENDING", "COMPLETED", "CANCELLED"].map((_, i) => (<Cell key={`cell-${i}`} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]}/> ))}
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

          {/* Sales Table (UNMODIFIED) */}
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Sales Entry Table</Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenCreateDialog}>Create New Sale</Button>
              </Stack>
              <TableContainer sx={{ maxHeight: 440, overflowY: "auto" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status", "Action"].map((head) => (
                        <TableCell key={head}>{head}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? ( <TableRow><TableCell colSpan={7} align="center"><CircularProgress/></TableCell></TableRow> ) : 
                    salesData.length > 0 ? (
                      salesData.map((sale) => (
                        <TableRow key={sale.saleId} hover>
                          <TableCell>{sale.saleId}</TableCell>
                          <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.createdBy}</TableCell>
                          <TableCell>₹{sale.totalAmount.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            {sale.saleStatus === "PENDING" ? (
                              <Button variant="contained" size="small" onClick={() => handleApproveSale(sale.saleId)}>Approve</Button>
                            ) : (
                              <Chip label={sale.saleStatus} color={sale.saleStatus === "APPROVED" ? "success" : "default"} size="small" icon={sale.saleStatus === "APPROVED" ? <CheckCircleIcon /> : null} variant="outlined"/>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary" onClick={() => handleViewDetails(sale.saleId)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : ( <TableRow><TableCell colSpan={7} align="center">No sales found</TableCell></TableRow> )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>

        {/* --- Sale Details Dialog (UNMODIFIED) --- */}
        <Dialog open={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Sale Details</DialogTitle>
          <DialogContent>
            {isDetailsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedSaleDetails ? (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Sale ID:</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.saleId}</Typography></Grid>

                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Customer Name:</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.customerName}</Typography></Grid>

                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Sale Date:</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">{dayjs(selectedSaleDetails.saleDate).format("DD MMM YYYY")}</Typography></Grid>

                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Created By:</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.createdBy}</Typography></Grid>

                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Approved By:</Typography></Grid>
                  <Grid item xs={6}><Typography fontWeight="bold">{selectedSaleDetails.approvedBy}</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Status:</Typography></Grid>
                  <Grid item xs={6}><Chip label={selectedSaleDetails.saleStatus} color={selectedSaleDetails.saleStatus === "APPROVED" ? "success" : "warning"} size="small" /></Grid>
                
                  <Grid item xs={6}><Typography variant="h6" color="text.secondary">Total Amount:</Typography></Grid>
                  <Grid item xs={6}><Typography variant="h6" fontWeight="bold">₹{selectedSaleDetails.totalAmount.toLocaleString("en-IN")}</Typography></Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }}/>
                
                <Typography variant="subtitle1" fontWeight="bold">Items Sold</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedSaleDetails.items.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.unitPrice.toLocaleString("en-IN")}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold'}}>₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            ) : ( <Typography>Could not load sale details.</Typography> )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* --- New Sale Dialog (MODIFIED UI/UX and Price Logic) --- */}
        <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth >
          <DialogTitle>New Sale Entry</DialogTitle>
          <DialogContent>
            <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }} >
              <Stack spacing={3}>
                
                {/* Section 1: Customer and Date */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <FormControl fullWidth required>
                            <InputLabel>Select Customer</InputLabel>
                            <Select 
                                value={form.entityId} 
                                label="Select Customer" 
                                onChange={(e) => setForm((prev) => ({...prev, entityId: e.target.value}))}
                                disabled={isSubmitting}
                            >
                                {customers.map((c) => ( <MenuItem key={c.customerId} value={c.customerId}>{c.customerName}</MenuItem> ))}
                            </Select>
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

                <Divider />

                {/* Section 2: Products List */}
                <Typography variant="subtitle1" fontWeight="bold">Products to Sell</Typography>
                
                {/* Table Header for Items */}
                <Grid container spacing={2} sx={{ mb: -1, fontWeight: 'bold' }}>
                    <Grid item xs={5}><Typography variant="body2">Product</Typography></Grid>
                    <Grid item xs={3}><Typography variant="body2" align="right">Quantity</Typography></Grid>
                    <Grid item xs={3}><Typography variant="body2" align="right">Unit Price (Fixed)</Typography></Grid>
                    <Grid item xs={1}></Grid> {/* Action */}
                </Grid>
                
                {form.items?.map((item, index) => {
                    // Look up the actual fixed price for display, or use the temporary state price if not found (shouldn't happen if logic is correct)
                    const fixedPrice = getProductPrice(item.productId);
                    return (
                        <Grid container spacing={2} key={index} alignItems="center">
                            <Grid item xs={5}>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel>Product</InputLabel>
                                    <Select 
                                        value={item.productId || ""} 
                                        label="Product" 
                                        onChange={(e) => handleProductChange(e, index)}
                                        disabled={isSubmitting}
                                    >
                                        {products.map((p) => (<MenuItem key={p.productId} value={p.productId}>{p.name}</MenuItem> ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField 
                                    fullWidth 
                                    size="small"
                                    type="number" 
                                    label="Quantity" 
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(e, index)} 
                                    inputProps={{ min: 1 }}
                                    disabled={!item.productId || isSubmitting}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                {/* Price is now READ-ONLY and derived from selected product */}
                                <TextField 
                                    fullWidth 
                                    size="small"
                                    label="Price (₹)" 
                                    value={fixedPrice.toLocaleString("en-IN")} // Display fixed price
                                    InputProps={{ 
                                        readOnly: true, 
                                        startAdornment: (<InputAdornment position="start">₹</InputAdornment>), 
                                    }} 
                                    variant="filled" // Use filled to show it's read-only
                                />
                            </Grid>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                <IconButton 
                                    color="error" 
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={form.items.length === 1 || isSubmitting} // Prevent removing the last item
                                    size="small"
                                > 
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    );
                })}

                <Button 
                    startIcon={<AddCircleOutlineIcon />} 
                    onClick={handleAddItem}
                    disabled={isSubmitting}
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Add Product
                </Button>
                
                <Divider />
                
                {/* Section 3: Total Amount Summary */}
                <TextField 
                    fullWidth 
                    label="Estimated Total Amount (₹)" 
                    value={totalAmount.toLocaleString("en-IN")} // Use memoized total amount
                    InputProps={{ 
                        readOnly: true, 
                        startAdornment: (<InputAdornment position="start"><Typography fontWeight="bold">₹</Typography></InputAdornment>), 
                        style: { fontWeight: 'bold' }
                    }} 
                    variant="outlined" // Can be outlined for better visibility
                    sx={{ 
                        "& .MuiInputBase-input": { fontSize: '1.25rem' },
                        "& .MuiInputLabel-root": { fontSize: '1.25rem' } 
                    }}
                />

              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button onClick={handleCloseCreateDialog} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" form="new-sale-form" variant="contained" disabled={isSubmitting || totalAmount === 0 || !form.entityId}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Sale"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}