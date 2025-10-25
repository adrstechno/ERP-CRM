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
  const [recentReports, setRecentReports] = useState([]); // State for the reports table
  
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
    try {
        const [ticketsRes, productsRes] = await Promise.all([
            axios.get(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, axiosConfig),
            axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
        ]);

        if (Array.isArray(ticketsRes.data)) {
            setTicketOptions(ticketsRes.data.map(t => ({ value: t.ticketId, label: `#${t.ticketId}` })));
        }
        
        if (Array.isArray(productsRes.data)) {
            setPartsOptions(productsRes.data.map(p => ({ value: p.name, label: p.name })));
        }
    } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError(err.message);
    }
  }, [axiosConfig]);

  const fetchRecentReports = useCallback(async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/reports/engineer`, axiosConfig);
      if (response.data && Array.isArray(response.data.data)) {
        setRecentReports(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching recent reports:", err);
      setError(err.message);
    }
  }, [axiosConfig]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingData(true);
      await Promise.all([fetchInitialData(), fetchRecentReports()]);
      setIsLoadingData(false);
    };
    loadAllData();
  }, [fetchInitialData, fetchRecentReports]);


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
      await axios.post(`${VITE_API_BASE_URL}/reports/create`, formData, {
        headers: {
            ...axiosConfig.headers,
            'Content-Type': 'multipart/form-data',
        },
      });

      alert('Service report submitted successfully!');
      
      // Reset form and refresh the reports table
      setForm({ ticketId: '', partsUsed: '', address: '', additionalCharges: '', description: '' });
      setReceipt(null);
      document.getElementById('upload-receipt').value = '';
      fetchRecentReports(); // <-- Refresh the table data

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
                    sx={{ border: '1px dashed', borderRadius: 2, py: 2, px: 4 }}
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
              Recent Reports
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: '900px' }}>
                <Box display="flex" fontWeight={600} p={1} sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ flexBasis: '10%' }}>Ticket ID</Box>
                  <Box sx={{ flexBasis: '20%' }}>Date</Box>
                  <Box sx={{ flexBasis: '15%' }}>Engineer</Box>
                  <Box sx={{ flexBasis: '15%' }}>Parts Used</Box>
                  <Box sx={{ flexBasis: '15%' }}>Charges</Box>
                  <Box sx={{ flexBasis: '15%' }}>Description</Box>
                  <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>Receipt</Box>
                </Box>
                {isLoadingData ? (
                  Array.from(new Array(5)).map((_, idx) => (
                      <Skeleton key={idx} height={48} animation="wave" sx={{ my: 0.5 }} />
                  ))
                ) : (
                  recentReports.map((report) => (
                    <Box
                      key={report.reportId}
                      display="flex"
                      alignItems="center"
                      p={1}
                      sx={{ borderBottom: `1px solid ${theme.palette.divider}`, '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <Box sx={{ flexBasis: '10%', fontWeight: 600 }}>#{report.ticketId}</Box>
                      <Box sx={{ flexBasis: '20%', color: theme.palette.text.secondary }}>{dayjs(report.createdAt).format('DD MMM YYYY, h:mm A')}</Box>
                      <Box sx={{ flexBasis: '15%' }}>{report.engineerName}</Box>
                      <Box sx={{ flexBasis: '15%' }}>{report.partsUsed || 'N/A'}</Box>
                      <Box sx={{ flexBasis: '15%' }}>
  ₹{(report?.additionalCharges ?? 0).toFixed(2)}
</Box>

                      <Box sx={{ flexBasis: '15%' }}>{report.description}</Box>
                      <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>
                        {report.receiptURL ? (
                          <IconButton component="a" href={report.receiptURL} target="_blank" rel="noopener noreferrer" size="small">
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        ) : 'N/A' }
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}