// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//     Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Button, Chip, Avatar, Stack, IconButton, Dialog, DialogTitle,
//     DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
//     Grid, CardHeader
// } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import CategoryIcon from '@mui/icons-material/Category';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
// import { REACT_APP_BASE_URL } from '../../utils/State';

// const categories = ['AC Units', 'Parts', 'Electronics', 'Accessories'];

// const KpiCard = ({ title, value, icon, color }) => (
//     <Card>
//         <CardContent>
//             <Stack direction="row" spacing={2} alignItems="center">
//                 <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
//                     {icon}
//                 </Avatar>
//                 <Box>
//                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
//                     <Typography variant="body2" color="text.secondary">{title}</Typography>
//                 </Box>
//             </Stack>
//         </CardContent>
//     </Card>
// );

// export default function InventoryManagementContent() {
//     const [products, setProducts] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', warrantyMonths: '' });
//     const [loading, setLoading] = useState(false);

//     const token = localStorage.getItem('authKey'); // Get token from localStorage
//     const axiosConfig = {
//         headers: { Authorization: `Bearer ${token}` }
//     };

//     const handleClickOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false);
//         setNewProduct({ name: '', category: '', price: '', stock: '', warrantyMonths: '' });
//     };

//     // Fetch all products
//     const fetchAllProducts = async () => {
//         try {
//             const response = await axios.get(`${REACT_APP_BASE_URL}/products/all`, axiosConfig);
//             setProducts(response.data.map(p => ({
//                 id: p.productId,
//                 name: p.name,
//                 category: p.category,
//                 price: p.price,
//                 stock: p.stock,
//                 warrantyMonths: p.warrantyMonths,
//                 status: p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'
//             })));
//         } catch (err) {
//             console.error('Fetch Products Error:', err.response?.data || err.message);
//         }
//     };

//     useEffect(() => {
//         fetchAllProducts();
//     }, []);

//     const handleAddProduct = async () => {
//         try {
//             setLoading(true);
//             const body = {
//                 name: newProduct.name,
//                 category: newProduct.category,
//                 price: parseFloat(newProduct.price),
//                 stock: parseInt(newProduct.stock),
//                 warrantyMonths: parseInt(newProduct.warrantyMonths)
//             };
//             const response = await axios.post(`${REACT_APP_BASE_URL}/products/create`, body, axiosConfig);
//             setProducts(prev => [...prev, {
//                 id: response.data.productId,
//                 name: response.data.name,
//                 category: response.data.category,
//                 price: response.data.price,
//                 stock: response.data.stock,
//                 warrantyMonths: response.data.warrantyMonths,
//                 status: response.data.stock === 0 ? 'Out of Stock' : response.data.stock < 10 ? 'Low Stock' : 'In Stock'
//             }]);
//             handleClose();
//         } catch (err) {
//             console.error('Failed to save product', err.response?.data || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteProduct = async (id) => {
//         if (!window.confirm('Are you sure to delete this product?')) return;
//         try {
//             await axios.delete(`${REACT_APP_BASE_URL}/products/${id}/delete`, axiosConfig);
//             setProducts(prev => prev.filter(p => p.id !== id));
//         } catch (err) {
//             console.error('Delete Product Error:', err.response?.data || err.message);
//         }
//     };

//     const getStatusChip = (status) => {
//         let color = 'default';
//         if (status === 'In Stock') color = 'success';
//         if (status === 'Low Stock') color = 'warning';
//         if (status === 'Out of Stock') color = 'error';
//         return <Chip label={status} color={color} size="small" variant="outlined" />;
//     };

//     const kpiData = useMemo(() => {
//         const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
//         const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;
//         return [
//             { title: 'Total Products', value: products.length, icon: <InventoryIcon />, color: 'primary' },
//             { title: 'Total Categories', value: categories.length, icon: <CategoryIcon />, color: 'info' },
//             { title: 'Low Stock Items', value: lowStockCount, icon: <WarningAmberIcon />, color: 'warning' },
//             { title: 'Out of Stock Items', value: outOfStockCount, icon: <ReportProblemIcon />, color: 'error' },
//         ];
//     }, [products]);

