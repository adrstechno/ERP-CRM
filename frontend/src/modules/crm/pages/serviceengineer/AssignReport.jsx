import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  UnfoldMore,
  MailOutline,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- DATA ---
const assignedTasks = [
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 30, 10:06 AM',
    dueDate: 'Dec 30, 10:06 AM',
    priority: 'medium',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'assigned',
    issue: 'Inverter issue',
  },
  {
    id: '#1531',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 29, 2:59 AM',
    dueDate: 'Dec 29, 2:59 AM',
    priority: 'low',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'assigned',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 29, 12:54 AM',
    dueDate: 'Dec 29, 12:54 AM',
    priority: 'medium',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'assigned',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 28, 2:32 PM',
    dueDate: 'Dec 28, 2:32 PM',
    priority: 'low',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'in progress',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 27, 2:20 PM',
    dueDate: 'Dec 27, 2:20 PM',
    priority: 'low',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'in progress',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 30, 10:06 AM',
    priority: 'low',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'in progress',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 29, 2:59 AM',
    priority: 'high',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'in progress',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 29, 12:54 AM',
    priority: 'high',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'in progress',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 28, 2:32 PM',
    priority: 'medium',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'completed',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 28, 2:32 PM',
    priority: 'high',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'completed',
    issue: 'Inverter issue',
  },
  {
    id: '#1532',
    customer: 'Lal Singh Chaddha',
    assignedDate: 'Dec 26, 9:48 AM',
    dueDate: 'Dec 27, 2:20 PM',
    priority: 'medium',
    product: '1.5 Ton 5 Star Inverter AC',
    status: 'completed',
    issue: 'Inverter issue',
  },
];

// Priority chip
const getPriorityChip = (priority, theme) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  };
  switch (priority) {
    case 'high':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(244,67,54,0.15)', color: '#f44336' }}>
          + high
        </Box>
      );
    case 'medium':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(255,193,7,0.15)', color: '#FFC107' }}>
          + medium
        </Box>
      );
    case 'low':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>
          + low
        </Box>
      );
    default:
      return null;
  }
};

// Status chip
const getStatusChip = (status, theme) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  };
  switch (status) {
    case 'assigned':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(33,150,243,0.15)', color: '#2196F3' }}>
          assigned
        </Box>
      );
    case 'in progress':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(255,193,7,0.15)', color: '#FFC107' }}>
          In progress
        </Box>
      );
    case 'completed':
      return (
        <Box sx={{ ...styles, backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>
          completed
        </Box>
      );
    default:
      return null;
  }
};

export default function AssignReports() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const headerTextStyle = {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Page Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Assigned Tasks
          </Typography>
          {/* Calendar Date Picker */}
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  input: { color: theme.palette.text.primary },
                  svg: { color: theme.palette.text.secondary },
                },
              },
            }}
          />
        </Box>

        {/* Tasks Table */}
        <Card sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
          <CardContent sx={{ padding: '8px' }}>
            {/* Table Header */}
            <Box
              display="flex"
              alignItems="center"
              p={2}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Ticket Id</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Customer</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>
                Assigned date <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
              </Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>
                Due date <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
              </Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Priority</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Product</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Status</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Issues</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '5%', justifyContent: 'center' }}>Details</Typography>
            </Box>

            {/* Table Body */}
            <Box>
              {assignedTasks.map((task, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  p={2}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                    fontSize: '0.85rem',
                  }}
                >
                  <Typography sx={{ flexBasis: '10%', fontWeight: 'bold' }}>{task.id}</Typography>
                  <Typography sx={{ flexBasis: '15%' }}>{task.customer}</Typography>
                  <Typography sx={{ flexBasis: '15%', color: theme.palette.text.secondary }}>{task.assignedDate}</Typography>
                  <Typography sx={{ flexBasis: '15%', color: theme.palette.text.secondary }}>{task.dueDate}</Typography>
                  <Box sx={{ flexBasis: '10%' }}>{getPriorityChip(task.priority, theme)}</Box>
                  <Typography sx={{ flexBasis: '15%' }}>{task.product}</Typography>
                  <Box sx={{ flexBasis: '10%' }}>{getStatusChip(task.status, theme)}</Box>
                  <Typography sx={{ flexBasis: '10%' }}>{task.issue}</Typography>
                  <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'center' }}>
                    <IconButton sx={{ color: theme.palette.text.secondary }}>
                      <MailOutline />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}