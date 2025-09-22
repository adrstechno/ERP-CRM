// import React from 'react';
// import {
//     Box, Grid, Card, CardContent, Typography, useTheme,
//     Stack, Divider, ToggleButton, ToggleButtonGroup
// } from '@mui/material';
// import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
// // Assuming your KPI component is located here, as in your AdminDashboard
// import KPI from "../../components/KPIs";

// // --- Mock Data ---

// // KPI data for the Subadmin Dashboard
// const kpiData = [
//     { title: 'Target', value: '7,265', change: '+11.01%', trend: 'up' },
//     { title: 'Regional sales', value: '2364', change: '-0.03%', trend: 'down' },
//     { title: 'New User', value: '72', change: '+11.01%', trend: 'up' },
//     { title: 'Old User', value: '36', change: '-0.03%', trend: 'down' },
// ];

// const marketerPerformance = {
//     value: 2364,
//     data: [{ name: 'Performance', value: 2364 }],
//     legend: [{ name: 'AC', value: 1000, color: '#8884d8' }, { name: 'AC Parts', value: 1300, color: '#82ca9d' }, { name: 'Paid Service', value: 64, color: '#ffc658' }]
// };

// const serviceEngPerformance = {
//     value: 5482,
//     data: [{ name: 'Performance', value: 5482 }],
//     legend: [{ name: 'AC', value: 1000, color: '#8884d8' }, { name: 'AC Parts', value: 1300, color: '#82ca9d' }, { name: 'Paid Service', value: 64, color: '#ffc658' }]
// };

// const totalSalesData = [
//     { month: 'Jan', thisYear: 12000, lastYear: 10000 }, { month: 'Feb', thisYear: 18000, lastYear: 15000 }, { month: 'Mar', thisYear: 15000, lastYear: 17000 }, { month: 'Apr', thisYear: 22000, lastYear: 20000 }, { month: 'May', thisYear: 28000, lastYear: 25000 }, { month: 'Jun', thisYear: 24000, lastYear: 29000 }, { month: 'Jul', thisYear: 32000, lastYear: 28000 },
// ];

// // --- Helper Components ---
// const PerformanceGaugeCard = ({ title, performanceData, color }) => {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const cardStyle = { borderRadius: 4, boxShadow: 'none', background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, height: '100%', p: 2 };

//     return (
//         <Card sx={cardStyle}>
//             <CardContent>
//                 <Box sx={{ height: 200, position: 'relative' }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                         <RadialBarChart innerRadius="80%" outerRadius="100%" data={performanceData.data} startAngle={180} endAngle={0} barSize={20}>
//                             <RadialBar background clockWise dataKey="value" cornerRadius={10} fill={color} />
//                         </RadialBarChart>
//                     </ResponsiveContainer>
//                     <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -20%)', textAlign: 'center' }}>
//                         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{performanceData.value.toLocaleString()}</Typography>
//                         <Typography variant="body2" color="text.secondary">{title}</Typography>
//                     </Stack>
//                 </Box>
//                 <Divider sx={{ my: 2 }} />
//                 <Stack spacing={1}>
//                     {performanceData.legend.map(item => (
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" key={item.name}>
//                             <Stack direction="row" alignItems="center" spacing={1}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} /><Typography variant="body2" color="text.secondary">{item.name}</Typography></Stack>
//                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.value.toLocaleString()}</Typography>
//                         </Stack>
//                     ))}
//                 </Stack>
//             </CardContent>
//         </Card>
//     );
// };

// // --- Main Component ---
// export default function SubadminDashboard() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [chartFilter, setChartFilter] = React.useState('This year');
//     const handleChartFilterChange = (event, newFilter) => { if (newFilter !== null) { setChartFilter(newFilter); } };

//     const cardStyle = { borderRadius: 4, boxShadow: 'none', background: isDark ? 'rgba(42, 51, 62, 0.7)' : 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, height: '100%' };

