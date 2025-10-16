import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Chip, IconButton, Skeleton, Button, CircularProgress
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { VITE_API_BASE_URL } from '../../utils/State'; 
import toast from 'react-hot-toast';


// --- Helper Components ---
const PriorityChip = React.memo(({ priority }) => {
    let color;
    if (priority === 'high') color = 'error';
    else if (priority === 'medium') color = 'warning';
    else if (priority === 'low') color = 'success';
    else color = 'default';
    return <Chip label={priority} color={color} size="small" sx={{ textTransform: 'capitalize' }}/>;
});

const StatusChip = React.memo(({ status }) => {
    let color;
    const upperStatus = status?.toUpperCase() || ''; // Safely convert to uppercase

    if (upperStatus === 'COMPLETED') color = 'success';
    else if (upperStatus === 'IN_PROGRESS') color = 'info';
    else if (upperStatus === 'OPEN' || upperStatus === 'ASSIGNED' || upperStatus === 'APPROVED') color = 'warning';
    else color = 'default';

    // Format for display: replace underscore with a space
    const displayStatus = status?.replace('_', ' ') || '';

    return <Chip label={displayStatus} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }} />;
});

// --- Main Component ---
export default function AssignedTasks() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("authKey");
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
            }

            const data = await response.json();
            
            const formattedTasks = data.map(task => ({
                ticketId: task.ticketId, // Keep raw ID for API calls
                id: `#${task.ticketId}`,
                customer: task.customerName,
                dueDate: task.dueDate,
                priority: task.priority?.toLowerCase(),
                product: task.productName,
                status: task.status, // Keep original status from API (e.g., 'APPROVED')
            }));

            setTasks(formattedTasks);

        } catch (err) {
            console.error("Error fetching tasks:", err);
            toast.error("something went Wrong");
            setError(err.message);
        } finally {
            setIsLoading(false);
        }

        
    }, [selectedDate]); // Keeping selectedDate dependency if you plan to use it for filtering


    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleStartWork = async (ticketId) => {
        setUpdatingTaskId(ticketId);
        try {
            const token = localStorage.getItem("authKey");
            if (!token) throw new Error("Authentication token not found.");
            
            const response = await fetch(`${VITE_API_BASE_URL}/tickets/${ticketId}/update`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                
            });

            if (!response.ok) throw new Error('Failed to update ticket status');

            const updatedTicket = await response.json();
            
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.ticketId === ticketId ? { ...task, status: updatedTicket.status } : task
                )
            );

        } catch (err) {
            console.error(`Error starting work for ticket ${ticketId}:`, err);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                             <Stack direction="row" spacing={1.5} alignItems="center">
                                <AssignmentIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Assigned Tasks</Typography>
                            </Stack>
                            <DatePicker
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </Stack>
                    </CardContent>

                    <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Table stickyHeader size="medium">
                            <TableHead>
                                <TableRow>
                                    {['Ticket ID', 'Customer', 'Due Date', 'Priority', 'Product', 'Status', 'Details'].map(head => (
                                        <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    Array.from(new Array(6)).map((_, index) => (
                                        <TableRow key={index}><TableCell colSpan={7}><Skeleton animation="wave" /></TableCell></TableRow>
                                    ))
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
                                            Error: {error}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{task.id}</TableCell>
                                            <TableCell>{task.customer}</TableCell>
                                            <TableCell>{dayjs(task.dueDate).format('DD MMM YYYY')}</TableCell>
                                            <TableCell><PriorityChip priority={task.priority} /></TableCell>
                                            <TableCell>{task.product}</TableCell>
                                            <TableCell>
                                                {task.status?.toUpperCase() === 'APPROVED' ? (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleStartWork(task.ticketId)}
                                                        disabled={updatingTaskId === task.ticketId}
                                                    >
                                                        {updatingTaskId === task.ticketId ? <CircularProgress size={20} color="inherit" /> : 'Start Work'}
                                                    </Button>
                                                ) : (
                                                    <StatusChip status={task.status} />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small">
                                                    <MailOutline fontSize="small"/>
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
        </LocalizationProvider>
    );
}