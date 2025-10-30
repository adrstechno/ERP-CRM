import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    List, ListItem, ListItemButton, ListItemText,
    Stack, Skeleton, InputLabel, Grid, Divider,
    FormControl, Select, MenuItem, TextField, Button,
    CircularProgress, FormHelperText
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';

// --- Mock Notice Data ---
const mockNotices = [
    {
        id: 1,
        title: 'GO OLD TOWN',
        timestamp: '2025-09-26T19:00:00Z',
        content: `YOU HAVE TO DELIVER TO OLD TOWN CLIENT.<br/>
                  <b>NAME:- LAL SINGH CHADHA</b><br/>
                  <b>MOBILE NO:- 9898989898</b><br/>
                  <b>ADDRESS:- WARD NO - 08, OLD TOWN</b>`,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    },
    { id: 2, title: 'TASK1', timestamp: '2025-09-26T19:00:00Z', content: 'Details for TASK1 will be shown here.' },
    { id: 3, title: 'TASK2', timestamp: '2025-09-26T11:00:00Z', content: 'Details for TASK2 will be shown here.' },
    { id: 4, title: 'New Stock Arrival', timestamp: '2025-09-25T15:30:00Z', content: 'New shipment of 1.5 Ton AC units has arrived. Please update your inventory.' },
];

export default function DealerNotice() {
    // Notice state
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Product & Form states
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);

    // Form fields
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    // Validation errors
    const [errors, setErrors] = useState({
        productId: '',
        quantity: ''
    });

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNotices(mockNotices);
        setSelectedNotice(mockNotices[0]);
        setIsLoading(false);
    }, []);

    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/products/all");
            if (!response.ok) throw new Error('Failed to fetch products.');
            const data = await response.json();
            setProducts(data || []);
        } catch (error) {
            console.error("Product fetch failed:", error);
        } finally {
            setIsProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
        fetchProducts();
    }, [fetchNotices]);

    // --- Validation function ---
    const validateForm = () => {
        let newErrors = {};
        if (!productId) newErrors.productId = "Please select a product.";
        if (!quantity) newErrors.quantity = "Quantity is required.";
        else if (Number(quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Submit handler ---
    const handleStockRequestSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // stop if validation fails
        setIsRequestSubmitting(true);

        const requestBody = { productId, quantity, notes };

        try {
            const response = await fetch("http://localhost:8080/api/stock-requests/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error(await response.text());
            const result = await response.json();
            alert('✅ Stock request submitted successfully!');
            console.log("Stock request:", result);

            // Clear form
            setProductId('');
            setQuantity('');
            setNotes('');
            setErrors({});
        } catch (error) {
            console.error("Error creating stock request:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setIsRequestSubmitting(false);
        }
    };

    return (
        <Box>
            <Grid container spacing={3} sx={{ height: { md: 'calc(100vh - 120px)' } }}>
                {/* Left: Notice List */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                <NotificationsIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                            </Stack>
                        </CardContent>
                        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            {isLoading ? (
                                Array.from(new Array(4)).map((_, i) => (
                                    <ListItem key={i}><Skeleton variant="rounded" height={50} /></ListItem>
                                ))
                            ) : (
                                notices.map((notice) => (
                                    <ListItem key={notice.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton
                                            selected={selectedNotice?.id === notice.id}
                                            onClick={() => setSelectedNotice(notice)}
                                        >
                                            <ListItemText
                                                primary={<Typography fontWeight="bold">{notice.title}</Typography>}
                                                secondary={new Date(notice.timestamp).toLocaleString()}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Card>
                </Grid>

                {/* Right: Notice Detail + Form */}
                <Grid item xs={12} md={9}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {isLoading || !selectedNotice ? (
                            <CardContent><Skeleton variant="rectangular" height="100%" /></CardContent>
                        ) : (
                            <>
                                <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                    <Typography variant="h4" fontWeight={700} mb={2}>
                                        {selectedNotice.title}
                                    </Typography>
                                    <Typography
                                        dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
                                        sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}
                                    />
                                    {selectedNotice.image && (
                                        <Box
                                            component="img"
                                            src={selectedNotice.image}
                                            alt={selectedNotice.title}
                                            sx={{ maxWidth: '100%', height: 'auto', borderRadius: 2, mt: 1, mb: 2 }}
                                        />
                                    )}
                                </CardContent>
                                <Divider />

                                {/* Stock Request Form */}
                                <CardContent component="form" onSubmit={handleStockRequestSubmit}>
                                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                                        Create Stock Request
                                    </Typography>

                                    <Stack spacing={2}>
                                        {/* Product */}
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            required
                                            error={!!errors.productId}
                                            disabled={isProductsLoading}
                                        >
                                            <InputLabel>Product</InputLabel>
                                            <Select
                                                label="Product"
                                                value={productId}
                                                onChange={(e) => setProductId(e.target.value)}
                                            >
                                                {isProductsLoading && <MenuItem disabled><em>Loading...</em></MenuItem>}
                                                {products.map((p) => (
                                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                                ))}
                                            </Select>
                                            {errors.productId && <FormHelperText>{errors.productId}</FormHelperText>}
                                        </FormControl>

                                        {/* Quantity */}
                                        <TextField
                                            label="Quantity"
                                            type="number"
                                            fullWidth
                                            size="small"
                                            required
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            InputProps={{ inputProps: { min: 1 } }}
                                            error={!!errors.quantity}
                                            helperText={errors.quantity}
                                        />

                                        {/* Notes */}
                                        <TextField
                                            label="Notes"
                                            multiline
                                            minRows={2}
                                            fullWidth
                                            size="small"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                endIcon={<SendIcon />}
                                                disabled={isRequestSubmitting}
                                            >
                                                {isRequestSubmitting
                                                    ? <CircularProgress size={24} color="inherit" />
                                                    : 'Submit Request'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