//     return (
//         <Box>
//             {/* KPI Cards */}
//             <Grid container spacing={3} mb={3}>
//                 {kpiData.map((kpi, index) => (
//                     <Grid item key={index} xs={12} sm={6} md={3}>
//                         <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* Products Table */}
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                     <Card sx={{ height: 'calc(100vh - 280px)' }}>
//                         <CardHeader
//                             title="Product Inventory"
//                             action={
//                                 <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>
//                                     Add Product
//                                 </Button>
//                             }
//                         />
//                         <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
//                             <Table stickyHeader size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(head => (
//                                             <TableCell key={head}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {products.map((product) => (
//                                         <TableRow key={product.id} hover>
//                                             <TableCell>
//                                                 <Stack direction="row" alignItems="center" spacing={2}>
//                                                     <Avatar variant="rounded"><InventoryIcon /></Avatar>
//                                                     <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
//                                                 </Stack>
//                                             </TableCell>
//                                             <TableCell>{product.category}</TableCell>
//                                             <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{product.stock}</TableCell>
//                                             <TableCell>{getStatusChip(product.status)}</TableCell>
//                                             <TableCell>
//                                                 <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
//                                                 <IconButton size="small" onClick={() => handleDeleteProduct(product.id)}><DeleteIcon fontSize="small" /></IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Card>
//                 </Grid>

//                 {/* Stock Movement Table (mocked) */}
//                 <Grid item xs={12} md={4}>
//                     <Card sx={{ height: 'calc(100vh - 280px)' }}>
//                         <CardHeader title="Recent Stock Movement" />
//                         <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
//                             <Table stickyHeader size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Product', 'Type', 'Qty'].map(head => (
//                                             <TableCell key={head}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     <TableRow>
//                                         <TableCell colSpan={3} align="center">Stock movements will appear here.</TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Add Product Dialog */}
//             <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Product</DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={2} sx={{ mt: 2 }}>
//                         <TextField
//                             autoFocus
//                             label="Product Name"
//                             value={newProduct.name}
//                             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
//                             fullWidth
//                         />
//                         <FormControl fullWidth>
//                             <InputLabel>Category</InputLabel>
//                             <Select
//                                 value={newProduct.category}
//                                 onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
//                             >
//                                 {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
//                             </Select>
//                         </FormControl>
//                         <TextField
//                             label="Price"
//                             type="number"
//                             value={newProduct.price}
//                             onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
//                             fullWidth
//                         />
//                         <TextField
//                             label="Stock Quantity"
//                             type="number"
//                             value={newProduct.stock}
//                             onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
//                             fullWidth
//                         />
//                         <TextField
//                             label="Warranty Months"
//                             type="number"
//                             value={newProduct.warrantyMonths}
//                             onChange={e => setNewProduct({ ...newProduct, warrantyMonths: e.target.value })}
//                             fullWidth
//                         />
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button variant="contained" onClick={handleAddProduct} disabled={loading}>
//                         {loading ? 'Saving...' : 'Add Product'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }

// // import React, { useState, useMemo } from 'react';
// // import {
// //     Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
// //     TableHead, TableRow, Button, Chip, Avatar, Stack, IconButton, Dialog, DialogTitle,
// //     DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
// //     Grid, CardHeader
// // } from '@mui/material';
// // import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// // import EditIcon from '@mui/icons-material/Edit';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// // import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// // import InventoryIcon from '@mui/icons-material/Inventory';
// // import CategoryIcon from '@mui/icons-material/Category';
// // import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// // import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// // // --- Mock Data ---
// // const initialProducts = [
// //     { id: 1, name: 'AC Compressor XA-200', category: 'Parts', price: 12500, stock: 50, status: 'In Stock' },
// //     { id: 2, name: 'Cooling Coils (Set)', category: 'Parts', price: 4500, stock: 8, status: 'Low Stock' },
// //     { id: 3, name: '1.5 Ton Split AC Unit', category: 'AC Units', price: 38000, stock: 25, status: 'In Stock' },
// //     { id: 4, name: 'Digital Thermostat T-80', category: 'Electronics', price: 1200, stock: 150, status: 'In Stock' },
// //     { id: 5, name: '1 Ton Window AC Unit', category: 'AC Units', price: 26500, stock: 0, status: 'Out of Stock' },
// //     { id: 6, name: 'Filter Drier Pack', category: 'Accessories', price: 800, stock: 300, status: 'In Stock' },
// //     { id: 7, name: 'Fan Motor Assembly', category: 'Parts', price: 3200, stock: 5, status: 'Low Stock' },
// // ];

