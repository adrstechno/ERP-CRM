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
  FileDownloadOutlined,
  UnfoldMore,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- DATA ---
const ordersData = [
  { id: '#1532', date: 'Dec 30, 10:06 AM', customer: 'Lal Singh Chaddha', status: 'Paid', total: '$ 329.60' },
  { id: '#1531', date: 'Dec 29, 2:39 AM', customer: 'Lal Singh Chaddha', status: 'Pending', total: '$ 87.24' },
  { id: '#1530', date: 'Dec 29, 12:54 AM', customer: 'Lal Singh Chaddha', status: 'Pending', total: '$ 52.16' },
  { id: '#1529', date: 'Dec 28, 3:32 PM', customer: 'Lal Singh Chaddha', status: 'Paid', total: '$ 350.12' },
  { id: '#1528', date: 'Dec 27, 2:20 PM', customer: 'Lal Singh Chaddha', status: 'Pending', total: '$ 246.78' },
  { id: '#1527', date: 'Dec 26, 9:48 AM', customer: 'Lal Singh Chaddha', status: 'Paid', total: '$ 64.00' },
];

// Status chip with theme aware colors
const getStatusChip = (status, theme) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
  };

  switch (status.toLowerCase()) {
    case 'paid':
      return (
        <Box
          sx={{
            ...styles,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
          }}
        >
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', mr: 1 }} />
          Paid
        </Box>
      );
    case 'pending':
      return (
        <Box
          sx={{
            ...styles,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(234, 179, 8, 0.1)',
            color: '#EAB308',
          }}
        >
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EAB308', mr: 1 }} />
          Pending
        </Box>
      );
    default:
      return null;
  }
};

export default function MySalesPage() {
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
            Recent orders
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

        {/* Orders Table */}
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
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Order id</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '20%' }}>
                Date <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
              </Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '25%' }}>Customer Name</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>
                Status <UnfoldMore sx={{ fontSize: '1rem', ml: 0.5 }} />
              </Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '15%' }}>Total</Typography>
              <Typography sx={{ ...headerTextStyle, flexBasis: '10%', justifyContent: 'center' }}>
                DOWNLOAD INVOICE
              </Typography>
            </Box>

            {/* Table Body */}
            <Box>
              {ordersData.map((order, index) => (
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
                  <Typography sx={{ flexBasis: '15%', fontWeight: 'bold' }}>{order.id}</Typography>
                  <Typography sx={{ flexBasis: '20%', color: theme.palette.text.secondary }}>{order.date}</Typography>
                  <Typography sx={{ flexBasis: '25%' }}>{order.customer}</Typography>
                  <Box sx={{ flexBasis: '15%' }}>{getStatusChip(order.status, theme)}</Box>
                  <Typography sx={{ flexBasis: '15%', fontWeight: 'bold' }}>{order.total}</Typography>
                  <Box sx={{ flexBasis: '10%', display: 'flex', justifyContent: 'center' }}>
                    <IconButton sx={{ color: theme.palette.text.secondary }}>
                      <FileDownloadOutlined />
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
