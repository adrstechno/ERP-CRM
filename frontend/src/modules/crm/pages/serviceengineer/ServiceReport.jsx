import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from "axios";
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
  CircularProgress,
  Skeleton
} from '@mui/material';
import { CloudUpload, ArrowDownward } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { VITE_API_BASE_URL } from '../../utils/State';

// --- Helper Components ---
const statusChip = (status) => {
  if (status?.toUpperCase() === 'RESOLVED' || status?.toUpperCase() === 'COMPLETED') {
    return <Chip label="Resolved" sx={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontWeight: 600 }} />;
  }
  return <Chip label="Pending" sx={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107', fontWeight: 600 }} />;
};

// --- Main Component ---
export default function ServiceReport() {
  const theme = useTheme();
  const [form, setForm] = useState({
    ticketId: '',
    partsUsed: '',
    address: '',
    additionalCharges: '',
    description: '',
  });
  const [date, setDate] = useState(dayjs());
  const [receipt, setReceipt] = useState(null);
  
  const [ticketOptions, setTicketOptions] = useState([]);
  const [partsOptions, setPartsOptions] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(() => {
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }, [token]);

  const fetchInitialData = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);
    try {
        // CORRECTED: Used axios for both calls for consistency
        const [ticketsRes, productsRes] = await Promise.all([
            axios.get(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, axiosConfig),
            axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
        ]);

        // CORRECTED: axios response body is in the .data property
        const ticketsData = ticketsRes.data;
        const productsData = productsRes.data;

        // CORRECTED: Map directly over the array from the API response
        if (Array.isArray(ticketsData)) {
            setTicketOptions(ticketsData.map(t => ({ value: t.ticketId, label: `#${t.ticketId}` })));
        } else {
            console.error("Ticket API response is not an array:", ticketsData);
        }
        
        // CORRECTED: Map directly over the array from the API response
        if (Array.isArray(productsData)) {
            setPartsOptions(productsData.map(p => ({ value: p.name, label: p.name })));
        } else {
             console.error("Products API response is not an array:", productsData);
        }
    } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message);
    } finally {
        setIsLoadingData(false);
    }
  }, [axiosConfig]); // CORRECTED: Added axiosConfig dependency

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ticketId || !receipt) {
      alert("Please select a ticket ID and upload a receipt.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('receipt', receipt);
    formData.append('ticketId', form.ticketId);
    formData.append('partsUsed', form.partsUsed);
    formData.append('additionalCharges', form.additionalCharges);
    formData.append('description', form.description);

    try {
      // Create the report
      await axios.post(`${VITE_API_BASE_URL}/reports/create`, formData, {
        headers: {
            ...axiosConfig.headers,
            'Content-Type': 'multipart/form-data',
        },

      }
    );

      // Update the status
      await axios.patch(`${VITE_API_BASE_URL}/tickets/${form.ticketId}/update?status=COMPLETED`, null, axiosConfig);

      alert('Service report submitted successfully!');
      
      setForm({ ticketId: '', partsUsed: '', address: '', additionalCharges: '', description: '' });
      setReceipt(null);
      document.getElementById('upload-receipt').value = '';

    } catch (err) {
      console.error("Submission failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: '100vh' }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Service Report
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Create and submit a new service report for a ticket.
        </Typography>
        <Box display="flex" gap={3} mb={6}>
          {/* Left Form */}
          <Card sx={{ flex: 2, background: theme.palette.background.paper, borderRadius: 2 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  select
                  label="Ticket id"
                  value={form.ticketId}
                  onChange={handleChange('ticketId')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '1/2' }}
                  disabled={isLoadingData}
                  required
                >
                  {isLoadingData ? <MenuItem disabled>Loading...</MenuItem> :
                   ticketOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Parts used"
                  value={form.partsUsed}
                  onChange={handleChange('partsUsed')}
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '2/3' }}
                  disabled={isLoadingData}
                >
                   {isLoadingData ? <MenuItem disabled>Loading...</MenuItem> :
                    partsOptions.map((opt) => (
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
                  value={form.additionalCharges}
                  onChange={handleChange('additionalCharges')}
                  type="number"
                  fullWidth
                  size="small"
                  sx={{ gridColumn: '1/3' }}
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
          {/* Right Upload & Submit */}
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
                      border: '1px dashed', borderRadius: 2, py: 2, px: 4,
                    }}
                  >
                    Upload Receipt
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" mt={1} display="block" noWrap>
                  {receipt ? receipt.name : 'No file selected'}
                </Typography>
              </CardContent>
            </Card>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: '100%', py: 1.5, borderRadius: 3, fontWeight: 700 }}
              onClick={handleSubmit}
              disabled={isSubmitting || isLoadingData}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
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
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
            <Box sx={{ overflow: 'auto', minWidth: '900px' }}>
              <Box display="flex" fontWeight={600} p={1} sx={{ color: theme.palette.text.secondary }}>
                <Box sx={{ flexBasis: '12%' }}>Ticket id</Box>
                <Box sx={{ flexBasis: '16%' }}>DATE</Box>
                <Box sx={{ flexBasis: '18%' }}>CUSTOMER</Box>
                <Box sx={{ flexBasis: '12%' }}>STATUS</Box>
                <Box sx={{ flexBasis: '14%' }}>PARTS USED</Box>
                <Box sx={{ flexBasis: '18%' }}>PRODUCT</Box>
                <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>DOWNLOAD</Box>
              </Box>
              {isLoadingData ? (
                Array.from(new Array(5)).map((_, idx) => (
                    <Skeleton key={idx} height={40} animation="wave" sx={{ my: 1 }} />
                ))
              ) : (
                recentServices.map((row, idx) => (
                  <Box
                    key={idx}
                    display="flex"
                    alignItems="center"
                    p={1}
                    sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                  >
                    <Box sx={{ flexBasis: '12%', fontWeight: 600 }}>{row.id}</Box>
                    <Box sx={{ flexBasis: '16%', color: theme.palette.text.secondary }}>{row.date}</Box>
                    <Box sx={{ flexBasis: '18%' }}>{row.customer}</Box>
                    <Box sx={{ flexBasis: '12%' }}>{statusChip(row.status)}</Box>
                    <Box sx={{ flexBasis: '14%' }}>{row.parts}</Box>
                    <Box sx={{ flexBasis: '18%' }}>{row.product}</Box>
                    <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>
                      <IconButton><ArrowDownward sx={{ color: theme.palette.text.secondary }} /></IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}