// // const stockMovementsData = [
// //     { id: 1, name: 'AC Compressor XA-200', type: 'Stock In', quantity: 20, date: '2025-09-15', user: 'John Carter' },
// //     { id: 2, name: '1.5 Ton Split AC Unit', type: 'Sale', quantity: -5, date: '2025-09-14', user: 'Sophie Moore' },
// //     { id: 3, name: 'Digital Thermostat T-80', type: 'Stock In', quantity: 100, date: '2025-09-14', user: 'Admin' },
// //     { id: 4, name: 'Cooling Coils (Set)', type: 'Sale', quantity: -12, date: '2025-09-13', user: 'Patrick Meyer' },
// //     { id: 5, name: '1 Ton Window AC Unit', type: 'Adjustment', quantity: -1, date: '2025-09-12', user: 'Admin' },
// // ];

// // const categories = ['AC Units', 'Parts', 'Electronics', 'Accessories'];

// // // Reusable KPI Card Component
// // const KpiCard = ({ title, value, icon, color }) => (
// //     <Card>
// //         <CardContent>
// //             <Stack direction="row" spacing={2} alignItems="center">
// //                 <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
// //                     {icon}
// //                 </Avatar>
// //                 <Box>
// //                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
// //                     <Typography variant="body2" color="text.secondary">{title}</Typography>
// //                 </Box>
// //             </Stack>
// //         </CardContent>
// //     </Card>
// // );

// // export default function InventoryManagementContent() {
// //     const [products, setProducts] = useState(initialProducts);
// //     const [open, setOpen] = useState(false);
// //     const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });

// //     const handleClickOpen = () => setOpen(true);
// //     const handleClose = () => {
// //         setOpen(false);
// //         setNewProduct({ name: '', category: '', price: '', stock: '' });
// //     };

// //     // Calculate KPI values
// //     const kpiData = useMemo(() => {
// //         const lowStockCount = initialProducts.filter(p => p.status === 'Low Stock').length;
// //         const outOfStockCount = initialProducts.filter(p => p.status === 'Out of Stock').length;
// //         return [
// //             { title: 'Total Products', value: initialProducts.length, icon: <InventoryIcon />, color: 'primary' },
// //             { title: 'Total Categories', value: categories.length, icon: <CategoryIcon />, color: 'info' },
// //             { title: 'Low Stock Items', value: lowStockCount, icon: <WarningAmberIcon />, color: 'warning' },
// //             { title: 'Out of Stock Items', value: outOfStockCount, icon: <ReportProblemIcon />, color: 'error' },
// //         ];
// //     }, [initialProducts]);

// //     const getStatusChip = (status) => {
// //         let color = 'default';
// //         if (status === 'In Stock') color = 'success';
// //         if (status === 'Low Stock') color = 'warning';
// //         if (status === 'Out of Stock') color = 'error';
// //         return <Chip label={status} color={color} size="small" variant="outlined" />;
// //     };

// //     const getMovementChip = (type) => {
// //         if (type === 'Stock In') return <Chip icon={<TrendingUpIcon />} label={type} color="success" size="small" variant="outlined" />;
// //         if (type === 'Sale') return <Chip icon={<TrendingDownIcon />} label={type} color="error" size="small" variant="outlined" />;
// //         return <Chip label={type} size="small" variant="outlined" />;
// //     };

// //     return (
// //         <Box>
// //             {/* KPI Cards Section */}
// //             <Grid container spacing={3} mb={3}>
// //                 {kpiData.map((kpi, index) => (
// //                     <Grid item xs={12} sm={6} md={3} key={index}>
// //                         <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
// //                     </Grid>
// //                 ))}
// //             </Grid>

