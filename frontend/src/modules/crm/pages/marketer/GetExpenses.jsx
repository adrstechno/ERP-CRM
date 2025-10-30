import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Chip,
  Link,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import axios from 'axios';
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';

// ---------------- Helper Constants ----------------
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ---------------- Helper Functions ----------------
const generateYearOptions = () => {
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

const generateMonthOptions = (selectedYear) => {
  const year = parseInt(selectedYear, 10);
  return year < currentYear ? monthNames : monthNames.slice(0, currentMonth + 1);
};

// ---------------- Status Chip ----------------
const StatusChip = React.memo(({ status }) => {
  const lower = status.toLowerCase();
  const color =
    lower === 'approved' ? 'success' :
    lower === 'pending' ? 'warning' :
    lower === 'rejected' ? 'error' : 'default';
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return <Chip label={label} color={color} size="small" variant="outlined" />;
});

// ---------------- Main Component ----------------
export default function MyExpenses() {
  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(monthNames[currentMonth]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [errors, setErrors] = useState({
    year: false,
    month: false,
  });

  const yearOptions = useMemo(() => generateYearOptions(), []);
  const monthOptions = useMemo(() => generateMonthOptions(year), [year]);

  const token = localStorage.getItem('authKey');
  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // 🔹 Handle month reset when year changes
  useEffect(() => {
    if (!generateMonthOptions(year).includes(month)) {
      const newMonths = generateMonthOptions(year);
      setMonth(newMonths[newMonths.length - 1]);
    }
  }, [year]);

  // 🔹 Fetch expenses
  const fetchExpenses = useCallback(async () => {
    // Required validation before API call
    const newErrors = {
      year: !year,
      month: !month,
    };
    setErrors(newErrors);

    if (newErrors.year || newErrors.month) {
      toast.error('Please select both Year and Month before fetching data.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/expense/my-expense`, axiosConfig);
      const result = response.data;

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item) => ({
          id: item.expenseId,
          userName: item.userName,
          date: format(new Date(item.expenseDate), 'dd-MM-yyyy'),
          category:
            item.category.charAt(0).toUpperCase() +
            item.category.slice(1).toLowerCase(),
          amount: item.amount,
          receipt: item.invoiceUrl,
          remarks: item.remarks,
          status:
            item.status.charAt(0).toUpperCase() +
            item.status.slice(1).toLowerCase(),
        }));
        setExpenses(formatted);
      } else {
        console.error('Unexpected data format:', result);
        setExpenses([]);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      toast.error('Failed to load expenses. Please try again.');
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig, year, month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // 🔹 Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const expDate = new Date(exp.date.split('-').reverse().join('-'));
      const selectedMonthIdx = monthNames.indexOf(month);
      const matchDate =
        expDate.getFullYear() === parseInt(year, 10) &&
        expDate.getMonth() === selectedMonthIdx;

      if (!matchDate) return false;

      const term = searchTerm.toLowerCase();
      if (!term) return true;

      return (
        exp.userName.toLowerCase().includes(term) ||
        String(exp.id).toLowerCase().includes(term) ||
        exp.category.toLowerCase().includes(term)
      );
    });
  }, [expenses, searchTerm, month, year]);

  // ---------------- UI ----------------
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
              <Typography variant="h6" fontWeight="bold">
                My Expenses
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by ID, Category..."
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

              {/* Year Dropdown with Validation */}
              <FormControl
                size="small"
                sx={{ minWidth: 120 }}
                required
                error={errors.year && !year}
              >
                <InputLabel>Year</InputLabel>
                <Select
                  value={year}
                  label="Year"
                  onChange={(e) => {
                    setYear(e.target.value);
                    setErrors((prev) => ({ ...prev, year: false }));
                  }}
                >
                  {yearOptions.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
                {errors.year && !year && (
                  <Typography variant="caption" color="error">
                    Year is required
                  </Typography>
                )}
              </FormControl>

              {/* Month Dropdown with Validation */}
              <FormControl
                size="small"
                sx={{ minWidth: 150 }}
                required
                error={errors.month && !month}
              >
                <InputLabel>Month</InputLabel>
                <Select
                  value={month}
                  label="Month"
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setErrors((prev) => ({ ...prev, month: false }));
                  }}
                >
                  {monthOptions.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && !month && (
                  <Typography variant="caption" color="error">
                    Month is required
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>

        {/* Table Section */}
        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {[
                  'Expense ID',
                  'User Name',
                  'Date',
                  'Category',
                  'Amount',
                  'Receipt',
                  'Remarks',
                  'Status',
                ].map((head) => (
                  <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(8)).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No expenses found for selected filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((exp) => (
                  <TableRow key={exp.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{exp.id}</TableCell>
                    <TableCell>{exp.userName}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell>₹{exp.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      {exp.receipt ? (
                        <Link
                          href={exp.receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="always"
                        >
                          View
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{exp.remarks}</TableCell>
                    <TableCell>
                      <StatusChip status={exp.status} />
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
