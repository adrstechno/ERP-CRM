// import React from 'react';
// import {
//     Box, Grid, Card, CardContent, Typography, useTheme,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
//     Divider, Stack
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// // --- Mock Data ---

// // Data for the Sales Entry Table
// const salesEntryData = [
//     { id: 'SI23', dealer: 'RAMESH', customer: 'RAM', product: 'AC_01', qty: 100, amount: 10000 },
//     { id: 'SI24', dealer: 'RAMESH', customer: 'RAM', product: 'AC_02', qty: 20, amount: 80000 },
//     { id: 'SI25', dealer: 'RAMESH', customer: 'RAM', product: 'AC_01', qty: 60, amount: 70000 },
//     { id: 'SI26', dealer: 'RAMESH', customer: 'RAM', product: 'AC_03', qty: 50, amount: 90000 },
//     { id: 'SI27', dealer: 'RAMESH', customer: 'RAM', product: 'AC_04', qty: 100, amount: 70000 },
//     { id: 'SI28', dealer: 'RAMESH', customer: 'RAM', product: 'AC_01', qty: 80, amount: 10000 },
// ];

// // Data for the Dealer-Wise-Sales Bar Chart
// const dealerWiseSalesData = [
//     { name: 'OTHER', sales: 18900 },
//     { name: 'AC_02', sales: 30000 },
//     { name: 'AC_03', sales: 15000 },
//     { name: 'AC_04', sales: 35000 },
//     { name: 'AC_5', sales: 12000 },
// ];

// // Data for the Marketer-wise-sale Pie Chart
// const marketerWiseSalesData = [
//     { name: 'AC_03', value: 52.1 },
//     { name: 'AC_04', value: 22.8 },
//     { name: 'AC_02', value: 15.9 },
//     { name: 'Other', value: 11.2 },
// ];

// // Colors for the Pie Chart slices (matching screenshot)
// const PIE_CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']; // Blue, Green, Orange, Red (example colors)

// // --- Main Component ---

// export default function SalesManagementContent() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';

//     const cardStyle = {
//         borderRadius: 4,
//         boxShadow: 'none',
//         background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//         backdropFilter: 'blur(10px)',
//         border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
//         height: '100%',
//     };

//     // Custom Tooltip for Recharts to match theme
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <Box
//                     sx={{
//                         p: 1,
//                         bgcolor: isDark ? 'rgba(42, 51, 62, 0.9)' : 'rgba(255,255,255,0.9)',
//                         border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
//                         borderRadius: 2,
//                         backdropFilter: 'blur(5px)'
//                     }}
//                 >
//                     <Typography variant="body2" color="text.secondary">{label}</Typography>
//                     {payload.map((entry, index) => (
//                         <Typography key={`item-${index}`} sx={{ color: entry.color }}>
//                             {`${entry.name}: ${entry.value}${entry.unit || ''}`}
//                         </Typography>
//                     ))}
//                 </Box>
//             );
//         }
//         return null;
//     };

//     return (
//         <Box p={{ xs: 2, sm: 3 }}>
//             <Stack spacing={3}>
//                 {/* Sales Entry Table Card */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Sales Entry Table</Typography>
//                         <TableContainer>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         {['Sale ID', 'Dealer', 'Customer', 'Product', 'Qty', 'Amount', 'Action'].map(head => (
//                                             <TableCell key={head} sx={{ fontWeight: 'bold' }}>{head}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {salesEntryData.map((sale) => (
//                                         <TableRow key={sale.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
//                                             <TableCell sx={{ fontWeight: 500 }}>{sale.id}</TableCell>
//                                             <TableCell>{sale.dealer}</TableCell>
//                                             <TableCell>{sale.customer}</TableCell>
//                                             <TableCell>{sale.product}</TableCell>
//                                             <TableCell>{sale.qty}</TableCell>
//                                             <TableCell>₹{sale.amount.toLocaleString('en-IN')}</TableCell>
//                                             <TableCell>
//                                                 <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
//                                                 <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
//                                                 <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>

//                 {/* Charts Section */}
//                 <Grid container spacing={3}>
//                     {/* Dealer-Wise-Sales Bar Chart */}
//                     <Grid item xs={12} lg={6}>
//                         <Card sx={{ ...cardStyle, height: 400, width:575, display: "flex", flexDirection: "column" }}>
//                             <CardContent>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>Dealer-Wise-Sales</Typography>
//                                 <Divider sx={{ mb: 2 }}/>
//                                 <Box sx={{ height: 300 }}>
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <BarChart data={dealerWiseSalesData}>
//                                             <XAxis dataKey="name" stroke={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'} />
//                                             <YAxis stroke={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'} />
//                                             <Tooltip content={<CustomTooltip nameKey="sales" unit="₹" />} />
//                                             <Bar dataKey="sales" fill={theme.palette.primary.main} barSize={30} radius={[5, 5, 0, 0]} />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>

