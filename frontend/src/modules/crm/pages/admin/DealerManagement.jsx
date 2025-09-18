import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, useTheme,
  List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip,
  Divider, Stack
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// --- Mock Data ---
// This data simulates the list of dealers and their detailed information
const dealersData = [
    {
        id: 1,
        name: 'Sophie Moore',
        handle: '@sophiemoore',
        avatar: '/img/sophie.jpg', // Placeholder image path
        time: '10 min ago',
        mobile: '8787878787',
        email: 'user@gmail.com',
        address: 'Jabalpur, India',
        accNo: 'XXX-XXX-XXX-123',
        gstNo: 'ABCDI23HG',
    },
    {
        id: 2,
        name: 'Patrick Meyer',
        handle: '@patrickmeyer',
        avatar: '/img/patrick.jpg', // Placeholder image path
        time: '5 min ago',
        mobile: '9898989898',
        email: 'patrick@example.com',
        address: 'Bhopal, India',
        accNo: 'YYY-YYY-YYY-456',
        gstNo: 'EFGHK45LM',
    },
    {
        id: 3,
        name: 'Matt Cannon',
        handle: '@mattcannon',
        avatar: '/img/matt.jpg', // Placeholder image path
        time: '15 min ago',
        mobile: '7676767676',
        email: 'matt@example.com',
        address: 'Indore, India',
        accNo: 'ZZZ-ZZZ-ZZZ-789',
        gstNo: 'PQRST67UV',
    },
    {
        id: 4,
        name: 'Sandy Houston',
        handle: '@sandyhouston',
        avatar: '/img/sandy.jpg', // Placeholder image path
        time: '25 min ago',
        mobile: '8989898989',
        email: 'sandy@example.com',
        address: 'Vidisha, India',
        accNo: 'AAA-AAA-AAA-012',
        gstNo: 'WXYZA90BC',
    },
];

// This data simulates the request approval table
const initialRequests = [
    { id: 1, reqNo: 'REQ_001', product: 'Compressor XA-200', qty: 100, status: 'Pending' },
    { id: 2, reqNo: 'REQ_002', product: 'Cooling Coils (Set)', qty: 150, status: 'Approved' },
    { id: 3, reqNo: 'REQ_003', product: 'Fan Motor Assembly', qty: 75, status: 'Approved' },
    { id: 4, reqNo: 'REQ_004', product: 'Thermostat Unit T-80', qty: 200, status: 'Approved' },
    { id: 5, reqNo: 'REQ_005', product: 'Filter Drier Pack', qty: 500, status: 'Approved' },
    { id: 6, reqNo: 'REQ_006', product: 'Compressor XA-200', qty: 120, status: 'Approved' },
];

// --- Reusable Helper Components ---
// A styled component for displaying individual dealer details
const DetailItem = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase' }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {value}
        </Typography>
    </Box>
);

// --- Main Component ---
export default function DealersManagementContent() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // State to manage the currently selected dealer
    const [selectedDealer, setSelectedDealer] = useState(dealersData[0]);

    // State to manage the requests in the table
    const [requests, setRequests] = useState(initialRequests);

    // Function to handle the approval action
    const handleApprove = (requestId) => {
        setRequests(
            requests.map((req) =>
                req.id === requestId ? { ...req, status: 'Approved' } : req
            )
        );
    };

    // A consistent, attractive card style for the page
    const cardStyle = {
        borderRadius: 4,
        boxShadow: 'none',
        background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    };

    return (
        <Box p={{ xs: 2, sm: 3 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Left Column: Dealer List */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardStyle, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Dealer List</Typography>
                            <List sx={{ p: 0 }}>
                                {dealersData.map((dealer) => (
                                    <ListItem key={dealer.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton
                                            selected={selectedDealer?.id === dealer.id}
                                            onClick={() => setSelectedDealer(dealer)}
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'background-color 0.3s, border-left 0.3s',
                                                borderLeft: '4px solid transparent',
                                                '&.Mui-selected': {
                                                    bgcolor: theme.palette.action.selected,
                                                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                                                    '&:hover': {
                                                        bgcolor: theme.palette.action.hover,
                                                    }
                                                },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar alt={dealer.name} src={dealer.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{dealer.name}</Typography>}
                                                secondary={dealer.handle}
                                            />
                                            <Typography variant="caption" color="text.secondary">{dealer.time}</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column: Details and Table */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ height: '100%' }}>
                        {/* Top Right Card: Dealer Information */}
                        <Card sx={cardStyle}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dealer Information</Typography>
                                </Stack>
                                <Divider sx={{ mb: 3 }} />
                                {selectedDealer ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}><DetailItem label="NAME" value={selectedDealer.name} /></Grid>
                                        <Grid item xs={12} sm={6}><DetailItem label="MOBILE NO" value={selectedDealer.mobile} /></Grid>
                                        <Grid item xs={12} sm={6}><DetailItem label="ADDRESS" value={selectedDealer.address} /></Grid>
                                        <Grid item xs={12} sm={6}><DetailItem label="E-MAIL" value={selectedDealer.email} /></Grid>
                                        <Grid item xs={12} sm={6}><DetailItem label="ACCOUNT NO" value={selectedDealer.accNo} /></Grid>
                                        <Grid item xs={12} sm={6}><DetailItem label="GST NO" value={selectedDealer.gstNo} /></Grid>
                                    </Grid>
                                ) : (
                                    <Typography>Select a dealer from the list to see their information.</Typography>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bottom Right Card: Request Approval Table */}
                        <Card sx={{ ...cardStyle, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: '16px !important' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, px: 2, pt: 2 }}>
                                    Request Approval Table
                                </Typography>
                                <TableContainer sx={{ flexGrow: 1 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                {['Request No.', 'Product', 'QTY', 'Action'].map((head) => (
                                                    <TableCell key={head} sx={{ fontWeight: 'bold', bgcolor: isDark ? '#2A333E' : '#F7F9FB' }}>
                                                        {head}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requests.map((req) => (
                                                <TableRow key={req.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                                                    <TableCell sx={{ fontWeight: 500 }}>{req.reqNo}</TableCell>
                                                    <TableCell>{req.product}</TableCell>
                                                    <TableCell>{req.qty}</TableCell>
                                                    <TableCell>
                                                        {req.status === 'Pending' ? (
                                                            <Button variant="contained" size="small" onClick={() => handleApprove(req.id)}>
                                                                Approve
                                                            </Button>
                                                        ) : (
                                                            <Chip
                                                                icon={<CheckCircleOutlineIcon fontSize="small" />}
                                                                label="Approved"
                                                                color="success"
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}