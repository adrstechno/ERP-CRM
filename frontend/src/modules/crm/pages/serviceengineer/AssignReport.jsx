// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   useTheme,
// } from '@mui/material';
// import {
//   UnfoldMore,
//   MailOutline,
// } from '@mui/icons-material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// // --- DATA ---
// const assignedTasks = [
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 30, 10:06 AM',
//     dueDate: 'Dec 30, 10:06 AM',
//     priority: 'medium',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'assigned',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1531',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 29, 2:59 AM',
//     dueDate: 'Dec 29, 2:59 AM',
//     priority: 'low',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'assigned',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 29, 12:54 AM',
//     dueDate: 'Dec 29, 12:54 AM',
//     priority: 'medium',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'assigned',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 28, 2:32 PM',
//     dueDate: 'Dec 28, 2:32 PM',
//     priority: 'low',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'in progress',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 27, 2:20 PM',
//     dueDate: 'Dec 27, 2:20 PM',
//     priority: 'low',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'in progress',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 30, 10:06 AM',
//     priority: 'low',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'in progress',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 29, 2:59 AM',
//     priority: 'high',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'in progress',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 29, 12:54 AM',
//     priority: 'high',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'in progress',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 28, 2:32 PM',
//     priority: 'medium',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'completed',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 28, 2:32 PM',
//     priority: 'high',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'completed',
//     issue: 'Inverter issue',
//   },
//   {
//     id: '#1532',
//     customer: 'Lal Singh Chaddha',
//     assignedDate: 'Dec 26, 9:48 AM',
//     dueDate: 'Dec 27, 2:20 PM',
//     priority: 'medium',
//     product: '1.5 Ton 5 Star Inverter AC',
//     status: 'completed',
//     issue: 'Inverter issue',
//   },
// ];

// // Priority chip
// const getPriorityChip = (priority, theme) => {
//   const styles = {
//     display: 'inline-flex',
//     alignItems: 'center',
//     padding: '4px 10px',
//     borderRadius: '12px',
//     fontSize: '0.75rem',
//     fontWeight: 600,
//     textTransform: 'capitalize',
//   };
//   switch (priority) {
//     case 'high':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(244,67,54,0.15)', color: '#f44336' }}>
//           + high
//         </Box>
//       );
//     case 'medium':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(255,193,7,0.15)', color: '#FFC107' }}>
//           + medium
//         </Box>
//       );
//     case 'low':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>
//           + low
//         </Box>
//       );
//     default:
//       return null;
//   }
// };

// // Status chip
// const getStatusChip = (status, theme) => {
//   const styles = {
//     display: 'inline-flex',
//     alignItems: 'center',
//     padding: '4px 10px',
//     borderRadius: '12px',
//     fontSize: '0.75rem',
//     fontWeight: 600,
//     textTransform: 'capitalize',
//   };
//   switch (status) {
//     case 'assigned':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(33,150,243,0.15)', color: '#2196F3' }}>
//           assigned
//         </Box>
//       );
//     case 'in progress':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(255,193,7,0.15)', color: '#FFC107' }}>
//           In progress
//         </Box>
//       );
//     case 'completed':
//       return (
//         <Box sx={{ ...styles, backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>
//           completed
//         </Box>
//       );
//     default:
//       return null;
//   }
// };

// export default function AssignReports() {
//   const theme = useTheme();
//   const [selectedDate, setSelectedDate] = useState(dayjs());

//   const headerTextStyle = {
//     color: theme.palette.text.secondary,
//     fontSize: '0.8rem',
//     fontWeight: '600',
//     display: 'flex',
//     alignItems: 'center',
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box p={3} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
//         {/* Page Header */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h5" fontWeight="bold">
//             Assigned Tasks
//           </Typography>
//           {/* Calendar Date Picker */}
//           <DatePicker
//             value={selectedDate}
//             onChange={(newValue) => setSelectedDate(newValue)}
//             slotProps={{
//               textField: {
//                 size: 'small',
//                 sx: {
//                   backgroundColor: theme.palette.background.paper,
//                   borderRadius: 1,
//                   input: { color: theme.palette.text.primary },
//                   svg: { color: theme.palette.text.secondary },
//                 },
//               },
//             }}
//           />
//         </Box>

//         {/* Tasks Table */}
//         <Card sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
//           <CardContent sx={{ padding: '8px' }}>
//             {/* Table Header */}
//             <Box
//               display="flex"
//               alignItems="center"
//               p={2}
//               sx={{
//                 borderBottom: `1px solid ${theme.palette.divider}`,
//               }}
//             >
//               <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Ticket Id</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Customer</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>
//                 Assigned date <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
//               </Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>
//                 Due date <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
//               </Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Priority</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Product</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Status</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '10%' }}>Issues</Typography>
//               <Typography sx={{ ...headerTextStyle, flexBasis: '5%', justifyContent: 'center' }}>Details</Typography>
//             </Box>

