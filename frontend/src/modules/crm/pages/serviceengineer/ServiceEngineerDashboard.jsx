// import React from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   useTheme,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
// } from "@mui/material";
// import KPI from "../../components/KPIs";
// import BuildIcon from "@mui/icons-material/Build";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import {
//   ResponsiveContainer,
//   RadialBarChart,
//   RadialBar,
//   Legend,
// } from "recharts";

// // KPI data
// const kpiData = [
//   { title: "Assigned Tickets", value: "184", change: "+10%", trend: "up" },
//   { title: "Pending Tickets", value: "38", change: "-5%", trend: "down" },
//   { title: "Completed Tickets", value: "72", change: "+15%", trend: "up" },
// ];

// // Gauge Chart data
// const serviceData = [
//   { name: "AC", value: 1100, fill: "#9C27B0" },
//   { name: "AC Parts", value: 1200, fill: "#2196F3" },
//   { name: "Paid Service", value: 64, fill: "#00BCD4" },
// ];

// // Recent services
// const recentServices = [
//   { date: "Feb 10, 2024", cost: "₹2000" },
//   { date: "Feb 12, 2024", cost: "₹1500" },
//   { date: "Feb 15, 2024", cost: "₹1800" },
//   { date: "Feb 20, 2024", cost: "₹950" },
//   { date: "Feb 28, 2024", cost: "₹2400" },
// ];

// export default function EngineerDashboard() {
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
//       {/* KPI Cards */}
//       <Grid container spacing={15} mb={3} height={120}>
//         {kpiData.map((item, idx) => (
//           <Grid item xs={12} sm={12} md={3} key={idx} width={300} height={120}>
//             <KPI {...item} variant={idx % 2 === 0 ? "blue" : "dark"} />
//           </Grid>
//         ))}
//       </Grid>

//       {/* Middle Section */}
//       <Grid container spacing={3}>
//         {/* Radial Chart */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ ...cardStyle, height: 480, width: 500 }}>
//             <CardContent>
//               <Typography variant="h6" mb={6}>
//                 Service Breakdown
//               </Typography>
//               <Divider sx={{ mb: 2 }} />
//               <Box sx={{ width: "100%", height: 260 }}>
//                 <ResponsiveContainer>
//                   <RadialBarChart
//                     cx="60%"
//                     cy="70%"
//                     innerRadius="70%"
//                     outerRadius="100%"
//                     barSize={20}
//                     startAngle={180}
//                     endAngle={0}
//                     data={[
//                       { name: "AC", value: 1100, fill: "#f44336" }, // red
//                       { name: "AC Parts", value: 1200, fill: "#2196f3" }, // blue
//                       { name: "Paid Service", value: 64, fill: "#4caf50" }, // green
//                     ]}
//                   >
//                     <RadialBar dataKey="value" clockWise cornerRadius={10} />
//                     <Legend
//                       iconSize={10}
//                       layout="vertical"
//                       verticalAlign="middle"
//                       align="left"
//                       wrapperStyle={{
//                         fontSize: "14px",
//                       }}
//                     />
//                   </RadialBarChart>
//                 </ResponsiveContainer>
//               </Box>
//               <Typography align="center" variant="h4" fontWeight="bold" mt={-10} ml={10}>
//                 2364
//               </Typography>
//               <Typography align="center" variant="body2" ml={10}>
//                 Total Units Serviced
//               </Typography>
//               <Box display="flex" justifyContent="space-between" mt={5}>
//                 <Typography color="secondary.main">● AC</Typography>
//                 <Typography>{1100}</Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography color="info.main">● AC Parts</Typography>
//                 <Typography>{1200}</Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography color="primary.main">● Paid Service</Typography>
//                 <Typography>{64}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Recent Services */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ ...cardStyle, height: 450, width: 500 }}>
//             <CardContent>
//               <Typography variant="h6" mb={2}>
//                 Recent Services
//               </Typography>
//               <Divider sx={{ mb: 2 }} />
//               <List>
//                 {recentServices.map((service, idx) => (
//                   <ListItem
//                     key={idx}
//                     sx={{
//                       borderBottom: `1px solid ${
//                         isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
//                       }`,
//                     }}
//                   >
//                     <ListItemText
//                       primary={service.date}
//                       secondary="Completed Service"
//                     />
//                     <Typography fontWeight={600}>{service.cost}</Typography>
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

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import {
    RadialBarChart, RadialBar, ResponsiveContainer
} from 'recharts';
import KPI from '../../components/KPIs';
import BuildIcon from '@mui/icons-material/Build';
import EventNoteIcon from '@mui/icons-material/EventNote';

