// import React, { useState } from 'react';
// import {
//     Box, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// // --- Mock Data ---
// const initialExpensesData = [
//     { id: 'EXP-1023', userName: 'Ramesh Kumar', role: 'Marketer', date: '05-09-2025', category: 'Travel', amount: 1200, receipt: '[N]', remarks: 'Client visit', status: 'Pending' },
//     { id: 'EXP-1024', userName: 'Suresh Kumar', role: 'Service Engg.', date: '04-09-2025', category: 'Tools', amount: 3500, receipt: '[Y]', remarks: 'New toolkit purchase', status: 'Pending' },
//     { id: 'EXP-1025', userName: 'Priya Singh', role: 'Marketer', date: '04-09-2025', category: 'Food', amount: 850, receipt: '[Y]', remarks: 'Lunch with dealer', status: 'Approved' },
//     { id: 'EXP-1026', userName: 'Anjali Mehta', role: 'Sub-admin', date: '03-09-2025', category: 'Office Supplies', amount: 2100, receipt: '[N]', remarks: 'Stationery for office', status: 'Pending' },
//     { id: 'EXP-1027', userName: 'Rajesh Sharma', role: 'Service Engg.', date: '02-09-2025', category: 'Travel', amount: 1800, receipt: '[Y]', remarks: 'Fuel for service vehicle', status: 'Approved' },
// ];

// // --- Main Component ---
// export default function ApproveExpenses() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [month, setMonth] = useState('Jun 2025');
//     const [expenses, setExpenses] = useState(initialExpensesData);

//     const handleMonthChange = (event) => {
//         setMonth(event.target.value);
//     };

//     const handleApprove = (expenseId) => {
//         setExpenses(
//             expenses.map(exp =>
//                 exp.id === expenseId ? { ...exp, status: 'Approved' } : exp
//             )
//         );
//     };

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//         height: '100%',
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Card sx={cardStyle}>
//                 <CardContent>
//                     <Stack
//                         direction={{ xs: 'column', md: 'row' }}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={3}
//                         spacing={2}
//                     >
//                         {/* Empty Box for spacing to center the search bar */}
//                         <Box sx={{ width: { xs: 0, md: 200 }, display: { xs: 'none', md: 'block' } }} />

//                         {/* Search Bar */}
//                         <TextField
//                             variant="outlined"
//                             size="small"
//                             placeholder="Search"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon color="action" />
//                                     </InputAdornment>
//                                 ),
//                                 sx: {
//                                     borderRadius: 3,
//                                     width: { xs: '100%', sm: 300, md: 400 },
//                                     bgcolor: theme.palette.action.hover,
//                                     '& .MuiOutlinedInput-notchedOutline': {
//                                         border: 'none',
//                                     },
//                                 }
//                             }}
//                         />

