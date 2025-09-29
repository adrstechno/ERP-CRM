// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,

//     Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, IconButton, Dialog, DialogTitle, DialogContent, Grid, DialogActions, InputLabel, CircularProgress
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// // ===================================================================================
// // MOCK API - Replace this with your actual API calls (e.g., using axios or fetch)
// // ===================================================================================

// const mockInitialTickets = [
//     { id: '#1532', createdDate: '2025-09-22T10:06:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-22T10:06:00Z' },
//     { id: '#1531', createdDate: '2025-09-21T14:19:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Pending', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-21T14:19:00Z' },
//     { id: '#1530', createdDate: '2025-09-21T12:14:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'medium', dueDate: '2025-09-21T12:14:00Z' },
//     { id: '#1528', createdDate: '2025-09-20T14:20:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Pending', product: '1.5 Ton 3 Star Inverter AC', priority: 'high', dueDate: '2025-09-20T14:20:00Z' },
//     { id: '#1527', createdDate: '2025-09-19T09:48:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-19T09:48:00Z' },
// ];

// const engineers = ['Ramesh Kumar', 'Suresh Kumar', 'Rajesh Sharma'];
// const products = ['1.5 Ton 3 Star Inverter AC', '2 Ton 5 Star Split AC', 'Window AC 1 Ton'];
// const priorities = ['low', 'medium', 'high'];


// // Simulates fetching tickets from your backend
// const fetchTicketsAPI = async () => {
//     console.log("API: Fetching tickets...");
//     return new Promise(resolve => {
//         setTimeout(() => {
//             console.log("API: Tickets fetched successfully.");
//             resolve(mockInitialTickets);
//         }, 1500); // 1.5 second delay
//     });
// };

