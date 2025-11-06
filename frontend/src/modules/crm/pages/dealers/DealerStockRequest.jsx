import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, TextField, Chip, Skeleton, InputLabel, Grid, CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import axios from 'axios';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

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

export default function StockRequestPage() {
    const [history, setHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ productId: '', quantity: '', notes: '' });

    const token = localStorage.getItem("authKey");
    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` },
    }), [token]);

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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await axios.post(`${VITE_API_BASE_URL}/stock-requests/create`, formData, axiosConfig);
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
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={3} alignItems="stretch">
                {/* Left: Request Form */}
                <Grid item xs={12} md={5}>
                    <Card component="form" onSubmit={handleSubmit} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                <ShoppingCartIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">New Stock Request</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Select product and quantity to request new stock.
                            </Typography>

                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <FormControl fullWidth required disabled={isProductsLoading}>
                                    <InputLabel>Product</InputLabel>
                                    <Select name="productId" label="Product" value={formData.productId} onChange={handleChange}>
                                        {isProductsLoading ? (
                                            <MenuItem disabled><em>Loading...</em></MenuItem>
                                        ) : (
                                            products.map(product => (
                                                <MenuItem key={product.productId} value={product.productId}>
                                                    {product.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>

                                <TextField fullWidth required name="quantity" label="Quantity" type="number"
                                    value={formData.quantity} onChange={handleChange}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />

                                <TextField fullWidth multiline rows={4} name="notes" label="Notes (Optional)"
                                    value={formData.notes} onChange={handleChange}
                                />
                            </Stack>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting || isProductsLoading}
                                    size="large"
                                >
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: History Table */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ pb: 1 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <HistoryIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Requests History</Typography>
                            </Stack>
                        </CardContent>

                        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="center">Qty</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isHistoryLoading ? (
                                        Array.from(new Array(6)).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={4}><Skeleton animation="wave" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">No requests found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        history.map((row) => (
                                            <TableRow key={row.requestId} hover>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(row.requestDate).toLocaleDateString('en-IN')}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.productName}</TableCell>
                                                <TableCell align="center">{row.quantity}</TableCell>
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