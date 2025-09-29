// // import React, { useState } from 'react';
// // import {
// //     Box, Grid, Card, CardContent, Typography, useTheme,
// //     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
// //     Chip, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
// //     TextField, FormControl, InputLabel, Select, MenuItem, Divider
// // } from '@mui/material';
// // import EditIcon from '@mui/icons-material/Edit';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import MoreVertIcon from '@mui/icons-material/MoreVert'; // Used for generic actions
// // import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For "Create New Ticket"
// // import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Icon for service management header
// // import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

// // // --- Mock Data ---

// // // Data for the Service Tickets Table
// // const serviceTicketsData = [
// //     { id: '#033', createdDate: 'Dec 30, 10:09 AM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'High', dueDate: 'Dec 30, 10:09 AM', status: 'Resolved' },
// //     { id: '#031', createdDate: 'Dec 29, 2:17 AM', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'Medium', dueDate: 'Dec 29, 2:17 AM', status: 'Pending' },
// //     { id: '#030', createdDate: 'Dec 29, 12:14 AM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'Low', dueDate: 'Dec 29, 12:14 AM', status: 'Resolved' },
// //     { id: '#029', createdDate: 'Dec 28, 7:33 PM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'High', dueDate: 'Dec 28, 7:33 PM', status: 'Pending' },
// //     { id: '#026', createdDate: 'Dec 27, 2:30 PM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'Urgent', dueDate: 'Dec 27, 2:30 PM', status: 'Open' },
// //     { id: '#027', createdDate: 'Dec 26, 9:48 AM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'Medium', dueDate: 'Dec 26, 9:48 AM', status: 'Resolved' },
// //     { id: '#029', createdDate: 'Dec 25, 1:09 AM', assignedEngineer: 'Suresh Kumar', customer: 'Lal Singh Chadha', product: '1.5 Ton 3 Star Inverter AC', priority: 'Low', dueDate: 'Dec 25, 1:09 AM', status: 'Resolved' },
// // ];

// // // Data for the "Service Projects Operating Status" Line Chart
// // const serviceStatusChartData = [
// //     { name: 'Jan', value: 25 },
// //     { name: 'Feb', value: 18 },
// //     { name: 'Mar', value: 30 },
// //     { name: 'Apr', value: 22 },
// //     { name: 'May', value: 40 },
// //     { name: 'Jun', value: 35 },
// //     { name: 'Jul', value: 45 },
// //     { name: 'Aug', value: 38 },
// // ];

// // // Options for the "Create New Ticket" form dropdowns
// // const engineers = ['Suresh Kumar', 'Ramesh Kumar', 'Rajesh Sharma', 'Priya Singh'];
// // const products = ['1.5 Ton 3 Star Inverter AC', '2 Ton 5 Star Split AC', 'Window AC 1 Ton', 'AC Compressor', 'Cooling Coils'];
// // const priorities = ['Low', 'Medium', 'High', 'Urgent'];

// // // --- Helper Functions ---

// // // Returns a styled Chip for ticket status
// // const getStatusChip = (status) => {
// //     let color = 'default';
// //     if (status === 'Resolved') color = 'success';
// //     if (status === 'Pending') color = 'warning';
// //     if (status === 'Open') color = 'primary'; // Or info
// //     return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
// // };

// // // Returns a styled Chip for ticket priority
// // const getPriorityChip = (priority) => {
// //     let color = 'default';
// //     if (priority === 'Urgent') color = 'error';
// //     if (priority === 'High') color = 'warning';
// //     if (priority === 'Medium') color = 'info';
// //     if (priority === 'Low') color = 'success';
// //     return <Chip label={priority} color={color} size="small" sx={{ fontWeight: 500 }} />;
// // };

// // // Custom Tooltip for Recharts to match theme
// // const CustomChartTooltip = ({ active, payload, label, theme, isDark }) => {
// //     if (active && payload && payload.length) {
// //         return (
// //             <Box
// //                 sx={{
// //                     p: 1.5,
// //                     bgcolor: isDark ? 'rgba(42, 51, 62, 0.9)' : 'rgba(255,255,255,0.9)',
// //                     border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
// //                     borderRadius: 2,
// //                     boxShadow: 3,
// //                     backdropFilter: 'blur(5px)'
// //                 }}
// //             >
// //                 <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{`Month: ${label}`}</Typography>
// //                 <Typography variant="body1" sx={{ color: payload[0].color, fontWeight: 'bold' }}>
// //                     {`Projects: ${payload[0].value}`}
// //                 </Typography>
// //             </Box>
// //         );
// //     }
// //     return null;
// // };

