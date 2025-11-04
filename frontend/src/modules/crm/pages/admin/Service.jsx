import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Chip, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControl, InputLabel, Select, MenuItem, Divider, CircularProgress, Skeleton,
    Paper, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

// --- Helper Components ---
const getStatusChip = (status) => {
    let color;
    if (['COMPLETED', 'APPROVED', 'CLOSED'].includes(status)) color = 'success';
    else if (['ASSIGNED', 'IN_PROGRESS', 'EN_ROUTE', 'ON_SITE'].includes(status)) color = 'warning';
    else if (['OPEN', 'PENDING'].includes(status)) color = 'error';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
};

const getPriorityChip = (priority) => {
    const color = priority === 'HIGH' ? 'error' : priority === 'MEDIUM' ? 'warning' : 'success';
    return <Chip label={priority} color={color} size="small" />;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return <Card sx={{ p: 1 }}><Typography variant="body2">{`${label}: ${payload[0].value} Tickets`}</Typography></Card>;
    }
    return null;
};

const TableSkeleton = ({ columns }) => Array.from(new Array(5)).map((_, i) => (
    <TableRow key={i}><TableCell colSpan={columns}><Skeleton animation="wave" /></TableCell></TableRow>
));

const TableError = ({ columns, message }) => (
    <TableRow><TableCell colSpan={columns} align="center"><Typography color="error">{message}</Typography></TableCell></TableRow>
);

