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
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';

// --- Helper Component ---
const StatusChip = React.memo(({ status }) => {
    const normalizedStatus = status ? status.toLowerCase() : '';
    let color;
    if (normalizedStatus === 'paid') {
        color = 'success';
    } else if (normalizedStatus === 'unpaid') {
        color = 'warning';
    } else if (normalizedStatus === 'partially_paid') {
        color = 'info';
    } else {
        color = 'default';
    }

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

// --- Main Component ---
export default function PayStatus() {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        paymentMethod: 'UPI',
        referenceNo: '',
        paymentDate: dayjs(),
        notes: '',
        proofFile: null,
    });

    const [errors, setErrors] = useState({});

    const token = localStorage.getItem("authKey");
    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${VITE_API_BASE_URL}/invoices/get-all`, axiosConfig);
            const formattedData = response.data.map((item) => ({
                id: item.invoiceId,
                invoiceNo: item.invoiceNumber,
                date: item.invoiceDate,
                customerName: item.sale.customerName,
                amount: item.outstandingAmount || 0,
                status: item.paymentStatus,
            }));
            setInvoices(formattedData);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
            toast.error("Could not fetch invoices.");
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleOpenDialog = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentForm(prev => ({ ...prev, amount: invoice.amount }));
        setErrors({});
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedInvoice(null);
        setPaymentForm({
            amount: '', paymentMethod: 'UPI', referenceNo: '',
            paymentDate: dayjs(), notes: '', proofFile: null,
        });
        setErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        setPaymentForm(prev => ({ ...prev, proofFile: e.target.files[0] }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!paymentForm.amount || Number(paymentForm.amount) <= 0)
            tempErrors.amount = "Amount is required and must be greater than 0.";
        if (!paymentForm.paymentMethod.trim())
            tempErrors.paymentMethod = "Payment method is required.";
        if (!paymentForm.paymentDate)
            tempErrors.paymentDate = "Payment date is required.";
        if (paymentForm.proofFile && paymentForm.proofFile.size > 5 * 1024 * 1024)
            tempErrors.proofFile = "File size must be less than 5MB.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        if (!selectedInvoice) {
            toast.error("No invoice selected.");
            return;
        }

        if (!validateForm()) {
            toast.error("Please fix form errors before submitting.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('invoiceId', selectedInvoice.id);
        formData.append('amount', paymentForm.amount);
        formData.append('paymentMethod', paymentForm.paymentMethod);
        formData.append('referenceNo', paymentForm.referenceNo);
        formData.append('paymentDate', paymentForm.paymentDate.format('YYYY-MM-DD'));
        formData.append('notes', paymentForm.notes);
        if (paymentForm.proofFile) {
            formData.append('proofFile', paymentForm.proofFile);
        }

        try {
            const response = await axios.post(
                `${VITE_API_BASE_URL}/payments/add-payment`,
                formData,
                { headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                handleCloseDialog();
                fetchInvoices();
            } else {
                throw new Error(response.data.message || "An unknown error occurred.");
            }

        } catch (error) {
            console.error("Payment submission error:", error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(`Payment failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                    {['Invoice No', 'Date', 'Customer', 'Remaining Amount', 'Status', 'Action'].map(head => (
                                        <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    Array.from(new Array(6)).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={6}><Skeleton animation="wave" /></TableCell>
                                        </TableRow>
                                    ))
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
                                                        onClick={() => handleOpenDialog(row)}
                                                    >
                                                        Make Payment
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

                {/* --- Payment Dialog --- */}
                <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Record Payment for {selectedInvoice?.invoiceNo}</DialogTitle>
                    <DialogContent>
                        <Box component="form" id="payment-form" onSubmit={handleSubmitPayment} sx={{ mt: 2 }}>
                            <Stack spacing={2.5}>
                                <TextField
                                    required
                                    name="amount"
                                    label="Amount"
                                    type="number"
                                    value={paymentForm.amount}
                                    onChange={handleFormChange}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
                                />
                                <DatePicker
                                    label="Payment Date"
                                    value={paymentForm.paymentDate}
                                    onChange={(newValue) => setPaymentForm(prev => ({ ...prev, paymentDate: newValue }))}
                                />
                                <TextField
                                    required
                                    name="paymentMethod"
                                    label="Payment Method"
                                    value={paymentForm.paymentMethod}
                                    onChange={handleFormChange}
                                    error={!!errors.paymentMethod}
                                    helperText={errors.paymentMethod}
                                />
                                <TextField
                                    name="referenceNo"
                                    label="Reference No (e.g., Transaction ID)"
                                    value={paymentForm.referenceNo}
                                    onChange={handleFormChange}
                                />
                                <TextField
                                    name="notes"
                                    label="Notes"
                                    multiline
                                    rows={2}
                                    value={paymentForm.notes}
                                    onChange={handleFormChange}
                                />
                                <Button component="label" variant="outlined">
                                    Upload Proof
                                    <input type="file" hidden onChange={handleFileChange} />
                                </Button>
                                {paymentForm.proofFile && (
                                    <Typography variant="body2" color={errors.proofFile ? "error" : "text.secondary"}>
                                        {errors.proofFile || paymentForm.proofFile.name}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
                        <Button
                            type="submit"
                            form="payment-form"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Payment'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}