// // // --- Main Component ---
// // export default function ServiceManagementContent() {
// //     const theme = useTheme();
// //     const isDark = theme.palette.mode === 'dark';

// //     const [openDialog, setOpenDialog] = useState(false);
// //     const [newTicket, setNewTicket] = useState({
// //         customer: '',
// //         product: '',
// //         priority: '',
// //         assignedEngineer: '',
// //         dueDate: '',
// //     });

// //     const handleOpenDialog = () => setOpenDialog(true);
// //     const handleCloseDialog = () => {
// //         setOpenDialog(false);
// //         setNewTicket({ customer: '', product: '', priority: '', assignedEngineer: '', dueDate: '' }); // Reset form
// //     };

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setNewTicket(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleCreateTicket = () => {
// //         console.log('New Ticket Data:', newTicket);
// //         // Here you would typically add this to a state or send to an API
// //         // For now, just close the dialog
// //         handleCloseDialog();
// //     };


// //     const cardStyle = {
// //         borderRadius: 4,
// //         boxShadow: 'none',
// //         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
// //         backdropFilter: 'blur(10px)',
// //         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
// //         height: '100%',
// //     };

// //     return (
// //         <Box p={{ xs: 2, sm: 3 }}>
// //             <Stack spacing={3}>
// //                 {/* Service Tickets Table Card */}
// //                 <Card sx={cardStyle}>
// //                     <CardContent>
// //                         <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
// //                             <Stack direction="row" alignItems="center" spacing={1.5}>
// //                                 <SupportAgentIcon color="primary" />
// //                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Tickets</Typography>
// //                             </Stack>
// //                             <Button
// //                                 variant="contained"
// //                                 startIcon={<AddCircleOutlineIcon />}
// //                                 onClick={handleOpenDialog}
// //                                 sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
// //                             >
// //                                 Create New Ticket
// //                             </Button>
// //                         </Stack>
// //                         <TableContainer>
// //                             <Table size="small">
// //                                 <TableHead>
// //                                     <TableRow>
// //                                         {['Ticket ID', 'Created Date', 'Assigned Engineer', 'Customer', 'Product', 'Priority', 'Due Date', 'Status', 'Actions'].map(head => (
// //                                             <TableCell key={head} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{head}</TableCell>
// //                                         ))}
// //                                     </TableRow>
// //                                 </TableHead>
// //                                 <TableBody>
// //                                     {serviceTicketsData.map((ticket) => (
// //                                         <TableRow key={ticket.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
// //                                             <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
// //                                             <TableCell>{ticket.createdDate}</TableCell>
// //                                             <TableCell>{ticket.assignedEngineer}</TableCell>
// //                                             <TableCell>{ticket.customer}</TableCell>
// //                                             <TableCell>{ticket.product}</TableCell>
// //                                             <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
// //                                             <TableCell>{ticket.dueDate}</TableCell>
// //                                             <TableCell>{getStatusChip(ticket.status)}</TableCell>
// //                                             <TableCell>
// //                                                 <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
// //                                                 <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
// //                                                 <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
// //                                             </TableCell>
// //                                         </TableRow>
// //                                     ))}
// //                                 </TableBody>
// //                             </Table>
// //                         </TableContainer>
// //                     </CardContent>
// //                 </Card>

// //                 {/* Service Projects Operating Status Chart Card */}
// //                 <Card sx={cardStyle}>
// //                     <CardContent>
// //                         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Service Projects Operating Status</Typography>
// //                         <Divider sx={{ mb: 3 }} />
// //                         <Box sx={{ height: 350 }}>
// //                             <ResponsiveContainer width="100%" height="100%">
// //                                 <AreaChart
// //                                     data={serviceStatusChartData}
// //                                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
// //                                 >
// //                                     <defs>
// //                                         <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
// //                                             <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
// //                                             <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
// //                                         </linearGradient>
// //                                     </defs>
// //                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
// //                                     <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
// //                                     <YAxis stroke={theme.palette.text.secondary} />
// //                                     <Tooltip content={<CustomChartTooltip theme={theme} isDark={isDark} />} />
// //                                     <Area type="monotone" dataKey="value" stroke={theme.palette.primary.main} fill="url(#chartGradient)" strokeWidth={3} />
// //                                 </AreaChart>
// //                             </ResponsiveContainer>
// //                         </Box>
// //                     </CardContent>
// //                 </Card>
// //             </Stack>

// //             {/* Create New Ticket Modal Form */}
// //             <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4 } }} maxWidth="sm" fullWidth>
// //                 <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
// //                     <AddCircleOutlineIcon /> Create New Service Ticket
// //                 </DialogTitle>
// //                 <DialogContent dividers>
// //                     <Grid container spacing={2}>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField autoFocus margin="dense" name="customer" label="Customer Name" type="text" fullWidth variant="outlined" value={newTicket.customer} onChange={handleInputChange} />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <FormControl fullWidth margin="dense">
// //                                 <InputLabel>Product</InputLabel>
// //                                 <Select label="Product" name="product" value={newTicket.product} onChange={handleInputChange}>
// //                                     {products.map(prod => <MenuItem key={prod} value={prod}>{prod}</MenuItem>)}
// //                                 </Select>
// //                             </FormControl>
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <FormControl fullWidth margin="dense">
// //                                 <InputLabel>Assigned Engineer</InputLabel>
// //                                 <Select label="Assigned Engineer" name="assignedEngineer" value={newTicket.assignedEngineer} onChange={handleInputChange}>
// //                                     {engineers.map(eng => <MenuItem key={eng} value={eng}>{eng}</MenuItem>)}
// //                                 </Select>
// //                             </FormControl>
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <FormControl fullWidth margin="dense">
// //                                 <InputLabel>Priority</InputLabel>
// //                                 <Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>
// //                                     {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
// //                                 </Select>
// //                             </FormControl>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                              {/* Note: In a real app, use a DatePicker component for better UX */}
// //                             <TextField margin="dense" name="dueDate" label="Due Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" value={newTicket.dueDate} onChange={handleInputChange} />
// //                         </Grid>
// //                     </Grid>
// //                 </DialogContent>
// //                 <DialogActions sx={{ p: '16px 24px' }}>
// //                     <Button onClick={handleCloseDialog}>Cancel</Button>
// //                     <Button onClick={handleCreateTicket} variant="contained">Create Ticket</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box>
// //     );
// // }


import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Chip, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControl, InputLabel, Select, MenuItem, Divider, Grid, CircularProgress, Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- API Simulation ---
const mockServiceTickets = [
    { id: '#033', createdDate: '2025-09-26T10:09:00Z', assignedTo: 'Ramesh Kumar', customer: 'Lal Singh Chaddha', status: 'Resolved', product: '1.5 Ton 5 Star Inverter AC', priority: 'High', dueDate: '2025-09-26T10:06:00Z' },
    { id: '#032', createdDate: '2025-09-25T12:14:00Z', assignedTo: 'Suresh Singh', customer: 'ACME Corp', status: 'Pending', product: '1 Ton Window AC', priority: 'Medium', dueDate: '2025-09-25T13:00:00Z' },
    { id: '#031', createdDate: 'Dec 28, 3:33 PM', assignedTo: 'Ramesh Kumar', customer: 'Global Tech', status: 'In Progress', product: '2 Ton Split AC', priority: 'Low', dueDate: 'Dec 28, 04:00 PM' },
    { id: '#030', createdDate: 'Dec 27, 9:48 AM', assignedTo: 'Amit Patel', customer: 'Home Essentials', status: 'Resolved', product: '1.5 Ton 3 Star AC', priority: 'High', dueDate: 'Dec 27, 10:00 AM' },
    { id: '#029', createdDate: 'Dec 26, 11:15 AM', assignedTo: 'Suresh Singh', customer: 'Lal Singh Chaddha', status: 'Pending', product: '1 Ton 3 Star Inverter AC', priority: 'Medium', dueDate: 'Dec 26, 11:30 AM' },
    { id: '#028', createdDate: 'Dec 25, 02:00 PM', assignedTo: 'Ramesh Kumar', customer: 'Sunrise Apartments', status: 'Resolved', product: 'Central AC Unit', priority: 'Low', dueDate: 'Dec 25, 03:00 PM' },
    { id: '#027', createdDate: 'Dec 24, 10:00 AM', assignedTo: 'Amit Patel', customer: 'ACME Corp', status: 'In Progress', product: 'Portable AC Unit', priority: 'High', dueDate: 'Dec 24, 11:00 AM' },
];
const fetchTicketsAPI = async () => new Promise(resolve => setTimeout(() => resolve(mockServiceTickets), 1500));
const createTicketAPI = async (data) => new Promise(resolve => setTimeout(() => resolve({ok: true, data}), 2000));


// --- Helper Components (Optimized by moving outside main component) ---
const getStatusChip = (status) => {
    let color;
    if (status === 'Resolved') color = 'success';
    else if (status === 'In Progress' || status === 'Open') color = 'warning';
    else if (status === 'Pending') color = 'error';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
};
const getPriorityChip = (priority) => {
    let color;
    if (priority === 'Urgent' || priority === 'High') color = 'error';
    else if (priority === 'Medium') color = 'warning';
    else color = 'success';
    return <Chip label={priority} color={color} size="small" />;
};
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return <Card sx={{ p: 1 }}><Typography variant="body2">{`${label}: ${payload[0].value} Tickets`}</Typography></Card>;
    }
    return null;
};
const TableSkeleton = ({ columns }) => Array.from(new Array(4)).map((_, i) => <TableRow key={i}><TableCell colSpan={columns}><Skeleton animation="wave" /></TableCell></TableRow>);
const TableError = ({ columns, message }) => <TableRow><TableCell colSpan={columns} align="center"><Typography color="error">{message}</Typography></TableCell></TableRow>;

