import React, { useState, useEffect, useCallback , useMemo} from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, TextField, Chip, Skeleton, InputLabel, Grid, CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';

// --- API Simulation (History is still mocked as per original code) ---
const mockRequestHistory = [
    { id: '#REQ-012', date: '2025-09-25T10:06:00Z', productName: '1.5 Ton 5 Star AC', qty: 10, amount: 380000, status: 'Approved' },
    { id: '#REQ-011', date: '2025-09-24T14:59:00Z', productName: 'Cooling Coils (Set)', qty: 50, amount: 225000, status: 'Pending' },
    { id: '#REQ-010', date: '2025-09-24T12:54:00Z', productName: 'Digital Thermostat', qty: 100, amount: 120000, status: 'Approved' },
];

// --- Helper Component ---
const StatusChip = React.memo(({ status }) => {
    let color;
    if (status === 'Approved') color = 'success';
    else if (status === 'Pending') color = 'warning';
    else if (status === 'Rejected') color = 'error';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
});

// --- Main Component ---
export default function StockRequestPage() {
    // History states
    const [history, setHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    // States for products and form
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        setHistory(mockRequestHistory);
        setIsHistoryLoading(false);
    }, []);
    
    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/products/all",axiosConfig);
            if (!response.ok) {
                throw new Error('Network response was not ok while fetching products.');
            }
            const data = await response.json();
            console.log("Fetched Products:", data); // DEBUG: Check the product data structure
            setProducts(data || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchProducts();
    }, [fetchHistory]);
    
    // --- CORRECTED EVENT HANDLER ---
    // This function is designed to handle changes from both the <Select> and <TextField> components.
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // DEBUG: Log the name and value to the browser console to see what's being captured.
        console.log(`Input changed: name='${name}', value='${value}'`);
        
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const requestBody = {
            productId: formData.productId,
            quantity: formData.quantity,
            notes: formData.notes,
        };
        
        console.log("Submitting Stock Request:", requestBody);

        try {
            const response = await fetch("http://localhost:8080/api/stock-requests/create", {
                method: 'POST',
                axiosConfig,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create stock request: ${errorText}`);
            }
            
            await response.json();
            alert('Stock request submitted successfully!');
            setFormData({ productId: '', quantity: '', notes: '' });
            fetchHistory();
        } catch (error) {
            console.error("Error submitting stock request:", error);
            alert(`Error: ${error.message}`);
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
                                <FormControl fullWidth required disabled={isProductsLoading}>
                                    <InputLabel>Product</InputLabel>
                                    {/* This Select component now correctly uses the handleChange function */}
                                    <Select 
                                        name="productId" // This 'name' MUST match the state key: formData.productId
                                        label="Product" 
                                        value={formData.productId} 
                                        onChange={handleChange}
                                    >
                                        {isProductsLoading ? (
                                            <MenuItem disabled><em>Loading products...</em></MenuItem>
                                        ) : (
                                            products.map(product => (
                                                // Ensure product.id and product.name exist in your API response
                                                <MenuItem key={product.productId} value={product.productId}>
                                                    {product.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                                <TextField 
                                    fullWidth 
                                    required 
                                    name="quantity" // This 'name' MUST match the state key: formData.quantity
                                    label="Quantity" 
                                    type="number" 
                                    value={formData.quantity} 
                                    onChange={handleChange} 
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <TextField 
                                    fullWidth 
                                    multiline 
                                    rows={4} 
                                    name="notes" // This 'name' MUST match the state key: formData.notes
                                    label="Notes (Optional)" 
                                    value={formData.notes} 
                                    onChange={handleChange} 
                                />
                            </Stack>
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
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.date).toLocaleDateString()}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.productName}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
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