// import React from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";

// export default function StockRequest() {
//   return (
//     <Grid container spacing={3}>
//       {/* 🔹 First Container - Stock Request Form */}
//       <Grid item xs={12}>
//         <Card sx={{ p: 3 }} md>
//           <Typography variant="h6" gutterBottom>
//             Stock Request
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             Lorem ipsum dolor sit amet consectetur adipisicing.
//           </Typography>
//           <Divider sx={{ mb: 2 }} />

//           {/* Form Fields */}
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={4}>
//               <TextField label="Product Name" fullWidth />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="Quantity" type="number" fullWidth />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="Comments" fullWidth />
//             </Grid>
//           </Grid>

//           {/* Buttons */}
//           <Grid
//             container
//             spacing={2}
//             justifyContent="flex-end"
//             sx={{ mt: 2 }}
//           >
//             <Grid item>
//               <Button variant="outlined">Add More</Button>
//             </Grid>
//             <Grid item>
//               <Button variant="contained">Submit</Button>
//             </Grid>
//           </Grid>
//         </Card>
//       </Grid>

//       {/* 🔹 Second Container - Stock Table */}
//       {'\n'}
//       {/* 🔹 Third Container - Requests Table */}
//       <Grid item xs={12}>
//         <Card sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Requests History
//           </Typography>
//           <Divider sx={{ mb: 2 }} />

//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Product Name</TableCell>
//                 <TableCell>Product No.</TableCell>
//                 <TableCell>Qty</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow>
//                 <TableCell>30-08-2024</TableCell>
//                 <TableCell>X_AC</TableCell>
//                 <TableCell>#15V85TH</TableCell>
//                 <TableCell>87</TableCell>
//                 <TableCell>$8000</TableCell>
//                 <TableCell>Pending</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, TextField, Chip, Skeleton, InputLabel, Grid, CircularProgress, Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';

// --- API Simulation ---
const mockRequestHistory = [
    { id: '#REQ-012', date: '2025-09-25T10:06:00Z', productName: '1.5 Ton 5 Star AC', qty: 10, amount: 380000, status: 'Approved' },
    { id: '#REQ-011', date: '2025-09-24T14:59:00Z', productName: 'Cooling Coils (Set)', qty: 50, amount: 225000, status: 'Pending' },
    { id: '#REQ-010', date: '2025-09-24T12:54:00Z', productName: 'Digital Thermostat', qty: 100, amount: 120000, status: 'Approved' },
    { id: '#REQ-009', date: '2025-09-23T15:32:00Z', productName: 'Window AC 1 Ton', qty: 5, amount: 132500, status: 'Rejected' },
    { id: '#REQ-008', date: '2025-09-22T11:00:00Z', productName: '1.5 Ton 5 Star AC', qty: 15, amount: 570000, status: 'Approved' },
    
];
const productOptions = ['1.5 Ton 5 Star AC', 'Cooling Coils (Set)', 'Digital Thermostat', 'Window AC 1 Ton'];

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
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ productName: '', qty: '', comments: '' });

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setHistory(mockRequestHistory);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);
    
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting Request:", form);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setForm({ productName: '', qty: '', comments: '' }); // Reset form
        fetchHistory(); // Refresh history
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Left Form Section */}
                <Grid item xs={12} lg={5}>
                    <Card component="form" onSubmit={handleSubmit} sx={{ height: '100%' , width:  '100%'}}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                <ShoppingCartIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">New Stock Request</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Select product and quantity to request new stock.
                            </Typography>
                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Product Name</InputLabel>
                                    <Select name="productName" label="Product Name" value={form.productName} onChange={handleChange}>
                                        {productOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth required name="qty" label="Quantity" type="number" value={form.qty} onChange={handleChange} />
                                <TextField fullWidth multiline rows={4} name="comments" label="Comments (Optional)" value={form.comments} onChange={handleChange} />
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                                <Button variant="outlined">Add More</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
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
                                    {isLoading ? (
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

