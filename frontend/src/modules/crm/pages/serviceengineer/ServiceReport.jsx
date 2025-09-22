import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { CloudUpload, ArrowDownward } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- Mock Data ---
const ticketOptions = [
  { value: '#1532', label: '#1532' },
  { value: '#1531', label: '#1531' },
  { value: '#1530', label: '#1530' },
  { value: '#1529', label: '#1529' },
  { value: '#1528', label: '#1528' },
  { value: '#1527', label: '#1527' },
];

const partsOptions = [
  { value: 'Wire', label: 'Wire' },
  { value: 'Compressor', label: 'Compressor' },
  { value: 'Fan', label: 'Fan' },
];

const recentServices = [
  {
    id: '#1532',
    date: 'Dec 30, 10:06 AM',
    customer: 'Lal Singh Chaddha',
    status: 'Resolved',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
  {
    id: '#1531',
    date: 'Dec 29, 2:59 AM',
    customer: 'Lal Singh Chaddha',
    status: 'Pending',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
  {
    id: '#1530',
    date: 'Dec 29, 12:54 AM',
    customer: 'Lal Singh Chaddha',
    status: 'Pending',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
  {
    id: '#1529',
    date: 'Dec 28, 3:32 PM',
    customer: 'Lal Singh Chaddha',
    status: 'Resolved',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
  {
    id: '#1528',
    date: 'Dec 27, 2:20 PM',
    customer: 'Lal Singh Chaddha',
    status: 'Pending',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
  {
    id: '#1527',
    date: 'Dec 26, 9:48 AM',
    customer: 'Lal Singh Chaddha',
    status: 'Resolved',
    parts: 'Wire',
    product: '1.5 Ton 5 Star Inverter AC',
  },
];

const statusChip = (status) => {
  if (status === 'Resolved') {
    return <Chip label="Resolved" sx={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontWeight: 600 }} />;
  }
  return <Chip label="Pending" sx={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107', fontWeight: 600 }} />;
};

export default function ServiceReport() {
  const theme = useTheme();
  const [form, setForm] = useState({
    ticket: '',
    parts: '',
    address: '',
    charges: '',
    status: '',
    description: '',
    date: dayjs(),
  });
  const [receipt, setReceipt] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: '100vh' }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Service Report
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </Typography>
        <Box display="flex" gap={3} mb={6}>
          {/* Left Form */}
          <Card sx={{ flex: 2, background: theme.palette.background.paper, borderRadius: 2 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  select
                  label="Ticket id"
                  value={form.ticket}
                  onChange={handleChange('ticket')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '1/2' }}
                >
                  {ticketOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Parts used"
                  value={form.parts}
                  onChange={handleChange('parts')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '2/3' }}
                >
                  {partsOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={handleChange('address')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '1/3' }}
                />
                <TextField
                  label="Additional charges"
                  value={form.charges}
                  onChange={handleChange('charges')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '1/2' }}
                />
                <TextField
                  label="Status"
                  value={form.status}
                  onChange={handleChange('status')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '2/3' }}
                />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={handleChange('description')}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  sx={{ gridColumn: '1/3' }}
                />
              </Box>
            </CardContent>
          </Card>
          {/* Right Upload */}
          <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
            <Card sx={{ width: '100%', background: theme.palette.background.paper, borderRadius: 2, mb: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="upload-receipt"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-receipt">
                  <Button
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      background: 'none',
                      color: theme.palette.text.secondary,
                      border: '1px dashed',
                      borderRadius: 2,
                      py: 2,
                      px: 4,
                      fontWeight: 600,
                    }}
                  >
                    Upload Receipt
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  {receipt ? receipt.name : 'Upload Receipt'}
                </Typography>
              </CardContent>
            </Card>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: '100%',
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(90deg,#434343 0%,#000000 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 2,
              }}
              onClick={handleSubmit}
            >
              submit
            </Button>
          </Box>
        </Box>
        {/* Recent Services Table */}
        <Card sx={{ background: theme.palette.background.paper, borderRadius: 2, mt: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent services
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <DatePicker
                value={form.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 1,
                      width: 140,
                      input: { color: theme.palette.text.primary },
                      svg: { color: theme.palette.text.secondary },
                    },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                maxHeight: 320,
                overflow: 'auto',
                minWidth: '900px',
              }}
            >
              <Box display="flex" fontWeight={600} p={1} sx={{ color: theme.palette.text.secondary }}>
                <Box sx={{ flexBasis: '12%' }}>Ticket id</Box>
                <Box sx={{ flexBasis: '16%' }}>DATE</Box>
                <Box sx={{ flexBasis: '18%' }}>CUSTOMER</Box>
                <Box sx={{ flexBasis: '12%' }}>STATUS</Box>
                <Box sx={{ flexBasis: '14%' }}>PARTS USED</Box>
                <Box sx={{ flexBasis: '18%' }}>PRODUCT</Box>
                <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>DOWNLOAD TICKET</Box>
              </Box>
              {recentServices.map((row, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  p={1}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.95rem',
                  }}
                >
                  <Box sx={{ flexBasis: '12%', fontWeight: 600 }}>{row.id}</Box>
                  <Box sx={{ flexBasis: '16%', color: theme.palette.text.secondary }}>{row.date}</Box>
                  <Box sx={{ flexBasis: '18%' }}>{row.customer}</Box>
                  <Box sx={{ flexBasis: '12%' }}>{statusChip(row.status)}</Box>
                  <Box sx={{ flexBasis: '14%' }}>{row.parts}</Box>
                  <Box sx={{ flexBasis: '18%' }}>{row.product}</Box>
                  <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>
                    <IconButton>
                      <ArrowDownward sx={{ color: theme.palette.text.secondary }} />
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