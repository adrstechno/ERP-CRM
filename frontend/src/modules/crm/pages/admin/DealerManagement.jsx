// import React, { useState } from 'react';
// import {
//   Box, Grid, Card, CardContent, Typography, useTheme,
//   List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip,
//   Divider, Stack
// } from '@mui/material';
// import BusinessIcon from '@mui/icons-material/Business';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// // --- Mock Data ---
// // This data simulates the list of dealers and their detailed information
// const dealersData = [
//     {
//         id: 1,
//         name: 'Sophie Moore',
//         handle: '@sophiemoore',
//         avatar: '/img/sophie.jpg', // Placeholder image path
//         time: '10 min ago',
//         mobile: '8787878787',
//         email: 'user@gmail.com',
//         address: 'Jabalpur, India',
//         accNo: 'XXX-XXX-XXX-123',
//         gstNo: 'ABCDI23HG',
//     },
//     {
//         id: 2,
//         name: 'Patrick Meyer',
//         handle: '@patrickmeyer',
//         avatar: '/img/patrick.jpg', // Placeholder image path
//         time: '5 min ago',
//         mobile: '9898989898',
//         email: 'patrick@example.com',
//         address: 'Bhopal, India',
//         accNo: 'YYY-YYY-YYY-456',
//         gstNo: 'EFGHK45LM',
//     },
//     {
//         id: 3,
//         name: 'Matt Cannon',
//         handle: '@mattcannon',
//         avatar: '/img/matt.jpg', // Placeholder image path
//         time: '15 min ago',
//         mobile: '7676767676',
//         email: 'matt@example.com',
//         address: 'Indore, India',
//         accNo: 'ZZZ-ZZZ-ZZZ-789',
//         gstNo: 'PQRST67UV',
//     },
//     {
//         id: 4,
//         name: 'Sandy Houston',
//         handle: '@sandyhouston',
//         avatar: '/img/sandy.jpg', // Placeholder image path
//         time: '25 min ago',
//         mobile: '8989898989',
//         email: 'sandy@example.com',
//         address: 'Vidisha, India',
//         accNo: 'AAA-AAA-AAA-012',
//         gstNo: 'WXYZA90BC',
//     },
// ];

// // This data simulates the request approval table
// const initialRequests = [
//     { id: 1, reqNo: 'REQ_001', product: 'Compressor XA-200', qty: 100, status: 'Pending' },
//     { id: 2, reqNo: 'REQ_002', product: 'Cooling Coils (Set)', qty: 150, status: 'Approved' },
//     { id: 3, reqNo: 'REQ_003', product: 'Fan Motor Assembly', qty: 75, status: 'Approved' },
//     { id: 4, reqNo: 'REQ_004', product: 'Thermostat Unit T-80', qty: 200, status: 'Approved' },
//     { id: 5, reqNo: 'REQ_005', product: 'Filter Drier Pack', qty: 500, status: 'Approved' },
//     { id: 6, reqNo: 'REQ_006', product: 'Compressor XA-200', qty: 120, status: 'Approved' },
// ];

// // --- Reusable Helper Components ---
// // A styled component for displaying individual dealer details
// const DetailItem = ({ label, value }) => (
//     <Box>
//         <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase' }}>
//             {label}
//         </Typography>
//         <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//             {value}
//         </Typography>
//     </Box>
// );

// // --- Main Component ---
// export default function DealersManagementContent() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';

//     // State to manage the currently selected dealer
//     const [selectedDealer, setSelectedDealer] = useState(dealersData[0]);

//     // State to manage the requests in the table
//     const [requests, setRequests] = useState(initialRequests);

//     // Function to handle the approval action
//     const handleApprove = (requestId) => {
//         setRequests(
//             requests.map((req) =>
//                 req.id === requestId ? { ...req, status: 'Approved' } : req
//             )
//         );
//     };

