// import React, { useState, useEffect,useMemo } from 'react';
// import {
//     Box, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Chip, Button, Stack, Divider, ToggleButtonGroup, ToggleButton, Skeleton
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DownloadIcon from '@mui/icons-material/Download';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// // --- Mock Data for Chart (API data will be used for the table) ---
// const generateGstData = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months.map(month => ({
//         month,
//         collection: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
//     }));
// };
// const gstCollectionData = generateGstData();

// // --- Helper Components ---
// const getStatusChip = (status) => {
//     // Assuming status will be "Paid" or "Unpaid"
//     const color = status === 'Paid' ? 'success' : 'warning';
//     return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
// };

// const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//         return (
//             <Card sx={{ p: 1 }}>
//                 <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
//                 <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
//                     {`Collection: ₹${payload[0].value.toLocaleString('en-IN')}`}
//                 </Typography>
//             </Card>
//         );
//     }
//     return null;
// };

// // --- Main Component ---
// export default function BillingAndInvoice() {
//     const theme = useTheme();
//     const [chartFilter, setChartFilter] = useState('All');
//     const [invoices, setInvoices] = useState([]); // State to hold API data
//     const [isLoading, setIsLoading] = useState(true); // Loading state
//     const token = localStorage.getItem("authKey");

//      const axiosConfig = useMemo(() => ({
//                 headers: { Authorization: `Bearer ${token}` },
//             }), [token]);

//     // --- 1. API Integration to Fetch Invoices ---
//     useEffect(() => {
//         const fetchInvoices = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await fetch('http://localhost:8080/api/invoices/get-all',axiosConfig);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();

//                 // --- 2. Data Transformation ---
//                 // Map API response to the structure needed by the table
//                 const formattedData = data.map(item => ({
//                     id: item.invoiceId,
//                     invoiceNo: item.invoiceNumber,
//                     date: new Date(item.invoiceDate).toLocaleDateString('en-GB'), // Format as DD/MM/YYYY
//                     customerName: item.sale.customerName, // Get customer name from nested object
//                     saleId: item.sale.saleId, // Get saleId from nested object
//                     amount: item.totalAmount,
//                     status: item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1).toLowerCase(), // Convert UNPAID -> Unpaid
//                 }));
//                 setInvoices(formattedData);
//             } catch (error) {
//                 console.error("Failed to fetch invoices:", error);
//                 setInvoices([]); // Clear data on error
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchInvoices();
//     }, []); // Empty dependency array ensures this runs only once on mount

//     const handleChartFilterChange = (event, newFilter) => {
//         if (newFilter !== null) {
//             setChartFilter(newFilter);
//         }
//     };

//     return (
//         <Box>
//             <Stack spacing={3}>