//                         {/* Date Filter */}
//                         <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
//                             <Select
//                                 value={month}
//                                 onChange={handleMonthChange}
//                                 sx={{
//                                     borderRadius: 2,
//                                     minWidth: 120,
//                                     '.MuiOutlinedInput-notchedOutline': {
//                                         borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="Jun 2025">Jun 2025</MenuItem>
//                                 <MenuItem value="Jul 2025">Jul 2025</MenuItem>
//                                 <MenuItem value="Aug 2025">Aug 2025</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Stack>
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     {['Expense', 'UserName', 'Role', 'Date', 'Category', 'Amount', 'Receipt', 'Remarks', 'Approval'].map(head => (
//                                         <TableCell key={head} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{head}</TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {expenses.map((expense) => (
//                                     <TableRow key={expense.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                         <TableCell sx={{ fontWeight: 500 }}>{expense.id}</TableCell>
//                                         <TableCell>{expense.userName}</TableCell>
//                                         <TableCell>{expense.role}</TableCell>
//                                         <TableCell>{expense.date}</TableCell>
//                                         <TableCell>{expense.category}</TableCell>
//                                         <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
//                                         <TableCell>{expense.receipt}</TableCell>
//                                         <TableCell>{expense.remarks}</TableCell>
//                                         <TableCell>
//                                             {expense.status === 'Pending' ? (
//                                                 <Button
//                                                     variant="contained"
//                                                     size="small"
//                                                     onClick={() => handleApprove(expense.id)}
//                                                     sx={{
//                                                         textTransform: 'none',
//                                                         bgcolor: theme.palette.warning.main,
//                                                         color: theme.palette.common.black,
//                                                         '&:hover': {
//                                                             bgcolor: theme.palette.warning.dark
//                                                         }
//                                                     }}
//                                                 >
//                                                     Show details
//                                                 </Button>
//                                             ) : (
//                                                 <Chip
//                                                     label="Approved"
//                                                     color="success"
//                                                     size="small"
//                                                     icon={<CheckCircleIcon />}
//                                                     disabled
//                                                 />
//                                             )}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, Skeleton, InputLabel, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// --- API Simulation ---
const mockExpensesData = [
    // Data for Sep 2025
    { id: 'EXP-1023', userName: 'Ramesh Kumar', role: 'Marketer', date: '05-09-2025', category: 'Travel', amount: 1200, receipt: '[N]', remarks: 'Client visit', status: 'Pending' },
    { id: 'EXP-1024', userName: 'Suresh Kumar', role: 'Service Engg.', date: '04-09-2025', category: 'Tools', amount: 3500, receipt: '[Y]', remarks: 'New toolkit purchase', status: 'Pending' },
    // Data for Aug 2025
    { id: 'EXP-1029', userName: 'Priya Singh', role: 'Marketer', date: '31-08-2025', category: 'Travel', amount: 950, receipt: '[N]', remarks: 'Local travel for meetings', status: 'Approved' },
    { id: 'EXP-1028', userName: 'Ramesh Kumar', role: 'Marketer', date: '28-08-2025', category: 'Accommodation', amount: 4500, receipt: '[Y]', remarks: 'Hotel stay for conference', status: 'Pending' },
    { id: 'EXP-1028', userName: 'Ramesh Kumar', role: 'Marketer', date: '28-08-2025', category: 'Accommodation', amount: 4500, receipt: '[Y]', remarks: 'Hotel stay for conference', status: 'Pending' },
    { id: 'EXP-1028', userName: 'Ramesh Kumar', role: 'Marketer', date: '28-08-2025', category: 'Accommodation', amount: 4500, receipt: '[Y]', remarks: 'Hotel stay for conference', status: 'Pending' },
    { id: 'EXP-1028', userName: 'Ramesh Kumar', role: 'Marketer', date: '28-08-2025', category: 'Accommodation', amount: 4500, receipt: '[Y]', remarks: 'Hotel stay for conference', status: 'Pending' },
    { id: 'EXP-1028', userName: 'Ramesh Kumar', role: 'Marketer', date: '28-08-2025', category: 'Accommodation', amount: 4500, receipt: '[Y]', remarks: 'Hotel stay for conference', status: 'Pending' },
];

// --- Helper Functions to Generate Date Filters ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0-indexed (0 for Jan, 11 for Dec)

const generateYearOptions = () => {
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
    }
    return years;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const generateMonthOptions = (selectedYear) => {
    const year = parseInt(selectedYear, 10);
    if (year < currentYear) {
        return monthNames; // Full year for past years
    }
    return monthNames.slice(0, currentMonth + 1); // Up to current month for the current year
};


// --- Main Component ---
export default function ApproveExpenses() {
    const [year, setYear] = useState(String(currentYear));
    const [month, setMonth] = useState(monthNames[currentMonth]);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const yearOptions = useMemo(() => generateYearOptions(), []);
    const monthOptions = useMemo(() => generateMonthOptions(year), [year]);

    useEffect(() => {
        // When year changes, check if the current month is valid. If not, reset to the latest possible month.
        if (!generateMonthOptions(year).includes(month)) {
            const newMonths = generateMonthOptions(year);
            setMonth(newMonths[newMonths.length - 1]);
        }
    }, [year]);


    useEffect(() => {
        // Simulate API call based on selected year and month
        setIsLoading(true);
        console.log(`Fetching data for ${month}, ${year}...`);
        setTimeout(() => {
            // In a real app, you would filter based on month and year from the API
            setExpenses(mockExpensesData);
            setIsLoading(false);
        }, 100);
    }, [month, year]);

    const handleApprove = (expenseId) => {
        setExpenses(
            expenses.map(exp =>
                exp.id === expenseId ? { ...exp, status: 'Approved' } : exp
            )
        );
    };

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp =>
            exp.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [expenses, searchTerm]);

    return (
        <Box>
            <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        spacing={2}
                        mb={2}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ReceiptLongIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Approve Expenses</Typography>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search by User, ID, Category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: { xs: '100%', sm: 300 } }}
                            />
                             <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Year</InputLabel>
                                <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                                    {yearOptions.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Month</InputLabel>
                                <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
                                   {monthOptions.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </CardContent>

                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {['Expense ID', 'User Name', 'Role', 'Date', 'Category', 'Amount', 'Receipt', 'Remarks', 'Approval'].map(head => (
                                    <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(8)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={9}><Skeleton animation="wave" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{expense.id}</TableCell>
                                        <TableCell>{expense.userName}</TableCell>
                                        <TableCell>{expense.role}</TableCell>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>{expense.receipt}</TableCell>
                                        <TableCell>{expense.remarks}</TableCell>
                                        <TableCell>
                                            {expense.status === 'Pending' ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleApprove(expense.id)}
                                                    color="primary"
                                                >
                                                    Approve
                                                </Button>
                                            ) : (
                                                <Chip
                                                    label="Approved"
                                                    color="success"
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
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

