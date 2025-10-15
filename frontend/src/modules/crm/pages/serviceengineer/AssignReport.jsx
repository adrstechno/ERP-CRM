import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Chip, IconButton, Skeleton
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { VITE_API_BASE_URL } from '../../utils/State'; // Assuming you have this for your API base URL

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
    if (status === 'Completed') color = 'success';
    else if (status === 'In Progress') color = 'info';
    else if (status === 'Open' || status === 'Assigned') color = 'warning';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
});

// --- Main Component ---
export default function AssignedTasks() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("authKey");
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            // Note: The API endpoint doesn't seem to use the selectedDate, but the logic is kept in case you want to filter later.
            const response = await fetch(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
            }

            const data = await response.json();
            
            // Map the API response to the format your component expects
            const formattedTasks = data.map(task => ({
                id: `#${task.ticketId}`,
                customer: task.customerName,
                dueDate: task.dueDate,
                priority: task.priority.toLowerCase(), // e.g., "LOW" -> "low"
                product: task.productName,
                // Capitalize first letter of status: "OPEN" -> "Open"
                status: task.status.charAt(0).toUpperCase() + task.status.slice(1).toLowerCase(),
            }));

            setTasks(formattedTasks);

        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]); // Keeping selectedDate dependency if you plan to use it for filtering

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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
                                            <TableCell><StatusChip status={task.status} /></TableCell>
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