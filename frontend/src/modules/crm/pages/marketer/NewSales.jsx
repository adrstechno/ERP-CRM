// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   CircularProgress,
//   Grid,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControl,
//   InputAdornment,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Skeleton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
// } from "@mui/material";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { VITE_API_BASE_URL } from "../../utils/State";
// import toast from "react-hot-toast";


// // --- Status Chip ---
// const StatusChip = ({ status }) => {
//   let color;
//   if (status === "COMPLETED") color = "success";
//   else if (status === "PENDING") color = "warning";
//   else color = "error";

//   return (
//     <Chip
//       label={status}
//       color={color}
//       size="small"
//       variant="outlined"
//       sx={{ fontWeight: "bold" }}
//     />
//   );
// };

// export default function NewSales() {
//   const [sales, setSales] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [dealers, setDealers] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [form, setForm] = useState({
//     saleToEntity: "",
//     entityId: "",
//     date: dayjs(),
//     items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
//   });

//   const token = localStorage.getItem("authKey");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const axiosConfig = useMemo(() => {
//     return {
//       headers: { Authorization: `Bearer ${token}` },
//     };
//   }, [token]);

//   const ADMIN_ID = 1;
//   const LOGGED_IN_MARKETER = { id: user?._id || "5", name: user?.name || "marketer" };

//   // --- Fetch Dropdown Data ---
//   const fetchDropdownData = useCallback(async () => {
//     try {
//       console.log("Fetching dropdown data with config:", axiosConfig);

//       const [dealerRes, customerRes, productRes] = await Promise.all([
//         axios.get(`${VITE_API_BASE_URL}/user/dealers`, axiosConfig),
//         axios.get(`${VITE_API_BASE_URL}/customer`, axiosConfig),
//         axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
//       ]);

//       // ✅ Format dealers based on your actual API response
//       const formattedDealers = (dealerRes.data || []).map((dealer) => ({
//         id: dealer.userId, // from your API
//         name: dealer.name,
//         email: dealer.email,
//         role: dealer.role?.name || "DEALER",
//       }));

//       console.log("✅ Dealers fetched:", formattedDealers);
//       setDealers(formattedDealers);
//       setCustomers(customerRes.data || []);
//       setProducts(productRes.data || []);
//     } catch (error) {
//       console.error("❌ Error fetching dropdown data:", error);
//       if (error.response && error.response.status === 401) {
//         toast.error("Your session has expired. Please log in again.");
//       }
//     }
//   }, [axiosConfig]);
//   // --- Fetch Sales Data ---
//   const fetchSales = useCallback(async () => {
//     try {
//       setIsLoading(true);

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/sales/get-all-sales`,
//         axiosConfig
//       );

//       console.log("✅ All Sales Response:", response.data);

//       const formattedSales = (response.data || []).map((sale) => ({
//         id: `#S${sale.saleId}`,
//         date: sale.saleDate,
//         customerName: sale.customerName || "N/A",
//         createdBy: sale.createdBy || "N/A",
//         amount: sale.totalAmount || 0,
//         status: sale.saleStatus || "PENDING",
//       }));



//       setSales(formattedSales);
//     } catch (error) {
//       console.error("❌ Error fetching all sales:", error);
//       toast.error("Failed to load sales list. Please check console for details.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [axiosConfig]);

//   useEffect(() => {
//     fetchDropdownData();
//     fetchSales();
//   }, [fetchDropdownData, fetchSales]);