// //             {/* Tables Section */}
// //             <Grid container spacing={3}>
// //                 {/* Main Inventory Table */}
// //                 <Grid item xs={12} md={8}>
// //                     <Card sx={{ height: 'calc(100vh - 280px)' }}>
// //                         <CardHeader
// //                             title="Product Inventory"
// //                             action={
// //                                 <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>
// //                                     Add Product
// //                                 </Button>
// //                             }
// //                         />
// //                         <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
// //                             <Table stickyHeader size="small">
// //                                 <TableHead>
// //                                     <TableRow>
// //                                         {['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(head => (
// //                                             <TableCell key={head}>{head}</TableCell>
// //                                         ))}
// //                                     </TableRow>
// //                                 </TableHead>
// //                                 <TableBody>
// //                                     {products.map((product) => (
// //                                         <TableRow key={product.id} hover>
// //                                             <TableCell>
// //                                                 <Stack direction="row" alignItems="center" spacing={2}>
// //                                                      <Avatar variant="rounded"><InventoryIcon/></Avatar>
// //                                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
// //                                                 </Stack>
// //                                             </TableCell>
// //                                             <TableCell>{product.category}</TableCell>
// //                                             <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
// //                                             <TableCell sx={{ fontWeight: 500 }}>{product.stock}</TableCell>
// //                                             <TableCell>{getStatusChip(product.status)}</TableCell>
// //                                             <TableCell>
// //                                                 <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
// //                                                 <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
// //                                             </TableCell>
// //                                         </TableRow>
// //                                     ))}
// //                                 </TableBody>
// //                             </Table>
// //                         </TableContainer>
// //                     </Card>
// //                 </Grid>

// //                 {/* Stock Movement Table */}
// //                  <Grid item xs={12} md={4}>
// //                     <Card sx={{ height: 'calc(100vh - 280px)' }}>
// //                         <CardHeader title="Recent Stock Movement" />
// //                         <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
// //                             <Table stickyHeader size="small">
// //                                 <TableHead>
// //                                     <TableRow>
// //                                         {['Product', 'Type', 'Qty'].map(head => (
// //                                             <TableCell key={head}>{head}</TableCell>
// //                                         ))}
// //                                     </TableRow>
// //                                 </TableHead>
// //                                 <TableBody>
// //                                     {stockMovementsData.map((movement) => (
// //                                         <TableRow key={movement.id} hover>
// //                                             <TableCell>
// //                                                 <Typography variant="body2" sx={{ fontWeight: 500 }}>{movement.name}</Typography>
// //                                                 <Typography variant="caption" color="text.secondary">{movement.date}</Typography>
// //                                             </TableCell>
// //                                             <TableCell>{getMovementChip(movement.type)}</TableCell>
// //                                             <TableCell sx={{ fontWeight: 500, color: movement.quantity > 0 ? 'success.main' : 'error.main' }}>
// //                                                 {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
// //                                             </TableCell>
// //                                         </TableRow>
// //                                     ))}
// //                                 </TableBody>
// //                             </Table>
// //                         </TableContainer>
// //                     </Card>
// //                 </Grid>
// //             </Grid>

// //             {/* Add Product Modal Form */}
// //             <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
// //                 <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Product</DialogTitle>
// //                 <DialogContent>
// //                     <Stack spacing={2} sx={{ mt: 2 }}>
// //                         <TextField autoFocus label="Product Name" name="name" fullWidth />
// //                         <FormControl fullWidth>
// //                             <InputLabel>Category</InputLabel>
// //                             <Select label="Category" name="category">
// //                                 {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
// //                             </Select>
// //                         </FormControl>
// //                         <TextField label="Price" name="price" type="number" fullWidth />
// //                         <TextField label="Stock Quantity" name="stock" type="number" fullWidth />
// //                     </Stack>
// //                 </DialogContent>
// //                 <DialogActions sx={{ p: '16px 24px' }}>
// //                     <Button onClick={handleClose}>Cancel</Button>
// //                     <Button variant="contained">Add Product</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box>
// //     );
// // }

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CardHeader,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { REACT_APP_BASE_URL } from "../../utils/State";

const categories = ["AC Units", "Parts", "Electronics", "Accessories"];

