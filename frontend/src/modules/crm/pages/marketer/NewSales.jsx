// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import {
//     Box, Card, CardContent, Typography,
//     TextField, Button, Stack, CircularProgress, Grid, InputLabel, Select, MenuItem, FormControl, InputAdornment,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Chip
// } from '@mui/material';
// import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Corrected Import
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// // --- API Simulation & Mock Data ---
// const mockSalesData = [
//     { id: '#S001', date: '2025-09-26', dealer: 'CoolAir Traders', customer: 'Lal Singh Chaddha', marketer: 'Rajesh Kumar', amount: 38000, status: 'Completed' },
//     { id: '#S002', date: '2025-09-25', dealer: 'Arctic Systems', customer: 'ACME Corp', marketer: 'Priya Singh', amount: 4500, status: 'Pending' },
// ];
// const mockDealers = ['CoolAir Traders', 'Arctic Systems', 'Zenith Corp'];
// const mockCustomers = ['Lal Singh Chaddha', 'ACME Corp', 'Global Tech'];
// const mockMarketers = ['Rajesh Kumar', 'Priya Singh', 'Anjali Mehta'];
// const mockProducts = [
//     { name: '1.5 Ton 5 Star AC', price: 38000 },
//     { name: 'Cooling Coils (Set)', price: 4500 },
//     { name: 'Digital Thermostat', price: 1200 },
// ];

// // --- Helper Component ---
// const StatusChip = ({ status }) => {
//     let color;
//     if (status === 'Completed') color = 'success';
//     else if (status === 'Pending') color = 'warning';
//     else color = 'error';
//     return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
// };

// // --- Main Component ---
// export default function NewSales() {
//     const [sales, setSales] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [form, setForm] = useState({
//         dealer: '', customer: '', marketer: '', salesItem: '',
//         date: dayjs(), quantity: 1, perUnit: 0,
//     });

//     const fetchSales = useCallback(async () => {
//         setIsLoading(true);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         setSales(mockSalesData);
//         setIsLoading(false);
//     }, []);

//     useEffect(() => {
//         fetchSales();
//     }, [fetchSales]);

//     const handleOpenDialog = () => setIsDialogOpen(true);
//     const handleCloseDialog = () => {
//         setIsDialogOpen(false);
//         setForm({ dealer: '', customer: '', marketer: '', salesItem: '', date: dayjs(), quantity: 1, perUnit: 0 });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const newForm = { ...form, [name]: value };
//         if (name === 'salesItem') {
//             const product = mockProducts.find(p => p.name === value);
//             newForm.perUnit = product ? product.price : 0;
//         }
//         if (name === 'quantity' && value !== '' && Number(value) < 1) newForm.quantity = 1;
//         setForm(newForm);
//     };
    
//     const handleDateChange = (d) => {
//         setForm({...form, date: d});
//     };

//     const amount = useMemo(() => {
//         const qty = parseFloat(form.quantity);
//         const price = parseFloat(form.perUnit);
//         return isNaN(qty) || isNaN(price) ? 0 : qty * price;
//     }, [form.quantity, form.perUnit]);

//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         const finalData = { ...form, amount, date: form.date.format('YYYY-MM-DD'), id: `#S00${mockSalesData.length + 1}`, status: 'Pending' };
//         console.log("Submitting New Sale:", finalData);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         mockSalesData.unshift(finalData);
//         setIsSubmitting(false);
//         handleCloseDialog();
//         fetchSales();
//     }, [form, amount, fetchSales]);

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box>
//                 <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
//                     <CardContent>
//                         <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                                 <PointOfSaleIcon color="primary" />
//                                 <Typography variant="h6" fontWeight="bold">Sales Entries</Typography>
//                             </Stack>
//                             <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
//                                 Create New Sale
//                             </Button>
//                         </Stack>
//                     </CardContent>
//                     <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                         <Table stickyHeader size="small">
//                             <TableHead>
//                                 <TableRow>{['Sale ID', 'Date', 'Dealer', 'Customer', 'Marketer', 'Amount', 'Status'].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {isLoading ?
//                                     Array.from(new Array(5)).map((_, i) => <TableRow key={i}><TableCell colSpan={7}><Skeleton /></TableCell></TableRow>) :
//                                     sales.map((sale) => (
//                                         <TableRow key={sale.id} hover>
//                                             <TableCell sx={{ fontWeight: 500 }}>{sale.id}</TableCell>
//                                             <TableCell>{dayjs(sale.date).format('DD MMM YYYY')}</TableCell>
//                                             <TableCell>{sale.dealer}</TableCell>
//                                             <TableCell>{sale.customer}</TableCell>
//                                             <TableCell>{sale.marketer}</TableCell>
//                                             <TableCell>₹{sale.amount.toLocaleString('en-IN')}</TableCell>
//                                             <TableCell><StatusChip status={sale.status} /></TableCell>
//                                         </TableRow>
//                                     ))
//                                 }
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </Card>

