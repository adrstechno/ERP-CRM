import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
 
  RadialBarChart,
  RadialBar,
  

} from "recharts";
import KPI from "../../components/KPIs";

// 🔹 KPI Data for Dealer
const dealerKpiData = [
  { title: "Allocated Stock", value: "7000", change: "+1.01%", trend: "up" },
  { title: "Stock Sold", value: "2360", change: "-0.03%", trend: "down" },
  { title: "Revenue Generated", value: "₹70,00,000", change: "+1.01%", trend: "up" },
  { title: "Pending Payments", value: "36,00,000", change: "-0.03%", trend: "down" },
];

// 🔹 Line Chart Data
const salesData = [
  { month: "Jan", sold: 4000, unsold: 2400 },
  { month: "Feb", sold: 3000, unsold: 1398 },
  { month: "Mar", sold: 2000, unsold: 9800 },
  { month: "Apr", sold: 2780, unsold: 3908 },
  { month: "May", sold: 1890, unsold: 4800 },
  { month: "Jun", sold: 2390, unsold: 3800 },
  { month: "Jul", sold: 3490, unsold: 4300 },
];

// 🔹 Bar Chart Data
const trafficData = [
  { name: "AC_01", value: 12000 },
  { name: "AC_02", value: 18000 },
  { name: "AC_03", value: 9000 },
  { name: "AC_04", value: 25000 },
  { name: "AC_05", value: 16000 },
  { name: "Other", value: 20000 },
];

export default function DealerDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const stockData = [
  { name: "total", value: 4640, fill: "#C135E4" }, // purple-pink
  { name: "Sold", value: 2360, fill: "#3F51B5" }, // blue
];

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
      <Grid container spacing={3} mb={8}>
        {dealerKpiData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
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
          <Typography variant="h6" mb={2}>
            Total Sales Overview
          </Typography>
          <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                />
                <XAxis dataKey="month" stroke={isDark ? "white" : "black"} />
                <YAxis stroke={isDark ? "white" : "black"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#20262E" : "#FFFFFF",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: isDark ? "white" : "black" }}
                />
                <Legend wrapperStyle={{ color: isDark ? "white" : "black" }} />
                <Line type="monotone" dataKey="sold" stroke="#2B75E4" strokeWidth={3} />
                <Line type="monotone" dataKey="unsold" stroke="#FF9800" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Gauge-style (Sold vs Unsold) */}
        <Grid item xs={120} md={9}>
          <Card sx={{ ...cardStyle, p: 4, minHeight: 350 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Stock Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <RadialBarChart
                    cx="60%"
                    cy="70%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={10}
                    startAngle={180}
                    endAngle={0}
                    data={stockData}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="left"
                      wrapperStyle={{
                        fontSize: "14px",
                        color: theme.palette.text.primary,
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </Box>

              <Typography align="center" variant="h4" fontWeight="bold" mt={-6}>
                7000
              </Typography>
              <Typography align="center" variant="body2">
                Total Units
              </Typography>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography color="secondary.main">● Sold</Typography>
                <Typography>{4640}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="info.main">● Unsold</Typography>
                <Typography>{2360}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart Traffic */}
          <Grid item xs={12} md={8}>
    <Card sx={{ ...cardStyle, p: 10, minHeight: 350 }}>
      <CardContent sx={{ pt: 2 }}> 
        <Typography variant="h6" mb={2}>
          Traffic by Device
        </Typography>
        <Divider sx={{ mb: 0}} />
        <Box sx={{ width: "150%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />
              <XAxis dataKey="name" stroke={isDark ? "white" : "black"} />
              <YAxis stroke={isDark ? "white" : "black"} />
              <Tooltip />
              <Bar dataKey="value" fill="#7A3EF3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  </Grid>
      </Grid>
    </Box>
  );
}
