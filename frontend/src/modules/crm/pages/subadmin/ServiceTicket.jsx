import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,

    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, IconButton, Dialog, DialogTitle, DialogContent, Grid, DialogActions, InputLabel, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// ===================================================================================
// MOCK API - Replace this with your actual API calls (e.g., using axios or fetch)
// ===================================================================================

const mockInitialTickets = [
    { id: '#1532', createdDate: '2025-09-22T10:06:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-22T10:06:00Z' },
    { id: '#1531', createdDate: '2025-09-21T14:19:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Pending', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-21T14:19:00Z' },
    { id: '#1530', createdDate: '2025-09-21T12:14:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'medium', dueDate: '2025-09-21T12:14:00Z' },
    { id: '#1528', createdDate: '2025-09-20T14:20:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Pending', product: '1.5 Ton 3 Star Inverter AC', priority: 'high', dueDate: '2025-09-20T14:20:00Z' },
    { id: '#1527', createdDate: '2025-09-19T09:48:00Z', assignedEngineer: 'Ramesh Kumar', customer: 'Lal Singh Chadha', status: 'Resolved', product: '1.5 Ton 3 Star Inverter AC', priority: 'low', dueDate: '2025-09-19T09:48:00Z' },
];

const engineers = ['Ramesh Kumar', 'Suresh Kumar', 'Rajesh Sharma'];
const products = ['1.5 Ton 3 Star Inverter AC', '2 Ton 5 Star Split AC', 'Window AC 1 Ton'];
const priorities = ['low', 'medium', 'high'];


// Simulates fetching tickets from your backend
const fetchTicketsAPI = async () => {
    console.log("API: Fetching tickets...");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Tickets fetched successfully.");
            resolve(mockInitialTickets);
        }, 1500); // 1.5 second delay
    });
};

