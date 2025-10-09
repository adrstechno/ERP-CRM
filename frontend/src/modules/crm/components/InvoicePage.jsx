
// // import React, { useRef } from "react";
// // import {
// //   Box,
// //   Button,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Divider,
// // } from "@mui/material";
// // import html2canvas from "html2canvas";
// // import jsPDF from "jspdf";

// // const invoiceData = {
// //   invoiceId: 1,
// //   invoiceDate: "2025-10-08",
// //   invoiceNumber: "INV-2025-00001",
// //   paymentStatus: "UNPAID",
// //   totalAmount: 114997.0,
// //   sale: {
// //     saleId: 2,
// //     adminName: "admin",
// //     marketerName: "marketer",
// //     customerType: "DEALER",
// //     customerName: "dealer",
// //     saleDate: "2025-10-08",
// //     totalAmount: 114997.0,
// //     saleStatus: "APPROVED",
// //     items: [
// //       { productId: 1, productName: "Samsung Convertible 5-in-1 AC 1.5 Ton", quantity: 1, unitPrice: 41999.0 },
// //       { productId: 2, productName: "LG Refrigerator 260L", quantity: 2, unitPrice: 59998.0 },
// //       { productId: 3, productName: "Sony 55-inch 4K TV", quantity: 1, unitPrice: 55999.0 },
// //     ],
// //   },
// // };

// // const InvoicePage = () => {
// //   const invoiceRef = useRef();

  
// //   const handleDownloadPDF = () => {
// //     const input = invoiceRef.current;
// //     html2canvas(input, { scale: 2 }).then((canvas) => {
// //       const imgData = canvas.toDataURL("image/png");
// //       const pdf = new jsPDF("p", "mm", "a4");
// //       const pdfWidth = 210; // A4 width in mm
// //       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
// //       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
// //       pdf.save(`${invoiceData.invoiceNumber}.pdf`);
// //     });
// //   };

// //   const calculateSubtotal = () => invoiceData.sale.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
// //   const tax = () => calculateSubtotal() * 0.1;
// //   const grandTotal = () => calculateSubtotal() + tax();

// //   return (
// //     <Box
// //       sx={{
// //         p: 2,
// //         "& *": { color: "#000 !important" }, // force all text black
// //         backgroundColor: "#f0f0f0", // optional light background outside the form
// //       }}
// //     >
// //       {/* Buttons */}
// //       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
// //         <Button variant="contained" onClick={handleDownloadPDF}>📄 Download PDF</Button>
// //       </Box>

// //       {/* Invoice */}
// //       <Paper
// //         ref={invoiceRef}
// //         sx={{
// //           p: 4,
// //           maxWidth: 800,
// //           mx: "auto",
// //           backgroundColor: "#fff", // white form
// //           color: "#000", // force black text
// //         }}
// //       >
// //         {/* Header */}
// //         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
// //           <Box>
// //             <img src="/main.png" alt="JK Power" style={{ height: 50 }} />
// //             <Typography variant="h6">JK Power</Typography>
// //             <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
// //           </Box>
// //           <Box textAlign="right">
// //             <Typography variant="h4" fontWeight="bold">INVOICE</Typography>
// //             <Typography>Invoice #: {invoiceData.invoiceNumber}</Typography>
// //             <Typography>Date: {invoiceData.invoiceDate}</Typography>
// //             <Typography>Status: {invoiceData.paymentStatus}</Typography>
// //           </Box>
// //         </Box>

// //         <Divider sx={{ mb: 3, backgroundColor: "#ccc" }} />

// //         {/* Billing Info */}
// //         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 1 }}>
// //           <Box>
// //             <Typography variant="subtitle1" fontWeight="bold">Billed To:</Typography>
// //             <Typography>{invoiceData.sale.customerName}</Typography>
// //             <Typography>Type: {invoiceData.sale.customerType}</Typography>
// //             <Typography>Sale Date: {invoiceData.sale.saleDate}</Typography>
// //             <Typography>Admin: {invoiceData.sale.adminName}</Typography>
// //             <Typography>Marketer: {invoiceData.sale.marketerName}</Typography>
// //           </Box>
// //         </Box>

