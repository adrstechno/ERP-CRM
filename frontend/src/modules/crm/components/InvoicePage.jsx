import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { VITE_API_BASE_URL } from "../utils/State";

const InvoicePage = () => {
  const { saleId } = useParams();
  const invoiceRef = useRef();

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch invoice data
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem("authKey");

        const response = await axios.get(
          `${VITE_API_BASE_URL}/invoices/${saleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInvoiceData(response.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [saleId]);

  // ✅ Handle Download
  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("authKey");

      const response = await axios.get(
        `${VITE_API_BASE_URL}/invoices/${saleId}/download`, // ✅ download endpoint (adjust if different)
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${saleId}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice or unauthorized!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading invoice...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error}
      </Alert>
    );
  }

  if (!invoiceData) return null;

  // ✅ Destructure invoice data
  const {
    // invoiceId,
    invoiceDate,
    invoiceNumber,
    paymentStatus,
    totalAmount,
    outstandingAmount,
    sale,
  } = invoiceData;

  return (
    <Box sx={{ p: 2, backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleDownloadPDF}>
          Download Invoice
        </Button>
      </Box>

      <Paper
        ref={invoiceRef}
        sx={{
          p: 4,
          maxWidth: 1000,
          mx: "auto",
          backgroundColor: "#fffff",
          color: "#000",
          boxShadow: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
            <Typography variant="h6">JK Power</Typography>
            <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold">
              INVOICE
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontWeight="bold">{invoiceNumber}</Typography>
            <Typography>Date: {invoiceDate}</Typography>
            <Typography>Status: {paymentStatus}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Customer / Sale Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Customer Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                p: 2,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              {[
                { label: "Name", value: sale.customerName },
                { label: "Created By", value: sale.createdBy },
                { label: "Sale Date", value: sale.saleDate },
                { label: "Status", value: sale.saleStatus },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px",
                    borderRadius: 1,
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ color: "#555" }}
                  >
                    {item.label}:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#222" }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Items Table */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Items
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                {["Product Name", "Quantity", "Unit Price", "Total"].map(
                  (head) => (
                    <TableCell key={head} sx={{ fontWeight: "bold" }}>
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sale.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    ₹{(item.quantity * item.unitPrice).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography>Total Amount: ₹{totalAmount.toLocaleString()}</Typography>

          <Divider sx={{ my: 1 }} />
          <Typography fontWeight="bold">
            Balance Due: ₹{outstandingAmount.toLocaleString()}
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold">
            <Typography fontWeight="bold"> {sale.approvedBy}</Typography>—
            Administrator
          </Typography>
          <Typography fontStyle="italic">
            Thank you for your business!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoicePage;
