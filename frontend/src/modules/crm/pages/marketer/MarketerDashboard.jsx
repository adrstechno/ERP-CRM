import React from "react";
import {
  Box, Grid, Card, CardContent, Typography, Divider, useTheme, Avatar, Table, TableBody, TableCell, TableRow,
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import KPI from "../../components/KPIs";

// Chart data
const chartData = [
  { month: "Jan", sales: 12000, target: 10000 },
  { month: "Feb", sales: 8000, target: 9500 },
  { month: "Mar", sales: 15000, target: 12000 },
  { month: "Apr", sales: 14000, target: 13000 },
  { month: "May", sales: 16000, target: 14000 },
  { month: "Jun", sales: 12500, target: 13500 },
  { month: "Jul", sales: 18000, target: 15000 },
];

// KPI data
const kpiData = [
  { title: "Target", value: "7,265", change: "+11.01%", trend: "up" },
  { title: "Sales", value: "2,364", change: "-0.03%", trend: "down" },
  { title: "New User", value: "72", change: "+11.01%", trend: "up" },
  { title: "Old User", value: "36", change: "-0.03%", trend: "down" },
];

// Gauge-like Pie Chart data
const gaugeData = [
  { name: "AC", value: 1000 },
  { name: "AC Parts", value: 1300 },
  { name: "Paid Service", value: 64 },
];
const COLORS = ["#8B5CF6", "#06B6D4", "#3B82F6"];

// Recent Earning Data
const earningData = [
  { date: "Dec 30, 10:06 AM", total: "$3240" },
  { date: "Dec 29, 2:59 AM", total: "$1172" },
  { date: "Dec 19, 12:54 AM", total: "$926" },
  { date: "Dec 23, 2:52 PM", total: "$3505" },
  { date: "Dec 21, 2:20 PM", total: "$2467" },
  { date: "Dec 26, 9:46 AM", total: "$640" },
];

export default function MarketerDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const cardStyle = {
    borderRadius: 2,
    boxShadow: theme.shadows[3],
    background: isDark
      ? "linear-gradient(135deg, #3A414B 0%, #20262E 100%)"
      : "linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)",
    color: isDark ? "white" : "black",
  };

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: isDark ? "#1E2328" : "#F5F6FA",
        minHeight: "100vh",
        color: isDark ? "white" : "black",
      }}
    >
      {/* KPI Section */}
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

      {/* Sales Line Chart */}
      <Card sx={{ ...cardStyle, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Total Sales Trend</Typography>
          <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
          <Box sx={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                <XAxis dataKey="month" stroke={isDark ? "white" : "black"} />
                <YAxis stroke={isDark ? "white" : "black"} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#20262E" : "#FFF" }} />
                <Legend wrapperStyle={{ color: isDark ? "white" : "black" }} />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Section */}
     {/* Bottom Section */}
<Grid container spacing={3}>
  {/* Total Units Sold */}
  <Grid item xs={12} md={6}>
    <Card sx={{ ...cardStyle, height:400, width:575, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" mb={2}>Total Units Sold</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {gaugeData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box mt={2}>
          {gaugeData.map((d, i) => (
            <Typography key={i} sx={{ color: COLORS[i], fontSize: 14 }}>
              {d.name}: {d.value}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Recent Earnings */}
  <Grid item xs={12} md={6}>
    <Card sx={{ ...cardStyle, height: 400, width:575, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" mb={2}>Recent Earnings</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Table size="small">
            <TableBody>
              {earningData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: isDark ? "white" : "black", fontSize: 14 }}>
                    {row.date}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: isDark ? "white" : "black", fontSize: 14 }}
                  >
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>

    </Box>
  );
}