//     // A consistent, attractive card style for the page
//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Grid container spacing={{ xs: 2, sm: 3 }}>
//                 {/* Left Column: Dealer List */}
//                 <Grid item xs={12} md={4}>
//                     <Card sx={{ ...cardStyle, height: '100%' }}>
//                         <CardContent>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Dealer List</Typography>
//                             <List sx={{ p: 0 }}>
//                                 {dealersData.map((dealer) => (
//                                     <ListItem key={dealer.id} disablePadding sx={{ mb: 1 }}>
//                                         <ListItemButton
//                                             selected={selectedDealer?.id === dealer.id}
//                                             onClick={() => setSelectedDealer(dealer)}
//                                             sx={{
//                                                 borderRadius: 2,
//                                                 transition: 'background-color 0.3s, border-left 0.3s',
//                                                 borderLeft: '4px solid transparent',
//                                                 '&.Mui-selected': {
//                                                     bgcolor: theme.palette.action.selected,
//                                                     borderLeft: `4px solid ${theme.palette.primary.main}`,
//                                                     '&:hover': {
//                                                         bgcolor: theme.palette.action.hover,
//                                                     }
//                                                 },
//                                             }}
//                                         >
//                                             <ListItemAvatar>
//                                                 <Avatar alt={dealer.name} src={dealer.avatar} />
//                                             </ListItemAvatar>
//                                             <ListItemText
//                                                 primary={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{dealer.name}</Typography>}
//                                                 secondary={dealer.handle}
//                                             />
//                                             <Typography variant="caption" color="text.secondary">{dealer.time}</Typography>
//                                         </ListItemButton>
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Right Column: Details and Table */}
//                 <Grid item xs={12} md={8}>
//                     <Stack spacing={{ xs: 2, sm: 3 }} sx={{ height: '100%' }}>
//                         {/* Top Right Card: Dealer Information */}
//                         <Card sx={cardStyle}>
//                             <CardContent>
//                                 <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//                                     <BusinessIcon color="primary" />
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dealer Information</Typography>
//                                 </Stack>
//                                 <Divider sx={{ mb: 3 }} />
//                                 {selectedDealer ? (
//                                     <Grid container spacing={3}>
//                                         <Grid item xs={12} sm={6}><DetailItem label="NAME" value={selectedDealer.name} /></Grid>
//                                         <Grid item xs={12} sm={6}><DetailItem label="MOBILE NO" value={selectedDealer.mobile} /></Grid>
//                                         <Grid item xs={12} sm={6}><DetailItem label="ADDRESS" value={selectedDealer.address} /></Grid>
//                                         <Grid item xs={12} sm={6}><DetailItem label="E-MAIL" value={selectedDealer.email} /></Grid>
//                                         <Grid item xs={12} sm={6}><DetailItem label="ACCOUNT NO" value={selectedDealer.accNo} /></Grid>
//                                         <Grid item xs={12} sm={6}><DetailItem label="GST NO" value={selectedDealer.gstNo} /></Grid>
//                                     </Grid>
//                                 ) : (
//                                     <Typography>Select a dealer from the list to see their information.</Typography>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         {/* Bottom Right Card: Request Approval Table */}
//                         <Card sx={{ ...cardStyle, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                             <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: '16px !important' }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, px: 2, pt: 2 }}>
//                                     Request Approval Table
//                                 </Typography>
//                                 <TableContainer sx={{ flexGrow: 1 }}>
//                                     <Table stickyHeader size="small">
//                                         <TableHead>
//                                             <TableRow>
//                                                 {['Request No.', 'Product', 'QTY', 'Action'].map((head) => (
//                                                     <TableCell key={head} sx={{ fontWeight: 'bold', bgcolor: isDark ? '#2A333E' : '#F7F9FB' }}>
//                                                         {head}
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {requests.map((req) => (
//                                                 <TableRow key={req.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                                     <TableCell sx={{ fontWeight: 500 }}>{req.reqNo}</TableCell>
//                                                     <TableCell>{req.product}</TableCell>
//                                                     <TableCell>{req.qty}</TableCell>
//                                                     <TableCell>
//                                                         {req.status === 'Pending' ? (
//                                                             <Button variant="contained" size="small" onClick={() => handleApprove(req.id)}>
//                                                                 Approve
//                                                             </Button>
//                                                         ) : (
//                                                             <Chip
//                                                                 icon={<CheckCircleOutlineIcon fontSize="small" />}
//                                                                 label="Approved"
//                                                                 color="success"
//                                                                 size="small"
//                                                                 variant="outlined"
//                                                             />
//                                                         )}
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             </CardContent>
//                         </Card>
//                     </Stack>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }

import React, { useState, useMemo, useEffect } from 'react';
import axios from "axios";
import {
    Box, Grid, Card, CardContent, Typography, List, ListItem, ListItemButton,
    ListItemAvatar, Avatar, ListItemText, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Chip, Divider, Stack,
    TextField, InputAdornment
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

// --- Mock Data ---
/** 
const dealersData = [
    { id: 1, name: 'Sophie Moore', handle: '@sophiemoore', time: '10 min ago', status: 'Active', mobile: '8787878787', email: 'sophie@example.com', address: 'Jabalpur, India', accNo: 'XXX-XXX-123', gstNo: 'ABCDI23HG', companyName: 'Moore Enterprises', panNo: 'ABCDE1234F', joinedDate: '15 Aug 2023' },
    { id: 2, name: 'Patrick Meyer', handle: '@patrickmeyer', time: '5 min ago', status: 'Active', mobile: '9898989898', email: 'patrick@example.com', address: 'Bhopal, India', accNo: 'YYY-YYY-456', gstNo: 'EFGHK45LM', companyName: 'Meyer Solutions', panNo: 'FGHIJ5678K', joinedDate: '22 Sep 2023' },
    { id: 3, name: 'Matt Cannon', handle: '@mattcannon', time: '15 min ago', status: 'Inactive', mobile: '7676767676', email: 'matt@example.com', address: 'Indore, India', accNo: 'ZZZ-ZZZ-789', gstNo: 'PQRST67UV', companyName: 'Cannon Traders', panNo: 'KLMNO9012L', joinedDate: '01 Jul 2023' },
    { id: 4, name: 'Sandy Houston', handle: '@sandyhouston', time: '25 min ago', status: 'Active', mobile: '8989898989', email: 'sandy@example.com', address: 'Vidisha, India', accNo: 'AAA-AAA-012', gstNo: 'WXYZA90BC', companyName: 'Houston Supplies', panNo: 'PQRST3456M', joinedDate: '11 Jun 2023' },
    { id: 5, name: 'John Doe', handle: '@johndoe', time: '30 min ago', status: 'Active', mobile: '8888888888', email: 'john@example.com', address: 'Sagar, India', accNo: 'BBB-BBB-345', gstNo: 'CDEFG12HI', companyName: 'Doe & Co.', panNo: 'UVWXY7890N', joinedDate: '19 May 2023' },
];
*/

const initialRequests = [
    { id: 1, reqNo: 'REQ_001', product: 'Compressor XA-200', qty: 100, status: 'Pending' },
    { id: 2, reqNo: 'REQ_002', product: 'Cooling Coils (Set)', qty: 150, status: 'Approved' },
    { id: 3, reqNo: 'REQ_003', product: 'Fan Motor Assembly', qty: 75, status: 'Approved' },
    { id: 4, reqNo: 'REQ_004', product: 'Thermostat Unit T-80', qty: 200, status: 'Approved' },
    { id: 5, reqNo: 'REQ_005', product: 'Filter Drier Pack', qty: 500, status: 'Approved' },
    { id: 6, reqNo: 'REQ_006', product: 'Compressor XA-200', qty: 120, status: 'Approved' },
];

// --- Reusable Helper Component ---
const DetailItem = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase' }}>{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{value || 'N/A'}</Typography>
    </Box>
);

// --- Main Component ---
export default function DealersManagement() {

    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [dealersData, setDealersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dealerProfile, setDealerProfile] = useState(null);


    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const authKey = localStorage.getItem("authKey");
                const response = await axios.get("http://localhost:8080/api/admin/users/DEALER",
                    {
                        headers: {
                            Authorization: `Bearer ${authKey}`,
                        },
                    }
                );
                setDealersData(response.data);  // make sure API returns array
                console.log("Fetched dealers:", response.data);
            } catch (error) {
                console.error("Error fetching dealers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealers();
    }, []);
    const [selectedDealer, setSelectedDealer] = useState(null);

    useEffect(() => {
        if (dealersData.length > 0) {
            setSelectedDealer(dealersData[0]);
        }
    }, [dealersData]);


    const handleApprove = (requestId) => {
        setRequests(requests.map((req) => req.id === requestId ? { ...req, status: 'Approved' } : req));
    };
    const handleDealerSelect = async (dealer) => {
        setSelectedDealer(dealer);
        setDealerProfile(null); // reset while fetching new one
        try {
            const authKey = localStorage.getItem("authKey");
            console.log("Fetching profile for dealer ID:", dealer.id);
            const response = await axios.get(`http://localhost:8080/api/profiles/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${authKey}`,
                },
            });
            console.log("Dealer profile data:", response.data);
            setDealerProfile(response.data);
        } catch (error) {
            console.error("Error fetching dealer profile:", error);
        }
    };


    const filteredDealers = useMemo(() =>
        dealersData.filter(dealer =>
            dealer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealer.handle?.toLowerCase().includes(searchTerm.toLowerCase())
        ), [dealersData, searchTerm]);

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Left Column: Dealer List
                {loading ? (
                    <Typography variant="body2" sx={{ p: 2 }}>Loading dealers...</Typography>
                ) : filteredDealers.length > 0 ? (
                    filteredDealers.map((dealer) => (
                        <ListItem key={dealer._id || dealer.id} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={selectedDealer?.id === dealer.id}
                                onClick={() => handleDealerSelect(dealer)}

                            >
                                <ListItemAvatar>
                                    <Avatar alt={dealer.name} src={dealer.avatar} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{dealer.name}</Typography>}
                                    secondary={dealer.email}
                                />
                                <Typography variant="caption" color="text.secondary">{dealer.status}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ p: 2 }}>No dealers found</Typography>
                )} */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Dealer List</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Search Dealers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                                }}
                            />
                        </CardContent>
                        <CardContent sx={{ flexGrow: 1, overflow: 'hidden', p: 0 }}>
                            <List sx={{ height: '100%', overflowY: 'auto', p: 2, pt: 0 }}>
                                {filteredDealers.map((dealer) => (
                                    <ListItem key={dealer.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton selected={selectedDealer?.id === dealer.id} onClick={() => setSelectedDealer(dealer)}>
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
                <Grid item xs={12} md={9}>
                    <Stack spacing={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dealer Information</Typography>
                                </Stack>
                                <Divider sx={{ mb: 3 }} />
                                : (
                                <Typography></Typography>
                           {selectedDealer ? (
  <TableContainer sx={{ maxHeight: 200, overflowY: 'auto' }}>
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell><DetailItem label="Name" value={selectedDealer.name} /></TableCell>
          <TableCell><DetailItem label="Mobile No" value={selectedDealer.phone} /></TableCell>
          <TableCell><DetailItem label="E-Mail" value={selectedDealer.email} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><DetailItem label="Address" value={selectedDealer.profile?.address} /></TableCell>
          <TableCell><DetailItem label="City" value={selectedDealer.profile?.city} /></TableCell>
          <TableCell><DetailItem label="State" value={selectedDealer.profile?.state} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><DetailItem label="Pincode" value={selectedDealer.profile?.pincode} /></TableCell>
          <TableCell><DetailItem label="GST No" value={selectedDealer.profile?.gstNumber} /></TableCell>
          <TableCell><DetailItem label="Account No" value={selectedDealer.profile?.accountNo} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <Typography></Typography>
)}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Request Approval Table</Typography>
                                <TableContainer sx={{ maxHeight: 'calc(100vh - 540px)', overflowY: 'auto' }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                {['Request No.', 'Product', 'QTY', 'Action'].map((head) => (<TableCell key={head}>{head}</TableCell>))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requests.map((req) => (
                                                <TableRow key={req.id} hover>
                                                    <TableCell sx={{ fontWeight: 500 }}>{req.reqNo}</TableCell>
                                                    <TableCell>{req.product}</TableCell>
                                                    <TableCell>{req.qty}</TableCell>
                                                    <TableCell>
                                                        {req.status === 'Pending' ? (
                                                            <Button variant="contained" size="small" onClick={() => handleApprove(req.id)}>Approve</Button>
                                                        ) : (
                                                            <Chip icon={<CheckCircleOutlineIcon fontSize="small" />} label="Approved" color="success" size="small" variant="outlined" />
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

