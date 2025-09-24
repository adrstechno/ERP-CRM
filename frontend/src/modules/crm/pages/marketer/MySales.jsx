import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Chip, IconButton, Skeleton
} from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- API Simulation ---
const mockOrdersData = [
    { id: '#1532', date: '2025-09-24T10:06:00Z', customer: 'Lal Singh Chaddha', status: 'Paid', total: 329.60 },
    { id: '#1531', date: '2025-09-23T14:39:00Z', customer: 'ACME Corp', status: 'Pending', total: 87.24 },
    { id: '#1530', date: '2025-09-23T12:54:00Z', customer: 'Global Tech', status: 'Pending', total: 52.16 },
    { id: '#1529', date: '2025-09-22T15:32:00Z', customer: 'Home Essentials', status: 'Paid', total: 350.12 },
    { id: '#1528', date: '2025-09-21T14:20:00Z', customer: 'Sunrise Apartments', status: 'Pending', total: 246.78 },
    { id: '#1527', date: '2025-09-20T09:48:00Z', customer: 'Lal Singh Chaddha', status: 'Paid', total: 64.00 },
    { id: '#1526', date: '2025-09-19T11:00:00Z', customer: 'ACME Corp', status: 'Paid', total: 1024.00 },
];

// --- Helper Component ---
const StatusChip = ({ status }) => {
    const theme = useTheme();
    const isPaid = status.toLowerCase() === 'paid';
    
    const chipColor = isPaid ? theme.palette.success : theme.palette.warning;

    return (
        <Chip 
            label={status} 
            size="large"
            sx={{
                backgroundColor: chipColor.light + '30', // Adding opacity
                color: chipColor.dark,
                fontWeight: 600,
            }}
        />
    );
};


// --- Main Component ---
export default function MySalesPage() {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call based on selectedDate
        console.log(`Fetching orders for ${selectedDate.format('YYYY-MM-DD')}...`);
        setTimeout(() => {
            setOrders(mockOrdersData);
            setIsLoading(false);
        }, 1500);
    }, [selectedDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                 <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        {/* Page Header */}
                        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                             <Stack direction="row" spacing={1.5} alignItems="center">
                                <ReceiptLongIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">My Sales</Typography>
                            </Stack>

                            <DatePicker
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                slotProps={{ textField: { size: 'large' } }}
                            />
                        </Stack>
                    </CardContent>

                    {/* Orders Table */}
                    <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Table stickyHeader size="large">
                            <TableHead>
                                <TableRow>
                                    {['Order ID', 'Date', 'Customer Name', 'Status', 'Total', 'Invoice'].map(head => (
                                        <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    Array.from(new Array(6)).map((_, index) => (
                                        <TableRow key={index}><TableCell colSpan={6}><Skeleton animation="wave" /></TableCell></TableRow>
                                    ))
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{order.id}</TableCell>
                                            <TableCell>{dayjs(order.date).format('DD MMM, hh:mm A')}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell><StatusChip status={order.status} /></TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>₹{order.total.toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small">
                                                    <FileDownloadOutlined fontSize="small"/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>
        </LocalizationProvider>
    );
}