// KPI Card Component
const KpiCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function InventoryManagementContent() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    warrantyMonths: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authKey");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/products/all`,
        axiosConfig
      );
      setProducts(
        response.data.map((p) => ({
          id: p.productId,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          warrantyMonths: p.warrantyMonths,
          status:
            p.stock === 0
              ? "Out of Stock"
              : p.stock < 10
              ? "Low Stock"
              : "In Stock",
        }))
      );
    } catch (err) {
      console.error("Fetch Products Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setSelectedId(null);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      warrantyMonths: "",
    });
  };

  // Add Product
  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const body = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        warrantyMonths: parseInt(newProduct.warrantyMonths),
      };
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/products/create`,
        body,
        axiosConfig
      );
      consol.log(token)
      const data = response.data;
      setProducts((prev) => [
        ...prev,
        {
          id: data.productId,
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
          warrantyMonths: data.warrantyMonths,
          status:
            data.stock === 0
              ? "Out of Stock"
              : data.stock < 10
              ? "Low Stock"
              : "In Stock",
        },
      ]);
      handleClose();
    } catch (err) {
      console.error(
        "Failed to save product",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit Product - Open Dialog
  const handleEditProduct = (product) => {
    setEditing(true);
    setSelectedId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      warrantyMonths: product.warrantyMonths,
    });
    setOpen(true);
  };

  // Update Product
  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      const body = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        warrantyMonths: parseInt(newProduct.warrantyMonths),
      };
      const response = await axios.put(
        `${REACT_APP_BASE_URL}/products/${selectedId}/update`,
        body,
        axiosConfig
      );
      const updated = response.data;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedId
            ? {
                id: updated.productId,
                name: updated.name,
                category: updated.category,
                price: updated.price,
                stock: updated.stock,
                warrantyMonths: updated.warrantyMonths,
                status:
                  updated.stock === 0
                    ? "Out of Stock"
                    : updated.stock < 10
                    ? "Low Stock"
                    : "In Stock",
              }
            : p
        )
      );
      handleClose();
    } catch (err) {
      console.error("Update Product Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `${REACT_APP_BASE_URL}/products/${id}/delete`,
        axiosConfig
      );
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete Product Error:", err.response?.data || err.message);
    }
  };

  const getStatusChip = (status) => {
    let color = "default";
    if (status === "In Stock") color = "success";
    if (status === "Low Stock") color = "warning";
    if (status === "Out of Stock") color = "error";
    return (
      <Chip label={status} color={color} size="small" variant="outlined" />
    );
  };

  const kpiData = useMemo(() => {
    const lowStockCount = products.filter(
      (p) => p.status === "Low Stock"
    ).length;
    const outOfStockCount = products.filter(
      (p) => p.status === "Out of Stock"
    ).length;
    return [
      {
        title: "Total Products",
        value: products.length,
        icon: <InventoryIcon />,
        color: "primary",
      },
      {
        title: "Total Categories",
        value: categories.length,
        icon: <CategoryIcon />,
        color: "info",
      },
      {
        title: "Low Stock Items",
        value: lowStockCount,
        icon: <WarningAmberIcon />,
        color: "warning",
      },
      {
        title: "Out of Stock Items",
        value: outOfStockCount,
        icon: <ReportProblemIcon />,
        color: "error",
      },
    ];
  }, [products]);

  return (
    <Box>
      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        {kpiData.map((kpi, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Products Table */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "calc(100vh - 280px)" }}>
            <CardHeader
              title="Product Inventory"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleClickOpen}
                >
                  Add Product
                </Button>
              }
            />
            <TableContainer
              sx={{ height: "calc(100% - 72px)", overflowY: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      "Product Name",
                      "Category",
                      "Price",
                      "Stock",
                      "Warranty (Months)",
                      "Status",
                      "Action",
                    ].map((head) => (
                      <TableCell key={head}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar variant="rounded">
                            <InventoryIcon />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        ₹{product.price.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {product.stock}
                      </TableCell>
                      <TableCell>{product.warrantyMonths}</TableCell>
                      <TableCell>{getStatusChip(product.status)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditProduct(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Stock Movement Table (placeholder) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "calc(100vh - 280px)" }}>
            <CardHeader title="Recent Stock Movement" />
            <TableContainer
              sx={{ height: "calc(100% - 72px)", overflowY: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {["Product", "Type", "Qty"].map((head) => (
                      <TableCell key={head}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Stock movements will appear here.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Add / Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editing ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              label="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setNewProduct({ ...newProduct, price: value });
                }
              }}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Stock Quantity"
              type="number"
              value={newProduct.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setNewProduct({ ...newProduct, stock: value });
                }
              }}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Warranty Months"
              type="number"
              value={newProduct.warrantyMonths}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setNewProduct({ ...newProduct, warrantyMonths: value });
                }
              }}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editing ? handleUpdateProduct : handleAddProduct}
            disabled={loading}
          >
            {loading ? "Saving..." : editing ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
