// import React from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
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
//   BarChart,
//   Bar,
 
//   RadialBarChart,
//   RadialBar,
  

// } from "recharts";
// import KPI from "../../components/KPIs";

// // 🔹 KPI Data for Dealer
// const dealerKpiData = [
//   { title: "Allocated Stock", value: "7000", change: "+1.01%", trend: "up" },
//   { title: "Stock Sold", value: "2360", change: "-0.03%", trend: "down" },
//   { title: "Revenue Generated", value: "₹70,00,000", change: "+1.01%", trend: "up" },
//   { title: "Pending Payments", value: "36,00,000", change: "-0.03%", trend: "down" },
// ];

// // 🔹 Line Chart Data
// const salesData = [
//   { month: "Jan", sold: 4000, unsold: 2400 },
//   { month: "Feb", sold: 3000, unsold: 1398 },
//   { month: "Mar", sold: 2000, unsold: 9800 },
//   { month: "Apr", sold: 2780, unsold: 3908 },
//   { month: "May", sold: 1890, unsold: 4800 },
//   { month: "Jun", sold: 2390, unsold: 3800 },
//   { month: "Jul", sold: 3490, unsold: 4300 },
// ];

// // 🔹 Bar Chart Data
// const trafficData = [
//   { name: "AC_01", value: 12000 },
//   { name: "AC_02", value: 18000 },
//   { name: "AC_03", value: 9000 },
//   { name: "AC_04", value: 25000 },
//   { name: "AC_05", value: 16000 },
//   { name: "Other", value: 20000 },
// ];

// export default function DealerDashboard() {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";
//   const stockData = [
//   { name: "total", value: 4640, fill: "#C135E4" }, // purple-pink
//   { name: "Sold", value: 2360, fill: "#3F51B5" }, // blue
// ];

//   const cardStyle = {
//     borderRadius: 2,
//     boxShadow: theme.shadows[3],
//     background: isDark
//       ? "linear-gradient(135deg, #3A414B 0%, #20262E 100%)"
//       : "linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)",
//     color: isDark ? "white" : "black",
//   };

//   return (
//     <Box
//       p={3}
//       sx={{
//         backgroundColor: isDark ? "#1E2328" : "#F5F6FA",
//         minHeight: "100vh",
//         color: isDark ? "white" : "black",
//       }}
//     >
//       {/* KPI Section */}
//       <Grid container spacing={3} mb={8}>
//         {dealerKpiData.map((item, idx) => (
//           <Grid item xs={12} sm={6} md={4} key={idx}>
//             <KPI
//               {...item}
//               variant={idx % 2 === 0 ? "blue" : isDark ? "dark" : "light"}
//             />
//           </Grid>
//         ))}
//       </Grid>

//       {/* Sales Line Chart */}
//       <Card sx={{ ...cardStyle, mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" mb={2}>
//             Total Sales Overview
//           </Typography>
//           <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
//           <Box sx={{ width: "100%", height: 300 }}>
//             <ResponsiveContainer>
//               <LineChart data={salesData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
//                 />
//                 <XAxis dataKey="month" stroke={isDark ? "white" : "black"} />
//                 <YAxis stroke={isDark ? "white" : "black"} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: isDark ? "#20262E" : "#FFFFFF",
//                     border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
//                     borderRadius: 8,
//                   }}
//                   labelStyle={{ color: isDark ? "white" : "black" }}
//                 />
//                 <Legend wrapperStyle={{ color: isDark ? "white" : "black" }} />
//                 <Line type="monotone" dataKey="sold" stroke="#2B75E4" strokeWidth={3} />
//                 <Line type="monotone" dataKey="unsold" stroke="#FF9800" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Bottom Section */}
//       <Grid container spacing={3}>
//         {/* Gauge-style (Sold vs Unsold) */}
//         <Grid item xs={120} md={9}>
//           <Card sx={{ ...cardStyle, p: 4, minHeight: 350 , width: 550,}}>
//             <CardContent>
//               <Typography variant="h6" mb={2}>
//                 Stock Performance
//               </Typography>
//               <Divider sx={{ mb: 2 }} />

//               <Box sx={{ width: "100%", height: 260 }}>
//                 <ResponsiveContainer>
//                   <RadialBarChart
//                     cx="60%"
//                     cy="70%"
//                     innerRadius="70%"
//                     outerRadius="100%"
//                     barSize={10}
//                     startAngle={180}
//                     endAngle={0}
//                     data={stockData}
//                   >
//                     <RadialBar
//                       minAngle={15}
//                       background
//                       clockWise
//                       dataKey="value"
//                     />
//                     <Legend
//                       iconSize={10}
//                       layout="vertical"
//                       verticalAlign="middle"
//                       align="left"
//                       wrapperStyle={{
//                         fontSize: "14px",
//                         color: theme.palette.text.primary,
//                       }}
//                     />
//                   </RadialBarChart>
//                 </ResponsiveContainer>
//               </Box>

//               <Typography align="center" variant="h4" fontWeight="bold" mt={-6}>
//                 7000
//               </Typography>
//               <Typography align="center" variant="body2">
//                 Total Units
//               </Typography>

