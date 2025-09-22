import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, FormControl, Select, MenuItem, InputAdornment, TextField, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Mock Data ---
const initialExpensesData = [
    { id: 'EXP-1023', userName: 'Ramesh Kumar', role: 'Marketer', date: '05-09-2025', category: 'Travel', amount: 1200, receipt: '[N]', remarks: 'Client visit', status: 'Pending' },
    { id: 'EXP-1024', userName: 'Suresh Kumar', role: 'Service Engg.', date: '04-09-2025', category: 'Tools', amount: 3500, receipt: '[Y]', remarks: 'New toolkit purchase', status: 'Pending' },
    { id: 'EXP-1025', userName: 'Priya Singh', role: 'Marketer', date: '04-09-2025', category: 'Food', amount: 850, receipt: '[Y]', remarks: 'Lunch with dealer', status: 'Approved' },
    { id: 'EXP-1026', userName: 'Anjali Mehta', role: 'Sub-admin', date: '03-09-2025', category: 'Office Supplies', amount: 2100, receipt: '[N]', remarks: 'Stationery for office', status: 'Pending' },
    { id: 'EXP-1027', userName: 'Rajesh Sharma', role: 'Service Engg.', date: '02-09-2025', category: 'Travel', amount: 1800, receipt: '[Y]', remarks: 'Fuel for service vehicle', status: 'Approved' },
];

// --- Main Component ---
export default function ApproveExpenses() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [month, setMonth] = useState('Jun 2025');
    const [expenses, setExpenses] = useState(initialExpensesData);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleApprove = (expenseId) => {
        setExpenses(
            expenses.map(exp =>
                exp.id === expenseId ? { ...exp, status: 'Approved' } : exp
            )
        );
    };

    const cardStyle = {
        borderRadius: 4,
        boxShadow: 'none',
        background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        height: '100%',
    };

    return (
        <Box p={{ xs: 2, sm: 3 }}>
            <Card sx={cardStyle}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                        spacing={2}
                    >
                        {/* Empty Box for spacing to center the search bar */}
                        <Box sx={{ width: { xs: 0, md: 200 }, display: { xs: 'none', md: 'block' } }} />

                        {/* Search Bar */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 3,
                                    width: { xs: '100%', sm: 300, md: 400 },
                                    bgcolor: theme.palette.action.hover,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }
                            }}
                        />

                        {/* Date Filter */}
                        <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <Select
                                value={month}
                                onChange={handleMonthChange}
                                sx={{
                                    borderRadius: 2,
                                    minWidth: 120,
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                    },
                                }}
                            >
                                <MenuItem value="Jun 2025">Jun 2025</MenuItem>
                                <MenuItem value="Jul 2025">Jul 2025</MenuItem>
                                <MenuItem value="Aug 2025">Aug 2025</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Expense', 'UserName', 'Role', 'Date', 'Category', 'Amount', 'Receipt', 'Remarks', 'Approval'].map(head => (
                                        <TableCell key={head} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenses.map((expense) => (
                                    <TableRow key={expense.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
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
                                                    sx={{
                                                        textTransform: 'none',
                                                        bgcolor: theme.palette.warning.main,
                                                        color: theme.palette.common.black,
                                                        '&:hover': {
                                                            bgcolor: theme.palette.warning.dark
                                                        }
                                                    }}
                                                >
                                                    Show details
                                                </Button>
                                            ) : (
                                                <Chip
                                                    label="Approved"
                                                    color="success"
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                    disabled
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}