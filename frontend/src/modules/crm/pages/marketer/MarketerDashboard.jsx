// import React from "react";
// import {
//   Box, Grid, Card, CardContent, Typography, Divider, useTheme, Avatar, Table, TableBody, TableCell, TableRow,
// } from "@mui/material";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
// } from "recharts";
// import { PieChart, Pie, Cell } from "recharts";
// import KPI from "../../components/KPIs";

// // Chart data
// const chartData = [
//   { month: "Jan", sales: 12000, target: 10000 },
//   { month: "Feb", sales: 8000, target: 9500 },
//   { month: "Mar", sales: 15000, target: 12000 },
//   { month: "Apr", sales: 14000, target: 13000 },
//   { month: "May", sales: 16000, target: 14000 },
//   { month: "Jun", sales: 12500, target: 13500 },
//   { month: "Jul", sales: 18000, target: 15000 },
// ];

// // KPI data
// const kpiData = [
//   { title: "Target", value: "7,265", change: "+11.01%", trend: "up" },
//   { title: "Sales", value: "2,364", change: "-0.03%", trend: "down" },
//   { title: "New User", value: "72", change: "+11.01%", trend: "up" },
//   { title: "Old User", value: "36", change: "-0.03%", trend: "down" },
// ];

// // Gauge-like Pie Chart data
// const gaugeData = [
//   { name: "AC", value: 1000 },
//   { name: "AC Parts", value: 1300 },
//   { name: "Paid Service", value: 64 },
// ];
// const COLORS = ["#8B5CF6", "#06B6D4", "#3B82F6"];

// // Recent Earning Data
// const earningData = [
//   { date: "Dec 30, 10:06 AM", total: "$3240" },
//   { date: "Dec 29, 2:59 AM", total: "$1172" },
//   { date: "Dec 19, 12:54 AM", total: "$926" },
//   { date: "Dec 23, 2:52 PM", total: "$3505" },
//   { date: "Dec 21, 2:20 PM", total: "$2467" },
//   { date: "Dec 26, 9:46 AM", total: "$640" },
// ];

// export default function MarketerDashboard() {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

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
//       <Grid container spacing={3} mb={3}>
//         {kpiData.map((item, idx) => (
//           <Grid item xs={12} sm={6} md={3} key={idx}>
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
//           <Typography variant="h6" mb={2}>Total Sales Trend</Typography>
//           <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
//           <Box sx={{ width: "100%", height: 250 }}>
//             <ResponsiveContainer>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
//                 <XAxis dataKey="month" stroke={isDark ? "white" : "black"} />
//                 <YAxis stroke={isDark ? "white" : "black"} />
//                 <Tooltip contentStyle={{ backgroundColor: isDark ? "#20262E" : "#FFF" }} />
//                 <Legend wrapperStyle={{ color: isDark ? "white" : "black" }} />
//                 <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} dot={false} />
//                 <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={3} dot={false} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Bottom Section */}
//      {/* Bottom Section */}
// <Grid container spacing={3}>
//   {/* Total Units Sold */}
//   <Grid item xs={12} md={6}>
//     <Card sx={{ ...cardStyle, height:400, width:550, display: "flex", flexDirection: "column" }}>
//       <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Typography variant="h6" mb={2}>Total Units Sold</Typography>
//         <Divider sx={{ mb: 2 }} />
//         <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={gaugeData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={90}
//                 dataKey="value"
//               >
//                 {gaugeData.map((entry, idx) => (
//                   <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </Box>
//         <Box mt={2}>
//           {gaugeData.map((d, i) => (
//             <Typography key={i} sx={{ color: COLORS[i], fontSize: 14 }}>
//               {d.name}: {d.value}
//             </Typography>
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   </Grid>

//   {/* Recent Earnings */}
//   <Grid item xs={12} md={6}>
//     <Card sx={{ ...cardStyle, height: 400, width:575, display: "flex", flexDirection: "column" }}>
//       <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Typography variant="h6" mb={2}>Recent Earnings</Typography>
//         <Divider sx={{ mb: 2 }} />
//         <Box sx={{ flex: 1, overflow: "auto" }}>
//           <Table size="small">
//             <TableBody>
//               {earningData.map((row, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell sx={{ color: isDark ? "white" : "black", fontSize: 14 }}>
//                     {row.date}
//                   </TableCell>
//                   <TableCell
//                     align="right"
//                     sx={{ fontWeight: 600, color: isDark ? "white" : "black", fontSize: 14 }}
//                   >
//                     {row.total}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//       </CardContent>
//     </Card>
//   </Grid>
// </Grid>

