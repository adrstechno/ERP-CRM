// import React from 'react';
// import {
//     Box, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Stack, FormControl, Select, MenuItem
// } from '@mui/material';

// // --- Mock Data ---

// // Data for the Regional Sales Report Table
// const regionalSalesData = [
//     { id: 1, dealerName: 'Ram Sharma', target: 12, actualSales: 10, achieved: 80, lastDate: '10-08-2025' },
//     { id: 2, dealerName: 'CoolAir Traders', target: 20, actualSales: 18, achieved: 90, lastDate: '12-08-2025' },
//     { id: 3, dealerName: 'Arctic Systems', target: 15, actualSales: 16, achieved: 106, lastDate: '11-08-2025' },
//     { id: 4, dealerName: 'FreshBreeze ACs', target: 25, actualSales: 20, achieved: 80, lastDate: '09-08-2025' },
// ];

// // Data for the Service Report Table
// const serviceReportData = [
//     { id: 1, engineerName: 'Anil Sharma', assigned: 12, tickets: 10, completed: 8, pending: 2, achieved: 80 },
//     { id: 2, engineerName: 'Suresh Kumar', assigned: 15, tickets: 14, completed: 12, pending: 2, achieved: 86 },
//     { id: 3, engineerName: 'Ramesh Kumar', assigned: 10, tickets: 10, completed: 9, pending: 1, achieved: 90 },
//     { id: 4, engineerName: 'Priya Singh', assigned: 18, tickets: 15, completed: 11, pending: 4, achieved: 73 },
// ];

// // --- Main Component ---
// export default function ReportsPage() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [salesMonth, setSalesMonth] = React.useState('Jan 2024');
//     const [serviceMonth, setServiceMonth] = React.useState('Jul 2024');


//     const handleSalesMonthChange = (event) => {
//         setSalesMonth(event.target.value);
//     };

//     const handleServiceMonthChange = (event) => {
//         setServiceMonth(event.target.value);
//     };

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Stack spacing={3}>
//                 {/* Regional Sales Report Card */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Stack
//                             direction={{ xs: 'column', sm: 'row' }}
//                             justifyContent="space-between"
//                             alignItems={{ xs: 'flex-start', sm: 'center' }}
//                             mb={3}
//                             spacing={2}
//                         >
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>REGIONAL SALES REPORT</Typography>
//                             <FormControl size="small">
//                                 <Select
//                                     value={salesMonth}
//                                     onChange={handleSalesMonthChange}
//                                     sx={{ borderRadius: 2, minWidth: 120, '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)' } }}
//                                 >
//                                     <MenuItem value="Jan 2024">Jan 2024</MenuItem>
//                                     <MenuItem value="Feb 2024">Feb 2024</MenuItem>
//                                     <MenuItem value="Mar 2024">Mar 2024</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Stack>
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Dealer name', 'target', 'Actual Sales', 'Achieved %', 'Last date'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {regionalSalesData.map((row) => (
//                                         <TableRow key={row.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                             <TableCell>{row.dealerName}</TableCell>
//                                             <TableCell>{row.target}</TableCell>
//                                             <TableCell>{row.actualSales}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{row.achieved}%</TableCell>
//                                             <TableCell>{row.lastDate}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>

//                 {/* Service Report Card */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Stack
//                             direction={{ xs: 'column', sm: 'row' }}
//                             justifyContent="space-between"
//                             alignItems={{ xs: 'flex-start', sm: 'center' }}
//                             mb={3}
//                             spacing={2}
//                         >
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SERVICE REPORT</Typography>
//                             <FormControl size="small">
//                                 <Select
//                                     value={serviceMonth}
//                                     onChange={handleServiceMonthChange}
//                                     sx={{ borderRadius: 2, minWidth: 120, '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)' } }}
//                                 >
//                                     <MenuItem value="Jul 2024">Jul 2024</MenuItem>
//                                     <MenuItem value="Aug 2024">Aug 2024</MenuItem>
//                                     <MenuItem value="Sep 2024">Sep 2024</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Stack>
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Engineer Name', 'Assigned', 'Tickets', 'Completed', 'Pending', 'ACHIEVED %'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {serviceReportData.map((row) => (
//                                         <TableRow key={row.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                             <TableCell>{row.engineerName}</TableCell>
//                                             <TableCell>{row.assigned}</TableCell>
//                                             <TableCell>{row.tickets}</TableCell>
//                                             <TableCell>{row.completed}</TableCell>
//                                             <TableCell>{row.pending}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{row.achieved}%</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>
//             </Stack>
//         </Box>
//     );
// }

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, FormControl, Select, MenuItem, Skeleton, InputLabel
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EngineeringIcon from '@mui/icons-material/Engineering';

