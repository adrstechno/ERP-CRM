import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
  Skeleton,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import KPI from '../../components/KPIs';
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1.5, minWidth: 150 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={`item-${index}`}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {`${entry.name}: ${typeof entry.value === 'number' 
              ? entry.value.toLocaleString('en-IN') 
              : entry.value}`}
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

// Colors for charts
const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

export default function AdminDashboard() {
  const theme = useTheme();
  
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API configuration
  const token = localStorage.getItem('authKey');
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch main dashboard data
      const dashboardResponse = await fetch(`${VITE_API_BASE_URL}/dashboard`, {
        headers: axiosConfig.headers,
      });
      
      if (dashboardResponse.ok) {
        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult.data);
      }

      // Fetch payment statistics
      const paymentStatsResponse = await fetch(`${VITE_API_BASE_URL}/payments/statistics`, {
        headers: axiosConfig.headers,
      });
      
      if (paymentStatsResponse.ok) {
        const paymentStatsResult = await paymentStatsResponse.json();
        setPaymentStats(paymentStatsResult.data);
      }

      // Fetch monthly payment collection
      const monthlyPaymentsResponse = await fetch(`${VITE_API_BASE_URL}/payments/monthly-collection`, {
        headers: axiosConfig.headers,
      });
      
      if (monthlyPaymentsResponse.ok) {
        const monthlyPaymentsResult = await monthlyPaymentsResponse.json();
        if (monthlyPaymentsResult.success && monthlyPaymentsResult.data) {
          const processedData = monthlyPaymentsResult.data.map(item => ({
            month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: item.totalAmount || 0,
          }));
          setMonthlyPayments(processedData);
        }
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Process KPI data
  const kpiData = useMemo(() => {
    // Combine dashboard data and payment stats for comprehensive KPIs
    const totalSales = dashboardData?.totalSales || 0;
    const totalPayments = paymentStats?.totalPayments || dashboardData?.totalPayments || 0;
    const outstandingPayments = paymentStats?.outstandingPayments || dashboardData?.outstandingPayments || 0;
    const totalExpenses = dashboardData?.totalExpenses || 0;
    const thisMonthCollection = paymentStats?.thisMonthCollection || 0;
    
    const netProfit = totalPayments - totalExpenses;
    const profitMargin = totalSales ? ((netProfit / totalSales) * 100).toFixed(1) : 0;
    
    return [
      {
        id: '1',
        title: 'Total Sales',
        value: `₹${totalSales.toLocaleString('en-IN')}`,
        change: '+0%',
        trend: 'up',
        icon: <ShoppingCart size={20} />,
      },
      {
        id: '2',
        title: 'Total Payments',
        value: `₹${totalPayments.toLocaleString('en-IN')}`,
        change: '+0%',
        trend: 'up',
        icon: <DollarSign size={20} />,
      },
      {
        id: '3',
        title: 'Outstanding',
        value: `₹${outstandingPayments.toLocaleString('en-IN')}`,
        change: '0%',
        trend: outstandingPayments > 0 ? 'down' : 'up',
        icon: <AlertTriangle size={20} />,
      },
      {
        id: '4',
        title: 'This Month',
        value: `₹${thisMonthCollection.toLocaleString('en-IN')}`,
        change: `${profitMargin}%`,
        trend: thisMonthCollection >= 0 ? 'up' : 'down',
        icon: thisMonthCollection >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />,
      },
    ];
  }, [dashboardData, paymentStats]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '100%' }}>
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <KPI
              {...item}
              variant={idx % 2 === 0 ? 'blue' : theme.palette.mode === 'dark' ? 'dark' : 'light'}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Payment Trends Chart */}
        {monthlyPayments.length > 0 && (
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Monthly Payment Collection Trends
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyPayments}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis 
                        dataKey="month" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Payment Collection"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* User Stats Pie Chart */}
        {dashboardData?.userStats && dashboardData.userStats.length > 0 && (
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Users by Role
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.userStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="totalUsers"
                        nameKey="role"
                      >
                        {dashboardData.userStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
        )}
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Top Products Table */}
        {dashboardData?.topProducts && dashboardData.topProducts.length > 0 && (
          <Grid item xs={16} lg={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Top Selling Products
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity Sold</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.topProducts.map((product, index) => (
                        <TableRow key={product.productId} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Chip 
                                label={index + 1} 
                                size="small" 
                                color={index < 3 ? 'primary' : 'default'}
                              />
                              <Typography variant="body2">
                                {product.productName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            {product.quantitySold.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell align="right">
                            ₹{product.revenue.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Sales by Category */}
        {dashboardData?.salesByCategory && dashboardData.salesByCategory.length > 0 && (
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Sales by Category
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.salesByCategory} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis 
                        type="number"
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis 
                        type="category"
                        dataKey="category"
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="totalRevenue" 
                        fill={theme.palette.secondary.main}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* No Data Message */}
      {!dashboardData?.topProducts?.length && 
       !dashboardData?.salesByCategory?.length && 
       !dashboardData?.revenueTrends?.length && 
       !dashboardData?.userStats?.length && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Additional Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Charts and tables will appear here once you have sales, products, and user data.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}