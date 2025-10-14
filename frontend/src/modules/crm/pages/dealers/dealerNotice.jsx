import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    List, ListItem, ListItemButton, ListItemText,
    Stack, Skeleton, InputLabel, Grid, Divider, FormControl, Select, MenuItem, TextField, Button, CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';

// --- API Simulation (Existing) ---
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

// --- Main Component ---
export default function DealerNotice() {
    // States for notices
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- NEW: States for the Stock Request Form ---
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
    
    // Form field states
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call for notices
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNotices(mockNotices);
        setSelectedNotice(mockNotices[0]);
        setIsLoading(false);
    }, []);

    // --- NEW: Function to fetch all products from the backend ---
    const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/products/all");
            if (!response.ok) {
                throw new Error('Network response was not ok while fetching products.');
            }
            const data = await response.json();
            setProducts(data || []); // Ensure products is an array
        } catch (error) {
            console.error("Failed to fetch products:", error);
            // You can add state here to show an error message in the UI
        } finally {
            setIsProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
        fetchProducts(); // Fetch products when the component mounts
    }, [fetchNotices]);
    
    // --- NEW: Handler to submit the stock request form ---
    const handleStockRequestSubmit = async (e) => {
        e.preventDefault();
        setIsRequestSubmitting(true);
        
        const requestBody = {
            productId,
            quantity,
            notes
        };

        try {
            const response = await fetch("http://localhost:8080/api/stock-requests/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                // You can get more specific error messages from the backend response body
                const errorData = await response.text();
                throw new Error(`Failed to create stock request: ${errorData}`);
            }

            const result = await response.json();
            console.log("Stock request created successfully:", result);
            
            // Show a success alert and clear the form
            alert('Stock request submitted successfully!');
            setProductId('');
            setQuantity('');
            setNotes('');
            
        } catch (error) {
            console.error("Error creating stock request:", error);
            alert(`Error: ${error.message}`); // Show an error alert
        } finally {
            setIsRequestSubmitting(false);
        }
    };

    return (
        <Box>
            <Grid container spacing={3} sx={{ height: { md: 'calc(100vh - 120px)' }}}>
                {/* Left Notifications List (Unchanged) */}
                <Grid item xs={12} md={3} sx={{ height: '100%',width: '25%' }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                <NotificationsIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                            </Stack>
                        </CardContent>
                        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            {isLoading ? (
                                Array.from(new Array(4)).map((_, index) => (
                                    <ListItem key={index}><Skeleton variant="rounded" height={50} /></ListItem>
                                ))
                            ) : (
                                notices.map((notice) => (
                                    <ListItem key={notice.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton
                                            selected={selectedNotice?.id === notice.id}
                                            onClick={() => setSelectedNotice(notice)}
                                        >
                                            <ListItemText
                                                primary={<Typography variant="body2" fontWeight="bold">{notice.title}</Typography>}
                                                secondary={new Date(notice.timestamp).toLocaleString()}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Card>
                </Grid>

                {/* Right Notice Content */}
                <Grid item xs={12} md={9} sx={{ height: '100%',width:'50%' }}>
                    <Card sx={{ height: '100%', width: 770,display: 'flex', flexDirection: 'column' }}>
                        {isLoading || !selectedNotice ? (
                            <CardContent><Skeleton variant="rectangular" height="100%" /></CardContent>
                        ) : (
                            <>
                                <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1, mb: 2 }}>
                                        {selectedNotice.title}
                                    </Typography>
                                    <Typography dangerouslySetInnerHTML={{ __html: selectedNotice.content }} sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }} />
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

                                {/* --- MODIFIED: Stock Request Form --- */}
                                <CardContent component="form" onSubmit={handleStockRequestSubmit}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Create Stock Request</Typography>
                                    <Stack spacing={2}>
                                        {/* Product Dropdown */}
                                        <FormControl fullWidth size="small" required disabled={isProductsLoading}>
                                            <InputLabel>Product</InputLabel>
                                            <Select 
                                                label="Product" 
                                                value={productId}
                                                onChange={(e) => setProductId(e.target.value)}
                                            >
                                                {/* Show a loading message while products are being fetched */}
                                                {isProductsLoading && <MenuItem disabled><em>Loading products...</em></MenuItem>}
                                                {/* Map over the fetched products to create menu items */}
                                                {products.map((product) => (
                                                    <MenuItem key={product.id} value={product.id}>
                                                        {product.name} {/* Assuming product has 'id' and 'name' properties */}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* Quantity Field */}
                                        <TextField 
                                            label="Quantity"
                                            type="number"
                                            fullWidth 
                                            size="small"
                                            required
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            InputProps={{ inputProps: { min: 1 } }} // Ensures the number is positive
                                        />
                                        
                                        {/* Notes Field */}
                                        <TextField 
                                            label="Notes" 
                                            multiline 
                                            minRows={2} 
                                            fullWidth 
                                            size="small"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />

                                        {/* Submit Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={isRequestSubmitting}>
                                                {isRequestSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
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