// // Simulates creating a new ticket on your backend
// const createTicketAPI = async (newTicketData) => {
//     console.log("API: Creating new ticket with data:", newTicketData);
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const newTicket = {
//                 ...newTicketData,
//                 id: `#${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
//                 createdDate: new Date().toISOString(),
//                 status: 'Open',
//             };
//             console.log("API: Ticket created successfully.", newTicket);
//             mockInitialTickets.unshift(newTicket); // Add to the top of our mock DB
//             resolve(newTicket);
//         }, 2000); // 2 second delay
//     });
// };

// // ===================================================================================
// // Custom Hook for Service Tickets Logic
// // ===================================================================================

// const useServiceTickets = () => {
//     // Data states
//     const [tickets, setTickets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Modal and Form states
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [formSubmitting, setFormSubmitting] = useState(false);
//     const [newTicket, setNewTicket] = useState({
//         customer: '',
//         product: '',
//         assignedEngineer: '',
//         priority: '',
//         dueDate: '',
//     });

//     const fetchTickets = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const data = await fetchTicketsAPI();
//             setTickets(data);
//         } catch (err) {
//             setError("Failed to fetch service tickets.");
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchTickets();
//     }, [fetchTickets]);

//     const handleOpenDialog = () => setDialogOpen(true);

//     const handleCloseDialog = () => {
//         setDialogOpen(false);
//         setNewTicket({ customer: '', product: '', assignedEngineer: '', priority: '', dueDate: '' });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewTicket(prev => ({ ...prev, [name]: value }));
//     };

//     const handleCreateTicket = async () => {
//         try {
//             setFormSubmitting(true);
//             await createTicketAPI(newTicket);
//             handleCloseDialog();
//             fetchTickets(); // Refresh the list after creation
//         } catch (err) {
//             console.error("Failed to create ticket", err);
//             // You could set a form-specific error state here
//         } finally {
//             setFormSubmitting(false);
//         }
//     };

//     return {
//         tickets,
//         loading,
//         error,
//         dialogOpen,
//         formSubmitting,
//         newTicket,
//         handleOpenDialog,
//         handleCloseDialog,
//         handleInputChange,
//         handleCreateTicket,
//     };
// };

// // ===================================================================================
// // Helper Functions & Components
// // ===================================================================================

// const getStatusChip = (status) => {
//     let color = 'default';
//     if (status === 'Resolved') color = 'success';
//     if (status === 'Pending') color = 'warning';
//     if (status === 'Open') color = 'info';
//     return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
// };

// const getPriorityChip = (priority) => {
//     let color;
//     switch (priority) {
//         case 'high': color = 'error'; break;
//         case 'medium': color = 'warning'; break;
//         case 'low': color = 'success'; break;
//         default: color = 'default';
//     }
//     return <Chip label={priority} color={color} size="small" sx={{ fontWeight: 500, textTransform: 'capitalize' }} />;
// };

// const TableLoadingSkeleton = ({ columns }) => (
//     <TableRow>
//         <TableCell colSpan={columns} align="center" sx={{ py: 5 }}>
//             <CircularProgress />
//             <Typography>Loading Tickets...</Typography>
//         </TableCell>
//     </TableRow>
// );

// const TableErrorState = ({ columns, error }) => (
//     <TableRow>
//         <TableCell colSpan={columns} align="center" sx={{ py: 5 }}>
//             <Typography color="error">{error}</Typography>
//         </TableCell>
//     </TableRow>
// );


// // ===================================================================================
// // Main UI Component
// // ===================================================================================
// export default function ServiceManagerPage() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [month, setMonth] = useState('Jun 2024');

//     const {
//         tickets,
//         loading,
//         error,
//         dialogOpen,
//         formSubmitting,
//         newTicket,
//         handleOpenDialog,
//         handleCloseDialog,
//         handleInputChange,
//         handleCreateTicket,
//     } = useServiceTickets();


//     const handleMonthChange = (event) => setMonth(event.target.value);

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//     };

//     const TABLE_COLUMNS = 9;

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Card sx={cardStyle}>
//                 <CardContent>
//                     {/* Header: Search, Title, Filter */}
//                     <Stack
//                         direction={{ xs: 'column', md: 'row' }}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={3}
//                         spacing={2}
//                     >
//                         <TextField
//                             variant="outlined"
//                             size="small"
//                             placeholder="Search"
//                             InputProps={{
//                                 startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
//                                 sx: { borderRadius: 3, width: { xs: '100%', sm: 300 }, bgcolor: theme.palette.action.hover, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }
//                             }}
//                         />
//                         <Typography variant="h5" sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>Service Tickets</Typography>
//                         <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
//                             <Select
//                                 value={month}
//                                 onChange={handleMonthChange}
//                                 sx={{ borderRadius: 2, minWidth: 120, '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)' } }}
//                             >
//                                 <MenuItem value="Jun 2024">Jun 2024</MenuItem>
//                                 <MenuItem value="Jul 2024">Jul 2024</MenuItem>
//                                 <MenuItem value="Aug 2024">Aug 2024</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Stack>

//                     {/* Service Tickets Table */}
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     {['Ticket id', 'CREATED DATE', 'assigned-engineer', 'CUSTOMER', 'STATUS', 'PRODUCT', 'PRIORITY', 'DUE DATE', 'ACTIONS'].map(head => (
//                                         <TableCell key={head} sx={{ fontWeight: 'bold', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{head}</TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {loading ? (
//                                     <TableLoadingSkeleton columns={TABLE_COLUMNS} />
//                                 ) : error ? (
//                                     <TableErrorState columns={TABLE_COLUMNS} error={error} />
//                                 ) : (
//                                     tickets.map((ticket) => (
//                                         <TableRow key={ticket.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                             <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
//                                             <TableCell>{new Date(ticket.createdDate).toLocaleString()}</TableCell>
//                                             <TableCell>{ticket.assignedEngineer}</TableCell>
//                                             <TableCell>{ticket.customer}</TableCell>
//                                             <TableCell>{getStatusChip(ticket.status)}</TableCell>
//                                             <TableCell>{ticket.product}</TableCell>
//                                             <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
//                                             <TableCell>{new Date(ticket.dueDate).toLocaleString()}</TableCell>
//                                             <TableCell><IconButton size="small"><MoreVertIcon /></IconButton></TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     {/* Create New Ticket Button */}
//                     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//                         <Button
//                             variant="contained"
//                             onClick={handleOpenDialog}
//                             sx={{
//                                 textTransform: 'none',
//                                 fontWeight: 'bold',
//                                 borderRadius: 3,
//                                 px: 4,
//                                 py: 1,
//                                 bgcolor: isDark ? '#3A414B' : '#424242',
//                                 '&:hover': { bgcolor: isDark ? '#4F5761' : '#616161' }
//                             }}
//                         >
//                             Create New ticket
//                         </Button>
//                     </Box>
//                 </CardContent>
//             </Card>

//             {/* Create New Ticket Modal */}
//             <Dialog open={dialogOpen} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4 } }} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                         <AddCircleOutlineIcon /> <Typography variant="h6">Create New Service Ticket</Typography>
//                     </Stack>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={2} sx={{ mt: 1 }}>
//                         <Grid item xs={12}><TextField label="Customer Name" name="customer" value={newTicket.customer} onChange={handleInputChange} fullWidth /></Grid>
//                         <Grid item xs={12}><FormControl fullWidth><InputLabel>Product</InputLabel><Select label="Product" name="product" value={newTicket.product} onChange={handleInputChange}>{products.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>
//                         <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Assigned Engineer</InputLabel><Select label="Assigned Engineer" name="assignedEngineer" value={newTicket.assignedEngineer} onChange={handleInputChange}>{engineers.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select></FormControl></Grid>
//                         <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Priority</InputLabel><Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>{priorities.map(p => <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>)}</Select></FormControl></Grid>
//                         <Grid item xs={12}><TextField label="Due Date" name="dueDate" type="date" value={newTicket.dueDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth /></Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleCloseDialog} disabled={formSubmitting}>Cancel</Button>
//                     <Button variant="contained" onClick={handleCreateTicket} disabled={formSubmitting}>
//                         {formSubmitting ? <CircularProgress size={24} /> : "Create Ticket"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, Skeleton, InputLabel, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// --- API Simulation ---
const mockTicketsData = [
    { id: '#033', createdDate: '30 Dec, 10:09 AM', assignedTo: 'Ramesh Kumar', customer: 'Lal Singh Chaddha', status: 'Resolved', product: '1.5 Ton 5 Star AC', priority: 'High' },
    { id: '#032', createdDate: '29 Dec, 12:14 PM', assignedTo: 'Suresh Singh', customer: 'ACME Corp', status: 'Pending', product: '1 Ton Window AC', priority: 'Medium' },
    { id: '#031', createdDate: '28 Dec, 03:33 PM', assignedTo: 'Ramesh Kumar', customer: 'Global Tech', status: 'In Progress', product: '2 Ton Split AC', priority: 'Low' },
    { id: '#030', createdDate: '27 Dec, 09:48 AM', assignedTo: 'Amit Patel', customer: 'Home Essentials', status: 'Resolved', product: '1.5 Ton 3 Star AC', priority: 'High' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
    { id: '#029', createdDate: '26 Dec, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star AC', priority: 'Medium' },
];
const serviceEngineers = ['Ramesh Kumar', 'Suresh Singh', 'Amit Patel'];
const priorityOptions = ['Low', 'Medium', 'High'];
const ticketStatusOptions = ['Pending', 'In Progress', 'Resolved', 'Cancelled'];


// --- Helper Components ---
const getStatusChip = (status) => {
    let color;
    if (status === 'Resolved') color = 'success';
    else if (status === 'In Progress') color = 'warning';
    else if (status === 'Pending') color = 'error';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
};
const getPriorityChip = (priority) => {
    let color;
    if (priority === 'High') color = 'error';
    else if (priority === 'Medium') color = 'warning';
    else if (priority === 'Low') color = 'success';
    else color = 'default';
    return <Chip label={priority} color={color} size="small" />;
};

// --- Main Component ---
export default function AssignServiceTicket() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setTickets(mockTicketsData);
            setIsLoading(false);
        }, 100);
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const handleCreateTicket = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            handleCloseDialog();
            fetchTickets(); // Refresh list
        }, 2000);
    };

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket =>
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tickets, searchTerm]);

    return (
        <Box>
            <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        spacing={2}
                        mb={2}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ConfirmationNumberIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Tickets</Typography>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search by Customer, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: { xs: '100%', sm: 300 } }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleOpenDialog}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                Create New Ticket
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>

                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader size="medium">
                        <TableHead>
                            <TableRow>
                                {['Ticket ID', 'Created Date', 'Assigned To', 'Customer', 'Product', 'Status', 'Priority', 'Actions'].map(head => (
                                    <TableCell key={head}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(5)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={8}><Skeleton animation="wave" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
                                        <TableCell>{ticket.createdDate}</TableCell>
                                        <TableCell>{ticket.assignedTo}</TableCell>
                                        <TableCell>{ticket.customer}</TableCell>
                                        <TableCell>{ticket.product}</TableCell>
                                        <TableCell>{getStatusChip(ticket.status)}</TableCell>
                                        <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                        <TableCell>
                                            <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Create New Ticket Dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                       <ConfirmationNumberIcon color="primary"/>
                       <Typography variant="h6" sx={{fontWeight: 'bold'}}>Create New Service Ticket</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                     <Box component="form" sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Customer Name" variant="outlined" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Contact Number" variant="outlined" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Address" variant="outlined" multiline rows={2} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Product Name / Model" variant="outlined" required />
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Assign to Engineer</InputLabel>
                                    <Select label="Assign to Engineer">
                                        {serviceEngineers.map(eng => <MenuItem key={eng} value={eng}>{eng}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Status</InputLabel>
                                    <Select label="Status" defaultValue="Pending">
                                        {ticketStatusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Priority</InputLabel>
                                    <Select label="Priority" defaultValue="Medium">
                                        {priorityOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Issue Description" variant="outlined" multiline rows={3} required />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleCreateTicket} variant="contained" size="large" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Ticket'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

