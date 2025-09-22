import React from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

// --- Mock Data ---
const dealersData = [
    { id: 'DL-00', name: 'CoolAir Traders', region: 'Delhi NCR', stock: 120, sales: 450000, requests: '2 Stock Requests', lastActivity: '06-Sep-2025' },
    { id: 'DL-001', name: 'CoolAir Traders', region: 'Delhi NCR', stock: 120, sales: 450000, requests: '2 Stock Requests', lastActivity: '06-Sep-2025' },
    { id: 'DL-002', name: 'FreshBreeze ACs', region: 'Mumbai', stock: 85, sales: 230000, requests: 'None', lastActivity: '04-Sep-2025' },
    { id: 'DL-003', name: 'Arctic Systems', region: 'Bangalore', stock: 40, sales: 90000, requests: '1 Stock Request', lastActivity: '02-Sep-2025' },
    { id: 'DL-004', name: 'Zenith Corp', region: 'Pune', stock: 150, sales: 620000, requests: 'None', lastActivity: '01-Sep-2025' },
    { id: 'DL-005', name: 'Evergreen Pvt. Ltd.', region: 'Chennai', stock: 75, sales: 310000, requests: '3 Stock Requests', lastActivity: '31-Aug-2025' },
];

// --- Main Component ---
export default function SubadminDealersPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [month, setMonth] = React.useState('Jan 2025');

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const cardStyle = {
        borderRadius: 4,
        boxShadow: 'none',
        background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        height: '100%',
    };

    return (
        <Box p={{ xs: 2, sm: 3 }}>
            <Card sx={cardStyle}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        mb={3}
                        spacing={2}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Dealers List</Typography>
                        <FormControl size="small">
                            <Select
                                value={month}
                                onChange={handleMonthChange}
                                sx={{
                                    borderRadius: 2,
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <MenuItem value="Jan 2025">Jan 2025</MenuItem>
                                <MenuItem value="Feb 2025">Feb 2025</MenuItem>
                                <MenuItem value="Mar 2025">Mar 2025</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Dealer ID', 'Dealer Name', 'Region', 'Stock Balance', 'Sales (MTD)', 'Requests Pending', 'Last Activity', 'Action'].map(head => (
                                        <TableCell key={head} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dealersData.map((dealer) => (
                                    <TableRow key={dealer.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                                        <TableCell sx={{ fontWeight: 500 }}>{dealer.id}</TableCell>
                                        <TableCell>{dealer.name}</TableCell>
                                        <TableCell>{dealer.region}</TableCell>
                                        <TableCell>{dealer.stock} Units</TableCell>
                                        <TableCell>₹{dealer.sales.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>{dealer.requests}</TableCell>
                                        <TableCell>{dealer.lastActivity}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ textTransform: 'none', color: theme.palette.primary.main, fontWeight: 'bold' }}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}