//   // --- Form Change ---
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEntitySelect = (value) => {
//     if (form.saleToType === "Dealer") {
//       const dealer = dealers.find((d) => d.id === value);
//       if (dealer) {
//         setForm((prev) => ({
//           ...prev,
//           saleToEntity: dealer.name,
//           entityId: dealer.id,
//         }));
//       }
//     } else {
//       const customer = customers.find((c) => c.customerId === value);
//       if (customer) {
//         setForm((prev) => ({
//           ...prev,
//           saleToEntity: customer.customerName,
//           entityId: customer.customerId,
//         }));
//       }
//     }
//   };

//   const handleProductSelect = (value) => {
//     const product = products.find((p) => p.name === value);
//     setForm((prev) => ({
//       ...prev,
//       salesItem: product?.name || "",
//       productId: product?.productId || "",
//       perUnit: product?.price || 0,
//     }));
//   };

//   const handleDateChange = (d) => {
//     setForm((prev) => ({ ...prev, date: d }));
//   };

//   const amount = useMemo(() => {
//     const qty = parseFloat(form.quantity);
//     const price = parseFloat(form.perUnit);
//     return isNaN(qty) || isNaN(price) ? 0 : qty * price;
//   }, [form.quantity, form.perUnit]);

//   // --- Submit Sale ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!form.entityId) {
//       toast.success("Please select a customer before submitting.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // Prepare payload as per new API
//       const payload = {
//         customerId: Number(form.entityId),
//         totalAmount: form.items
//           .reduce((sum, item) => sum + item.quantity * item.perUnit, 0)
//           .toFixed(0), // still stringified but safe
//         items: form.items.map((item) => ({
//           productId: Number(item.productId),
//           quantity: Number(item.quantity),
//         })),
//       };

//       console.log("🧾 Final Sale Payload:", payload);

//       const response = await axios.post(
//         `${VITE_API_BASE_URL}/sales/create-sale`,
//         payload,
//         axiosConfig
//       );

//       console.log("✅ Sale created successfully:", response.data);
//       toast.success(`Sale Created Successfully for ${response.data.customerName}`);

//       // Refresh the table after creation
//       fetchSales();
//       handleCloseDialog();
//     } catch (error) {
//       console.error("❌ Error creating sale:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to create sale.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };




//   const handleOpenDialog = () => setIsDialogOpen(true);
//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     setForm({
//       saleToType: "",
//       saleToEntity: "",
//       entityId: "",
//       salesItem: "",
//       productId: "",
//       date: dayjs(),
//       quantity: 1,
//       perUnit: 0,
//     });
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box>
//         <Card
//           sx={{
//             height: "calc(100vh - 120px)",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <CardContent>
//             <Stack
//               direction={{ xs: "column", md: "row" }}
//               justifyContent="space-between"
//               spacing={2}
//               mb={2}
//             >
//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <PointOfSaleIcon color="primary" />
//                 <Typography variant="h6" fontWeight="bold">
//                   Sales Entries
//                 </Typography>
//               </Stack>
//               <Button
//                 variant="contained"
//                 startIcon={<AddCircleOutlineIcon />}
//                 onClick={handleOpenDialog}
//               >
//                 Create New Sale
//               </Button>
//             </Stack>
//           </CardContent>

//           {/* --- Sales Table --- */}
//           <TableContainer sx={{ flexGrow: 1, overflowY: "auto" }}>
//             <Table stickyHeader size="small">
//               <TableHead>
//                 <TableRow>
//                   {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status"].map((h) => (
//                     <TableCell key={h}>{h}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   Array.from(new Array(5)).map((_, i) => (
//                     <TableRow key={i}>
//                       <TableCell colSpan={6}>
//                         <Skeleton />
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : sales.length > 0 ? (
//                   sales.map((sale) => (
//                     <TableRow key={sale.id} hover>
//                       <TableCell sx={{ fontWeight: 500 }}>{sale.id}</TableCell>
//                       <TableCell>{dayjs(sale.date).format("DD MMM YYYY")}</TableCell>
//                       <TableCell>{sale.customerName}</TableCell>
//                       <TableCell>{sale.createdBy}</TableCell>
//                       <TableCell>₹{sale.amount.toLocaleString("en-IN")}</TableCell>
//                       <TableCell>
//                         <StatusChip status={sale.status} />
//                       </TableCell>

//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center">
//                       No sales records found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>

//         {/* --- Dialog --- */}
//         <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//           <DialogTitle>New Sale Entry</DialogTitle>
//           <DialogContent>
//             <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//               <Stack spacing={2.5}>
//                 {/* Customer Selection */}
//                 <FormControl fullWidth>
//                   <InputLabel>Select Customer</InputLabel>
//                   <Select
//                     value={form.entityId}
//                     label="Select Customer"
//                     onChange={(e) => {
//                       const customer = customers.find(
//                         (c) => c.customerId === e.target.value
//                       );
//                       if (customer) {
//                         setForm((prev) => ({
//                           ...prev,
//                           saleToEntity: customer.customerName,
//                           entityId: customer.customerId,
//                         }));
//                       }
//                     }}
//                   >
//                     {customers.map((c) => (
//                       <MenuItem key={c.customerId} value={c.customerId}>
//                         {c.customerName}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 {/* Product Section */}
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   Products
//                 </Typography>

//                 {form.items?.map((item, index) => (
//                   <Grid container spacing={2} key={index}>
//                     <Grid item xs={5}>
//                       <FormControl fullWidth>
//                         <InputLabel>Product</InputLabel>
//                         <Select
//                           value={item.productId || ""}
//                           label="Product"
//                           onChange={(e) => {
//                             const selected = products.find(
//                               (p) => p.productId === e.target.value
//                             );
//                             const updated = [...form.items];
//                             updated[index] = {
//                               ...updated[index],
//                               productId: selected.productId,
//                               productName: selected.name,
//                               perUnit: selected.price,
//                             };
//                             setForm((prev) => ({ ...prev, items: updated }));
//                           }}
//                         >
//                           {products.map((p) => (
//                             <MenuItem key={p.productId} value={p.productId}>
//                               {p.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>

//                     <Grid item xs={3}>
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Quantity"
//                         value={item.quantity}
//                         onChange={(e) => {
//                           const updated = [...form.items];
//                           updated[index].quantity = Number(e.target.value);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }}
//                         inputProps={{ min: 1 }}
//                       />
//                     </Grid>

//                     <Grid item xs={3}>
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Price (₹)"
//                         value={item.perUnit}
//                         onChange={(e) => {
//                           const updated = [...form.items];
//                           updated[index].perUnit = Number(e.target.value);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }}
//                         inputProps={{ min: 0 }}
//                       />
//                     </Grid>

//                     <Grid item xs={1}>
//                       <Button
//                         color="error"
//                         onClick={() => {
//                           const updated = form.items.filter((_, i) => i !== index);
//                           setForm((prev) => ({ ...prev, items: updated }));
//                         }}
//                       >
//                         ❌
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 ))}