// --- Visit History Modal ---
const VisitHistoryModal = ({ open, onClose, ticketId, visits = [] }) => {
    const [imageDialog, setImageDialog] = useState({ open: false, url: "", title: "" });

    const openImage = (url, title) => setImageDialog({ open: true, url, title });
    const closeImage = () => setImageDialog({ open: false, url: "", title: "" });

    const formatDate = (date) => date ? dayjs(date).format('DD MMM YYYY, hh:mm A') : '—';

    if (visits.length === 0) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Ticket #{String(ticketId).padStart(3, '0')} - Visit History</DialogTitle>
                <DialogContent>
                    <Alert severity="info">No visits recorded yet.</Alert>
                </DialogContent>
                <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
            </Dialog>
        );
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Ticket #{String(ticketId).padStart(3, '0')} - Visit History
                    </Typography>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <Stack spacing={2} p={3}>
                        {visits.map((visit, index) => {
                            const totalTravelled = visit.startKm && visit.endKm
                                ? Number(visit.endKm) - Number(visit.startKm)
                                : null;

                            return (
                                <Paper
                                    key={visit.visitId || visit.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: visit.active ? 2 : 1,
                                        borderColor: visit.active ? 'primary.main' : 'divider',
                                        bgcolor: visit.active ? 'action.hover' : 'background.paper',
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Visit #{index + 1} - {visit.engineerName || 'Engineer'}
                                            {visit.active && <Chip label="ACTIVE" color="primary" size="small" sx={{ ml: 1 }} />}
                                        </Typography>
                                        {getStatusChip(visit.visitStatus || visit.status)}
                                    </Box>

                                    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={2} mb={2}>
                                        <Box><Typography variant="caption" color="text.secondary">Start KM</Typography><Typography variant="body2" fontWeight={500}>{visit.startKm || '-'}</Typography></Box>
                                        <Box><Typography variant="caption" color="text.secondary">End KM</Typography><Typography variant="body2" fontWeight={500}>{visit.endKm || '-'}</Typography></Box>
                                        {totalTravelled !== null && (
                                            <Box><Typography variant="caption" color="text.secondary">Total Travelled</Typography>
                                                <Typography variant="body2" fontWeight={600} color="primary.main">{totalTravelled} KM</Typography>
                                            </Box>
                                        )}
                                        <Box><Typography variant="caption" color="text.secondary">Started At</Typography><Typography variant="body2" fontWeight={500}>{formatDate(visit.startTime || visit.startedAt)}</Typography></Box>
                                        {visit.endTime && (
                                            <Box><Typography variant="caption" color="text.secondary">Ended At</Typography><Typography variant="body2" fontWeight={500}>{formatDate(visit.endTime || visit.endedAt)}</Typography></Box>
                                        )}
                                    </Box>

                                    {(visit.startKmPhoto || visit.startKmPhotoUrl || visit.endKmPhoto || visit.endKmPhotoUrl) && (
                                        <Box mb={2}>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>Photos:</Typography>
                                            <Box display="flex" gap={2}>
                                                {(visit.startKmPhoto || visit.startKmPhotoUrl) && (
                                                    <Button size="small" variant="outlined" startIcon={<ImageIcon />}
                                                        onClick={() => openImage(visit.startKmPhoto || visit.startKmPhotoUrl, `Visit #${index + 1} - Start KM`)}>
                                                        Start
                                                    </Button>
                                                )}
                                                {(visit.endKmPhoto || visit.endKmPhotoUrl) && (
                                                    <Button size="small" variant="outlined" startIcon={<ImageIcon />}
                                                        onClick={() => openImage(visit.endKmPhoto || visit.endKmPhotoUrl, `Visit #${index + 1} - End KM`)}>
                                                        End
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    )}

                                    {visit.usedParts && <Box mb={1}><Typography variant="caption" color="text.secondary">Used Parts:</Typography><Typography variant="body2">{visit.usedParts}</Typography></Box>}
                                    {visit.missingPart && <Box mb={1}><Typography variant="caption" color="text.secondary">Missing Part:</Typography><Typography variant="body2" color="warning.main">{visit.missingPart}</Typography></Box>}
                                    {visit.remarks && <Box mb={1}><Typography variant="caption" color="text.secondary">Remarks:</Typography><Typography variant="body2">{visit.remarks}</Typography></Box>}
                                    {visit.lastUpdatedBy && (
                                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                            Updated by {visit.lastUpdatedBy} at {formatDate(visit.lastUpdatedAt)}
                                        </Typography>
                                    )}
                                </Paper>
                            );
                        })}
                    </Stack>
                </DialogContent>
                <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
            </Dialog>

            <Dialog open={imageDialog.open} onClose={closeImage} maxWidth="md" fullWidth>
                <DialogTitle>{imageDialog.title}<IconButton onClick={closeImage} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
                <DialogContent>{imageDialog.url && <img src={imageDialog.url} alt={imageDialog.title} style={{ width: '100%', height: 'auto' }} />}</DialogContent>
            </Dialog>
        </>
    );
};

// --- Custom Hook ---
const useServiceTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [visitsMap, setVisitsMap] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const [engineers, setEngineers] = useState([]);
    const [sales, setSales] = useState([]);
    const [productsForSelectedSale, setProductsForSelectedSale] = useState([]);
    const [customers, setCustomers] = useState([]);

    const initialState = { saleId: '', customerId: '', customerName: '', productId: '', assignedEngineerId: '', priority: '', dueDate: null };
    const [newTicket, setNewTicket] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});

    const token = localStorage.getItem("authKey");
    const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

    // Get Role from JWT
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || payload.authorities?.[0]?.authority || payload.authorities?.[0];
                setUserRole(role?.replace('ROLE_', ''));
            } catch (e) {
                console.error("JWT parse error", e);
            }
        }
    }, [token]);

    const validateTicket = (t) => {
        const errors = {};
        if (!t.saleId) errors.saleId = 'Sale ID is required';
        if (!t.productId) errors.productId = 'Product is required';
        if (!t.assignedEngineerId) errors.assignedEngineerId = 'Engineer is required';
        if (!t.priority) errors.priority = 'Priority is required';
        if (!t.dueDate) errors.dueDate = 'Due date is required';
        return errors;
    };

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/tickets/get-all`, axiosConfig);
            if (!response.ok) throw new Error('Failed to fetch tickets');
            const data = await response.json();

            const formatted = data.map(t => ({
                id: t.ticketId,
                assignedTo: t.assignedEngineerName || 'Unassigned',
                customer: t.customerName,
                product: t.productName,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
                imageUrl: t.imageUrl,
            }));
            setTickets(formatted);
        } catch (err) {
            setError("Failed to fetch tickets");
            toast.error("Failed to load tickets");
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    const fetchVisits = async (ticketId) => {
        try {
            const res = await fetch(`${VITE_API_BASE_URL}/service-visits/ticket/${ticketId}`, axiosConfig);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setVisitsMap(prev => ({ ...prev, [ticketId]: data }));
        } catch {
            toast.error("Failed to load visit history");
        }
    };

    const openVisitModal = async (ticketId) => {
        setSelectedTicketId(ticketId);
        setModalOpen(true);
        if (!visitsMap[ticketId]) {
            await fetchVisits(ticketId);
        }
    };

    const closeVisitModal = () => {
        setModalOpen(false);
        setSelectedTicketId(null);
    };

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [engRes, custRes, salesRes] = await Promise.all([
                    fetch(`${VITE_API_BASE_URL}/admin/users`, axiosConfig),
                    fetch(`${VITE_API_BASE_URL}/customer`, axiosConfig),
                    fetch(`${VITE_API_BASE_URL}/sales/get-all-sales`, axiosConfig)
                ]);
                if (!engRes.ok || !custRes.ok || !salesRes.ok) throw new Error();

                const [engData, custData, salesData] = await Promise.all([engRes.json(), custRes.json(), salesRes.json()]);
                setEngineers(engData.filter(u => u.role.name === 'ENGINEER'));
                setCustomers(custData);
                setSales(salesData);
            } catch {
                toast.error("Failed to load form data");
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
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));

        if (name === 'saleId') {
            const sale = sales.find(s => s.saleId === value);
            if (sale) {
                const cust = customers.find(c => c.customerName?.trim().toLowerCase() === sale.customerName?.trim().toLowerCase());
                setNewTicket(prev => ({
                    ...prev, saleId: value, customerId: cust?.customerId || null,
                    customerName: sale.customerName, productId: ''
                }));
                setProductsForSelectedSale(sale.items || []);
            }
        } else {
            setNewTicket(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (date) => {
        if (formErrors.dueDate) setFormErrors(prev => ({ ...prev, dueDate: undefined }));
        setNewTicket(prev => ({ ...prev, dueDate: date }));
    };

    const handleCreateTicket = async () => {
        const errors = validateTicket(newTicket);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Object.values(errors).forEach(toast.error);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                saleId: newTicket.saleId,
                customerId: newTicket.customerId,
                productId: newTicket.productId,
                assignedEngineerId: newTicket.assignedEngineerId,
                priority: newTicket.priority,
                dueDate: newTicket.dueDate ? dayjs(newTicket.dueDate).format('YYYY-MM-DD') : null,
            };

            const res = await fetch(`${VITE_API_BASE_URL}/tickets/open`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error((await res.json()).message || 'Failed to create');

            const createdTicket = await res.json();
            const ticketId = createdTicket.ticketId;

            toast.success("Ticket created");

            // AUTO APPROVE IF ADMIN/SUBADMIN
            if (['ADMIN', 'SUBADMIN'].includes(userRole)) {
                try {
                    const approveRes = await fetch(`${VITE_API_BASE_URL}/tickets/${ticketId}/approve`, {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (approveRes.ok) {
                        toast.success("Ticket auto-approved");
                    }
                } catch (err) {
                    toast.warn("Auto-approve failed");
                }
            }

            handleCloseDialog();
            fetchTickets();
        } catch (err) {
            toast.error(err.message || "Failed to create");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApproveTicket = async (id) => {
        try {
            const res = await fetch(`${VITE_API_BASE_URL}/tickets/${id}/approve`, {
                method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: updated.status } : t));
            toast.success("Approved");
        } catch {
            toast.error("Failed to approve");
        }
    };

    const handleCloseTicket = async (ticketId) => {
        if (!window.confirm("Are you sure you want to close this ticket?")) return;

        try {
            const res = await fetch(`${VITE_API_BASE_URL}/tickets/${ticketId}/close`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: updated.status } : t));
            toast.success("Ticket closed");
        } catch {
            toast.error("Failed to close ticket");
        }
    };

    return {
        tickets, isLoading, error, openDialog, isSubmitting, newTicket,
        engineers, sales, productsForSelectedSale, formErrors,
        modalOpen, selectedTicketId, visitsMap, userRole,
        openVisitModal, closeVisitModal,
        handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange,
        handleCreateTicket, handleApproveTicket, handleCloseTicket
    };
};

// --- MAIN COMPONENT ---
export default function ServiceManagement() {
    const theme = useTheme();
    const {
        tickets, isLoading, error, openDialog, isSubmitting, newTicket,
        engineers, sales, productsForSelectedSale, formErrors,
        modalOpen, selectedTicketId, visitsMap, userRole,
        openVisitModal, closeVisitModal,
        handleOpenDialog, handleCloseDialog, handleInputChange, handleDateChange,
        handleCreateTicket, handleApproveTicket, handleCloseTicket
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
                    {/* Service Tickets Table */}
                    <Card>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1} mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <SupportAgentIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Tickets</Typography>
                                </Stack>
                                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
                                    Create New Ticket
                                </Button>
                            </Stack>

                            <TableContainer sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {['Ticket ID', 'Assigned To', 'Customer', 'Product', 'Status', 'Priority', 'Due Date', 'Actions'].map(h => (
                                                <TableCell key={h} sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
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
                                                            {ticket.status === 'OPEN' && !['ADMIN', 'SUBADMIN'].includes(userRole) ? (
                                                                <Button size="small" variant="contained" onClick={() => handleApproveTicket(ticket.id)}>
                                                                    Approve
                                                                </Button>
                                                            ) : (
                                                                getStatusChip(ticket.status)
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                                        <TableCell>{dayjs(ticket.dueDate).format('DD MMM YYYY')}</TableCell>
                                                        <TableCell>
                                                            <Stack direction="row" spacing={1}>
                                                                <IconButton size="small" color="primary" onClick={() => openVisitModal(ticket.id)}>
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                                {ticket.status === 'COMPLETED' && ['ADMIN', 'SUBADMIN'].includes(userRole) && (
                                                                    <IconButton size="small" color="error" onClick={() => handleCloseTicket(ticket.id)}>
                                                                        <CloseIcon />
                                                                    </IconButton>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>Service Projects - Operating Status</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={operatingStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="status" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="tickets" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>

                {/* Create Ticket Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Service Ticket</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            <FormControl fullWidth variant="filled" error={!!formErrors.saleId}>
                                <InputLabel>Sale ID</InputLabel>
                                <Select label="Sale ID" name="saleId" value={newTicket.saleId} onChange={handleInputChange}>
                                    {sales.map(s => (
                                        <MenuItem key={s.saleId} value={s.saleId}>{`Sale #${s.saleId} (${s.customerName})`}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.saleId && <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>{formErrors.saleId}</Typography>}
                            </FormControl>

                            <TextField label="Customer" value={newTicket.customerName} fullWidth variant="filled" InputProps={{ readOnly: true }} />

                            <FormControl fullWidth variant="filled" disabled={!newTicket.saleId} error={!!formErrors.productId}>
                                <InputLabel>Product</InputLabel>
                                <Select label="Product" name="productId" value={newTicket.productId} onChange={handleInputChange}>
                                    {productsForSelectedSale.map(p => (
                                        <MenuItem key={p.productId} value={p.productId}>{p.productName}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.productId && <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>{formErrors.productId}</Typography>}
                            </FormControl>

                            <FormControl fullWidth variant="filled" error={!!formErrors.assignedEngineerId}>
                                <InputLabel>Assigned Engineer</InputLabel>
                                <Select label="Assigned Engineer" name="assignedEngineerId" value={newTicket.assignedEngineerId} onChange={handleInputChange}>
                                    {engineers.map(e => <MenuItem key={e.userId} value={e.userId}>{e.name}</MenuItem>)}
                                </Select>
                                {formErrors.assignedEngineerId && <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>{formErrors.assignedEngineerId}</Typography>}
                            </FormControl>

                            <FormControl fullWidth variant="filled" error={!!formErrors.priority}>
                                <InputLabel>Priority</InputLabel>
                                <Select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange}>
                                    {['LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                </Select>
                                {formErrors.priority && <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>{formErrors.priority}</Typography>}
                            </FormControl>

                            <DatePicker
                                label="Due Date"
                                value={newTicket.dueDate}
                                onChange={handleDateChange}
                                sx={{ width: '100%' }}
                                slotProps={{
                                    textField: {
                                        variant: 'filled',
                                        error: !!formErrors.dueDate,
                                        helperText: formErrors.dueDate
                                    }
                                }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleCreateTicket} variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Visit History Modal */}
                <VisitHistoryModal
                    open={modalOpen}
                    onClose={closeVisitModal}
                    ticketId={selectedTicketId}
                    visits={selectedTicketId ? (visitsMap[selectedTicketId] || []) : []}
                />
            </Box>
        </LocalizationProvider>
    );
}