//                     {/* Marketer-wise-sale Pie Chart */}
//                     <Grid item xs={12} lg={6}>
//                         <Card sx={{ ...cardStyle, height: 400, width:575, display: "flex", flexDirection: "column" }}>
//                             <CardContent>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>Marketer-wise-sale</Typography>
//                                 <Divider sx={{ mb: 2 }}/>
//                                 <Box sx={{ height: 300 }}>
//                                     <ResponsiveContainer width="100%" height="100%">
//                                         <PieChart>
//                                             <Pie
//                                                 data={marketerWiseSalesData}
//                                                 cx="50%"
//                                                 cy="50%"
//                                                 outerRadius={100}
//                                                 fill="#8884d8"
//                                                 dataKey="value"
//                                                 labelLine={false}
//                                                 label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Custom label to show percentage
//                                             >
//                                                 {marketerWiseSalesData.map((entry, index) => (
//                                                     <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
//                                                 ))}
//                                             </Pie>
//                                             <Tooltip content={<CustomTooltip nameKey="value" unit="%" />} />
//                                             <Legend
//                                                 layout="vertical"
//                                                 verticalAlign="middle"
//                                                 align="right"
//                                                 wrapperStyle={{ color: isDark ? theme.palette.text.primary : theme.palette.text.secondary }}
//                                                 formatter={(value, entry, index) => (
//                                                     <Typography sx={{ color: entry.color, fontWeight: 'bold' }}>
//                                                         {value} <span style={{ color: theme.palette.text.secondary, fontWeight: 'normal' }}>({marketerWiseSalesData[index].value}%)</span>
//                                                     </Typography>
//                                                 )}
//                                             />
//                                         </PieChart>
//                                     </ResponsiveContainer>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </Stack>
//         </Box>
//     );
// }

import React from "react";
import {
  Box,
  Grid,
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
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- Mock Data (Expanded for Scrolling) ---
const salesEntryData = [
  {
    id: "SI23",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_01",
    qty: 100,
    amount: 10000,
  },
  {
    id: "SI24",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_02",
    qty: 20,
    amount: 80000,
  },
  {
    id: "SI25",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_01",
    qty: 60,
    amount: 70000,
  },
  {
    id: "SI26",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_03",
    qty: 50,
    amount: 90000,
  },
  {
    id: "SI27",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_04",
    qty: 100,
    amount: 70000,
  },
  {
    id: "SI28",
    dealer: "RAMESH",
    customer: "RAM",
    product: "AC_01",
    qty: 80,
    amount: 10000,
  },
  {
    id: "SI29",
    dealer: "SURESH",
    customer: "SHYAM",
    product: "AC_05",
    qty: 30,
    amount: 45000,
  },
  {
    id: "SI30",
    dealer: "SURESH",
    customer: "SHYAM",
    product: "AC_02",
    qty: 15,
    amount: 60000,
  },
];

const dealerWiseSalesData = [
  { name: "OTHER", sales: 18900 },
  { name: "AC_02", sales: 30000 },
  { name: "AC_03", sales: 15000 },
  { name: "AC_04", sales: 35000 },
  { name: "AC_5", sales: 12000 },
];

const marketerWiseSalesData = [
  { name: "AC_03", value: 52.1 },
  { name: "AC_04", value: 22.8 },
  { name: "AC_02", value: 15.9 },
  { name: "Other", value: 11.2 },
];

// --- Custom Themed Tooltip for Recharts ---
const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={`item-${index}`}
            sx={{ color: entry.color, fontWeight: "bold" }}
          >
            {`${entry.name}: ${entry.value.toLocaleString("en-IN")}${
              entry.unit || ""
            }`}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

// --- Main Component ---
export default function SalesManagement() {
  const theme = useTheme();

  // Using theme colors for charts
  const PIE_CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  return (
    <Box>
      <Stack spacing={3}>
        {/* Sales Entry Table Card */}
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Sales Entry Table
            </Typography>
            <TableContainer sx={{ maxHeight: 280, overflowY: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      "Sale ID",
                      "Dealer",
                      "Customer",
                      "Product",
                      "Qty",
                      "Amount",
                      "Action",
                    ].map((head) => (
                      <TableCell key={head}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesEntryData.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{sale.id}</TableCell>
                      <TableCell>{sale.dealer}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.qty}</TableCell>
                      <TableCell>
                        ₹{sale.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Charts Section */}
      <Grid container spacing={3}>
  {/* Dealer-wise Sales Bar Chart */}
  <Grid item xs={12} md={12}>
    <Card sx={{ height: 400, width: 587, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
          Dealer-wise Sales
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dealerWiseSalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
              <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip nameKey="sales" unit="₹" />} cursor={{ fill: theme.palette.action.hover }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "14px", color: theme.palette.text.secondary }} />
              <Bar dataKey="sales" fill={theme.palette.primary.main} barSize={30} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Marketer-wise Sales Pie Chart */}
  <Grid item xs={12} md={12}>
    <Card sx={{ height: 400, width: 587, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
          Marketer-wise Sales
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketerWiseSalesData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {marketerWiseSalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip nameKey="value" unit="%" />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "14px", color: theme.palette.text.secondary }} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>

      </Stack>
    </Box>
  );
}
