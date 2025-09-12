// // src/pages/AdminDashboard.jsx
// import React from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Divider,
//   useTheme,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// // Example line chart data
// const chartData = [
//   { month: "Jan", sales: 4000, target: 3800 },
//   { month: "Feb", sales: 3000, target: 3500 },
//   { month: "Mar", sales: 5000, target: 4200 },
//   { month: "Apr", sales: 4780, target: 4000 },
//   { month: "May", sales: 5890, target: 4600 },
//   { month: "Jun", sales: 4390, target: 4800 },
//   { month: "Jul", sales: 4490, target: 5000 },
// ];

// // Metric cards
// const metrics = [
//   { title: "Total Sales", value: "70Cr", change: "+11.01%", color: "#568751" },
//   { title: "Target vs Achievement", value: "80%", change: "-0.03%", color: "#9c27b0" },
//   { title: "Pending Service", value: "72", change: "+11.01%", color: "#ff9800" },
//   { title: "Stock Alert", value: "36", change: "-0.03%", color: "#f44336" },
// ];

// export default function AdminDashboard() {
//   const theme = useTheme();

//   return (
//     <Box p={3}>
//       {/* Top metric boxes */}
//       <Grid container spacing={2} mb={3}>
//         {metrics.map((item, idx) => (
//           <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: "flex" }}>
//             <Card
//               sx={{
//                 flex: 1,
//                 minHeight: 140,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: 2,
//                 boxShadow: theme.shadows[3],
//                 backgroundColor: theme.palette.custom.cardBg,
//                 color: theme.palette.text.primary,
//               }}
//             >
//               <CardContent
//                 sx={{
//                   textAlign: "center",
//                   "&:last-child": { pb: 2 },
//                 }}
//               >
//                 <Typography
//                   variant="subtitle2"
//                   sx={{ opacity: 0.85, fontWeight: 500 }}
//                 >
//                   {item.title}
//                 </Typography>
//                 <Typography variant="h5" fontWeight={700}>
//                   {item.value}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     mt: 1,
//                     fontWeight: 600,
//                     color: item.color, // Highlight % change with its own accent
//                   }}
//                 >
//                   {item.change}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Chart Section */}
//       <Card
//         sx={{
//           borderRadius: 2,
//           boxShadow: theme.shadows[3],
//           backgroundColor: theme.palette.custom.cardBg,
//           color: theme.palette.text.primary,
//         }}
//       >
//         <CardContent>
//           <Typography variant="h6" mb={2}>
//             Total Sales
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ width: "100%", height: 350 }}>
//             <ResponsiveContainer>
//               <LineChart data={chartData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={theme.palette.divider}
//                 />
//                 <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
//                 <YAxis stroke={theme.palette.text.secondary} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: theme.palette.background.paper,
//                     border: `1px solid ${theme.palette.divider}`,
//                     borderRadius: 8,
//                   }}
//                   labelStyle={{ color: theme.palette.text.primary }}
//                 />
//                 <Legend />
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
//                   stroke={theme.palette.secondary.main}
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


// import React from "react";
// import { 
//   Box, Grid, Card, CardContent, Typography, Divider, useTheme, List, ListItem, ListItemText 
// } from "@mui/material";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
// import KPI from "../components/KPIs"; // your reusable KPI component

// // Chart data
// const chartData = [
//   { month: "Jan", sales: 4000, target: 3800 },
//   { month: "Feb", sales: 3000, target: 3500 },
//   { month: "Mar", sales: 5000, target: 4200 },
//   { month: "Apr", sales: 4780, target: 4000 },
//   { month: "May", sales: 5890, target: 4600 },
//   { month: "Jun", sales: 4390, target: 4800 },
//   { month: "Jul", sales: 4490, target: 5000 },
// ];

// // KPI data
// const kpiData = [
//   { title: "Sales", value: "70Cr", change: "+11.01%", trend: "up" },
//   { title: "Target vs Achievement", value: "80%", change: "-0.03%", trend: "down" },
//   { title: "Pending Service", value: "72", change: "+11.01%", trend: "up" },
//   { title: "Stock Alert", value: "36", change: "-0.03%", trend: "down" },
// ];

