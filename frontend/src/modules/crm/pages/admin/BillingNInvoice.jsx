// import React, { useState } from 'react';
// import {
//     Box, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Chip, Button, Stack, Divider, ToggleButtonGroup, ToggleButton
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DownloadIcon from '@mui/icons-material/Download';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// // --- Mock Data ---

// // Data for the Billing & Invoice Table
// const invoiceData = [
//     { invoiceNo: 'INV-2025-01', date: '06-Sep-25', dealerName: 'CoolAir Traders', saleId: 'S-1001', amount: 45000, gst: 18, status: 'Paid' },
//     { invoiceNo: 'INV-2025-02', date: '07-Sep-25', dealerName: 'Arctic Systems', saleId: 'S-1002', amount: 52500, gst: 18, status: 'Unpaid' },
//     { invoiceNo: 'INV-2025-03', date: '08-Sep-25', dealerName: 'Zenith Corp', saleId: 'S-1003', amount: 120000, gst: 18, status: 'Paid' },
//     { invoiceNo: 'INV-2025-04', date: '09-Sep-25', dealerName: 'Evergreen Pvt. Ltd.', saleId: 'S-1004', amount: 78000, gst: 18, status: 'Paid' },
//     { invoiceNo: 'INV-2025-05', date: '10-Sep-25', dealerName: 'Delta Solutions', saleId: 'S-1005', amount: 32000, gst: 18, status: 'Unpaid' },
// ];

// // Generates realistic, varied data for the 12 months of the year
// const generateGstData = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months.map(month => ({
//         month,
//         collection: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
//     }));
// };
// const gstCollectionData = generateGstData();

// // --- Helper Functions ---

// const getStatusChip = (status) => {
//     const color = status === 'Paid' ? 'success' : 'warning';
//     return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
// };

// // --- Main Component ---
// export default function BillingAndInvoiceContent() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [chartFilter, setChartFilter] = useState('All');

//     const handleChartFilterChange = (event, newFilter) => {
//         if (newFilter !== null) {
//             setChartFilter(newFilter);
//         }
//     };

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//         height: '100%',
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Billing & Invoice</Typography>
//             <Stack spacing={3}>
//                 {/* Billing & Invoice Table Card */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Invoice No', 'Date', 'Dealer Name', 'Sale ID', 'Amount', 'GST %', 'Status', 'Action'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {invoiceData.map((invoice) => (
//                                         <TableRow key={invoice.invoiceNo} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                             <TableCell sx={{ fontWeight: 500 }}>{invoice.invoiceNo}</TableCell>
//                                             <TableCell>{invoice.date}</TableCell>
//                                             <TableCell>{invoice.dealerName}</TableCell>
//                                             <TableCell>{invoice.saleId}</TableCell>
//                                             <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
//                                             <TableCell>{invoice.gst}%</TableCell>
//                                             <TableCell>{getStatusChip(invoice.status)}</TableCell>
//                                             <TableCell>
//                                                 <Stack direction="row" spacing={1}>
//                                                     <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}>View</Button>
//                                                     <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Download</Button>
//                                                 </Stack>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>

//                 {/* GST Collection Chart Card */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GST Collection</Typography>
//                             <ToggleButtonGroup
//                                 value={chartFilter}
//                                 exclusive
//                                 onChange={handleChartFilterChange}
//                                 size="small"
//                             >
//                                 <ToggleButton value="All">All</ToggleButton>
//                                 <ToggleButton value="Source">Source(1)</ToggleButton>
//                                 <ToggleButton value="Dashboard">Dashboard</ToggleButton>
//                             </ToggleButtonGroup>
//                         </Stack>
//                         <Divider sx={{ mb: 3 }} />
//                         <Box sx={{ height: 350 }}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={gstCollectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                                     <defs>
//                                         <linearGradient id="gstGradient" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
//                                             <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0.2} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid vertical={false} stroke="transparent" />
//                                     <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
//                                     <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
//                                     <Tooltip
//                                         cursor={{ fill: 'rgba(128,128,128,0.1)' }}
//                                         contentStyle={{
//                                             backgroundColor: isDark ? 'rgba(42, 51, 62, 0.9)' : 'rgba(255,255,255,0.9)',
//                                             borderRadius: '8px',
//                                             border: 'none',
//                                             backdropFilter: 'blur(5px)'
//                                         }}
//                                     />
//                                     <Bar dataKey="collection" fill="url(#gstGradient)" barSize={10} radius={[5, 5, 0, 0]} />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Box>
//                     </CardContent>
//                 </Card>
//             </Stack>
//         </Box>
//     );
// }