//                 <Button
//                   startIcon={<AddCircleOutlineIcon />}
//                   onClick={() =>
//                     setForm((prev) => ({
//                       ...prev,
//                       items: [
//                         ...(prev.items || []),
//                         { productId: "", productName: "", quantity: 1, perUnit: 0 },
//                       ],
//                     }))
//                   }
//                 >
//                   Add Product
//                 </Button>

//                 <DatePicker
//                   label="Sale Date"
//                   value={form.date}
//                   onChange={(d) => setForm((prev) => ({ ...prev, date: d }))}
//                   sx={{ width: "100%" }}
//                 />

//                 {/* Total Amount */}
//                 <TextField
//                   fullWidth
//                   label="Total Amount (₹)"
//                   value={
//                     (form.items || [])
//                       .reduce(
//                         (sum, item) => sum + item.quantity * item.perUnit,
//                         0
//                       )
//                       .toLocaleString("en-IN")
//                   }
//                   InputProps={{
//                     readOnly: true,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography fontWeight="bold">₹</Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="filled"
//                 />
//               </Stack>
//             </Box>
//           </DialogContent>
//           <DialogActions sx={{ p: "16px 24px" }}>
//             <Button onClick={handleCloseDialog} disabled={isSubmitting}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               form="new-sale-form"
//               variant="contained"
//               disabled={isSubmitting}
//             >
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
  FormHelperText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";

