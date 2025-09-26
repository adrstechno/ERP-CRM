import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Chip, IconButton, Skeleton
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Corrected Import
import PaymentsIcon from '@mui/icons-material/Payments';
import dayjs from 'dayjs'; // Added for consistent date formatting

// --- API Simulation ---
const mockPaymentData = [
    { id: '#1532', date: '2025-09-24T10:08:00Z', customer: 'Lal Singh Chaddha', status: 'Paid', amount: 326.50 },
    { id: '#1531', date: '2025-09-23T14:59:00Z', customer: 'ACME Corp', status: 'Pending', amount: 87.24 },
    { id: '#1530', date: '2025-09-23T10:56:00Z', customer: 'Global Tech', status: 'Pending', amount: 52.16 },
    { id: '#1529', date: '2025-09-22T14:33:00Z', customer: 'Home Essentials', status: 'Paid', amount: 356.52 },
    { id: '#1528', date: '2025-09-21T14:20:00Z', customer: 'Sunrise Apartments', status: 'Pending', amount: 246.78 },
    { id: '#1527', date: '2025-09-20T09:48:00Z', customer: 'Lal Singh Chaddha', status: 'Paid', amount: 46.00 },
    { id: '#1526', date: '2025-09-19T11:00:00Z', customer: 'ACME Corp', status: 'Paid', amount: 1024.00 },
];

// --- Helper Component ---
const StatusChip = React.memo(({ status }) => {
    return (
        <Chip
            label={status}
            size="small"
            variant="outlined"
            color={status === 'Paid' ? 'success' : 'warning'}
            sx={{ fontWeight: 600 }}
        />
    );
});

// --- Main Component ---
export default function PayStatus() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        setPayments(mockPaymentData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return (
        <Box>
            <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                        <PaymentsIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Pay Status</Typography>
                    </Stack>
                     <Typography variant="body2" color="text.secondary">
                        Here is a summary of your recent payment statuses.
                    </Typography>
                </CardContent>
                
                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader size="large">
                        <TableHead>
                            <TableRow>
                                {['Order ID', 'Date', 'Customer Name', 'Amount', 'Status', 'Download Invoice'].map(head => (
                                    <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(6)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={6}><Skeleton animation="wave" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                payments.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell sx={{ fontWeight: '600' }}>{row.id}</TableCell>
                                        <TableCell>{dayjs(row.date).format('DD MMM YYYY, hh:mm A')}</TableCell>
                                        <TableCell>{row.customer}</TableCell>
                                        <TableCell>₹{row.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell><StatusChip status={row.status} /></TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" aria-label="download invoice">
                                                <ArrowDownwardIcon />
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
    );
}