// //         {/* Items Table */}
// //         <TableContainer sx={{ backgroundColor: "#fff" }}>
// //           <Table sx={{ borderCollapse: "collapse", backgroundColor: "#fff" }}>
// //             <TableHead>
// //               <TableRow>
// //                 {["Product Name", "Qty", "Unit Price", "Total"].map((head) => (
// //                   <TableCell key={head} sx={{ borderBottom: "1px solid #ccc", backgroundColor: "#fff" }}>{head}</TableCell>
// //                 ))}
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {invoiceData.sale.items.map((item) => (
// //                 <TableRow key={item.productId} sx={{ backgroundColor: "#fff" }}>
// //                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{item.productName}</TableCell>
// //                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{item.quantity}</TableCell>
// //                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>₹{item.unitPrice.toLocaleString()}</TableCell>
// //                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>₹{(item.unitPrice * item.quantity).toLocaleString()}</TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         {/* Summary */}
// //         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, p: 2, backgroundColor: "#fff", borderRadius: 1 }}>
// //           <Box sx={{ width: 300 }}>
// //             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
// //               <Typography>Subtotal:</Typography>
// //               <Typography>₹{calculateSubtotal().toLocaleString()}</Typography>
// //             </Box>
// //             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
// //               <Typography>Tax (10%):</Typography>
// //               <Typography>₹{tax().toLocaleString()}</Typography>
// //             </Box>
// //             <Divider sx={{ my: 1, backgroundColor: "#ccc" }} />
// //             <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
// //               <Typography>Grand Total:</Typography>
// //               <Typography>₹{grandTotal().toLocaleString()}</Typography>
// //             </Box>
// //           </Box>
// //         </Box>

// //         {/* Footer */}
// //         <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between", backgroundColor: "#fff" }}>
// //           <Box textAlign="left">
// //             <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
// //           </Box>
// //           <Box textAlign="center" flexGrow={1}>
// //             <Typography fontStyle="italic">Thank You for Your Business!</Typography>
// //           </Box>
// //         </Box>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default InvoicePage;


// import React, { useRef } from "react";
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
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Replace this with your API response
// const paymentData = [
//   { paymentId: 7, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 2000.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: null },
//   { paymentId: 8, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 2000.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: null },
//   { paymentId: 9, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 2000.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: null },
//   { paymentId: 10, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 2000.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: null },
//   { paymentId: 11, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 42997.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: "cash payment " },
//   { paymentId: 12, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 42997.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: "cash payment " },
//   { paymentId: 13, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 42997.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: null, receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: "cash payment " },
//   { paymentId: 14, invoiceId: 2, invoiceNumber: "INV-2025-00002", amount: 50000.0, paymentDate: "2025-10-08", paymentMethod: "UPI", referenceNo: "TXN123456779", status: "PENDING", proofUrl: "https://res.cloudinary.com/dhy4osny1/image/upload/v1759984183/crm/receipts/2/tkc5xpzx2yg0y4rcnfxc.png", receivedBy: "marketer", remainingBalance: 1012006.0, totalBalance: 1148997.0, notes: "cash payment " },
// ];

// const InvoicePage = () => {
//   const invoiceRef = useRef();

//   const handleDownloadPDF = () => {
//     const input = invoiceRef.current;
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = 210; // A4 width in mm
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`${paymentData[0].invoiceNumber}.pdf`);
//     });
//   };

//   const totalPaid = paymentData.reduce((acc, p) => acc + p.amount, 0);
//   const remainingBalance = paymentData[0]?.remainingBalance ?? 0;

//   return (
//     <Box sx={{ p: 2, "& *": { color: "#000 !important" }, backgroundColor: "#f0f0f0" }}>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         <Button variant="contained" onClick={handleDownloadPDF}>📄 Download PDF</Button>
//       </Box>

//       <Paper ref={invoiceRef} sx={{ p: 4, maxWidth: 800, mx: "auto", backgroundColor: "#fff", color: "#000" }}>
//         {/* Header */}
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//           <Box>
//             <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
//             <Typography variant="h6">JK Power</Typography>
//             <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
//           </Box>
//           <Box textAlign="right">
//             <Typography variant="h4" fontWeight="bold">INVOICE</Typography>
//             <Typography>Invoice #: {paymentData[0].invoiceNumber}</Typography>
//             <Typography>Date: {paymentData[0].paymentDate}</Typography>
//             <Typography>Status: {paymentData[0].status}</Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ mb: 3, backgroundColor: "#ccc" }} />

//         {/* Payments Table */}
//         <TableContainer sx={{ backgroundColor: "#fff" }}>
//           <Table sx={{ borderCollapse: "collapse", backgroundColor: "#fff" }}>
//             <TableHead>
//               <TableRow>
//                 {["Payment ID", "Amount", "Payment Date", "Method", "Status", "Received By", "Notes", "Proof"].map((head) => (
//                   <TableCell key={head} sx={{ borderBottom: "1px solid #ccc", backgroundColor: "#fff" }}>{head}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paymentData.map((p) => (
//                 <TableRow key={p.paymentId} sx={{ backgroundColor: "#fff" }}>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentId}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>₹{p.amount.toLocaleString()}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentDate}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentMethod}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.status}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.receivedBy}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.notes || "-"}</TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #eee" }}>
//                     {p.proofUrl ? <a href={p.proofUrl} target="_blank" rel="noopener noreferrer">View</a> : "-"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Summary */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, p: 2, backgroundColor: "#fff", borderRadius: 1 }}>
//           <Box sx={{ width: 300 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography>Total Paid:</Typography>
//               <Typography>₹{totalPaid.toLocaleString()}</Typography>
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography>Remaining Balance:</Typography>
//               <Typography>₹{remainingBalance.toLocaleString()}</Typography>
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", mt: 1 }}>
//               <Typography>Total Amount:</Typography>
//               <Typography>₹{paymentData[0].totalBalance.toLocaleString()}</Typography>
//             </Box>
//           </Box>
//         </Box>

//         {/* Footer */}
//         <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between", backgroundColor: "#fff" }}>
//           <Box textAlign="left">
//             <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
//           </Box>
//           <Box textAlign="center" flexGrow={1}>
//             <Typography fontStyle="italic">Thank You for Your Business!</Typography>
//           </Box>
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
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { VITE_API_BASE_URL } from "../utils/State";

const InvoicePage = ({ invoiceId }) => {
  const invoiceRef = useRef();
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/payments/${invoiceId}`);
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [invoiceId]);

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      if (paymentData.length > 0) {
        pdf.save(`${paymentData[0].invoiceNumber}.pdf`);
      }
    });
  };

  const totalPaid = paymentData.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = paymentData[0]?.remainingBalance ?? 0;

  if (loading) return <Typography>Loading payments...</Typography>;

  if (paymentData.length === 0)
    return <Typography>No payment data available for this invoice.</Typography>;

  return (
    <Box sx={{ p: 2, "& *": { color: "#000 !important" }, backgroundColor: "#f0f0f0" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={handleDownloadPDF}>📄 Download PDF</Button>
      </Box>

      <Paper ref={invoiceRef} sx={{ p: 4, maxWidth: 800, mx: "auto", backgroundColor: "#fff", color: "#000" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <img src="/main.png" alt="Company Logo" style={{ height: 50 }} />
            <Typography variant="h6">JK Power</Typography>
            <Typography variant="body2">Madan Mahal, Jabalpur</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold">INVOICE</Typography>
            <Typography>Invoice #: {paymentData[0].invoiceNumber}</Typography>
            <Typography>Date: {paymentData[0].paymentDate}</Typography>
            <Typography>Status: {paymentData[0].status}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, backgroundColor: "#ccc" }} />

        {/* Payments Table */}
        <TableContainer sx={{ backgroundColor: "#fff" }}>
          <Table sx={{ borderCollapse: "collapse", backgroundColor: "#fff" }}>
            <TableHead>
              <TableRow>
                {["Payment ID", "Amount", "Payment Date", "Method", "Status", "Received By", "Notes", "Proof"].map((head) => (
                  <TableCell key={head} sx={{ borderBottom: "1px solid #ccc", backgroundColor: "#fff" }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentData.map((p) => (
                <TableRow key={p.paymentId} sx={{ backgroundColor: "#fff" }}>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentId}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>₹{p.amount.toLocaleString()}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentDate}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.paymentMethod}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.status}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.receivedBy}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>{p.notes || "-"}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #eee" }}>
                    {p.proofUrl ? <a href={p.proofUrl} target="_blank" rel="noopener noreferrer">View</a> : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, p: 2, backgroundColor: "#fff", borderRadius: 1 }}>
          <Box sx={{ width: 300 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Total Paid:</Typography>
              <Typography>₹{totalPaid.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Remaining Balance:</Typography>
              <Typography>₹{remainingBalance.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", mt: 1 }}>
              <Typography>Total Amount:</Typography>
              <Typography>₹{paymentData[0].totalBalance.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between", backgroundColor: "#fff" }}>
          <Box textAlign="left">
            <Typography fontWeight="bold">Srajal Vishwakarma — Administrator</Typography>
          </Box>
          <Box textAlign="center" flexGrow={1}>
            <Typography fontStyle="italic">Thank You for Your Business!</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoicePage;
