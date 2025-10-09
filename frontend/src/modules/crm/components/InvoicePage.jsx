import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Toolbar,
  Divider,
} from '@mui/material'; // <-- All imports are from Material-UI
import { useTheme } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MailIcon from '@mui/icons-material/Mail';

// --- Mock Data ---
const invoiceData = {
  invoiceId: 101,
  invoiceNumber: 'INV-2025-0001',
  invoiceDate: '2025-10-08', // Set to the current date
  paymentStatus: 'UNPAID',
  totalAmount: 1650.0,
  sale: {
    saleId: 72,
    customer: {
      name: 'Innovate Tech Corp',
      address: '123 Tech Park, Silicon Valley, CA 94043',
      email: 'contact@innovatetech.com',
    },
    saleItems: [
      {
        id: 1,
        product: { name: 'Pro Software License', description: '1-year subscription' },
        quantity: 5,
        unitPrice: 300.0,
      },
      {
        id: 2,
        product: { name: 'Cloud Storage', description: '1TB annual plan' },
        quantity: 1,
        unitPrice: 100.0,
      },
      {
        id: 3,
        product: { name: 'Priority Support', description: '24/7 technical support' },
        quantity: 1,
        unitPrice: 50.0,
      },
    ],
  },
  payments: [],
};

// --- Helper Components & Functions ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const StatusChip = ({ status }) => {
  const statusConfig = {
    PAID: { label: 'Paid', color: 'success' },
    UNPAID: { label: 'Unpaid', color: 'error' },
    PARTIAL: { label: 'Partially Paid', color: 'warning' },
  };

  const config = statusConfig[status] || { label: status, color: 'default' };

  return <Chip label={config.label} color={config.color} variant="filled" />;
};


// --- The Main Invoice Component ---

export default function InvoicePage() {
  const theme = useTheme(); // Access the MUI theme

  const subtotal = invoiceData.sale.saleItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  const taxRate = 0.10;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Action Toolbar using MUI Toolbar */}
      <Toolbar disableGutters sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Invoice Details
        </Typography>
        <Box>
          <Button startIcon={<MailIcon />} sx={{ mr: 1 }}>
            Send
          </Button>
          <Button startIcon={<PrintIcon />} sx={{ mr: 1 }} variant="outlined">
            Print
          </Button>
          <Button startIcon={<DownloadIcon />} variant="contained">
            Download PDF
          </Button>
        </Box>
      </Toolbar>

      {/* Main content area using MUI Paper */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '12px',
        }}
      >
        {/* Layout managed by MUI Grid */}
        <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
          <Grid item>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Your Company Name
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Business Avenue, Katni, MP, India<br />
              your.email@company.com<br />
              +91 123-456-7890
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: 'right' }}>
            <Typography variant="h3" color="text.secondary" sx={{ letterSpacing: 2 }}>
              INVOICE
            </Typography>
            <StatusChip status={invoiceData.paymentStatus} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
          {/* ... Billed To and Invoice Info sections using Grid, Typography, and Box ... */}
        </Grid>

        {/* Data table built with MUI Table components */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.sale.saleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ... Totals and Notes sections using Box, Grid, and Typography ... */}

      </Paper>
    </Container>
  );
}