//                 <Card>
//                     <CardContent>
//                         <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Payments Collection</Typography>
//                             <ToggleButtonGroup
//                                 value={chartFilter}
//                                 exclusive
//                                 onChange={handleChartFilterChange}
//                                 size="small"
//                                 color="primary"
//                             >
//                                 <ToggleButton value="All">All</ToggleButton>
//                                 <ToggleButton value="Source">Source(1)</ToggleButton>
//                                 <ToggleButton value="Dashboard">Dashboard</ToggleButton>
//                             </ToggleButtonGroup>
//                         </Stack>
//                         <Divider sx={{ mb: 3 }} />
//                         <Box sx={{ height: 210  }}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={gstCollectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                                     <defs>
//                                         <linearGradient id="gstGradient" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
//                                             <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0.2} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid vertical={false} stroke={theme.palette.divider} strokeDasharray="3 3"/>
//                                     <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
//                                     <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
//                                     <Tooltip
//                                         cursor={{ fill: theme.palette.action.hover }}
//                                         content={<CustomTooltip />}
//                                     />
//                                     <Bar dataKey="collection" fill="url(#gstGradient)" barSize={15} radius={[5, 5, 0, 0]} />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Box>
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Invoices</Typography>
//                         <TableContainer sx={{ maxHeight: 'calc(125vh - 700px)', overflowY: 'auto' }}>
//                             <Table stickyHeader size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {/* --- 3. Table Column Changes --- */}
//                                         {['Invoice No', 'Date', 'Customer Name', 'Sale ID', 'Amount', 'Status', 'Action'].map(head => (
//                                             <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {isLoading ? (
//                                         // Show skeleton loaders while data is being fetched
//                                         Array.from(new Array(5)).map((_, index) => (
//                                             <TableRow key={index}>
//                                                 <TableCell colSpan={7}><Skeleton animation="wave" /></TableCell>
//                                             </TableRow>
//                                         ))
//                                     ) : (
//                                         // --- 4. Render Data from API ---
//                                         invoices.map((invoice) => (
//                                             <TableRow key={invoice.id} hover>
//                                                 <TableCell sx={{ fontWeight: 500 }}>{invoice.invoiceNo}</TableCell>
//                                                 <TableCell>{invoice.date}</TableCell>
//                                                 <TableCell>{invoice.customerName}</TableCell>
//                                                 <TableCell>{invoice.saleId}</TableCell>
//                                                 <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
//                                                 <TableCell>{getStatusChip(invoice.status)}</TableCell>
//                                                 <TableCell>
//                                                     <Stack direction="row" spacing={1}>
//                                                         <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Download</Button>
//                                                     </Stack>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>

//             </Stack>
//         </Box>
//     );
// }

import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

// --- Mock Data for Chart (API data will be used for the table) ---
const generateGstData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    month,
    collection: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
  }));
};
const gstCollectionData = generateGstData();

// --- Helper Components ---
const getStatusChip = (status) => {
  const color = status === "Paid" ? "success" : "warning";
  return (
    <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />
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
  const [chartFilter, setChartFilter] = useState("All");
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("authKey");
  const navigate = useNavigate();

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // --- Fetch Invoices ---
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/invoices/get-all",
          axiosConfig
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const formattedData = data.map((item) => ({
          id: item.invoiceId,
          invoiceNo: item.invoiceNumber,
          date: new Date(item.invoiceDate).toLocaleDateString("en-GB"),
          customerName: item.sale.customerName,
          saleId: item.sale.saleId,
          amount: item.totalAmount,
          status:
            item.paymentStatus.charAt(0).toUpperCase() +
            item.paymentStatus.slice(1).toLowerCase(),
        }));
        setInvoices(formattedData);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleChartFilterChange = (event, newFilter) => {
    if (newFilter !== null) setChartFilter(newFilter);
  };

  // --- 🟢 Download Handler ---
  const handleDownload = (saleId) => {
    navigate(`/crm/invoice/${saleId}`,"_blank");
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Payments Collection
              </Typography>
              <ToggleButtonGroup
                value={chartFilter}
                exclusive
                onChange={handleChartFilterChange}
                size="small"
                color="primary"
              >
                <ToggleButton value="All">All</ToggleButton>
                <ToggleButton value="Source">Source(1)</ToggleButton>
                <ToggleButton value="Dashboard">Dashboard</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gstCollectionData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="gstGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.light}
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke={theme.palette.divider}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: theme.palette.action.hover }}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="collection"
                    fill="url(#gstGradient)"
                    barSize={15}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Invoices
            </Typography>
            <TableContainer
              sx={{ maxHeight: "calc(125vh - 700px)", overflowY: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      "Invoice No",
                      "Date",
                      "Customer Name",
                      "Sale ID",
                      "Amount",
                      "Status",
                      "Action",
                    ].map((head) => (
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
                          <TableCell colSpan={7}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        </TableRow>
                      ))
                    : invoices.map((invoice) => (
                        <TableRow key={invoice.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {invoice.invoiceNo}
                          </TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell>{invoice.saleId}</TableCell>
                          <TableCell>
                            ₹{invoice.amount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>{getStatusChip(invoice.status)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                onClick={() => handleDownload(invoice.saleId)}
                              >
                                Download
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
    </Box>
  );
}
