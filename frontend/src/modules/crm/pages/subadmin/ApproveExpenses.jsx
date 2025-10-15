import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, Skeleton, InputLabel, Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { format } from 'date-fns';
import axios from 'axios';
import { VITE_API_BASE_URL } from '../../utils/State';

// --- Helper Functions (No changes) ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const generateYearOptions = () => {
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
    }
    return years;
};

const generateMonthOptions = (selectedYear) => {
    const year = parseInt(selectedYear, 10);
    if (year < currentYear) return monthNames;
    return monthNames.slice(0, currentMonth + 1);
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

    const token = localStorage.getItem("authKey");
    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` },
    }), [token]);

    useEffect(() => {
        if (!generateMonthOptions(year).includes(month)) {
            const newMonths = generateMonthOptions(year);
            setMonth(newMonths[newMonths.length - 1]);
        }
    }, [year]);

    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${VITE_API_BASE_URL}/expense/all-expense`, axiosConfig);
                const result = response.data;

                if (result.success && Array.isArray(result.data)) {
                    const formattedData = result.data.map(item => ({
                        id: item.expenseId,
                        userName: item.userName,
                        date: format(new Date(item.expenseDate), 'dd-MM-yyyy'),
                        category: item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase(),
                        amount: item.amount,
                        receipt: item.invoiceUrl,
                        remarks: item.remarks,
                        status: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
                    }));
                    setExpenses(formattedData);
                } else {
                    console.error("API call was successful, but the data format is incorrect:", result);
                    setExpenses([]);
                }
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
                setExpenses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, [axiosConfig]);

    // --- ## Updated Approval Logic ---
    const handleApprove = async (expenseId) => {
        const originalExpenses = [...expenses];
        setExpenses(
            expenses.map(exp =>
                exp.id === expenseId ? { ...exp, status: 'Approved' } : exp
            )
        );

        try {
            // **1. Construct the new URL with the query parameter**
            const API_URL = `${VITE_API_BASE_URL}/expense/${expenseId}/status?status=APPROVED`;
            
            // **2. Make the PATCH request with a `null` body**
            // The second argument to axios.patch is the request body, which is not needed here.
            await axios.patch(API_URL, null, axiosConfig);

        } catch (error) {
            console.error("Error approving expense:", error);
            setExpenses(originalExpenses);
            alert("Failed to approve the expense. Please try again.");
        }
    };

    const filteredExpenses = useMemo(() => {
        if (!expenses) return [];
        return expenses.filter(exp => {
            const expenseDate = new Date(exp.date.split('-').reverse().join('-'));
            const selectedMonthIndex = monthNames.indexOf(month);
            const isDateMatch = expenseDate.getFullYear() === parseInt(year, 10) && expenseDate.getMonth() === selectedMonthIndex;
            if (!isDateMatch) return false;
            const searchTermLower = searchTerm.toLowerCase();
            if (!searchTermLower) return true;
            return (
                exp.userName.toLowerCase().includes(searchTermLower) ||
                String(exp.id).toLowerCase().includes(searchTermLower) ||
                exp.category.toLowerCase().includes(searchTermLower)
            );
        });
    }, [expenses, searchTerm, month, year]);

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
                                {['Expense ID', 'User Name', 'Date', 'Category', 'Amount', 'Receipt', 'Remarks', 'Approval'].map(head => (
                                    <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(8)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={8}><Skeleton animation="wave" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{expense.id}</TableCell>
                                        <TableCell>{expense.userName}</TableCell>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>
                                            {expense.receipt ? (
                                                <Link href={expense.receipt} target="_blank" rel="noopener noreferrer" underline="always">
                                                    View
                                                </Link>
                                            ) : 'N/A'}
                                        </TableCell>
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