//                 <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//                     <DialogTitle>New Sale Entry</DialogTitle>
//                     <DialogContent>
//                         <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                             <Stack spacing={2.5}>
//                                 <FormControl fullWidth><InputLabel>Dealer</InputLabel><Select name="dealer" label="Dealer" value={form.dealer} onChange={handleChange}>{mockDealers.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
//                                 <FormControl fullWidth><InputLabel>Customer</InputLabel><Select name="customer" label="Customer" value={form.customer} onChange={handleChange}>{mockCustomers.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select></FormControl>
//                                 <FormControl fullWidth><InputLabel>Marketer</InputLabel><Select name="marketer" label="Marketer" value={form.marketer} onChange={handleChange}>{mockMarketers.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl>
//                                 <FormControl fullWidth><InputLabel>Sales Item</InputLabel><Select name="salesItem" label="Sales Item" value={form.salesItem} onChange={handleChange}>{mockProducts.map(p => <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>)}</Select></FormControl>
//                                 <DatePicker label="Sale Date" value={form.date} onChange={handleDateChange} sx={{ width: '100%' }} />
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={6}><TextField fullWidth name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} inputProps={{ min: 1 }} /></Grid>
//                                     <Grid item xs={6}><TextField fullWidth name="perUnit" label="Per Unit (₹)" type="number" value={form.perUnit} onChange={handleChange} inputProps={{ min: 0 }} /></Grid>
//                                 </Grid>
//                                 <TextField fullWidth name="amount" label="Total Amount (₹)" value={amount.toLocaleString('en-IN')} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><Typography fontWeight="bold">₹</Typography></InputAdornment> }} variant="filled" />
//                             </Stack>
//                         </Box>
//                     </DialogContent>
//                     <DialogActions sx={{ p: '16px 24px' }}>
//                         <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
//                         <Button type="submit" form="new-sale-form" variant="contained" disabled={isSubmitting}>
//                             {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Sale'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </LocalizationProvider>
//     );
// }



import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography,
    TextField, Button, Stack, CircularProgress, Grid, InputLabel, Select, MenuItem, FormControl, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- API Simulation & Mock Data ---
const mockSalesData = [
    { id: '#S001', date: '2025-09-26', dealer: 'CoolAir Traders', customer: 'Lal Singh Chaddha', marketer: 'Rajesh Kumar', amount: 38000, status: 'Completed' },
    { id: '#S002', date: '2025-09-25', dealer: 'Arctic Systems', customer: 'ACME Corp', marketer: 'Priya Singh', amount: 4500, status: 'Pending' },
];
const mockDealers = ['CoolAir Traders', 'Arctic Systems', 'Zenith Corp'];
const mockCustomers = ['Lal Singh Chaddha', 'ACME Corp', 'Global Tech'];
// Marketers list is no longer needed for the form, but might be useful for other parts of the app
// const mockMarketers = ['Rajesh Kumar', 'Priya Singh', 'Anjali Mehta'];
const mockProducts = [
    { name: '1.5 Ton 5 Star AC', price: 38000 },
    { name: 'Cooling Coils (Set)', price: 4500 },
    { name: 'Digital Thermostat', price: 1200 },
];
// Simulate a logged-in marketer. In a real app, this would come from your auth context.
const LOGGED_IN_MARKETER = { id: 'MKT-001', name: 'Rajesh Kumar' };


// --- Helper Component ---
const StatusChip = ({ status }) => {
    let color;
    if (status === 'Completed') color = 'success';
    else if (status === 'Pending') color = 'warning';
    else color = 'error';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
};