//               <Box display="flex" justifyContent="space-between" mt={2}>
//                 <Typography color="secondary.main">● Sold</Typography>
//                 <Typography>{4640}</Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography color="info.main">● Unsold</Typography>
//                 <Typography>{2360}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Bar Chart Traffic */}
//           <Grid item xs={13} md={5}>
//     <Card sx={{ ...cardStyle, p: 2, minHeight: 350, width: 576, }}>
//       <CardContent sx={{ pt: 2 }}> 
//         <Typography variant="h6" mb={2}>
//           Traffic by Device
//         </Typography>
//         <Divider sx={{ mb: 4 }} />
//         <Box sx={{ width: 525, height: 350 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={trafficData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
//               />
//               <XAxis dataKey="name" stroke={isDark ? "white" : "black"} />
//               <YAxis stroke={isDark ? "white" : "black"} />
//               <Tooltip />
//               <Bar dataKey="value" fill="#7A3EF3" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>
//       </CardContent>
//     </Card>
//   </Grid>
//       </Grid>
//     </Box>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';
import KPI from '../../components/KPIs'; // Assuming KPI component is themed
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';

// --- API Simulation ---
const mockApiData = {
    kpis: [
        { title: "Allocated Stock", value: "7,000", change: "+1.01%", trend: "up" },
        { title: "Stock Sold", value: "2,360", change: "-0.03%", trend: "down" },
        { title: "Revenue Generated", value: "₹70,00,000", change: "+1.01%", trend: "up" },
        { title: "Pending Payments", value: "₹36,00,000", change: "-0.03%", trend: "down" },
    ],
    salesOverview: [
        { month: "Jan", sold: 4000, unsold: 2400 },
        { month: "Feb", sold: 3000, unsold: 1398 },
        { month: "Mar", sold: 2000, unsold: 9800 },
        { month: "Apr", sold: 2780, unsold: 3908 },
        { month: "May", sold: 1890, unsold: 4800 },
    ],
    stockPerformance: { total: 7000, sold: 2360 },
    trafficByDevice: [
        { name: "AC_01", value: 12000 },
        { name: "AC_02", value: 18000 },
        { name: "AC_03", value: 9000 },
        { name: "AC_04", value: 25000 },
        { name: "AC_05", value: 16000 },
    ]
};

// --- Reusable Themed Components ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
                {payload.map(pld => (
                    <Typography key={pld.dataKey} sx={{ color: pld.stroke || pld.fill, fontWeight: 500 }}>
                        {`${pld.name}: ${pld.value.toLocaleString('en-IN')}`}
                    </Typography>
                ))}
            </Card>
        );
    }
    return null;
};

// --- Main Dashboard Component ---
export default function DealerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // API-ready state
    const [kpiData, setKpiData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [stockData, setStockData] = useState(null);
    const [trafficData, setTrafficData] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setKpiData(mockApiData.kpis);
        setSalesData(mockApiData.salesOverview);
        setStockData(mockApiData.stockPerformance);
        setTrafficData(mockApiData.trafficByDevice);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stockPerformanceChartData = stockData ? [{ name: 'Sold', value: stockData.sold, fill: theme.palette.primary.main }] : [];

    return (
        <Box>
            <Stack spacing={3}>
                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {isLoading ? (
                        Array.from(new Array(4)).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}><Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} /></Grid>
                        ))
                    ) : (
                        kpiData.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <KPI {...item} variant={["blue", "dark", "light", "dark"][idx % 4]} />
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Sales Line Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Total Sales Overview</Typography>
                        <Box sx={{ height: 300 }}>
                            {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                                        <Line type="monotone" dataKey="sold" name="Stock Sold" stroke={theme.palette.primary.main} strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="unsold" name="Stock Unsold" stroke={theme.palette.warning.main} strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Stock Performance */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ height: '100%', width: 550 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <InventoryIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Stock Performance</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                {isLoading || !stockData ? <Skeleton variant="rectangular" height={300} /> : (
                                    <Box sx={{ height: 300, position: 'relative' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                             <RadialBarChart innerRadius="80%" outerRadius="100%" data={stockPerformanceChartData} startAngle={90} endAngle={-270} barSize={25}>
                                                <RadialBar background clockWise dataKey="value" cornerRadius={12} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{`${((stockData.sold / stockData.total) * 100).toFixed(0)}%`}</Typography>
                                            <Typography variant="body2" color="text.secondary">Sold vs Allocated</Typography>
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Selling Products */}
                    <Grid item xs={12} lg={9}>
                        <Card sx={{ height: '100%' , width: 550 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <TrendingUpIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Top Selling Products</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ height: 300 }}>
                                {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={trafficData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor={theme.palette.primary.dark} stopOpacity={0.9}/>
                                                    <stop offset="100%" stopColor={theme.palette.primary.light} stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider}/>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={60} stroke={theme.palette.text.secondary} fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }}/>
                                            <Bar dataKey="value" name="Units Sold" fill="url(#barGradient)" barSize={20} radius={[0, 10, 10, 0]}/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