//     </Box>
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import KPI from '../../components/KPIs'; // Assuming KPI component is already themed

// --- API Simulation ---
const mockApiData = {
    kpis: [
        { title: "Target", value: "7,265", change: "+11.01%", trend: "up" },
        { title: "Sales", value: "2,364", change: "-0.03%", trend: "down" },
        { title: "New Customers", value: "72", change: "+11.01%", trend: "up" },
        { title: "Old Customers", value: "36", change: "-0.03%", trend: "down" },
    ],
    salesTrend: [
    { month: "Jan", sales: 12000, target: 10000 },
    { month: "Feb", sales: 8000, target: 9500 },
    { month: "Mar", sales: 15000, target: 12000 },
    { month: "Apr", sales: 14000, target: 13000 },
    { month: "May", sales: 16000, target: 14000 },
    { month: "Jun", sales: 12500, target: 13500 },
    { month: "Jul", sales: 18000, target: 15000 },
    { month: "Aug", sales: 17000, target: 15500 },
    { month: "Sep", sales: 14500, target: 14000 },
    { month: "Oct", sales: 15500, target: 15000 },
    { month: "Nov", sales: 16500, target: 16000 },
    { month: "Dec", sales: 11000, target: 10500 },
]
, 
    totalUnits: {
        data: [
            { name: "AC", value: 1000 },
            { name: "AC Parts", value: 1300 },
            { name: "Paid Service", value: 64 },
        ],
    },
    recentEarnings: [
        { date: 'Dec 30, 10:06 AM', total: 3240 },
        { date: 'Dec 29, 2:59 AM', total: 1172 },
        { date: 'Dec 19, 12:54 AM', total: 926 },
        { date: 'Dec 23, 2:52 PM', total: 3505 },
        { date: 'Dec 21, 2:20 PM', total: 2467 },
    ]
};

// --- Reusable Themed Components ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1.5, backdropFilter: 'blur(5px)' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
                {payload.map(pld => (
                    <Typography key={pld.dataKey} sx={{ color: pld.stroke, fontWeight: 500 }}>
                        {pld.name}: ₹{pld.value.toLocaleString('en-IN')}
                    </Typography>
                ))}
            </Card>
        );
    }
    return null;
};

// --- Main Dashboard Component ---
export default function MarketerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    
    // API-ready state
    const [kpiData, setKpiData] = useState([]);
    const [salesTrendData, setSalesTrendData] = useState([]);
    const [totalUnitsData, setTotalUnitsData] = useState({ data: [] });
    const [earningsData, setEarningsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            setKpiData(mockApiData.kpis);
            setSalesTrendData(mockApiData.salesTrend);
            setTotalUnitsData(mockApiData.totalUnits);
            setEarningsData(mockApiData.recentEarnings);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    const PIE_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main];

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
                            <Grid item xs={12} sm={6} md={3} width={280} key={idx}>
                                <KPI {...item} variant={idx % 2 === 0 ? "blue" : (theme.palette.mode === 'dark' ? "dark" : "light")} />
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Sales Line Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Total Sales Trend</Typography>
                        <Box sx={{ height: 250 }}>
                            {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                                        <Line type="monotone" dataKey="sales" name="Sales" stroke={theme.palette.primary.main} strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="target" name="Target" stroke={theme.palette.warning.main} strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Total Units Sold Pie Chart */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 400, width:550,display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Total Units Sold</Typography>
                                <Divider sx={{ mb: 2 }} />
                                {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                    <>
                                        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 0 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={totalUnitsData.data} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={5}>
                                                        {totalUnitsData.data.map((entry, idx) => (
                                                            <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                        <Stack direction="row" justifyContent="center" spacing={2} mt={2} flexWrap="wrap">
                                            {totalUnitsData.data.map((d, i) => (
                                                <Stack key={i} direction="row" alignItems="center" spacing={1}>
                                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <Typography variant="body2">{`${d.name}: ${d.value}`}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Earnings Table */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: 400, width: 550,display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Recent Earnings</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                                    <Table size="small">
                                        <TableBody>
                                            {isLoading ? (
                                                Array.from(new Array(5)).map((_, index) => (
                                                    <TableRow key={index}><TableCell colSpan={2}><Skeleton animation="wave" /></TableCell></TableRow>
                                                ))
                                            ) : (
                                                earningsData.map((row, idx) => (
                                                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell sx={{ color: 'text.secondary' }}>{row.date}</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600 }}>₹{row.total.toLocaleString('en-IN')}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}