//     return (
//         <Box p={{ xs: 2, sm: 3 }} sx={{ backgroundColor: isDark ? "#262E37" : "#F0F2F5", minHeight: "100vh" }}>
//             <Stack spacing={3}>
//                 {/* KPI Cards (Using your component, just like in AdminDashboard) */}
//                 <Grid container spacing={3} mb={3}>
//                     {kpiData.map((item, idx) => (
//                         <Grid item xs={12} sm={6} md={3} key={idx}>
//                             <KPI
//                                 {...item}
//                                 variant={idx % 2 === 0 ? "blue" : isDark ? "dark" : "light"}
//                             />
//                         </Grid>
//                     ))}
//                 </Grid>

//                 {/* Performance Gauges */}
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} md={6}><PerformanceGaugeCard title="Marketer Performance" performanceData={marketerPerformance} color="#8884d8" /></Grid>
//                     <Grid item xs={12} md={6}><PerformanceGaugeCard title="Service Engg. Performance" performanceData={serviceEngPerformance} color="#82ca9d" /></Grid>
//                 </Grid>

//                 {/* Total Sales Line Chart */}
//                 <Card sx={cardStyle}>
//                     <CardContent>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Sales</Typography>
//                             <ToggleButtonGroup value={chartFilter} exclusive onChange={handleChartFilterChange} size="small">
//                                 <ToggleButton value="Total AC">Total AC</ToggleButton>
//                                 <ToggleButton value="Traveling Expense">Traveling Expense</ToggleButton>
//                                 <ToggleButton value="This year">This year</ToggleButton>
//                                 <ToggleButton value="Last year">Last year</ToggleButton>
//                             </ToggleButtonGroup>
//                         </Stack>
//                         <Box sx={{ height: 300 }}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart data={totalSalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                                     <defs>
//                                         <linearGradient id="thisYearGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} /><stop offset="95%" stopColor="#8884d8" stopOpacity={0} /></linearGradient>
//                                         <linearGradient id="lastYearGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} /><stop offset="95%" stopColor="#82ca9d" stopOpacity={0} /></linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
//                                     <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
//                                     <YAxis stroke={theme.palette.text.secondary} />
//                                     <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(42, 51, 62, 0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', backdropFilter: 'blur(5px)' }} />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="thisYear" stroke="#8884d8" fill="url(#thisYearGradient)" strokeWidth={2} name="This year" />
//                                     <Area type="monotone" dataKey="lastYear" stroke="#82ca9d" fill="url(#lastYearGradient)" strokeWidth={2} name="Last year" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </Box>
//                     </CardContent>
//                 </Card>
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
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import KPI from "../../components/KPIs";

// --- Mock Data ---
const kpiData = [
  { title: "Target", value: "7,265", change: "+11.01%", trend: "up" },
  { title: "Regional sales", value: "2364", change: "-0.03%", trend: "down" },
  { title: "New User", value: "72", change: "+11.01%", trend: "up" },
  { title: "Old User", value: "36", change: "-0.03%", trend: "down" },
];

const marketerPerformance = {
  value: 2364,
  data: [{ name: "Performance", value: 2364 }],
  legend: [
    { name: "AC", value: 1000, color: "#8884d8" },
    { name: "AC Parts", value: 1300, color: "#82ca9d" },
    { name: "Paid Service", value: 64, color: "#ffc658" },
  ],
};

const serviceEngPerformance = {
  value: 5482,
  data: [{ name: "Performance", value: 5482 }],
  legend: [
    { name: "AC", value: 1000, color: "#8884d8" },
    { name: "AC Parts", value: 1300, color: "#82ca9d" },
    { name: "Paid Service", value: 64, color: "#ffc658" },
  ],
};

