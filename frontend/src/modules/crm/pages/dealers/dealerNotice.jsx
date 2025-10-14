import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    List, ListItem, ListItemButton, ListItemText,
    Stack, Skeleton, InputLabel, Grid, Divider, FormControl, TextField, Button, CircularProgress, Snackbar, Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios'; // Import axios

// --- API Simulation for notices (remains the same) ---
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
];

// --- Main Component ---
export default function DealerNotice() {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- State for the new Stock Request Form ---
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });


    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotices(mockNotices);
        setSelectedNotice(mockNotices[0]);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);
    
    // --- 1. Function to handle the Stock Request API call ---
    const handleStockRequestSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback({ open: false, message: '', severity: 'info' }); // Reset feedback

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authKey');

        if (!user || !user.id || !token) {
            setFeedback({ open: true, message: 'Authentication error. Please log in again.', severity: 'error' });
            setIsSubmitting(false);
            return;
        }

        const API_URL = `http://localhost:8080/api/stock-requests/create/${user.id}`;
        const requestBody = { productId, quantity, notes };
        const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await axios.post(API_URL, requestBody, axiosConfig);
            setFeedback({ open: true, message: `Request #${response.data.requestId} created successfully!`, severity: 'success' });
            // Clear the form on success
            setProductId('');
            setQuantity('');
            setNotes('');
        } catch (error) {
            console.error("Failed to create stock request:", error);
            const errorMessage = error.response?.data?.message || 'Failed to create request. Please try again.';
            setFeedback({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseFeedback = (event, reason) => {
        if (reason === 'clickaway') return;
        setFeedback({ ...feedback, open: false });
    };

    return (
        <Box>
            <Grid container spacing={3} sx={{ height: { md: 'calc(100vh - 120px)' }}}>
                {/* Left Notifications List (no changes) */}
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
                                {/* --- 2. Updated Form for Stock Request --- */}
                                <CardContent component="form" onSubmit={handleStockRequestSubmit}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Create Stock Request</Typography>
                                    <Stack spacing={2}>
                                        <TextField 
                                            label="Product ID" 
                                            fullWidth 
                                            size="small"
                                            required
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                        <TextField 
                                            label="Quantity" 
                                            fullWidth 
                                            size="small"
                                            type="number"
                                            required
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            InputProps={{ inputProps: { min: 1 } }} // Ensure quantity is positive
                                        />
                                        <TextField 
                                            label="Notes / Remarks" 
                                            multiline 
                                            minRows={2} 
                                            fullWidth 
                                            size="small"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={isSubmitting}>
                                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
            
            {/* --- 3. Snackbar for User Feedback --- */}
            <Snackbar open={feedback.open} autoHideDuration={6000} onClose={handleCloseFeedback}>
                <Alert onClose={handleCloseFeedback} severity={feedback.severity} sx={{ width: '100%' }}>
                    {feedback.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}