import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import KPI from "../../components/KPIs";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

// KPI data
const kpiData = [
  { title: "Assigned Tickets", value: "184", change: "+10%", trend: "up" },
  { title: "Pending Tickets", value: "38", change: "-5%", trend: "down" },
  { title: "Completed Tickets", value: "72", change: "+15%", trend: "up" },
];

// Gauge Chart data
const serviceData = [
  { name: "AC", value: 1100, fill: "#9C27B0" },
  { name: "AC Parts", value: 1200, fill: "#2196F3" },
  { name: "Paid Service", value: 64, fill: "#00BCD4" },
];

// Recent services
const recentServices = [
  { date: "Feb 10, 2024", cost: "₹2000" },
  { date: "Feb 12, 2024", cost: "₹1500" },
  { date: "Feb 15, 2024", cost: "₹1800" },
  { date: "Feb 20, 2024", cost: "₹950" },
  { date: "Feb 28, 2024", cost: "₹2400" },
];

export default function EngineerDashboard() {
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
      {/* KPI Cards */}
      <Grid container spacing={15} mb={3} height={120}>
        {kpiData.map((item, idx) => (
          <Grid item xs={12} sm={12} md={3} key={idx} width={300} height={120}>
            <KPI {...item} variant={idx % 2 === 0 ? "blue" : "dark"} />
          </Grid>
        ))}
      </Grid>

      {/* Middle Section */}
      <Grid container spacing={3}>
        {/* Radial Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardStyle, height: 480, width: 500 }}>
            <CardContent>
              <Typography variant="h6" mb={6}>
                Service Breakdown
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <RadialBarChart
                    cx="60%"
                    cy="70%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={20}
                    startAngle={180}
                    endAngle={0}
                    data={[
                      { name: "AC", value: 1100, fill: "#f44336" }, // red
                      { name: "AC Parts", value: 1200, fill: "#2196f3" }, // blue
                      { name: "Paid Service", value: 64, fill: "#4caf50" }, // green
                    ]}
                  >
                    <RadialBar dataKey="value" clockWise cornerRadius={10} />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="left"
                      wrapperStyle={{
                        fontSize: "14px",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </Box>
              <Typography align="center" variant="h4" fontWeight="bold" mt={-10} ml={10}>
                2364
              </Typography>
              <Typography align="center" variant="body2" ml={10}>
                Total Units Serviced
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={5}>
                <Typography color="secondary.main">● AC</Typography>
                <Typography>{1100}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="info.main">● AC Parts</Typography>
                <Typography>{1200}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="primary.main">● Paid Service</Typography>
                <Typography>{64}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Services */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardStyle, height: 450, width: 500 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Recent Services
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {recentServices.map((service, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      borderBottom: `1px solid ${
                        isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                      }`,
                    }}
                  >
                    <ListItemText
                      primary={service.date}
                      secondary="Completed Service"
                    />
                    <Typography fontWeight={600}>{service.cost}</Typography>
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
