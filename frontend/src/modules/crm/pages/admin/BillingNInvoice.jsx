import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Link, // 👈 Import Link component
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// --- Mock Data (assuming this stays for the chart) ---
const gstCollectionData = Array.from({ length: 12 }, (_, i) => ({
  month: dayjs().month(i).format("MMM"),
  collection: Math.floor(Math.random() * 40000) + 10000,
}));

// --- Helper Components ---
const getStatusChip = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : "";
  let color;
  if (normalizedStatus === "paid" || normalizedStatus === "approved")
    color = "success";
  else if (normalizedStatus === "unpaid" || normalizedStatus === "pending")
    color = "warning";
  else color = "default";
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 500, textTransform: "capitalize" }}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color: "primary.main", fontWeight: "bold" }}>
          {`Collection: ₹${payload[0].value.toLocaleString("en-IN")}`}
        </Typography>
      </Card>
    );
  }
  return null;
};

// --- Main Component ---
export default function BillingAndInvoice() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("authKey");

  // --- State for Payment Dialog ---
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // --- Fetch All Invoices ---
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/invoices/get-all`,
        { headers: axiosConfig.headers } // Pass headers correctly
      );
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      const formattedData = data.map((item) => ({
        id: item.invoiceId,
        invoiceNo: item.invoiceNumber,
        date: new Date(item.invoiceDate).toLocaleDateString("en-GB"),
        customerName: item.sale.customerName,
        saleId: item.sale.saleId,
        amount: item.totalAmount,
        status: item.paymentStatus,
      }));
      setInvoices(formattedData);
    } catch (error) {
      toast.error(error.message);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // --- Dialog Handlers ---
  const handleOpenPaymentsDialog = async (invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
    setIsPaymentsLoading(true);
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/payments/${invoice.id}`,
        { headers: axiosConfig.headers } // Pass headers correctly
      );
      if (!response.ok) throw new Error("Failed to fetch payment details.");
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
      setPayments([]);
    } finally {
      setIsPaymentsLoading(false);
    }
  };

  const handleClosePaymentsDialog = () => {
    setIsPaymentDialogOpen(false);
    setSelectedInvoice(null);
    setPayments([]);
  };

  // --- Approve Payment Handler ---
  const handleApprovePayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/payments/${paymentId}/status?status=APPROVED`,
        {
          method: "PATCH",
          headers: axiosConfig.headers,
        }
      );
      if (!response.ok) throw new Error("Failed to approve payment.");
      
      const result = await response.json();
      toast.success(result.message || "Payment approved successfully!");
      handleClosePaymentsDialog();
      fetchInvoices(); // Refresh the main invoice table
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownload = (saleId) => {
    navigate(`/crm/invoice/${saleId}`);
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Payment Collection Chart Card - This part remains unchanged */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>GST Payment Collection</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gstCollectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                  <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                  <Bar dataKey="collection" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Invoices Table Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Invoices
            </Typography>
            <TableContainer sx={{ maxHeight: "calc(100vh - 450px)", overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[ "Invoice No", "Date", "Customer Name", "Sale ID", "Amount", "Status", "Action" ].map((head) => (
                      <TableCell key={head} sx={{ whiteSpace: "nowrap" }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array.from(new Array(5)).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={7}> <Skeleton animation="wave" /> </TableCell>
                        </TableRow>
                      ))
                    : invoices.map((invoice) => (
                        <TableRow key={invoice.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}> {invoice.invoiceNo} </TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell>{invoice.saleId}</TableCell>
                          <TableCell> ₹{invoice.amount.toLocaleString("en-IN")} </TableCell>
                          <TableCell>{getStatusChip(invoice.status)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button variant="outlined" size="small" onClick={() => handleOpenPaymentsDialog(invoice)}>
                                View Payments
                              </Button>
                              <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={() => handleDownload(invoice.saleId)}>
                                PDF
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Payment Details Dialog */}
      <Dialog open={isPaymentDialogOpen} onClose={handleClosePaymentsDialog} fullWidth maxWidth="md">
        <DialogTitle>
          Payment Details for Invoice #{selectedInvoice?.invoiceNo}
        </DialogTitle>
        <DialogContent>
          {isPaymentsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : payments.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {/* 👇 Updated table header */}
                    {["Date", "Amount", "Method", "Ref No", "Proof", "Status", "Action"].map(h => <TableCell key={h}>{h}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.paymentId}>
                      <TableCell>{dayjs(p.paymentDate).format("DD MMM YYYY")}</TableCell>
                      <TableCell>₹{p.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{p.paymentMethod}</TableCell>
                      <TableCell>{p.referenceNo || 'N/A'}</TableCell>
                      {/* 👇 New cell for viewing proof */}
                      <TableCell>
                        {p.proofUrl ? (
                          <Link href={p.proofUrl} target="_blank" rel="noopener noreferrer" underline="always">
                            View
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{getStatusChip(p.status)}</TableCell>
                      <TableCell>
                        {p.status.toLowerCase() === 'pending' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprovePayment(p.paymentId)}
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ my: 4, textAlign: 'center' }}>No payment records found for this invoice.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}