// --- API Simulation ---
const mockApiData = {
    kpis: [
        { title: "Assigned Tickets", value: "184", change: "+10%", trend: "up" },
        { title: "Pending Tickets", value: "38", change: "-5%", trend: "down" },
        { title: "Completed Tickets", value: "72", change: "+15%", trend: "up" },
    ],
    serviceBreakdown: {
        total: 2364,
        data: [
            { name: "AC", value: 1100 },
            { name: "AC Parts", value: 1200 },
            { name: "Paid Service", value: 64 },
        ],
    },
    recentServices: [
        { id: 1, date: "Feb 10, 2024", cost: 2000, description: "AC General Service" },
        { id: 2, date: "Feb 12, 2024", cost: 1500, description: "Filter Replacement" },
        { id: 3, date: "Feb 15, 2024", cost: 1800, description: "Cooling Coil Repair" },
        { id: 4, date: "Feb 20, 2024", cost: 950, description: "Thermostat Check" },
        { id: 5, date: "Feb 28, 2024", cost: 2400, description: "Compressor Gas Refill" },
    ]
};

// --- Main Dashboard Component ---
export default function EngineerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    
    // API-ready state
    const [kpiData, setKpiData] = useState([]);
    const [serviceData, setServiceData] = useState(null);
    const [recentServices, setRecentServices] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setKpiData(mockApiData.kpis);
        setServiceData(mockApiData.serviceBreakdown);
        setRecentServices(mockApiData.recentServices);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    
    const RADIAL_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main];

    return (
        <Box>
            <Stack spacing={3}>
                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {isLoading ? (
                        Array.from(new Array(3)).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}><Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} /></Grid>
                        ))
                    ) : (
                        kpiData.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <KPI {...item} variant={["blue", "dark", "light"][idx % 3]} />
                            </Grid>
                        ))
                    )}
                </Grid>

                <Grid container spacing={3}>
                    {/* Service Breakdown Radial Chart */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <BuildIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Breakdown</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                {isLoading || !serviceData ? <Skeleton variant="rectangular" height={350} /> : (
                                    <>
                                        <Box sx={{ height: 250, position: "relative" }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ value: serviceData.total }]} startAngle={90} endAngle={-270} barSize={25}>
                                                    <RadialBar background clockWise dataKey="value" cornerRadius={12} fill={theme.palette.primary.main} />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                            <Stack sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                                <Typography variant="h3" sx={{ fontWeight: "bold", color: 'primary.main' }}>{serviceData.total.toLocaleString()}</Typography>
                                                <Typography variant="body2" color="text.secondary">Total Units Serviced</Typography>
                                            </Stack>
                                        </Box>
                                        <Stack spacing={1.5} mt={2}>
                                            {serviceData.data.map((item, index) => (
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" key={item.name}>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: RADIAL_COLORS[index] }} />
                                                        <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                                                    </Stack>
                                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.value.toLocaleString()}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Services Table */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ height: '100%' }}>
                             <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <EventNoteIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Services</Typography>
                                </Stack>
                                <Divider sx={{ mb: 1 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                             {isLoading ? (
                                                 Array.from(new Array(5)).map((_, index) => (
                                                    <TableRow key={index}><TableCell colSpan={2}><Skeleton animation="wave" /></TableCell></TableRow>
                                                ))
                                            ) : (
                                                recentServices.map((service) => (
                                                    <TableRow key={service.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{service.date}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{service.description}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                            ₹{service.cost.toLocaleString('en-IN')}
                                                        </TableCell>
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

