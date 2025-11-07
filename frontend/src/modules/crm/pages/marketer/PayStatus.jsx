import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Stack, Chip, Button, Skeleton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, CircularProgress,
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VITE_API_BASE_URL } from '../../utils/State';

// --- Helper Component for Status ---
const StatusChip = React.memo(({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  const color =
    normalizedStatus === 'paid'
      ? 'success'
      : normalizedStatus === 'unpaid'
      ? 'warning'
      : normalizedStatus === 'partially_paid'
      ? 'info'
      : 'default';

  return (
    <Chip
      label={status.replace('_', ' ')}
      size="small"
      variant="outlined"
      color={color}
      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
    />
  );
});

export default function PayStatus() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    referenceNo: '',
    paymentDate: dayjs(),
    notes: '',
    proofFile: null,
  });

  const token = localStorage.getItem('authKey');
  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // ---------------- FETCH INVOICES ----------------
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/invoices/get-all`, axiosConfig);
      const formatted = res.data
        .map((item) => ({
          id: item.invoiceId,
          invoiceNo: item.invoiceNumber,
          date: item.invoiceDate,
          customerName: item.sale.customerName,
          amount: item.outstandingAmount || 0,
          status: item.paymentStatus,
          hasPendingPayment: item.payments?.some((p) => p.status === 'PENDING') || false, // <-- Add this flag
        }))
        .sort((a, b) => b.id - a.id);
      setInvoices(formatted);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // ---------------- VALIDATION ----------------
  const validatePaymentForm = (form, selectedInvoice) => {
    const errors = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = 'Enter a valid amount greater than 0';
    } else if (selectedInvoice && Number(form.amount) > selectedInvoice.amount) {
      errors.amount = `Amount cannot exceed remaining balance (₹${selectedInvoice.amount.toLocaleString('en-IN')})`;
    }
    if (!form.paymentMethod?.trim()) {
      errors.paymentMethod = 'Payment method is required';
    }
    if (!form.referenceNo?.trim()) {
      errors.referenceNo = 'Reference ID is required';
    }
    if (!form.paymentDate || !form.paymentDate.isValid()) {
      errors.paymentDate = 'Payment date is required';
    }
    if (!form.proofFile) {
      errors.proofFile = 'Proof of payment is required';
    }
    return errors;
  };

  // ---------------- HANDLERS ----------------
  const handleOpenDialog = (invoice) => {
    // If a pending payment exists, block immediately
    if (invoice.hasPendingPayment) {
      toast.error('A payment for this invoice is already pending approval. Please wait for admin verification.');
      return;
    }

    setSelectedInvoice(invoice);
    setPaymentForm((prev) => ({
      ...prev,
      amount: invoice.amount,
      paymentDate: dayjs(),
    }));
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormErrors({});
    setSelectedInvoice(null);
    setIsDialogOpen(false);
    setPaymentForm({
      amount: '',
      paymentMethod: 'UPI',
      referenceNo: '',
      paymentDate: dayjs(),
      notes: '',
      proofFile: null,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPaymentForm((prev) => ({ ...prev, proofFile: e.target.files[0] }));
  };

  // ---------------- SUBMIT PAYMENT ----------------
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) {
      toast.error('No invoice selected.');
      return;
    }

    const errors = validatePaymentForm(paymentForm, selectedInvoice);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('invoiceId', selectedInvoice.id);
      formData.append('amount', paymentForm.amount);
      formData.append('paymentMethod', paymentForm.paymentMethod.trim());
      formData.append('referenceNo', paymentForm.referenceNo.trim());
      formData.append('paymentDate', paymentForm.paymentDate.format('YYYY-MM-DD'));
      formData.append('notes', paymentForm.notes.trim());
      formData.append('proofFile', paymentForm.proofFile);

      const res = await axios.post(`${VITE_API_BASE_URL}/payments/add-payment`, formData, {
        headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Payment recorded successfully!');
        handleCloseDialog();
        fetchInvoices();
      } else {
        throw new Error(res.data.message || 'Payment failed.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.includes('pending approval')) {
        toast.error('A payment for this invoice is already pending approval. Wait for admin review.');
      } else {
        toast.error(`Payment failed: ${message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- UI RENDER ----------------
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <PaymentsIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Pay Status</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Summary of all customer invoices and their payment statuses.
            </Typography>
          </CardContent>

          <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  {['Invoice No', 'Date', 'Customer', 'Remaining Amount', 'Status', 'Action'].map((head) => (
                    <TableCell key={head}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton animation="wave" /></TableCell>
                    </TableRow>
                  ))
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No invoices found.</TableCell>
                  </TableRow>
                ) : (
                  invoices.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: '600' }}>{row.invoiceNo}</TableCell>
                      <TableCell>{dayjs(row.date).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>₹{row.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                      <TableCell>
                        {(row.status.toLowerCase() === 'unpaid' || row.status.toLowerCase() === 'partially_paid') && (
                          <Button
                            variant="contained"
                            size="small"
                            disabled={row.hasPendingPayment} // 👈 disable if pending exists
                            onClick={() => handleOpenDialog(row)}
                          >
                            {row.hasPendingPayment ? 'Pending Approval' : 'Make Payment'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Record Payment for <strong>{selectedInvoice?.invoiceNo}</strong>
          </DialogTitle>
          <DialogContent>
            <Box component="form" id="payment-form" onSubmit={handleSubmitPayment} sx={{ mt: 2 }}>
              <Stack spacing={2.5}>
                <TextField
                  required
                  name="amount"
                  label="Amount (₹)"
                  type="number"
                  value={paymentForm.amount}
                  onChange={handleFormChange}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                />
                <DatePicker
                  label="Payment Date"
                  value={paymentForm.paymentDate}
                  onChange={(newValue) => setPaymentForm((prev) => ({ ...prev, paymentDate: newValue }))}
                />
                <TextField
                  required
                  name="paymentMethod"
                  label="Payment Method"
                  value={paymentForm.paymentMethod}
                  onChange={handleFormChange}
                  error={!!formErrors.paymentMethod}
                  helperText={formErrors.paymentMethod}
                />
                <TextField
                  required
                  name="referenceNo"
                  label="Transaction / Reference ID"
                  value={paymentForm.referenceNo}
                  onChange={handleFormChange}
                  error={!!formErrors.referenceNo}
                  helperText={formErrors.referenceNo}
                />
                <TextField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={2}
                  value={paymentForm.notes}
                  onChange={handleFormChange}
                  error={!!formErrors.notes}
                  helperText={formErrors.notes}
                />
                <Button component="label" variant="outlined" color={formErrors.proofFile ? 'error' : 'primary'}>
                  {paymentForm.proofFile ? 'Change File' : 'Upload Proof'}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {formErrors.proofFile && (
                  <Typography variant="caption" color="error">{formErrors.proofFile}</Typography>
                )}
                {paymentForm.proofFile && (
                  <Typography variant="body2" color="text.secondary">{paymentForm.proofFile.name}</Typography>
                )}
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" form="payment-form" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Payment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
