

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
                    <Table stickyHeader size="medium">
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