// Simulates creating a new ticket on your backend
const createTicketAPI = async (newTicketData) => {
    console.log("API: Creating new ticket with data:", newTicketData);
    return new Promise(resolve => {
        setTimeout(() => {
            const newTicket = {
                ...newTicketData,
                id: `#${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
                createdDate: new Date().toISOString(),
                status: 'Open',
            };
            console.log("API: Ticket created successfully.", newTicket);
            mockInitialTickets.unshift(newTicket); // Add to the top of our mock DB
            resolve(newTicket);
        }, 2000); // 2 second delay
    });
};

// ===================================================================================
// Custom Hook for Service Tickets Logic
// ===================================================================================

const useServiceTickets = () => {
    // Data states
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal and Form states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [newTicket, setNewTicket] = useState({
        customer: '',
        product: '',
        assignedEngineer: '',
        priority: '',
        dueDate: '',
    });

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTicketsAPI();
            setTickets(data);
        } catch (err) {
            setError("Failed to fetch service tickets.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleOpenDialog = () => setDialogOpen(true);

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setNewTicket({ customer: '', product: '', assignedEngineer: '', priority: '', dueDate: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTicket(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateTicket = async () => {
        try {
            setFormSubmitting(true);
            await createTicketAPI(newTicket);
            handleCloseDialog();
            fetchTickets(); // Refresh the list after creation
        } catch (err) {
            console.error("Failed to create ticket", err);
            // You could set a form-specific error state here
        } finally {
            setFormSubmitting(false);
        }
    };

    return {
        tickets,
        loading,
        error,
        dialogOpen,
        formSubmitting,
        newTicket,
        handleOpenDialog,
        handleCloseDialog,
        handleInputChange,
        handleCreateTicket,
    };
};

// ===================================================================================
// Helper Functions & Components
// ===================================================================================

const getStatusChip = (status) => {
    let color = 'default';
    if (status === 'Resolved') color = 'success';
    if (status === 'Pending') color = 'warning';
    if (status === 'Open') color = 'info';
    return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
};

const getPriorityChip = (priority) => {
    let color;
    switch (priority) {
        case 'high': color = 'error'; break;
        case 'medium': color = 'warning'; break;
        case 'low': color = 'success'; break;
        default: color = 'default';
    }
    return <Chip label={priority} color={color} size="small" sx={{ fontWeight: 500, textTransform: 'capitalize' }} />;
};

const TableLoadingSkeleton = ({ columns }) => (
    <TableRow>
        <TableCell colSpan={columns} align="center" sx={{ py: 5 }}>
            <CircularProgress />
            <Typography>Loading Tickets...</Typography>
        </TableCell>
    </TableRow>
);

const TableErrorState = ({ columns, error }) => (
    <TableRow>
        <TableCell colSpan={columns} align="center" sx={{ py: 5 }}>
            <Typography color="error">{error}</Typography>
        </TableCell>
    </TableRow>
);


// ===================================================================================
// Main UI Component
// ===================================================================================
export default function ServiceManagerPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [month, setMonth] = useState('Jun 2024');

    const {
        tickets,
        loading,
        error,
        dialogOpen,
        formSubmitting,
        newTicket,
        handleOpenDialog,
        handleCloseDialog,
        handleInputChange,
        handleCreateTicket,
    } = useServiceTickets();


    const handleMonthChange = (event) => setMonth(event.target.value);

    const cardStyle = {
        borderRadius: 4,
        boxShadow: 'none',
        background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    };

    const TABLE_COLUMNS = 9;

    return (
        <Box p={{ xs: 2, sm: 3 }}>
            <Card sx={cardStyle}>
                <CardContent>
                    {/* Header: Search, Title, Filter */}
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                        spacing={2}
                    >
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                                sx: { borderRadius: 3, width: { xs: '100%', sm: 300 }, bgcolor: theme.palette.action.hover, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>Service Tickets</Typography>
                        <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <Select
                                value={month}
                                onChange={handleMonthChange}
                                sx={{ borderRadius: 2, minWidth: 120, '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)' } }}
                            >
                                <MenuItem value="Jun 2024">Jun 2024</MenuItem>
                                <MenuItem value="Jul 2024">Jul 2024</MenuItem>
                                <MenuItem value="Aug 2024">Aug 2024</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Service Tickets Table */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Ticket id', 'CREATED DATE', 'assigned-engineer', 'CUSTOMER', 'STATUS', 'PRODUCT', 'PRIORITY', 'DUE DATE', 'ACTIONS'].map(head => (
                                        <TableCell key={head} sx={{ fontWeight: 'bold', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableLoadingSkeleton columns={TABLE_COLUMNS} />
                                ) : error ? (
                                    <TableErrorState columns={TABLE_COLUMNS} error={error} />
                                ) : (
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                                            <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
                                            <TableCell>{new Date(ticket.createdDate).toLocaleString()}</TableCell>
                                            <TableCell>{ticket.assignedEngineer}</TableCell>
                                            <TableCell>{ticket.customer}</TableCell>
                                            <TableCell>{getStatusChip(ticket.status)}</TableCell>
                                            <TableCell>{ticket.product}</TableCell>
                                            <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                            <TableCell>{new Date(ticket.dueDate).toLocaleString()}</TableCell>
                                            <TableCell><IconButton size="small"><MoreVertIcon /></IconButton></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Create New Ticket Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleOpenDialog}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                px: 4,
                                py: 1,
                                bgcolor: isDark ? '#3A414B' : '#424242',
                                '&:hover': { bgcolor: isDark ? '#4F5761' : '#616161' }
                            }}
                        >
                            Create New ticket
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Create New Ticket Modal */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4 } }} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <AddCircleOutlineIcon /> <Typography variant="h6">Create New Service Ticket</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><TextField label="Customer Name" name="customer" value={newTicket.customer} onChange={handleInputChange} fullWidth /></Grid>
                        <Grid item xs={12}><FormControl fullWidth><InputLabel>Product</InputLabel><Select label="Product" name="product" value={newTicket.product} onChange={handleInputChange}>{products.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>
                        <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Assigned Engineer</InputLabel><Select label="Assigned Engineer" name="assignedEngineer" value={newTicket.assignedEngineer} onChange={handleInputChange}>{engineers.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}</Select></FormControl></Grid>
                        <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Priority</InputLabel><Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>{priorities.map(p => <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>)}</Select></FormControl></Grid>
                        <Grid item xs={12}><TextField label="Due Date" name="dueDate" type="date" value={newTicket.dueDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseDialog} disabled={formSubmitting}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateTicket} disabled={formSubmitting}>
                        {formSubmitting ? <CircularProgress size={24} /> : "Create Ticket"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}