const totalSalesData = [
  { month: "Jan", thisYear: 12000, lastYear: 10000 },
  { month: "Feb", thisYear: 18000, lastYear: 15000 },
  { month: "Mar", thisYear: 15000, lastYear: 17000 },
  { month: "Apr", thisYear: 22000, lastYear: 20000 },
  { month: "May", thisYear: 28000, lastYear: 25000 },
  { month: "Jun", thisYear: 24000, lastYear: 29000 },
  { month: "Jul", thisYear: 32000, lastYear: 28000 },
  { month: "Aug", thisYear: 28000, lastYear: 17000 },
  { month: "Sep", thisYear: 32000, lastYear: 28000 },
  { month: "Oct", thisYear: 32000, lastYear: 28000 },
  { month: "Nov", thisYear: 32000, lastYear: 28000 },
  { month: "Dec", thisYear: 32000, lastYear: 28000 },
];

// --- Redesigned Performance Gauge Card ---
const PerformanceGaugeCard = ({ title, performanceData, color }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        background: isDark
          ? "linear-gradient(135deg, #3A414B 0%, #20262E 100%)"
      : "linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
          border: `1px solid ${color}`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: isDark ? "#E2E8F0" : "#1A202C",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </Typography>

        {/* Chart */}
        <Box sx={{ height: 220, width :475, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="80%"
              outerRadius="100%"
              data={performanceData.data}
              startAngle={180}
              endAngle={0}
              barSize={22}
            >
              <RadialBar
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
                fill={color}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Value in Center */}
          <Stack
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -30%)",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
              {performanceData.value.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Score
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Legend */}
        <Stack spacing={1}>
          {performanceData.legend.map((item) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              key={item.name}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.name}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#111" }}
              >
                {item.value.toLocaleString()}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};


// --- Main Component ---
export default function SubadminDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [chartFilter, setChartFilter] = React.useState("This year");

  const handleChartFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setChartFilter(newFilter);
    }
  };

  const cardStyle = {
    borderRadius: 4,
    boxShadow: "none",
    background: isDark ? "rgba(42, 51, 62, 0.7)" : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${
      isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
    height: "100%",
  };

  return (
    <Box
      p={{ xs: 2, sm: 3 }}
      sx={{
        backgroundColor: isDark ? "#262E37" : "#F0F2F5",
        minHeight: "100vh",
      }}
    >
      <Stack spacing={3}>
        {/* KPI Cards */}
        <Grid container spacing={3} mb={3}>
          {kpiData.map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <KPI
                {...item}
                variant={idx % 2 === 0 ? "blue" : isDark ? "dark" : "light"}
              />
            </Grid>
          ))}
        </Grid>

        
        {/* Performance Gauges */}
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <PerformanceGaugeCard
              title="Marketer Performance"
              performanceData={marketerPerformance}
              color="#8884d8"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6}>
            <PerformanceGaugeCard
              title="Service Engg. Performance"
              performanceData={serviceEngPerformance}
              color="#82ca9d"
            />
          </Grid>
        </Grid>

        {/* Total Sales Line Chart */}
        <Card sx={cardStyle}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total Sales
              </Typography>
              <ToggleButtonGroup
                value={chartFilter}
                exclusive
                onChange={handleChartFilterChange}
                size="small"
              >
                <ToggleButton value="Total AC">Total AC</ToggleButton>
                <ToggleButton value="Traveling Expense">
                  Traveling Expense
                </ToggleButton>
                <ToggleButton value="This year">This year</ToggleButton>
                <ToggleButton value="Last year">Last year</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={totalSalesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="thisYearGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="lastYearGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={
                      isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark
                        ? "rgba(42, 51, 62, 0.9)"
                        : "rgba(255,255,255,0.9)",
                      borderRadius: "8px",
                      border: "none",
                      backdropFilter: "blur(5px)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="thisYear"
                    stroke="#8884d8"
                    fill="url(#thisYearGradient)"
                    strokeWidth={2}
                    name="This year"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastYear"
                    stroke="#82ca9d"
                    fill="url(#lastYearGradient)"
                    strokeWidth={2}
                    name="Last year"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
