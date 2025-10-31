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
import KPI from '../../components/KPIs'; 

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