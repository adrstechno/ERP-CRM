import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { VITE_API_BASE_URL } from "../../utils/State";

// --- Custom Tooltip for Charts ---
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

export default function SalesManagement() {
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart color palette
  const PIE_CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const authKey = localStorage.getItem("authKey");
        const response = await axios.get(`${VITE_API_BASE_URL}/sales/get-all-sales`,
          {
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                    },
                }
        );
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

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
                    {["Sale ID", "Date", "Customer", "Created By", "Amount", "Status","Action"].map((head) => (
                      <TableCell key={head}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Loading sales...
                      </TableCell>
                    </TableRow>
                  ) : salesData.length > 0 ? (
                    salesData.map((sale) => (
                      <TableRow key={sale.saleId} hover>
                        <TableCell>{sale.saleId}</TableCell>
                        <TableCell>{sale.saleDate}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>{sale.createdBy}</TableCell>

                        
                        <TableCell>
                          ₹{sale.totalAmount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>{sale.saleStatus}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No sales found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Dealer-wise Sales Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400,  width: 600}}>
              <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                  Dealer-wise Sales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="customerName" stroke={theme.palette.text.secondary} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                      <Legend />
                      <Bar dataKey="totalAmount" fill={theme.palette.primary.main} barSize={30} radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sale Status Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 ,width: 500 }}>
              <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                  Sale Status Distribution
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Pending", value: salesData.filter(s => s.saleStatus === "PENDING").length },
                          { name: "APPROVED", value: salesData.filter(s => s.saleStatus === "APPROVED").length },
                          { name: "Cancelled", value: salesData.filter(s => s.saleStatus === "CANCELLED").length },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {["PENDING", "COMPLETED", "CANCELLED"].map((_, i) => (
                          <Cell key={`cell-${i}`} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
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