// --- Main Component ---
export default function NewSales() {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        saleToType: '', // 'Dealer' or 'Customer'
        saleToEntity: '', // The selected dealer or customer
        salesItem: '',
        date: dayjs(), 
        quantity: 1, 
        perUnit: 0,
    });

    const fetchSales = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSales(mockSalesData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setForm({ saleToType: '', saleToEntity: '', salesItem: '', date: dayjs(), quantity: 1, perUnit: 0 });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newForm = { ...form, [name]: value };

        // Reset the entity if the type changes
        if(name === 'saleToType') {
            newForm.saleToEntity = '';
        }

        if (name === 'salesItem') {
            const product = mockProducts.find(p => p.name === value);
            newForm.perUnit = product ? product.price : 0;
        }
        if (name === 'quantity' && value !== '' && Number(value) < 1) newForm.quantity = 1;
        setForm(newForm);
    };
    
    const handleDateChange = (d) => {
        setForm({...form, date: d});
    };

    const amount = useMemo(() => {
        const qty = parseFloat(form.quantity);
        const price = parseFloat(form.perUnit);
        return isNaN(qty) || isNaN(price) ? 0 : qty * price;
    }, [form.quantity, form.perUnit]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const finalData = { 
            id: `#S00${mockSalesData.length + 1}`,
            date: form.date.format('YYYY-MM-DD'),
            dealer: form.saleToType === 'Dealer' ? form.saleToEntity : null,
            customer: form.saleToType === 'Customer' ? form.saleToEntity : null,
            marketer: LOGGED_IN_MARKETER.name, // Automatically add the logged-in marketer's name
            marketerId: LOGGED_IN_MARKETER.id, // The ID you would send to the API
            amount,
            status: 'Pending'
        };
        console.log("Submitting New Sale:", finalData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        mockSalesData.unshift(finalData);
        setIsSubmitting(false);
        handleCloseDialog();
        fetchSales();
    }, [form, amount, fetchSales]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <PointOfSaleIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Sales Entries</Typography>
                            </Stack>
                            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
                                Create New Sale
                            </Button>
                        </Stack>
                    </CardContent>
                    <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>{['Sale ID', 'Date', 'Dealer', 'Customer', 'Marketer', 'Amount', 'Status'].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ?
                                    Array.from(new Array(5)).map((_, i) => <TableRow key={i}><TableCell colSpan={7}><Skeleton /></TableCell></TableRow>) :
                                    sales.map((sale) => (
                                        <TableRow key={sale.id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{sale.id}</TableCell>
                                            <TableCell>{dayjs(sale.date).format('DD MMM YYYY')}</TableCell>
                                            <TableCell>{sale.dealer || 'N/A'}</TableCell>
                                            <TableCell>{sale.customer || 'N/A'}</TableCell>
                                            <TableCell>{sale.marketer}</TableCell>
                                            <TableCell>₹{sale.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell><StatusChip status={sale.status} /></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>

                <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>New Sale Entry</DialogTitle>
                    <DialogContent>
                        <Box component="form" id="new-sale-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <Stack spacing={2.5}>
                                <FormControl fullWidth><InputLabel>Sale To</InputLabel><Select name="saleToType" label="Sale To" value={form.saleToType} onChange={handleChange}><MenuItem value="Dealer">Dealer</MenuItem><MenuItem value="Customer">Customer</MenuItem></Select></FormControl>

                                {form.saleToType && (
                                    <FormControl fullWidth>
                                        <InputLabel>{`Select ${form.saleToType}`}</InputLabel>
                                        <Select name="saleToEntity" label={`Select ${form.saleToType}`} value={form.saleToEntity} onChange={handleChange}>
                                            {(form.saleToType === 'Dealer' ? mockDealers : mockCustomers).map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                )}

                                <FormControl fullWidth><InputLabel>Sales Item</InputLabel><Select name="salesItem" label="Sales Item" value={form.salesItem} onChange={handleChange}>{mockProducts.map(p => <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>)}</Select></FormControl>
                                <DatePicker label="Sale Date" value={form.date} onChange={handleDateChange} sx={{ width: '100%' }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><TextField fullWidth name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} inputProps={{ min: 1 }} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth name="perUnit" label="Per Unit (₹)" type="number" value={form.perUnit} onChange={handleChange} inputProps={{ min: 0 }} /></Grid>
                                </Grid>
                                <TextField fullWidth name="amount" label="Total Amount (₹)" value={amount.toLocaleString('en-IN')} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><Typography fontWeight="bold">₹</Typography></InputAdornment> }} variant="filled" />
                            </Stack>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" form="new-sale-form" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Sale'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}

