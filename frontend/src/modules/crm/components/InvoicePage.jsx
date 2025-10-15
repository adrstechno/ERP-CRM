import React, { useEffect, useState, useRef } from "react";
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
  const invoiceRef = useRef(); // ref for printing

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoice data
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

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload page to restore state
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

  const {
    invoiceDate,
    invoiceNumber,
    paymentStatus,
    totalAmount,
    outstandingAmount,
    sale,
  } = invoiceData;

  return (
    <Box >
      {/* Print Button */}
      <Box sx={{ textAlign: "right", mb: 2 ,mt:2 , mr:2 }}>
        <Button variant="contained" onClick={handlePrint}>
          Print Invoice
        </Button>
      </Box>

      {/* Invoice Content */}
      <Box
        ref={invoiceRef} // wrap invoice content
        sx={{
        
          p:4,
          backgroundColor: "#f6f7f8",
          minHeight: "100vh",
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
            <Typography
              variant="h6"
              sx={{ mt: 1, fontWeight: 600, color: "#2c3e50" }}
            >
              JK Power
            </Typography>
            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
              Madan Mahal, Jabalpur
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                letterSpacing: "1px",
                color: "#2c3e50",
                borderBottom: "1px solid black", // separate property
                display: "inline-block", // ensures border is only under the text
                pb: 0.5, // optional: small padding below text
              }}
            >
              INVOICE
            </Typography>
          </Box>
          <Box textAlign="right" sx={{ color: "#2c3e50" }}>
            <Typography fontWeight="bold">{invoiceNumber}</Typography>
            <Typography>Date: {invoiceDate}</Typography>
            <Typography>Status: {paymentStatus}</Typography>
          </Box>
        </Box>

        {/* Customer Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 1, color: "#2c3e50" }}
          >
            Customer Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
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
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "#7f8c8d" }}
                >
                  {item.label}:
                </Typography>
                <Typography variant="body2" sx={{ color: "#2c3e50" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Items Table */}
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 600, color: "#2c3e50" }}
        >
          Items
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0" }}
        >
          <Table
            size="small"
            sx={{ borderCollapse: "collapse", width: "100%" }}
          >
            <TableHead>
              <TableRow>
                {["Product Name", "Quantity", "Unit Price", "Total"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      sx={{
                        fontWeight: "bold",
                        color: "#34495e",
                        fontSize: "0.9rem",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#f1f2f6",
                        textAlign: "center",
                      }}
                    >
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sale.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      color: "#2c3e50",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    {item.productName}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#2c3e50",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#2c3e50",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    ₹{item.unitPrice.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#2c3e50",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    ₹{(item.quantity * item.unitPrice).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography sx={{ color: "#2c3e50" }}>
            Total Amount: ₹{totalAmount.toLocaleString()}
          </Typography>
          <Divider sx={{ my: 1, borderColor: "#bdc3c7" }} />
          <Typography fontWeight="bold" sx={{ color: "#c0392b" }}>
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
            flexWrap: "wrap",
            color: "#2c3e50",
          }}
        >
          <Typography fontWeight="bold">
            {sale.approvedBy} — Administrator
          </Typography>
          <Typography fontStyle="italic" sx={{ color: "#7f8c8d" }}>
            Thank you for your business!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePage;
