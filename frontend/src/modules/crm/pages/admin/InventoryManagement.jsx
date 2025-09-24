// import React, { useState } from 'react';
// import {
//     Box, Grid, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip,
//     Avatar, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
//     TextField, FormControl, InputLabel, Select, MenuItem, DialogContentText
// } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// // --- Mock Data ---
// const initialProducts = [
//     { id: 1, image: '/img/ac-compressor.png', name: 'AC Compressor XA-200', category: 'Parts', price: 12500, stock: 50, status: 'In Stock' },
//     { id: 2, image: '/img/cooling-coil.png', name: 'Cooling Coils (Set)', category: 'Parts', price: 4500, stock: 8, status: 'Low Stock' },
//     { id: 3, image: '/img/split-ac.png', name: '1.5 Ton Split AC Unit', category: 'AC Units', price: 38000, stock: 25, status: 'In Stock' },
//     { id: 4, image: '/img/thermostat.png', name: 'Digital Thermostat T-80', category: 'Electronics', price: 1200, stock: 150, status: 'In Stock' },
//     { id: 5, image: '/img/window-ac.png', name: '1 Ton Window AC Unit', category: 'AC Units', price: 26500, stock: 0, status: 'Out of Stock' },
// ];

// const stockMovementsData = [
//     { id: 1, name: 'AC Compressor XA-200', type: 'Stock In', quantity: 20, date: '2025-09-15', user: 'John Carter' },
//     { id: 2, name: '1.5 Ton Split AC Unit', type: 'Sale', quantity: -5, date: '2025-09-14', user: 'Sophie Moore' },
//     { id: 3, name: 'Digital Thermostat T-80', type: 'Stock In', quantity: 100, date: '2025-09-14', user: 'Admin' },
//     { id: 4, name: 'Cooling Coils (Set)', type: 'Sale', quantity: -12, date: '2025-09-13', user: 'Patrick Meyer' },
//     { id: 5, name: '1 Ton Window AC Unit', type: 'Adjustment', quantity: -1, date: '2025-09-12', user: 'Admin' },
// ];

// const categories = ['AC Units', 'Parts', 'Electronics', 'Accessories'];

// export default function InventoryManagementContent() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';

//     const [products, setProducts] = useState(initialProducts);
//     const [open, setOpen] = useState(false);
//     const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });

//     const handleClickOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false);
//         setNewProduct({ name: '', category: '', price: '', stock: '' }); // Reset form
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewProduct(prev => ({ ...prev, [name]: value }));
//     };

//     const handleAddProduct = () => {
//         if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
//             const productToAdd = {
//                 id: products.length + 1,
//                 name: newProduct.name,
//                 category: newProduct.category,
//                 price: parseFloat(newProduct.price),
//                 stock: parseInt(newProduct.stock),
//                 status: parseInt(newProduct.stock) === 0 ? 'Out of Stock' : (parseInt(newProduct.stock) < 10 ? 'Low Stock' : 'In Stock'),
//                 image: '/img/placeholder.png', // Default image for new products
//             };
//             setProducts([productToAdd, ...products]);
//             handleClose();
//         }
//     };

//     const getStatusChip = (status) => {
//         let color = 'default';
//         if (status === 'In Stock') color = 'success';
//         if (status === 'Low Stock') color = 'warning';
//         if (status === 'Out of Stock') color = 'error';
//         return <Chip label={status} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
//     };

//     const getMovementChip = (type) => {
//         if (type === 'Stock In') return <Chip icon={<TrendingUpIcon />} label={type} color="success" size="small" variant="outlined" />;
//         if (type === 'Sale') return <Chip icon={<TrendingDownIcon />} label={type} color="error" size="small" variant="outlined" />;
//         return <Chip label={type} size="small" variant="outlined" />;
//     };

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Stack spacing={3}>
//                 {/* Top Card: Main Inventory Table */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Inventory Management</Typography>
//                             <Button
//                                 variant="contained"
//                                 startIcon={<AddCircleOutlineIcon />}
//                                 onClick={handleClickOpen}
//                             >
//                                 Add Product
//                             </Button>
//                         </Stack>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Image', 'Product Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {products.map((product) => (
//                                         <TableRow key={product.id} hover>
//                                             <TableCell><Avatar variant="rounded" src={product.image} /></TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
//                                             <TableCell>{product.category}</TableCell>
//                                             <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{product.stock}</TableCell>
//                                             <TableCell>{getStatusChip(product.status)}</TableCell>
//                                             <TableCell>
//                                                 <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
//                                                 <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>

//                 {/* Bottom Card: Stock Movement Table */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Stock Movement</Typography>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Product Name', 'Type', 'Quantity', 'Date', 'User'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {stockMovementsData.map((movement) => (
//                                         <TableRow key={movement.id} hover>
//                                             <TableCell sx={{ fontWeight: 500 }}>{movement.name}</TableCell>
//                                             <TableCell>{getMovementChip(movement.type)}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500, color: movement.quantity > 0 ? theme.palette.success.main : theme.palette.error.main }}>
//                                                 {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
//                                             </TableCell>
//                                             <TableCell>{movement.date}</TableCell>
//                                             <TableCell>{movement.user}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>
//             </Stack>

//             {/* Add Product Modal Form */}
//             <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4 } }} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
//                     <AddCircleOutlineIcon /> Add New Product
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText sx={{ mb: 2 }}>
//                         Fill in the details below to add a new product to the inventory.
//                     </DialogContentText>
//                     <Stack spacing={2} sx={{ mt: 2 }}>
//                         <TextField autoFocus label="Product Name" name="name" value={newProduct.name} onChange={handleInputChange} fullWidth />
//                         <FormControl fullWidth>
//                             <InputLabel>Category</InputLabel>
//                             <Select label="Category" name="category" value={newProduct.category} onChange={handleInputChange}>
//                                 {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
//                             </Select>
//                         </FormControl>
//                         <TextField label="Price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} fullWidth />
//                         <TextField label="Stock Quantity" name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} fullWidth />
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button onClick={handleAddProduct} variant="contained">Add Product</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }

