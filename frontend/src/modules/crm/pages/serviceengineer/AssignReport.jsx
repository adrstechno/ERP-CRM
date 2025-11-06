import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Stack, Chip, Skeleton, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { VITE_API_BASE_URL } from '../../utils/State';
import dayjs from 'dayjs';

const PriorityChip = React.memo(({ priority }) => {
  const color = priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'success';
  return <Chip label={priority} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
});

const StatusChip = React.memo(({ status }) => {
  const upper = status?.toUpperCase() || '';
  const color = upper === 'COMPLETED' ? 'success' :
                ['IN_PROGRESS', 'EN_ROUTE', 'ON_SITE'].includes(upper) ? 'info' :
                ['ASSIGNED', 'APPROVED'].includes(upper) ? 'warning' : 'default';

  return (
    <Chip
      label={status?.replace('_', ' ') || ''}
      color={color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
    />
  );
});

export default function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [customerFilter, setCustomerFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authKey");
      if (!token) throw new Error("Please log in again.");

      const response = await fetch(`${VITE_API_BASE_URL}/tickets/get-by-user`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      const formatted = data
        .filter(task => task.status && !['OPEN'].includes(task.status.toUpperCase()))
        .map(task => ({
          ticketId: task.ticketId,
          customerName: task.customerName || 'Unknown',
          createdAt: task.createdAt || task.createdDate,
          dueDate: task.dueDate,
          priority: (task.priority || 'low').toLowerCase(),
          productName: task.productName || '-',
          status: task.status,
        }))
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

      setTasks(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Unique customers & priorities for dropdown
  const customers = useMemo(() => 
    [...new Set(tasks.map(t => t.customerName))].sort(), [tasks]
  );

  const priorities = ['high', 'medium', 'low'];

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchCustomer = !customerFilter || task.customerName === customerFilter;
      const matchPriority = !priorityFilter || task.priority === priorityFilter;
      return matchCustomer && matchPriority;
    });
  }, [tasks, customerFilter, priorityFilter]);

  return (
    <Box>
      <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">Assigned Tasks</Typography>
          </Stack>

          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
            <TextField
              label="Search Customer"
              variant="outlined"
              size="small"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              sx={{ minWidth: 220 }}
              placeholder="Type or select..."
              select
              SelectProps={{ native: false }}
            >
              <MenuItem value="">All Customers</MenuItem>
              {customers.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </TextField>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All Priorities</MenuItem>
                {priorities.map(p => (
                  <MenuItem key={p} value={p}>
                    <Chip label={p} color={p === 'high' ? 'error' : p === 'medium' ? 'warning' : 'success'} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>

        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}><Skeleton animation="wave" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {customerFilter || priorityFilter
                      ? 'No tickets match your filters'
                      : 'No assigned & approved tickets found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.ticketId} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{task.ticketId}</TableCell>
                    <TableCell>{task.customerName}</TableCell>
                    <TableCell>{dayjs(task.createdAt).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{task.dueDate ? dayjs(task.dueDate).format('DD MMM YYYY') : '-'}</TableCell>
                    <TableCell><PriorityChip priority={task.priority} /></TableCell>
                    <TableCell>{task.productName}</TableCell>
                    <TableCell><StatusChip status={task.status} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}