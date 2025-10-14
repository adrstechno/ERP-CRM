
// // import React from "react";
// // import {
// //   Box,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Typography,
// //   Divider,
// //   useTheme,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Avatar,
// // } from "@mui/material";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   CartesianGrid,
// //   Legend,
// // } from "recharts";
// // import KPI from "../../components/KPIs";
// // import AddBusinessIcon from "@mui/icons-material/AddBusiness";
// // import InventoryIcon from "@mui/icons-material/Inventory";
// // import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// // import { VITE_API_BASE_URL } from "../../utils/State";

// // // Static data remains the same
// // const chartData = [
// //   { month: "Jan", sales: 4000, target: 3800 },
// //   { month: "Feb", sales: 3000, target: 3500 },
// //   { month: "Mar", sales: 5000, target: 4200 },
// //   { month: "Apr", sales: 4780, target: 4000 },
// //   { month: "May", sales: 5890, target: 4600 },
// //   { month: "Jun", sales: 4390, target: 4800 },
// //   { month: "Jul", sales: 4490, target: 5000 },
// // ];

// // const kpiData = [
// //   { title: "Sales", value: "70Cr", change: "+11.01%", trend: "up" },
// //   { title: "Target vs Achievement", value: "80%", change: "-0.03%", trend: "down" },
// //   { title: "Pending Service", value: "72", change: "+11.01%", trend: "up" },
// //   { title: "Stock Alert", value: "36", change: "-0.03%", trend: "down" },
// // ];


// // export default function AdminDashboard() {
// //   const theme = useTheme(); // To access theme colors for the chart

// //   return (
// //     <Box>
// //       {/* KPI Cards */}
// //       <Grid container spacing={3} mb={3}>
// //         {kpiData.map((item, idx) => (
// //           <Grid item xs={12} sm={6} md={3} key={idx}>
// //             <KPI
// //               {...item}
// //               // Alternate between 'blue' and another variant for visual distinction
// //               variant={idx % 2 === 0 ? "blue" : (theme.palette.mode === 'dark' ? "dark" : "light")}
// //             />
// //           </Grid>
// //         ))}
// //       </Grid>

// //       {/* Line Chart */}
// //       <Card sx={{ mb: 3 }}>
// //         <CardContent>
// //           <Typography variant="h6" mb={2}>
// //             Total Sales Trend
// //           </Typography>
// //           <Divider sx={{ mb: 2 }} />
// //           <Box sx={{ width: "100%", height: 350 }}>
// //             <ResponsiveContainer>
// //               <LineChart data={chartData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
// //                 <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
// //                 <YAxis stroke={theme.palette.text.secondary} />
// //                 <Tooltip
// //                   contentStyle={{
// //                     backgroundColor: theme.palette.background.paper,
// //                     border: `1px solid ${theme.palette.divider}`,
// //                     borderRadius: 8,
// //                     color: theme.palette.text.primary,
// //                   }}
// //                   labelStyle={{ color: theme.palette.text.primary }}
// //                 />
// //                 <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
// //                 <Line type="monotone" dataKey="sales" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 5 }} />
// //                 <Line type="monotone" dataKey="target" stroke="#FF9800" strokeWidth={3} dot={{ r: 5 }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </Box>
// //         </CardContent>
// //       </Card>
// //     </Box>
// //   );
// // }


// import React from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   useTheme,
// } from '@mui/material';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from 'recharts';

// // KPI Component (from your previous message, included for completeness)
// const ArrowUp = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 4L3 15H9V20H15V15H21L12 4Z" />
//   </svg>
// );

// const ArrowDown = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 20L21 9H15V4H9V9H3L12 20Z" />
//   </svg>
// );

// function KPI({ title, value, change, trend, variant = 'blue' }) {
//   const theme = useTheme();

//   const gradients = {
//     blue: 'linear-gradient(135deg, #0f356d 0%, #1d51a5 100%)',
//     dark: 'linear-gradient(135deg, #292a2c 0%, #c3cfdc 100%)',
//     light: 'linear-gradient(135deg, #f5f7fa 0%, #d3dce6 100%)',
//   };

//   const backgroundGradient = gradients[variant] || gradients.blue;
//   const textColor = variant === 'light' ? theme.palette.text.primary : 'white';
//   const changeBgColor = variant === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         background: backgroundGradient,
//         boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
//         minHeight: 120,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         flex: 1,
//         height: '100%',
//         color: textColor,
//       }}
//     >
//       <CardContent sx={{ p: 2, flexGrow: 1 }}>
//         <Typography
//           variant="subtitle1"
//           sx={{
//             opacity: 0.9,
//             fontWeight: 500,
//             lineHeight: 1.2,
//             fontFamily: 'Inter, sans-serif',
//           }}
//         >
//           {title || 'N/A'}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5 }}>
//           <Typography
//             variant="h4"
//             fontWeight={700}
//             sx={{ fontFamily: 'Inter, sans-serif' }}
//           >
//             {value || 'N/A'}
//           </Typography>
//           {change && (
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: changeBgColor,
//                 borderRadius: '12px',
//                 padding: '2px 8px',
//                 ml: 1.5,
//               }}
//             >
//               {trend === 'up' ? <ArrowUp /> : <ArrowDown />}
//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: 600,
//                   color: textColor,
//                   ml: 0.5,
//                   fontFamily: 'Inter, sans-serif',
//                 }}
//               >
//                 {change}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// // Static data
// const chartData = [
//   { month: 'Jan', sales: 4000, target: 3800 },
//   { month: 'Feb', sales: 3000, target: 3500 },
//   { month: 'Mar', sales: 5000, target: 4200 },
//   { month: 'Apr', sales: 4780, target: 4000 },
//   { month: 'May', sales: 5890, target: 4600 },
//   { month: 'Jun', sales: 4390, target: 4800 },
//   { month: 'Jul', sales: 4490, target: 5000 },
// ];

