import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Chip, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControl, InputLabel, Select, MenuItem, Divider, CircularProgress, Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

// --- Helper Components ---
const getStatusChip = (status) => {
    let color;
    if (status === 'Resolved' || status === 'APPROVED') color = 'success';
    else if (status === 'In Progress' || status === 'Open' || status === "OPEN") color = 'warning';
    else if (status === 'Pending') color = 'error';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
};
const getPriorityChip = (priority) => {
    let color;
    if (priority === 'HIGH') color = 'error';
    else if (priority === 'MEDIUM') color = 'warning';
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

    const [engineers, setEngineers] = useState([]);
    const [sales, setSales] = useState([]);
    const [productsForSelectedSale, setProductsForSelectedSale] = useState([]);
    const [customers, setCustomers] = useState([]);
    const initialState = { saleId: '', customerId: '', customerName: '', productId: '', assignedEngineerId: '', priority: '', dueDate: null };
    const [newTicket, setNewTicket] = useState(initialState);

    const token = localStorage.getItem("authKey");

    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` },
    }), [token]);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/tickets/get-all`, axiosConfig);
            if (!response.ok) {
                throw new Error('Failed to fetch service tickets from API.');
            }
            const data = await response.json();
            
            const formattedTickets = data.map(ticket => ({
                id: ticket.ticketId,
                assignedTo: ticket.assignedEngineerName,
                customer: ticket.customerName,
                product: ticket.productName,
                status: ticket.status,
                priority: ticket.priority,
                dueDate: ticket.dueDate,
                imageUrl: ticket.imageUrl, 
            }));
            
            setTickets(formattedTickets);
        } catch (err) {
            setError("Failed to fetch service tickets.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    useEffect(() => {
        // ... (fetchDropdownData remains the same)
        const fetchDropdownData = async () => {
            try {
                const [engineersRes, customersRes, salesRes] = await Promise.all([
                    fetch(`${VITE_API_BASE_URL}/admin/users`, axiosConfig),
                    fetch(`${VITE_API_BASE_URL}/customer`, axiosConfig),
                    fetch(`${VITE_API_BASE_URL}/sales/get-all-sales`, axiosConfig)
                ]);

                if (!engineersRes.ok || !customersRes.ok || !salesRes.ok) {
                    throw new Error('Failed to fetch form data');
                }

                const engineersData = await engineersRes.json();
                const customersData = await customersRes.json();
                const salesData = await salesRes.json();
                const engineerUsers = engineersData.filter(user => user.role.name === 'ENGINEER');
                setEngineers(engineerUsers);
                setCustomers(customersData);
                setSales(salesData);
            } catch (err) {
                console.error("Failed to load dropdown data:", err);
            }
        };

        fetchTickets();
        fetchDropdownData();
    }, [fetchTickets, axiosConfig]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewTicket(initialState);
        setProductsForSelectedSale([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'saleId') {
            const selectedSale = sales.find(sale => sale.saleId === value);
            if (selectedSale) {
                const matchingCustomer = customers.find(cust => cust.customerName?.trim().toLowerCase() === selectedSale.customerName?.trim().toLowerCase());
                setNewTicket(prev => ({...prev, saleId: value, customerId: matchingCustomer?.customerId || null, customerName: selectedSale.customerName, productId: ''}));
                setProductsForSelectedSale(selectedSale.items || []);
            }
        } else {
            setNewTicket(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleDateChange = (date) => setNewTicket(prev => ({ ...prev, dueDate: date }));

    const handleCreateTicket = async () => {
        // ... (this function remains the same)
        setIsSubmitting(true);
        try {
            const ticketData = {
                saleId: newTicket.saleId,
                customerId: newTicket.customerId,
                productId: newTicket.productId,
                assignedEngineerId: newTicket.assignedEngineerId,
                priority: newTicket.priority,
                dueDate: newTicket.dueDate ? dayjs(newTicket.dueDate).format('YYYY-MM-DD') : null,
            };

            const response = await fetch(`${VITE_API_BASE_URL}/tickets/open`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
                throw new Error(`API Error: ${response.status} - ${errorBody.message || 'Failed to create ticket'}`);
            }
            handleCloseDialog();
            fetchTickets();
            toast.success("Create Ticket successfully")
        } catch (err) {
            console.error("Failed to create ticket:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- New Handler for Approving Tickets ---
    const handleApproveTicket = async (ticketId) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/tickets/${ticketId}/approve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to approve ticket');
            }
            const updatedTicket = await response.json();

            // Update the state locally for instant UI feedback
            setTickets(prevTickets => 
                prevTickets.map(ticket => 
                    ticket.id === ticketId ? { ...ticket, status: updatedTicket.status } : ticket
                )
            );
        } catch (err) {
            console.error(`Error approving ticket ${ticketId}:`, err);
            // Optionally, set an error state to show a user-facing message
        }
    };

    return {
        tickets, isLoading, error, openDialog, isSubmitting, newTicket,
        engineers, sales, productsForSelectedSale,
        handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange, handleCreateTicket,
        handleApproveTicket // Export the new handler
    };
};

// --- Main UI Component ---
export default function ServiceManagement() {
    const theme = useTheme();
    const { tickets, isLoading, error, openDialog, isSubmitting, newTicket,
        engineers, sales, productsForSelectedSale,
        handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange, handleCreateTicket,
        handleApproveTicket // Destructure the new handler
    } = useServiceTickets();

    const operatingStatusData = [
        { month: 'Jan', tickets: 30 }, { month: 'Feb', tickets: 25 }, { month: 'Mar', tickets: 40 },
        { month: 'Apr', tickets: 35 }, { month: 'May', tickets: 28 }, { month: 'Jun', tickets: 45 },
        { month: 'Jul', tickets: 32 }, { month: 'Aug', tickets: 50 }, { month: 'Sep', tickets: 38 },
        { month: 'Oct', tickets: 42 }, { month: 'Nov', tickets: 27 }, { month: 'Dec', tickets: 48 },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Stack spacing={3}>
                    <Card>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1} mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <SupportAgentIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Tickets</Typography>
                                </Stack>
                                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>Create New Ticket</Button>
                            </Stack>
                            <TableContainer sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>{['Ticket ID', 'Assigned To', 'Customer', 'Product', 'Status', 'Priority', 'Due Date','View' ].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? <TableSkeleton columns={8} /> :
                                            error ? <TableError columns={8} message={error} /> :
                                                tickets.map((ticket) => (
                                                    <TableRow key={ticket.id} hover>
                                                        <TableCell sx={{ fontWeight: 500 }}>#{String(ticket.id).padStart(3, '0')}</TableCell>
                                                        <TableCell>{ticket.assignedTo}</TableCell>
                                                        <TableCell>{ticket.customer}</TableCell>
                                                        <TableCell>{ticket.product}</TableCell>
                                                        <TableCell>
                                                            {/* --- Conditional Rendering for Approve Button --- */}
                                                            {ticket.status === 'OPEN' ? (
                                                                <Button 
                                                                    variant="contained" 
                                                                    size="small" 
                                                                    onClick={() => handleApproveTicket(ticket.id)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            ) : (
                                                                getStatusChip(ticket.status)
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                                        <TableCell>{dayjs(ticket.dueDate).format('DD MMM YYYY')}</TableCell>
                                                        <TableCell>
                                                       {ticket.imageUrl ? (
                                                         <Button
                                                           variant="outlined"
                                                           color="primary"
                                                           size="small"
                                                           component="a"
                                                           href={ticket.imageUrl}
                                                           target="_blank"
                                                           rel="noopener noreferrer"
                                                         >
                                                           View
                                                         </Button>
                                                       ) : (
                                                         'N/A'
                                                       )}
                                                     </TableCell>
                                                    </TableRow>
                                                ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Operating Status Chart Card */}
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

                {/* Create New Ticket Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Service Ticket</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            {/* Form Controls... */}
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Sale ID</InputLabel>
                                <Select label="Sale ID" name="saleId" value={newTicket.saleId} onChange={handleInputChange}>
                                    {sales.map(s => ( <MenuItem key={s.saleId} value={s.saleId}>{`Sale #${s.saleId} (${s.customerName})`}</MenuItem> ))}
                                </Select>
                            </FormControl>
                            <TextField label="Customer" value={newTicket.customerName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            <FormControl fullWidth variant="filled" disabled={!newTicket.saleId}>
                                <InputLabel>Product</InputLabel>
                                <Select label="Product" name="productId" value={newTicket.productId} onChange={handleInputChange}>
                                    {productsForSelectedSale.map(p => ( <MenuItem key={p.productId} value={p.productId}>{p.productName}</MenuItem> ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Assigned Engineer</InputLabel>
                                <Select label="Assigned Engineer" name="assignedEngineerId" value={newTicket.assignedEngineerId} onChange={handleInputChange}>
                                    {engineers.map(e => <MenuItem key={e.userId} value={e.userId}>{e.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Priority</InputLabel>
                                <Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>
                                    {['LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <DatePicker label="Due Date" value={newTicket.dueDate} onChange={handleDateChange} sx={{ width: '100%' }} slotProps={{ textField: { variant: 'filled' } }} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleCreateTicket} variant="contained" disabled={!newTicket.productId || isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}