import React, { useState, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Chip, Avatar, Stack, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
    Grid, CardHeader
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// --- Mock Data ---
const initialProducts = [
    { id: 1, name: 'AC Compressor XA-200', category: 'Parts', price: 12500, stock: 50, status: 'In Stock' },
    { id: 2, name: 'Cooling Coils (Set)', category: 'Parts', price: 4500, stock: 8, status: 'Low Stock' },
    { id: 3, name: '1.5 Ton Split AC Unit', category: 'AC Units', price: 38000, stock: 25, status: 'In Stock' },
    { id: 4, name: 'Digital Thermostat T-80', category: 'Electronics', price: 1200, stock: 150, status: 'In Stock' },
    { id: 5, name: '1 Ton Window AC Unit', category: 'AC Units', price: 26500, stock: 0, status: 'Out of Stock' },
    { id: 6, name: 'Filter Drier Pack', category: 'Accessories', price: 800, stock: 300, status: 'In Stock' },
    { id: 7, name: 'Fan Motor Assembly', category: 'Parts', price: 3200, stock: 5, status: 'Low Stock' },
];

const stockMovementsData = [
    { id: 1, name: 'AC Compressor XA-200', type: 'Stock In', quantity: 20, date: '2025-09-15', user: 'John Carter' },
    { id: 2, name: '1.5 Ton Split AC Unit', type: 'Sale', quantity: -5, date: '2025-09-14', user: 'Sophie Moore' },
    { id: 3, name: 'Digital Thermostat T-80', type: 'Stock In', quantity: 100, date: '2025-09-14', user: 'Admin' },
    { id: 4, name: 'Cooling Coils (Set)', type: 'Sale', quantity: -12, date: '2025-09-13', user: 'Patrick Meyer' },
    { id: 5, name: '1 Ton Window AC Unit', type: 'Adjustment', quantity: -1, date: '2025-09-12', user: 'Admin' },
];

const categories = ['AC Units', 'Parts', 'Electronics', 'Accessories'];

// Reusable KPI Card Component
const KpiCard = ({ title, value, icon, color }) => (
    <Card>
        <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
                    {icon}
                </Avatar>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);


export default function InventoryManagementContent() {
    const [products, setProducts] = useState(initialProducts);
    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewProduct({ name: '', category: '', price: '', stock: '' });
    };

    // Calculate KPI values
    const kpiData = useMemo(() => {
        const lowStockCount = initialProducts.filter(p => p.status === 'Low Stock').length;
        const outOfStockCount = initialProducts.filter(p => p.status === 'Out of Stock').length;
        return [
            { title: 'Total Products', value: initialProducts.length, icon: <InventoryIcon />, color: 'primary' },
            { title: 'Total Categories', value: categories.length, icon: <CategoryIcon />, color: 'info' },
            { title: 'Low Stock Items', value: lowStockCount, icon: <WarningAmberIcon />, color: 'warning' },
            { title: 'Out of Stock Items', value: outOfStockCount, icon: <ReportProblemIcon />, color: 'error' },
        ];
    }, [initialProducts]);


    const getStatusChip = (status) => {
        let color = 'default';
        if (status === 'In Stock') color = 'success';
        if (status === 'Low Stock') color = 'warning';
        if (status === 'Out of Stock') color = 'error';
        return <Chip label={status} color={color} size="small" variant="outlined" />;
    };

    const getMovementChip = (type) => {
        if (type === 'Stock In') return <Chip icon={<TrendingUpIcon />} label={type} color="success" size="small" variant="outlined" />;
        if (type === 'Sale') return <Chip icon={<TrendingDownIcon />} label={type} color="error" size="small" variant="outlined" />;
        return <Chip label={type} size="small" variant="outlined" />;
    };

    return (
        <Box>
            {/* KPI Cards Section */}
            <Grid container spacing={3} mb={3}>
                {kpiData.map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
                    </Grid>
                ))}
            </Grid>

            {/* Tables Section */}
            <Grid container spacing={3}>
                {/* Main Inventory Table */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: 'calc(100vh - 280px)' }}>
                        <CardHeader
                            title="Product Inventory"
                            action={
                                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>
                                    Add Product
                                </Button>
                            }
                        />
                        <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(head => (
                                            <TableCell key={head}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id} hover>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                     <Avatar variant="rounded"><InventoryIcon/></Avatar>
                                                     <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{product.stock}</TableCell>
                                            <TableCell>{getStatusChip(product.status)}</TableCell>
                                            <TableCell>
                                                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                                <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>

                {/* Stock Movement Table */}
                 <Grid item xs={12} md={4}>
                    <Card sx={{ height: 'calc(100vh - 280px)' }}>
                        <CardHeader title="Recent Stock Movement" />
                        <TableContainer sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Product', 'Type', 'Qty'].map(head => (
                                            <TableCell key={head}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockMovementsData.map((movement) => (
                                        <TableRow key={movement.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{movement.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{movement.date}</Typography>
                                            </TableCell>
                                            <TableCell>{getMovementChip(movement.type)}</TableCell>
                                            <TableCell sx={{ fontWeight: 500, color: movement.quantity > 0 ? 'success.main' : 'error.main' }}>
                                                {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Product Modal Form */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Product</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField autoFocus label="Product Name" name="name" fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select label="Category" name="category">
                                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Price" name="price" type="number" fullWidth />
                        <TextField label="Stock Quantity" name="stock" type="number" fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained">Add Product</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

