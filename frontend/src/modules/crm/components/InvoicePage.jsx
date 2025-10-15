

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Divider,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useParams } from "react-router-dom";
// import { VITE_API_BASE_URL as EXPORTED_BASE_URL } from "../utils/State";

// /*
//   InvoicePage improvements/fixes:
//   - Accept invoiceId via prop OR route param.
//   - Fallback to import.meta.env.VITE_API_BASE_URL if utils export is missing.
//   - Clearer error handling / loading states so the page always shows useful UI.
//   - Defensive handling of response shapes.
// */

// const InvoicePage = ({ invoiceId: propInvoiceId }) => {
//   const { invoiceId: paramInvoiceId } = useParams() || {};
//   const invoiceRef = useRef();
//   const [paymentData, setPaymentData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Determine base URL (try exported constant first, then Vite env)
//   const VITE_API_BASE_URL =
//     EXPORTED_BASE_URL || import.meta?.env?.VITE_API_BASE_URL || "";

//   // Prefer prop -> route param -> empty
//   const invoiceId = propInvoiceId || paramInvoiceId;

//   const fetchPayments = useCallback(async () => {
//     setError("");
//     setPaymentData([]);
//     setLoading(true);

//     if (!invoiceId) {
//       setError("No invoice ID provided.");
//       setLoading(false);
//       return;
//     }

//     if (!VITE_API_BASE_URL) {
//       setError("API base URL is not configured.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const url = `${VITE_API_BASE_URL.replace(/\/$/, "")}/payments/${invoiceId}`;
//       const response = await axios.get(url);

//       // Support a few common response shapes
//       const data =
//         response?.data?.data ||
//         response?.data?.payments ||
//         (Array.isArray(response?.data) ? response.data : []);

//       if (!Array.isArray(data) || data.length === 0) {
//         setError("No payment data available for this invoice.");
//       } else {
//         setPaymentData(data);
//       }
//     } catch (err) {
//       console.error("Error fetching payments:", err);
//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to fetch payments. Please try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [invoiceId, VITE_API_BASE_URL]);

//   useEffect(() => {
//     fetchPayments();
//   }, [fetchPayments]);

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current || paymentData.length === 0) return;
//     try {
//       const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = 210;
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//       const fileName =
//         paymentData[0]?.invoiceNumber || `Invoice-${invoiceId || "unknown"}`;
//       pdf.save(`${fileName}.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//     }
//   };

//   const totalPaid = paymentData.reduce((acc, p) => acc + (p.amount || 0), 0);
//   const remainingBalance = paymentData[0]?.remainingBalance ?? 0;
//   const totalAmount = paymentData[0]?.totalBalance ?? totalPaid + remainingBalance;

//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//         <Box>
//           <Typography variant="body2" color="textSecondary">
//             If this invoice should exist, verify the invoice ID and backend API.
//           </Typography>
//         </Box>
//       </Box>
//     );

//   return (
//     <Box sx={{ p: 2, backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleDownloadPDF}
//           sx={{
//             textTransform: "none",
//             fontWeight: "bold",
//             boxShadow: 2,
//           }}
//         >
//           📄 Download PDF
//         </Button>
//       </Box>

//       <Paper
//         ref={invoiceRef}
//         sx={{
//           p: 4,
//           maxWidth: 1000,
//           mx: "auto",
//           backgroundColor: "#fff",
//           color: "#000",
//           boxShadow: 4,
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//           <Box>
//             <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
//             <Typography variant="h6">JK Power</Typography>
//             <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
//           </Box>
//           <Box textAlign="right">
//             <Typography variant="h4" fontWeight="bold">
//               INVOICE
//             </Typography>
//             <Typography>Invoice #: {paymentData[0]?.invoiceNumber || "-"}</Typography>
//             <Typography>Date: {paymentData[0]?.paymentDate || "-"}</Typography>
//             <Typography>Status: {paymentData[0]?.status || "-"}</Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ mb: 3, backgroundColor: "#ccc" }} />