//             {/* Table Body */}
//             <Box>
//               {assignedTasks.map((task, index) => (
//                 <Box
//                   key={index}
//                   display="flex"
//                   alignItems="center"
//                   p={2}
//                   sx={{
//                     borderBottom: `1px solid ${theme.palette.divider}`,
//                     '&:last-child': { borderBottom: 'none' },
//                     fontSize: '0.85rem',
//                   }}
//                 >
//                   <Typography sx={{ flexBasis: '10%', fontWeight: 'bold' }}>{task.id}</Typography>
//                   <Typography sx={{ flexBasis: '15%' }}>{task.customer}</Typography>
//                   <Typography sx={{ flexBasis: '15%', color: theme.palette.text.secondary }}>{task.assignedDate}</Typography>
//                   <Typography sx={{ flexBasis: '15%', color: theme.palette.text.secondary }}>{task.dueDate}</Typography>
//                   <Box sx={{ flexBasis: '10%' }}>{getPriorityChip(task.priority, theme)}</Box>
//                   <Typography sx={{ flexBasis: '15%' }}>{task.product}</Typography>
//                   <Box sx={{ flexBasis: '10%' }}>{getStatusChip(task.status, theme)}</Box>
//                   <Typography sx={{ flexBasis: '10%' }}>{task.issue}</Typography>
//                   <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'center' }}>
//                     <IconButton sx={{ color: theme.palette.text.secondary }}>
//                       <MailOutline />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               ))}
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     </LocalizationProvider>
//   );
// }

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

// --- API Simulation ---
const mockTasksData = [
    { id: '#1532', customer: 'Lal Singh Chaddha', assignedDate: '2025-09-25T10:06:00Z', dueDate: '2025-09-26T18:00:00Z', priority: 'medium', product: '1.5 Ton 5 Star Inverter AC', status: 'Assigned', issue: 'Inverter issue' },
    { id: '#1531', customer: 'ACME Corp', assignedDate: '2025-09-25T09:00:00Z', dueDate: '2025-09-25T17:00:00Z', priority: 'low', product: 'Window AC Unit', status: 'Assigned', issue: 'Not cooling' },
    { id: '#1530', customer: 'Global Tech', assignedDate: '2025-09-24T15:30:00Z', dueDate: '2025-09-25T12:00:00Z', priority: 'high', product: 'Central AC Unit', status: 'In Progress', issue: 'Water leakage' },
    { id: '#1529', customer: 'Home Essentials', assignedDate: '2025-09-24T11:00:00Z', dueDate: '2025-09-24T15:00:00Z', priority: 'medium', product: '2 Ton Split AC', status: 'Completed', issue: 'Noise from outdoor unit' },
    { id: '#1528', customer: 'Sunrise Apartments', assignedDate: '2025-09-23T16:00:00Z', dueDate: '2025-09-24T18:00:00Z', priority: 'low', product: 'Portable AC', status: 'Assigned', issue: 'Remote not working' },
];

// --- Helper Components ---
const PriorityChip = React.memo(({ priority }) => {
    let color;
    if (priority === 'high') color = 'error';
    else if (priority === 'medium') color = 'warning';
    else color = 'success';
    return <Chip label={priority} color={color} size="small" sx={{ textTransform: 'capitalize' }}/>;
});

const StatusChip = React.memo(({ status }) => {
    let color;
    if (status === 'Completed') color = 'success';
    else if (status === 'In Progress') color = 'info';
    else if (status === 'Assigned') color = 'warning';
    else color = 'default';
    return <Chip label={status} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
});

// --- Main Component ---
export default function AssignedTasks() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call based on selectedDate
        console.log(`Fetching tasks for ${selectedDate.format('YYYY-MM-DD')}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTasks(mockTasksData);
        setIsLoading(false);
    }, [selectedDate]);

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
                                    {['Ticket ID', 'Customer', 'Assigned Date', 'Due Date', 'Priority', 'Product', 'Status', 'Issue', 'Details'].map(head => (
                                        <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    Array.from(new Array(6)).map((_, index) => (
                                        <TableRow key={index}><TableCell colSpan={9}><Skeleton animation="wave" /></TableCell></TableRow>
                                    ))
                                ) : (
                                    tasks.map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{task.id}</TableCell>
                                            <TableCell>{task.customer}</TableCell>
                                            <TableCell>{dayjs(task.assignedDate).format('DD MMM, hh:mm A')}</TableCell>
                                            <TableCell>{dayjs(task.dueDate).format('DD MMM, hh:mm A')}</TableCell>
                                            <TableCell><PriorityChip priority={task.priority} /></TableCell>
                                            <TableCell>{task.product}</TableCell>
                                            <TableCell><StatusChip status={task.status} /></TableCell>
                                            <TableCell>{task.issue}</TableCell>
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
