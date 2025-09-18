// src/pages/PayStatus.jsx
import React from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

// --- MOCK DATA ---
// Placed outside the component to prevent re-creation on every render.
const paymentData = [
    { id: '#1532', date: 'Dec 30, 10:08 AM', customer: 'Lal Singh Chaddha', status: 'Paid', amount: '$326.50' },
    { id: '#1531', date: 'Dec 29, 2:59 AM', customer: 'Lal Singh Chaddha', status: 'Pending', amount: '$87.24' },
    { id: '#1530', date: 'Dec 29, 10:56 AM', customer: 'Lal Singh Chaddha', status: 'Pending', amount: '$52.16' },
    { id: '#1529', date: 'Dec 28, 2:33 PM', customer: 'Lal Singh Chaddha', status: 'Paid', amount: '$356.52' },
    { id: '#1528', date: 'Dec 27, 2:20 PM', customer: 'Lal Singh Chaddha', status: 'Pending', amount: '$246.78' },
    { id: '#1527', date: 'Dec 26, 9:48 AM', customer: 'Lal Singh Chaddha', status: 'Paid', amount: '$46.00' },
];

// --- Reusable Status Chip Component ---
// This is a small, optimized component for displaying the status.
const StatusChip = React.memo(({ status }) => {
    const theme = useTheme();
    const isPaid = status === 'Paid';

    // Determine color based on status from the theme
    const chipColor = isPaid ? theme.palette.success.main : theme.palette.secondary.main;

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                // Use a semi-transparent background for the chip
                backgroundColor: `${chipColor}30`, // Adds ~20% opacity
                color: chipColor,
                fontWeight: 600,
                borderRadius: '6px',
            }}
        />
    );
});

export default function PayStatus() {
    const theme = useTheme();

    return (
        <Card>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="700">
                    Pay Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lorem ipsum dolor sit amet consectetur adipiscing.
                </Typography>
            </Box>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Table Headers */}
                            <TableCell sx={{ color: 'text.secondary' }}>Order id</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Customer Name</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Amount</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>
                                <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
                                    Status
                                    <SortIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary' }}>DOWNLOAD INVOICE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentData.map((row) => (
                            // Using a unique ID from the data for the key is crucial for performance
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: '600' }}>{row.id}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.customer}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>
                                    <StatusChip status={row.status} />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" aria-label="download invoice">
                                        <ArrowDownwardIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}