// // Leaderboard mock data
// const leaderboardData = [
//   { dealer: "LAL SINGH CHADDA", sales: "$3940" },
//   { dealer: "Dealer 1", sales: "$15724" },
//   { dealer: "Dealer 2", sales: "$13218" },
//   { dealer: "Dealer 3", sales: "$10432" },
//   { dealer: "Dealer 4", sales: "$14678" },
//   { dealer: "Dealer 5", sales: "$8400" },
// ];

// // Activity Feed
// const activityFeed = [
//   { id: 1, text: "New Dealer Added", time: "Today, 11:59 AM" },
//   { id: 2, text: "Stock Updated", time: "Today, 11:59 AM" },
//   { id: 3, text: "Sales Entry Created", time: "Today, 11:59 AM" },
//   { id: 4, text: "New Dealer Added", time: "Today, 11:59 AM" },
//   { id: 5, text: "Stock Updated", time: "Today, 11:59 AM" },
// ];

// export default function AdminDashboard() {
//   const theme = useTheme();

//   return (
//     <Box p={3} sx={{ backgroundColor: "#1E2328", minHeight: "100vh", color: "white" }}>
      
//       {/* KPI Cards */}
//       <Grid container spacing={3} mb={3}>
//         {kpiData.map((item, idx) => (
//           <Grid item xs={12} sm={6} md={3} key={idx}>
//             <KPI {...item} variant={idx % 2 === 0 ? "blue" : "dark"} />
//           </Grid>
//         ))}
//       </Grid>

//       {/* Line Chart */}
//       <Card
//         sx={{
//           borderRadius: 2,
//           mb: 3,
//           boxShadow: theme.shadows[3],
//           background: "linear-gradient(135deg, #3A414B 0%, #20262E 100%)",
//           color: "white",
//         }}
//       >
//         <CardContent>
//           <Typography variant="h6" mb={2}>
//             Total Sales
//           </Typography>
//           <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
//           <Box sx={{ width: "100%", height: 350 }}>
//             <ResponsiveContainer>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
//                 <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
//                 <YAxis stroke={theme.palette.text.secondary} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#20262E",
//                     border: `1px solid rgba(255,255,255,0.2)`,
//                     borderRadius: 8,
//                   }}
//                   labelStyle={{ color: "white" }}
//                 />
//                 <Legend />
//                 <Line type="monotone" dataKey="sales" stroke="#2B75E4" strokeWidth={3} dot={{ r: 5 }} />
//                 <Line type="monotone" dataKey="target" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Bottom Section: Leaderboard + Activity Feed */}
//       <Grid container spacing={3}>
//         {/* Leaderboard */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               borderRadius: 2,
//               boxShadow: theme.shadows[3],
//               background: "linear-gradient(135deg, #3A414B 0%, #20262E 100%)",
//               color: "white",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" mb={2}>
//                 Dealer Leaderboard
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
//               {leaderboardData.map((dealer, idx) => (
//                 <Box key={idx} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid rgba(255,255,255,0.1)">
//                   <Typography>{dealer.dealer}</Typography>
//                   <Typography>{dealer.sales}</Typography>
//                 </Box>
//               ))}
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Active Feed */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               borderRadius: 2,
//               boxShadow: theme.shadows[3],
//               background: "linear-gradient(135deg, #3A414B 0%, #20262E 100%)",
//               color: "white",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" mb={2}>
//                 Active Feed
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
//               <List>
//                 {activityFeed.map((activity) => (
//                   <ListItem key={activity.id} sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
//                     <ListItemText
//                       primary={<Typography color="white">{activity.text}</Typography>}
//                       secondary={<Typography color="gray">{activity.time}</Typography>}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

