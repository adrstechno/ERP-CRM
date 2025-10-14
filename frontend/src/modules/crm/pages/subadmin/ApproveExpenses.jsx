import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip, Skeleton, InputLabel, Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { format } from 'date-fns'; // A robust library for date formatting

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
    const [expenses, setExpenses] = useState([]); // This will hold all expenses fetched from the API
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const yearOptions = useMemo(() => generateYearOptions(), []);
    const monthOptions = useMemo(() => generateMonthOptions(year), [year]);

    
  const token = localStorage.getItem("authKey");
  const user = JSON.parse(localStorage.getItem("user"));
 const axiosConfig = useMemo(() => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}, [token]);

    // This effect ensures the month dropdown is valid when the year changes.
    useEffect(() => {
        if (!generateMonthOptions(year).includes(month)) {
            const newMonths = generateMonthOptions(year);
            setMonth(newMonths[newMonths.length - 1]);
        }
    }, [year]);

    // --- 1. API Integration: Fetching all expenses ---
    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            try {
                // Fetch data from your API endpoint
                const response = await fetch('http://localhost:8080/api/expense/all-expense',axiosConfig
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    // Map API data to the structure your component expects
                    const formattedData = result.data.map(item => ({
                        id: item.expenseId,
                        userName: item.userName,
                        // 'role' is not in the API response, so it's removed
                        date: format(new Date(item.expenseDate), 'dd-MM-yyyy'), // Format date for display
                        category: item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase(),
                        amount: item.amount,
                        receipt: item.invoiceUrl, // Keep the URL for creating a link
                        remarks: item.remarks,
                        status: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(), // e.g., PENDING -> Pending
                    }));
                    setExpenses(formattedData);
                } else {
                    console.error("API call was successful, but the data format is incorrect:", result);
                    setExpenses([]); // Set to empty array on format error
                }
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
                setExpenses([]); // Clear expenses on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, []); // Empty dependency array means this runs once when the component mounts

    // --- 2. Approval Logic: Updating an expense's status ---
    const handleApprove = async (expenseId) => {
        // Optimistically update the UI first for a better user experience
        setExpenses(
            expenses.map(exp =>
                exp.id === expenseId ? { ...exp, status: 'Approved' } : exp
            )
        );

        // TODO: Implement the backend API call to approve the expense
        /*
        try {
            const response = await fetch(`http://localhost:8080/api/expense/approve/${expenseId}`, {
                method: 'PUT', // or 'PATCH', depending on your API design
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ status: 'APPROVED' }) // if your API requires a body
            });

            if (!response.ok) {
                throw new Error('Failed to approve on server');
            }
            // If successful, the UI is already updated. You could refetch data here if needed.

        } catch (error) {
            console.error("Error approving expense:", error);
            // If the API call fails, revert the change in the UI
            setExpenses(
                expenses.map(exp =>
                    exp.id === expenseId ? { ...exp, status: 'Pending' } : exp
                )
            );
            alert("Failed to approve the expense. Please try again.");
        }
        */
    };

    // --- 3. Client-Side Filtering: By date and search term ---
    const filteredExpenses = useMemo(() => {
        if (!expenses) return [];

        return expenses.filter(exp => {
            // Filter by selected month and year
            const expenseDate = new Date(exp.date.split('-').reverse().join('-')); // Convert DD-MM-YYYY string to Date object
            const selectedMonthIndex = monthNames.indexOf(month);
            const isDateMatch = expenseDate.getFullYear() === parseInt(year, 10) && expenseDate.getMonth() === selectedMonthIndex;

            if (!isDateMatch) {
                return false; // Exclude if it doesn't match the selected period
            }

            // Filter by search term (if a date match was found)
            const searchTermLower = searchTerm.toLowerCase();
            if (!searchTermLower) {
                return true; // Include if date matches and no search term
            }
            
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

                {/* --- 4. Table Rendering Adjustments --- */}
                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader size="medium">
                        <TableHead>
                            <TableRow>
                                {/* Adjusted columns to match API data: 'Role' is removed */}
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
                                            {/* Display a clickable link for the receipt if URL exists */}
                                            {expense.receipt ? (
                                                <Link href={expense.receipt} target="_blank" rel="noopener noreferrer" underline="always">
                                                    View
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
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