//         <TableContainer component={Paper} elevation={0}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Payment ID",
//                   "Amount",
//                   "Payment Date",
//                   "Method",
//                   "Status",
//                   "Received By",
//                   "Notes",
//                   "Proof",
//                 ].map((head) => (
//                   <TableCell
//                     key={head}
//                     sx={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
//                   >
//                     {head}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paymentData.map((p) => (
//                 <TableRow key={p.paymentId || `${p.invoiceNumber}-${p.paymentDate}`}>
//                   <TableCell>{p.paymentId || "-"}</TableCell>
//                   <TableCell>₹{(p.amount || 0).toLocaleString()}</TableCell>
//                   <TableCell>{p.paymentDate || "-"}</TableCell>
//                   <TableCell>{p.paymentMethod || "-"}</TableCell>
//                   <TableCell>{p.status || "-"}</TableCell>
//                   <TableCell>{p.receivedBy || "-"}</TableCell>
//                   <TableCell>{p.notes || "-"}</TableCell>
//                   <TableCell>
//                     {p.proofUrl ? (
//                       <a href={p.proofUrl} target="_blank" rel="noopener noreferrer">
//                         View
//                       </a>
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             mt: 3,
//             p: 2,
//             backgroundColor: "#fafafa",
//             borderRadius: 1,
//           }}
//         >
//           <Box sx={{ width: 300 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography>Total Paid:</Typography>
//               <Typography>₹{totalPaid.toLocaleString()}</Typography>
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography>Remaining Balance:</Typography>
//               <Typography>₹{remainingBalance.toLocaleString()}</Typography>
//             </Box>
//             <Divider sx={{ my: 1 }} />
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 fontWeight: "bold",
//               }}
//             >
//               <Typography>Total Amount:</Typography>
//               <Typography>₹{totalAmount.toLocaleString()}</Typography>
//             </Box>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             mt: 6,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
//           <Typography fontStyle="italic">Thank you for your business!</Typography>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default InvoicePage;

// import React, { useRef, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Divider,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useParams } from "react-router-dom";
// import { VITE_API_BASE_URL } from "../utils/State"; // ✅ uses env indirectly

// const InvoicePage = () => {
//   const { invoiceId } = useParams();
//   const invoiceRef = useRef();
//   const [paymentData, setPaymentData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchPayments = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(`${VITE_API_BASE_URL}/invoices/${invoiceId}`);
//       const data =
//         response.data.data ||
//         response.data.payments ||
//         (Array.isArray(response.data) ? response.data : []);