import React from "react";
import { 
  Box, Grid, Card, CardContent, Typography, Divider, useTheme, List, ListItem, ListItemText, Avatar 
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import KPI from "../components/KPIs"; // your reusable KPI component
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Chart data
const chartData = [
  { month: "Jan", sales: 4000, target: 3800 },
  { month: "Feb", sales: 3000, target: 3500 },
  { month: "Mar", sales: 5000, target: 4200 },
  { month: "Apr", sales: 4780, target: 4000 },
  { month: "May", sales: 5890, target: 4600 },
  { month: "Jun", sales: 4390, target: 4800 },
  { month: "Jul", sales: 4490, target: 5000 },
];

// KPI data
const kpiData = [
  { title: "Sales", value: "70Cr", change: "+11.01%", trend: "up" },
  { title: "Target vs Achievement", value: "80%", change: "-0.03%", trend: "down" },
  { title: "Pending Service", value: "72", change: "+11.01%", trend: "up" },
  { title: "Stock Alert", value: "36", change: "-0.03%", trend: "down" },
];

// Leaderboard mock data
const leaderboardData = [
  { dealer: "LAL SINGH CHADDA", sales: "$3940" },
  { dealer: "Dealer 1", sales: "$15724" },
  { dealer: "Dealer 2", sales: "$13218" },
  { dealer: "Dealer 3", sales: "$10432" },
  { dealer: "Dealer 4", sales: "$14678" },
  { dealer: "Dealer 5", sales: "$8400" },
];

// Activity Feed
const activityFeed = [
  { id: 1, text: "New Dealer Added", time: "Today, 11:59 AM", icon: <AddBusinessIcon /> },
  { id: 2, text: "Stock Updated", time: "Today, 11:59 AM", icon: <InventoryIcon /> },
  { id: 3, text: "Sales Entry Created", time: "Today, 11:59 AM", icon: <ReceiptLongIcon /> },
  { id: 4, text: "New Dealer Added", time: "Today, 10:32 AM", icon: <AddBusinessIcon /> },
  { id: 5, text: "Stock Updated", time: "Yesterday, 4:10 PM", icon: <InventoryIcon /> },
];

export default function AdminDashboard() {
  const theme = useTheme();

  // Common card styles
  const cardStyle = {
    borderRadius: 2,
    boxShadow: theme.shadows[3],
    background: "linear-gradient(135deg, #3A414B 0%, #20262E 100%)",
    color: "white",
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#1E2328", minHeight: "100vh", color: "white" }}>
      
      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        {kpiData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <KPI {...item} variant={idx % 2 === 0 ? "blue" : "dark"} />
          </Grid>
        ))}
      </Grid>

      {/* Line Chart */}
      <Card sx={{ ...cardStyle, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Total Sales Trend
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
          <Box sx={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#20262E",
                    border: `1px solid rgba(255,255,255,0.2)`,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "white" }}
                />
                <Legend wrapperStyle={{ color: "white" }} />
                <Line type="monotone" dataKey="sales" stroke="#2B75E4" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" stroke="#FF9800" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Leaderboard */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Dealer Leaderboard
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
              {leaderboardData.map((dealer, idx) => (
                <Box 
                  key={idx} 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  py={1} 
                  borderBottom="1px solid rgba(255,255,255,0.1)"
                >
                  <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "#2B75E4", width: 28, height: 28, fontSize: 14 }}>
                      {idx + 1}
                    </Avatar>
                    {dealer.dealer}
                  </Typography>
                  <Typography fontWeight={600}>{dealer.sales}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Activity Feed
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
              <List>
                {activityFeed.map((activity) => (
                  <ListItem 
                    key={activity.id} 
                    sx={{ 
                      borderBottom: "1px solid rgba(255,255,255,0.1)", 
                      display: "flex", 
                      alignItems: "center" 
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#2B75E4", width: 32, height: 32, mr: 2 }}>
                      {activity.icon}
                    </Avatar>
                    <ListItemText
                      primary={<Typography color="white">{activity.text}</Typography>}
                      secondary={<Typography color="gray">{activity.time}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
