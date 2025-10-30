import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, TextField, Chip, Skeleton, InputLabel, Grid, CircularProgress, FormHelperText
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import axios from 'axios';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

// --- Helper Component ---
const StatusChip = React.memo(({ status }) => {
    let color;
    const lowerCaseStatus = status.toLowerCase();

    if (lowerCaseStatus === 'approved') color = 'success';
    else if (lowerCaseStatus === 'pending') color = 'warning';
    else if (lowerCaseStatus === 'rejected') color = 'error';
    else color = 'default';

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return <Chip label={displayStatus} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
});

// --- Main Component ---
export default function StockRequestPage() {
    // History states
    const [history, setHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    // Form states
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ productId: '', quantity: '', notes: '' });
    const [errors, setErrors] = useState({});

    const token = localStorage.getItem("authKey");
    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` },
    }), [token]);

    // Fetch history from API
    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        try {
            const response = await axios.get(`${VITE_API_BASE_URL}/stock-requests/user`, axiosConfig);
            setHistory(response.data.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch request history:", error);
            setHistory([]);
        } finally {
            setIsHistoryLoading(false);
        }
    }, [axiosConfig]);
    
    // Fetch products
    const fetchProducts = useCallback(async () => {
        setIsProductsLoading(true);
        try {
            const response = await axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig);
            setProducts(response.data || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsProductsLoading(false);
        }
    }, [axiosConfig]);

    useEffect(() => {
        fetchHistory();
        fetchProducts();
    }, [fetchHistory, fetchProducts]);

    // Input Change Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // clear field error when typing
    };

    // Validation Function
    const validateForm = () => {
        const newErrors = {};
        if (!formData.productId) newErrors.productId = "Please select a product.";
        if (!formData.quantity) newErrors.quantity = "Quantity is required.";
        else if (parseInt(formData.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0.";
        return newErrors;
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if validation fails
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${VITE_API_BASE_URL}/stock-requests/create`,
                { ...formData },
                axiosConfig
            );
            toast.success('Stock request submitted successfully!');
            setFormData({ productId: '', quantity: '', notes: '' });
            fetchHistory();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create stock request.";
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Left Form Section */}
                <Grid item xs={12} lg={5}>
                    <Card component="form" onSubmit={handleSubmit} sx={{ height: '100%', width: '100%' }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                <ShoppingCartIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">New Stock Request</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Select product and quantity to request new stock.
                            </Typography>

                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                {/* Product Field */}
                                <FormControl fullWidth size="small" required error={!!errors.productId} disabled={isProductsLoading}>
                                    <InputLabel>Product</InputLabel>
                                    <Select 
                                        name="productId"
                                        label="Product" 
                                        value={formData.productId} 
                                        onChange={handleChange}
                                    >
                                        {isProductsLoading ? (
                                            <MenuItem disabled><em>Loading products...</em></MenuItem>
                                        ) : (
                                            products.map(product => (
                                                <MenuItem key={product.productId} value={product.productId}>
                                                    {product.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.productId && <FormHelperText>{errors.productId}</FormHelperText>}
                                </FormControl>

                                {/* Quantity Field */}
                                <TextField 
                                    fullWidth 
                                    required 
                                    name="quantity"
                                    label="Quantity" 
                                    type="number" 
                                    size="small"
                                    value={formData.quantity} 
                                    onChange={handleChange} 
                                    InputProps={{ inputProps: { min: 1 } }}
                                    error={!!errors.quantity}
                                    helperText={errors.quantity}
                                />

                                {/* Notes Field */}
                                <TextField 
                                    fullWidth 
                                    multiline 
                                    rows={3} 
                                    name="notes"
                                    label="Notes (Optional)" 
                                    size="small"
                                    value={formData.notes} 
                                    onChange={handleChange} 
                                />
                            </Stack>

                            {/* Submit Button */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                                <Button type="submit" variant="contained" disabled={isSubmitting || isProductsLoading}>
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right History Table */}
                <Grid item xs={12} lg={7}>
                    <Card sx={{ height: { xs: 'auto', lg: 'calc(100vh - 120px)' }, width:770, display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                <HistoryIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Requests History</Typography>
                            </Stack>
                        </CardContent>
                        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            <Table stickyHeader size="medium">
                                <TableHead>
                                    <TableRow>
                                        {['Date', 'Product Name', 'Qty', 'Status'].map(head => <TableCell key={head}>{head}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isHistoryLoading ? (
                                        Array.from(new Array(5)).map((_, index) => (
                                            <TableRow key={index}><TableCell colSpan={4}><Skeleton animation="wave" /></TableCell></TableRow>
                                        ))
                                    ) : (
                                        history.map((row) => (
                                            <TableRow key={row.requestId} hover>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.requestDate).toLocaleDateString()}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.productName}</TableCell>
                                                <TableCell>{row.quantity}</TableCell>
                                                <TableCell><StatusChip status={row.status} /></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