// const kpiData = [
//   { id: '1', title: 'Sales', value: '70Cr', change: '+11.01%', trend: 'up' },
//   { id: '2', title: 'Target vs Achievement', value: '80%', change: '-0.03%', trend: 'down' },
//   { id: '3', title: 'Pending Service', value: '72', change: '+11.01%', trend: 'up' },
//   { id: '4', title: 'Stock Alert', value: '36', change: '-0.03%', trend: 'down' },
// ];

// // AdminDashboard Component
// export default function AdminDashboard() {
//   const theme = useTheme();

//   return (
//     <Box sx={{ p: 3, width: '100%' }}>
//       {/* KPI Cards */}
//       <Grid
//         container
//         spacing={2}
//         sx={{
//           mb: 3,
//           justifyContent: kpiData.length === 1 ? 'center' : 'space-between',
//           alignItems: 'stretch',
//         }}
//       >
//         {kpiData.length > 0 ? (
//           kpiData.map((item, idx) => (
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={12 / Math.min(kpiData.length, 4)} // Dynamic width, max 4 per row
//               key={item.id || idx} // Prefer id for stable keys
//               sx={{
//                 display: 'flex',
//                 minWidth: { md: 200 }, // Prevent cards from being too narrow
//               }}
//             >
//               <KPI
//                 {...item}
//                 variant={idx % 2 === 0 ? 'blue' : theme.palette.mode === 'dark' ? 'dark' : 'light'}
//               />
//             </Grid>
//           ))
//         ) : (
//           <Grid item xs={12}>
//             <Typography variant="body1" color="text.secondary" align="center">
//               No KPI data available
//             </Typography>
//           </Grid>
//         )}
//       </Grid>

//       {/* Line Chart */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" mb={2} fontWeight="bold">
//             Total Sales Trend
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 350 } }}>
//             <ResponsiveContainer>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
//                 <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
//                 <YAxis stroke={theme.palette.text.secondary} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: theme.palette.background.paper,
//                     border: `1px solid ${theme.palette.divider}`,
//                     borderRadius: 8,
//                     color: theme.palette.text.primary,
//                   }}
//                   labelStyle={{ color: theme.palette.text.primary }}
//                 />
//                 <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke={theme.palette.primary.main}
//                   strokeWidth={3}
//                   dot={{ r: 5 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="target"
//                   stroke="#FF9800"
//                   strokeWidth={3}
//                   dot={{ r: 5 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
// AdminDashboard.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import KPI from '../../components/KPIs'; // Adjust path based on your project structure

// Static data
const chartData = [
  { month: 'Jan', sales: 4000, target: 3800 },
  { month: 'Feb', sales: 3000, target: 3500 },
  { month: 'Mar', sales: 5000, target: 4200 },
  { month: 'Apr', sales: 4780, target: 4000 },
  { month: 'May', sales: 5890, target: 4600 },
  { month: 'Jun', sales: 4390, target: 4800 },
  { month: 'Jul', sales: 4490, target: 5000 },
];

const kpiData = [
  { id: '1', title: 'Sales', value: '70Cr', change: '+11.01%', trend: 'up' },
  { id: '2', title: 'Target vs Achievement', value: '80%', change: '-0.03%', trend: 'down' },
  { id: '3', title: 'Pending Service', value: '72', change: '+11.01%', trend: 'up' },
  { id: '4', title: 'Stock Alert', value: '36', change: '-0.03%', trend: 'down' },
];

export default function AdminDashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
      {/* KPI Cards */}
      <Grid
        container
        spacing={1} // Reduced spacing for tighter layout
        sx={{
          mb: 3,
          justifyContent: kpiData.length === 1 ? 'center' : 'space-between',
          alignItems: 'stretch',
        }}
      >
        {kpiData.length > 0 ? (
          kpiData.map((item, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={12 / Math.min(kpiData.length, 4)} // Dynamic width, max 4 per row
              key={item.id || idx}
              sx={{
                display: 'flex',
                minWidth: { md: 200 }, // Prevent cards from being too narrow
                maxWidth: { md: 300 }, // Cap card width for balance
              }}
            >
              <KPI
                {...item}
                variant={idx % 2 === 0 ? 'blue' : theme.palette.mode === 'dark' ? 'dark' : 'light'}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No KPI data available
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Line Chart */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Total Sales Trend
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ width: '100%', height: { xs: 200, sm: 250, md: 300, lg: 350 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="month"
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  tickMargin={5}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  tickMargin={5}
                  tickFormatter={(value) => `${value / 1000}k`} // Simplify Y-axis labels
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                    color: theme.palette.text.primary,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                  formatter={(value) => `${value}`}
                />
                <Legend
                  wrapperStyle={{
                    color: theme.palette.text.primary,
                    fontSize: 12,
                    paddingTop: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#FF9800"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}