// --- API Simulation ---
const mockSalesReports = [
    { id: 1, dealerName: 'Ram Sharma', target: 12, actualSales: 10, achieved: 80, lastDate: '10-08-2025' },
    { id: 2, dealerName: 'CoolAir Traders', target: 20, actualSales: 18, achieved: 90, lastDate: '12-08-2025' },
    { id: 3, dealerName: 'Arctic Systems', target: 15, actualSales: 16, achieved: 106, lastDate: '11-08-2025' },
    { id: 4, dealerName: 'FreshBreeze ACs', target: 25, actualSales: 20, achieved: 80, lastDate: '09-08-2025' },
    { id: 5, dealerName: 'Zenith Corp', target: 30, actualSales: 32, achieved: 107, lastDate: '15-08-2025' },
];

const mockServiceReports = [
    { id: 1, engineerName: 'Anil Sharma', assigned: 12, tickets: 10, completed: 8, pending: 2, achieved: 80 },
    { id: 2, engineerName: 'Suresh Kumar', assigned: 15, tickets: 14, completed: 12, pending: 2, achieved: 86 },
    { id: 3, engineerName: 'Ramesh Kumar', assigned: 10, tickets: 10, completed: 9, pending: 1, achieved: 90 },
    { id: 4, engineerName: 'Priya Singh', assigned: 18, tickets: 15, completed: 11, pending: 4, achieved: 73 },
    { id: 5, engineerName: 'Amit Patel', assigned: 14, tickets: 12, completed: 12, pending: 0, achieved: 100 },
];

// --- Main Component ---
export default function ReportsPage() {
    const [salesDate, setSalesDate] = useState('Aug 2025');
    const [serviceDate, setServiceDate] = useState('Aug 2025');
    const [salesData, setSalesData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSalesData(mockSalesReports);
            setServiceData(mockServiceReports);
            setIsLoading(false);
        }, 100);
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return (
        <Box>
            <Stack spacing={3}>
                {/* Regional Sales Report Card */}
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <AssessmentIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Regional Sales Report</Typography>
                            </Stack>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Month</InputLabel>
                                <Select value={salesDate} label="Month" onChange={(e) => setSalesDate(e.target.value)}>
                                    <MenuItem value="Aug 2025">August 2025</MenuItem>
                                    <MenuItem value="Sep 2025">September 2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <TableContainer sx={{ maxHeight: 'calc(50vh - 130px)', overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Dealer Name', 'Target', 'Actual Sales', 'Achieved %', 'Last Date'].map(head => (
                                            <TableCell key={head}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from(new Array(4)).map((_, index) => (
                                            <TableRow key={index}><TableCell colSpan={5}><Skeleton animation="wave" /></TableCell></TableRow>
                                        ))
                                    ) : (
                                        salesData.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.dealerName}</TableCell>
                                                <TableCell>{row.target}</TableCell>
                                                <TableCell>{row.actualSales}</TableCell>
                                                <TableCell>{row.achieved}%</TableCell>
                                                <TableCell>{row.lastDate}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Service Report Card */}
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <EngineeringIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Report</Typography>
                            </Stack>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Month</InputLabel>
                                <Select value={serviceDate} label="Month" onChange={(e) => setServiceDate(e.target.value)}>
                                     <MenuItem value="Aug 2025">August 2025</MenuItem>
                                     <MenuItem value="Sep 2025">September 2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <TableContainer sx={{ maxHeight: 'calc(50vh - 130px)', overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Engineer Name', 'Assigned', 'Tickets', 'Completed', 'Pending', 'Achieved %'].map(head => (
                                            <TableCell key={head}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                     {isLoading ? (
                                        Array.from(new Array(4)).map((_, index) => (
                                            <TableRow key={index}><TableCell colSpan={6}><Skeleton animation="wave" /></TableCell></TableRow>
                                        ))
                                    ) : (
                                        serviceData.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.engineerName}</TableCell>
                                                <TableCell>{row.assigned}</TableCell>
                                                <TableCell>{row.tickets}</TableCell>
                                                <TableCell>{row.completed}</TableCell>
                                                <TableCell>{row.pending}</TableCell>
                                                <TableCell>{row.achieved}%</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}