export default function SalesManagement() {
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Dropdowns
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form state
  const [form, setForm] = useState({
    entityId: "",
    date: dayjs(),
    items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Fetch all sales
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

  // Fetch customers and products
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

  // Validation Logic
  const validateForm = () => {
    let newErrors = {};

    if (!form.entityId) newErrors.entityId = "Customer is required.";
    if (!form.date) newErrors.date = "Sale date is required.";

    if (!form.items || form.items.length === 0)
      newErrors.items = "At least one product is required.";

    form.items.forEach((item, index) => {
      if (!item.productId)
        newErrors[`items.${index}.productId`] = "Product required.";
      if (item.quantity <= 0)
        newErrors[`items.${index}.quantity`] = "Quantity must be greater than 0.";
      if (item.perUnit <= 0)
        newErrors[`items.${index}.perUnit`] = "Price must be greater than 0.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: Number(form.entityId),
        saleDate: form.date,
        totalAmount: form.items.reduce(
          (sum, item) => sum + item.quantity * item.perUnit,
          0
        ),
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

      toast.success(`Sale created for ${response.data.customerName}`);
      fetchSales();
      handleCloseCreateDialog();
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error(error.response?.data?.message || "Failed to create sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dialog Controls ---
  const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setErrors({});
    setForm({
      entityId: "",
      date: dayjs(),
      items: [{ productId: "", productName: "", quantity: 1, perUnit: 0 }],
    });
  };

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
      console.error("Error fetching details:", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedSaleDetails(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Stack spacing={3}>
          {/* --- Sales Table --- */}
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
                  onClick={handleOpenCreateDialog}
                >
                  Create New Sale
                </Button>
              </Stack>

              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {[
                        "Sale ID",
                        "Date",
                        "Customer",
                        "Created By",
                        "Amount",
                        "Status",
                        "Action",
                      ].map((head) => (
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
                          <TableCell>
                            {dayjs(sale.saleDate).format("DD MMM YYYY")}
                          </TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.createdBy}</TableCell>
                          <TableCell>
                            ₹{sale.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={sale.saleStatus}
                              color={
                                sale.saleStatus === "APPROVED"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(sale.saleId)}
                            >
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

        {/* --- Create Sale Dialog --- */}
        <Dialog
          open={isCreateDialogOpen}
          onClose={handleCloseCreateDialog}
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
                <FormControl fullWidth error={!!errors.entityId}>
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
                  {errors.entityId && (
                    <FormHelperText>{errors.entityId}</FormHelperText>
                  )}
                </FormControl>

                <Typography variant="subtitle1" fontWeight="bold">
                  Products
                </Typography>

                {errors.items && (
                  <Typography color="error" variant="body2">
                    {errors.items}
                  </Typography>
                )}

                {form.items.map((item, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={5}>
                      <FormControl
                        fullWidth
                        error={!!errors[`items.${index}.productId`]}
                      >
                        <InputLabel>Product</InputLabel>
                        <Select
                          value={item.productId || ""}
                          label="Product"
                          onChange={(e) => {
                            const selected = products.find(
                              (p) => p.productId === e.target.value
                            );
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
                        {errors[`items.${index}.productId`] && (
                          <FormHelperText>
                            {errors[`items.${index}.productId`]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={item.quantity}
                        error={!!errors[`items.${index}.quantity`]}
                        helperText={errors[`items.${index}.quantity`]}
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
                        fullWidth
                        type="number"
                        label="Price (₹)"
                        value={item.perUnit}
                        error={!!errors[`items.${index}.perUnit`]}
                        helperText={errors[`items.${index}.perUnit`]}
                        onChange={(e) => {
                          const updated = [...form.items];
                          updated[index].perUnit = Number(e.target.value);
                          setForm((prev) => ({ ...prev, items: updated }));
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        color="error"
                        onClick={() => {
                          const updated = form.items.filter(
                            (_, i) => i !== index
                          );
                          setForm((prev) => ({ ...prev, items: updated }));
                        }}
                      >
                        ❌
                      </Button>
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
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Total Amount (₹)"
                  value={(
                    (form.items || []).reduce(
                      (sum, item) => sum + item.quantity * item.perUnit,
                      0
                    ) || 0
                  ).toLocaleString("en-IN")}
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
          <DialogActions>
            <Button onClick={handleCloseCreateDialog} disabled={isSubmitting}>
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

        {/* --- Details Dialog --- */}
        <Dialog
          open={isDetailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Sale Details</DialogTitle>
          <DialogContent>
            {isDetailsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedSaleDetails ? (
              <Stack spacing={2}>
                <Typography>
                  <strong>Customer:</strong> {selectedSaleDetails.customerName}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {dayjs(selectedSaleDetails.saleDate).format("DD MMM YYYY")}
                </Typography>
                <Typography>
                  <strong>Total:</strong> ₹
                  {selectedSaleDetails.totalAmount.toLocaleString("en-IN")}
                </Typography>
              </Stack>
            ) : (
              <Typography>No details available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}