// --- Custom Hook for Logic ---
const useServiceTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTicket, setNewTicket] = useState({ customer: '', product: '', priority: '', assignedTo: '', dueDate: null });

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchTicketsAPI();
            setTickets(data);
        } catch (err) {
            setError("Failed to fetch service tickets.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewTicket({ customer: '', product: '', priority: '', assignedTo: '', dueDate: null });
    };
    const handleInputChange = (e) => setNewTicket(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleDateChange = (date) => setNewTicket(prev => ({ ...prev, dueDate: date }));

    const handleCreateTicket = async () => {
        setIsSubmitting(true);
        try {
            await createTicketAPI(newTicket);
            handleCloseDialog();
            fetchTickets(); // Refresh the list
        } catch (err) {
            console.error("Failed to create ticket", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { tickets, isLoading, error, openDialog, isSubmitting, newTicket, handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange, handleCreateTicket };
};

// --- Main UI Component ---
export default function ServiceManagement() {
    const theme = useTheme();
    const { tickets, isLoading, error, openDialog, isSubmitting, newTicket, handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange, handleCreateTicket } = useServiceTickets();
    
   const operatingStatusData = [
  { month: 'Jan', tickets: 30 },
  { month: 'Feb', tickets: 25 },
  { month: 'Mar', tickets: 40 },
  { month: 'Apr', tickets: 35 },
  { month: 'May', tickets: 28 },
  { month: 'Jun', tickets: 45 },
  { month: 'Jul', tickets: 32 },
  { month: 'Aug', tickets: 50 },
  { month: 'Sep', tickets: 38 },
  { month: 'Oct', tickets: 42 },
  { month: 'Nov', tickets: 27 },
  { month: 'Dec', tickets: 48 },
];

    const engineers = ['Suresh Kumar', 'Ramesh Kumar', 'Rajesh Sharma'];
    const products = ['1.5 Ton 3 Star Inverter AC', '2 Ton 5 Star Split AC', 'Window AC 1 Ton'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Stack spacing={3}>
                    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <SupportAgentIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Tickets</Typography>
                                </Stack>
                                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>Create New Ticket</Button>
                            </Stack>
                            <TableContainer sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>{['Ticket ID', 'Created', 'Assigned To', 'Customer', 'Product', 'Status', 'Priority', 'Due Date', 'Actions'].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? <TableSkeleton columns={9} /> :
                                         error ? <TableError columns={9} message={error} /> :
                                         tickets.map((ticket) => (
                                            <TableRow key={ticket.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
                                                <TableCell>{dayjs(ticket.createdDate).format('DD MMM, hh:mm A')}</TableCell>
                                                <TableCell>{ticket.assignedTo}</TableCell>
                                                <TableCell>{ticket.customer}</TableCell>
                                                <TableCell>{ticket.product}</TableCell>
                                                <TableCell>{getStatusChip(ticket.status)}</TableCell>
                                                <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                                <TableCell>{dayjs(ticket.dueDate).format('DD MMM, hh:mm A')}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                                    <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>Service Projects - Operating Status</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={operatingStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="tickets" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Service Ticket</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2.5} sx={{mt: 2}}>
                            <TextField autoFocus name="customer" label="Customer Name" fullWidth variant="filled" value={newTicket.customer} onChange={handleInputChange} />
                            <FormControl fullWidth variant="filled"><InputLabel>Product</InputLabel><Select label="Product" name="product" value={newTicket.product} onChange={handleInputChange}>{products.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl>
                            <FormControl fullWidth variant="filled"><InputLabel>Assigned Engineer</InputLabel><Select label="Assigned Engineer" name="assignedTo" value={newTicket.assignedTo} onChange={handleInputChange}>{engineers.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select></FormControl>
                            <FormControl fullWidth variant="filled"><InputLabel>Priority</InputLabel><Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>{priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl>
                            <DatePicker label="Due Date" value={newTicket.dueDate} onChange={handleDateChange} sx={{width: '100%'}} slotProps={{ textField: { variant: 'filled' } }} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleCreateTicket} variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}