//       if (!Array.isArray(data) || data.length === 0) {
//         setError("No payment data available for this invoice.");
//       } else {
//         setPaymentData(data);
//       }
//     } catch (err) {
//       console.error("Error fetching payments:", err);
//       setError("Failed to fetch payments. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (invoiceId) fetchPayments();
//   }, [invoiceId]);

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current || paymentData.length === 0) return;
//     const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = 210;
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Invoice-${invoiceId}.pdf`);
//   };

//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );

//   const totalPaid = paymentData.reduce((acc, p) => acc + (p.amount || 0), 0);
//   const remainingBalance = paymentData[0]?.remainingBalance ?? 0;
//   const totalAmount = paymentData[0]?.totalBalance ?? totalPaid + remainingBalance;

//   return (
//     <Box sx={{ p: 2, backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//         <Button variant="contained" onClick={handleDownloadPDF}>
//           📄 Download PDF
//         </Button>
//       </Box>

//       <Paper
//         ref={invoiceRef}
//         sx={{
//           p: 4,
//           maxWidth: 1000,
//           mx: "auto",
//           backgroundColor: "#fff",
//           color: "#000",
//           boxShadow: 4,
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//           <Box>
//             <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
//             <Typography variant="h6">JK Power</Typography>
//             <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
//           </Box>
//           <Box textAlign="right">
//             <Typography variant="h4" fontWeight="bold">
//               INVOICE
//             </Typography>
//             <Typography>Invoice #: {paymentData[0]?.invoiceNumber || "-"}</Typography>
//             <Typography>Date: {paymentData[0]?.paymentDate || "-"}</Typography>
//             <Typography>Status: {paymentData[0]?.status || "-"}</Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         <TableContainer component={Paper} elevation={0}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Payment ID",
//                   "Amount",
//                   "Payment Date",
//                   "Method",
//                   "Status",
//                   "Received By",
//                   "Notes",
//                   "Proof",
//                 ].map((head) => (
//                   <TableCell key={head} sx={{ fontWeight: "bold" }}>
//                     {head}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paymentData.map((p) => (
//                 <TableRow key={p.paymentId}>
//                   <TableCell>{p.paymentId}</TableCell>
//                   <TableCell>₹{p.amount?.toLocaleString()}</TableCell>
//                   <TableCell>{p.paymentDate}</TableCell>
//                   <TableCell>{p.paymentMethod}</TableCell>
//                   <TableCell>{p.status}</TableCell>
//                   <TableCell>{p.receivedBy}</TableCell>
//                   <TableCell>{p.notes || "-"}</TableCell>
//                   <TableCell>
//                     {p.proofUrl ? (
//                       <a href={p.proofUrl} target="_blank" rel="noreferrer">
//                         View
//                       </a>
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box sx={{ mt: 3, textAlign: "right" }}>
//           <Typography>Total Paid: ₹{totalPaid.toLocaleString()}</Typography>
//           <Typography>Remaining Balance: ₹{remainingBalance.toLocaleString()}</Typography>
//           <Divider sx={{ my: 1 }} />
//           <Typography fontWeight="bold">
//             Total Amount: ₹{totalAmount.toLocaleString()}
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             mt: 6,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
//           <Typography fontStyle="italic">Thank you for your business!</Typography>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default InvoicePage;

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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";

// ✅ Ensure your utils/State.js exports this properly
import { VITE_API_BASE_URL } from "../utils/State";

const InvoicePage = () => {
  // const { invoiceId } = useParams();
  const invoiceRef = useRef();
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const invoiceId = 2;
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching invoice:", invoiceId, "from:", VITE_API_BASE_URL);

      const response = await axios.get(`${VITE_API_BASE_URL}/invoices/${invoiceId}`);

      console.log("Response data:", response.data);

      let data =
        response.data.data ||
        response.data.payments ||
        (Array.isArray(response.data) ? response.data : [response.data]);

      if (!Array.isArray(data) || data.length === 0) {
        setError("No payment data available for this invoice.");
      } else {
        setPaymentData(data);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to fetch payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) fetchPayments();
  }, [invoiceId]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || paymentData.length === 0) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoiceId}.pdf`);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const totalPaid = paymentData.reduce((acc, p) => acc + (p.amount || 0), 0);
  const remainingBalance = paymentData[0]?.remainingBalance ?? 0;
  const totalAmount = paymentData[0]?.totalBalance ?? totalPaid + remainingBalance;

  return (
    <Box sx={{ p: 2, backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleDownloadPDF}>
          📄 Download PDF
        </Button>
      </Box>

      <Paper
        ref={invoiceRef}
        sx={{
          p: 4,
          maxWidth: 1000,
          mx: "auto",
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
            <Typography variant="h6">JK Power</Typography>
            <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold">
              INVOICE
            </Typography>
            <Typography>Invoice #: {paymentData[0]?.invoiceNumber || "-"}</Typography>
            <Typography>Date: {paymentData[0]?.paymentDate || "-"}</Typography>
            <Typography>Status: {paymentData[0]?.status || "-"}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Payment ID",
                  "Amount",
                  "Payment Date",
                  "Method",
                  "Status",
                  "Received By",
                  "Notes",
                  "Proof",
                ].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: "bold" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentData.map((p, index) => (
                <TableRow key={p.paymentId || index}>
                  <TableCell>{p.paymentId}</TableCell>
                  <TableCell>₹{p.amount?.toLocaleString()}</TableCell>
                  <TableCell>{p.paymentDate}</TableCell>
                  <TableCell>{p.paymentMethod}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>{p.receivedBy}</TableCell>
                  <TableCell>{p.notes || "-"}</TableCell>
                  <TableCell>
                    {p.proofUrl ? (
                      <a href={p.proofUrl} target="_blank" rel="noreferrer">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography>Total Paid: ₹{totalPaid.toLocaleString()}</Typography>
          <Typography>Remaining Balance: ₹{remainingBalance.toLocaleString()}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography fontWeight="bold">
            Total Amount: ₹{totalAmount.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
          <Typography fontStyle="italic">Thank you for your business!</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoicePage;
