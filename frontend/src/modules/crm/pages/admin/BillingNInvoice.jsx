import { useState, useEffect, useMemo, useCallback } from "react";
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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Link,
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

// This will be replaced with actual payment data

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
  const [paymentCollectionData, setPaymentCollectionData] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [billingStats, setBillingStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });
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
      
      // Calculate billing statistics
      const stats = {
        totalInvoices: formattedData.length,
        totalAmount: formattedData.reduce((sum, inv) => sum + inv.amount, 0),
        paidAmount: formattedData
          .filter(inv => inv.status?.toLowerCase() === 'paid' || inv.status?.toLowerCase() === 'approved')
          .reduce((sum, inv) => sum + inv.amount, 0),
        pendingAmount: formattedData
          .filter(inv => inv.status?.toLowerCase() === 'unpaid' || inv.status?.toLowerCase() === 'pending')
          .reduce((sum, inv) => sum + inv.amount, 0),
      };
      setBillingStats(stats);
    } catch (error) {
      toast.error(error.message);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  // --- Fetch Payment Collection Data for Chart ---
  const fetchPaymentCollectionData = useCallback(async () => {
    setIsChartLoading(true);
    try {
      // Use the new monthly payment collection API
      const response = await fetch(
        `${VITE_API_BASE_URL}/payments/monthly-collection`,
        { headers: axiosConfig.headers }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch payment collection data");
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data || result.data.length === 0) {
        // Generate empty data for last 12 months if no payments exist
        const emptyData = Array.from({ length: 12 }, (_, i) => ({
          month: dayjs().subtract(11 - i, 'month').format("MMM YYYY"),
          collection: 0,
        }));
        setPaymentCollectionData(emptyData);
        toast.info("No payment collection data available yet");
      } else {
        // Process the actual payment data from the new API
        const processedData = result.data.map(item => ({
          month: dayjs(item.month, 'YYYY-MM').format("MMM YYYY"),
          collection: item.totalAmount || 0,
        }));
        setPaymentCollectionData(processedData);
      }
    } catch (error) {
      console.error("Payment collection fetch error:", error);
      // Generate empty data as fallback
      const emptyData = Array.from({ length: 12 }, (_, i) => ({
        month: dayjs().subtract(11 - i, 'month').format("MMM YYYY"),
        collection: 0,
      }));
      setPaymentCollectionData(emptyData);
      toast.error("Failed to load payment collection data");
    } finally {
      setIsChartLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchInvoices();
    fetchPaymentCollectionData();
  }, [fetchInvoices, fetchPaymentCollectionData]);

  // --- Dialog Handlers ---
  const handleOpenPaymentsDialog = async (invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
    setIsPaymentsLoading(true);
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/payments/${invoice.id}`,
        { headers: axiosConfig.headers }
      );
      if (!response.ok) throw new Error("Failed to fetch payment details.");
      const data = await response.json();
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setPayments([]);
        toast.info(`No payments found for Invoice #${invoice.invoiceNo}`);
      } else {
        setPayments(Array.isArray(data) ? data : []);
      }
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
      fetchPaymentCollectionData(); // Refresh the chart data
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Reject Payment Handler ---
  const handleRejectPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/payments/${paymentId}/status?status=REJECTED`,
        {
          method: "PATCH",
          headers: axiosConfig.headers,
        }
      );
      if (!response.ok) throw new Error("Failed to reject payment.");
      
      const result = await response.json();
      toast.success(result.message || "Payment rejected successfully!");
      handleClosePaymentsDialog();
      fetchInvoices(); // Refresh the main invoice table
      fetchPaymentCollectionData(); // Refresh the chart data
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownload = (saleId) => {
    navigate(`/crm/invoice/${saleId}`);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        {/* Billing Statistics KPI Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {billingStats.totalInvoices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Invoices
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                ₹{billingStats.totalAmount.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ₹{billingStats.paidAmount.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paid Amount
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                ₹{billingStats.pendingAmount.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Amount
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Payment Collection Chart Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Monthly Payment Collection</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 300 }}>
              {isChartLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading payment data...</Typography>
                </Box>
              ) : paymentCollectionData.length > 0 && paymentCollectionData.some(item => item.collection > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentCollectionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme.palette.text.secondary} 
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary} 
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                    <Bar 
                      dataKey="collection" 
                      fill={theme.palette.primary.main} 
                      radius={[4, 4, 0, 0]}
                      name="Payment Collection"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No Payment Data Available
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Payment collection chart will appear here once payments are received and approved.
                  </Typography>
                </Box>
              )}
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
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApprovePayment(p.paymentId)}
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRejectPayment(p.paymentId)}
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Payment Records Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No payments have been made for Invoice #{selectedInvoice?.invoiceNo} yet.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}