import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Button, Stack, Divider, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- Mock Data (Expanded for Scrolling) ---
const invoiceData = [
    { invoiceNo: 'INV-2025-01', date: '06-Sep-25', dealerName: 'CoolAir Traders', saleId: 'S-1001', amount: 45000, gst: 18, status: 'Paid' },
    { invoiceNo: 'INV-2025-02', date: '07-Sep-25', dealerName: 'Arctic Systems', saleId: 'S-1002', amount: 52500, gst: 18, status: 'Unpaid' },
    { invoiceNo: 'INV-2025-03', date: '08-Sep-25', dealerName: 'Zenith Corp', saleId: 'S-1003', amount: 120000, gst: 18, status: 'Paid' },
    { invoiceNo: 'INV-2025-04', date: '09-Sep-25', dealerName: 'Evergreen Pvt. Ltd.', saleId: 'S-1004', amount: 78000, gst: 18, status: 'Paid' },
    { invoiceNo: 'INV-2025-05', date: '10-Sep-25', dealerName: 'Delta Solutions', saleId: 'S-1005', amount: 32000, gst: 18, status: 'Unpaid' },
    { invoiceNo: 'INV-2025-06', date: '11-Sep-25', dealerName: 'CoolAir Traders', saleId: 'S-1006', amount: 95000, gst: 18, status: 'Paid' },
    { invoiceNo: 'INV-2025-07', date: '12-Sep-25', dealerName: 'Zenith Corp', saleId: 'S-1007', amount: 15000, gst: 18, status: 'Paid' },
];

const generateGstData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
        month,
        collection: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
    }));
};
const gstCollectionData = generateGstData();

// --- Helper Components ---
const getStatusChip = (status) => {
    const color = status === 'Paid' ? 'success' : 'warning';
    return <Chip label={status} color={color} size="small" sx={{ fontWeight: 500 }} />;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
                <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {`Collection: ₹${payload[0].value.toLocaleString('en-IN')}`}
                </Typography>
            </Card>
        );
    }
    return null;
};

// --- Main Component ---
export default function BillingAndInvoice() {
    const theme = useTheme();
    const [chartFilter, setChartFilter] = useState('All');

    const handleChartFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setChartFilter(newFilter);
        }
    };

    return (
        <Box>
            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Invoices</Typography>
                        <TableContainer sx={{ maxHeight: 'calc(125vh - 700px)', overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {['Invoice No', 'Date', 'Dealer Name', 'Sale ID', 'Amount', 'GST %', 'Status', 'Action'].map(head => (
                                            <TableCell key={head} sx={{ whiteSpace: 'nowrap' }}>{head}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoiceData.map((invoice) => (
                                        <TableRow key={invoice.invoiceNo} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{invoice.invoiceNo}</TableCell>
                                            <TableCell>{invoice.date}</TableCell>
                                            <TableCell>{invoice.dealerName}</TableCell>
                                            <TableCell>{invoice.saleId}</TableCell>
                                            <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>{invoice.gst}%</TableCell>
                                            <TableCell>{getStatusChip(invoice.status)}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}>View</Button>
                                                    <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Download</Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GST Collection</Typography>
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
                        <Box sx={{ height: 210  }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gstCollectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="gstGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke={theme.palette.divider} strokeDasharray="3 3"/>
                                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                                    <Tooltip
                                        cursor={{ fill: theme.palette.action.hover }}
                                        content={<CustomTooltip />}
                                    />
                                    <Bar dataKey="collection" fill="url(#gstGradient)" barSize={15} radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}
