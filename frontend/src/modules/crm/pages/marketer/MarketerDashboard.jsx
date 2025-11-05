import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow,
    Alert, CircularProgress
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import KPI from '../../components/KPIs';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

// Mock data for fallback
const mockData = {
    stats: {
        totalSales: 150000,
        totalPayments: 120000,
        outstandingAmount: 30000,
        thisMonthSales: 15,
        conversionRate: 80
    },
    salesVsPayments: [
        { month: 'Jan 2024', sales: 12000, payments: 10000, outstanding: 2000 },
        { month: 'Feb 2024', sales: 15000, payments: 12000, outstanding: 3000 },
        { month: 'Mar 2024', sales: 18000, payments: 15000, outstanding: 3000 }
    ],
    categoryPerformance: [
        { category: 'Air Conditioners', totalSales: 80000 },
        { category: 'AC Parts', totalSales: 45000 },
        { category: 'Services', totalSales: 25000 }
    ],
    recentSales: [
        { saleId: 1, customerName: 'John Doe', totalAmount: 5000, saleDate: 'Nov 01, 2024' },
        { saleId: 2, customerName: 'Jane Smith', totalAmount: 3500, saleDate: 'Oct 30, 2024' }
    ],
    customerTrends: [
        { month: 'Jan', newCustomers: 5 },
        { month: 'Feb', newCustomers: 8 },
        { month: 'Mar', newCustomers: 12 }
    ]
};

// --- Custom Hook for Marketer Data ---
const useMarketerData = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [salesVsPayments, setSalesVsPayments] = useState([]);
    const [categoryPerformance, setCategoryPerformance] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [customerTrends, setCustomerTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useMockData, setUseMockData] = useState(false);

    const token = localStorage.getItem('authKey');
    const axiosConfig = useMemo(
        () => ({ headers: { Authorization: `Bearer ${token}` } }),
        [token]
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching marketer dashboard data...');
            console.log('API Base URL:', VITE_API_BASE_URL);
            console.log('Auth token exists:', !!token);

            const [statsRes, salesVsPayRes, categoryRes, recentSalesRes, customerTrendsRes] = await Promise.all([
                fetch(`${VITE_API_BASE_URL}/marketer/dashboard/statistics`, axiosConfig),
                fetch(`${VITE_API_BASE_URL}/marketer/dashboard/sales-vs-payments`, axiosConfig),
                fetch(`${VITE_API_BASE_URL}/marketer/dashboard/category-performance`, axiosConfig),
                fetch(`${VITE_API_BASE_URL}/marketer/dashboard/recent-sales`, axiosConfig),
                fetch(`${VITE_API_BASE_URL}/marketer/dashboard/customer-trends`, axiosConfig)
            ]);

            console.log('API Response statuses:', {
                stats: statsRes.status,
                salesVsPay: salesVsPayRes.status,
                category: categoryRes.status,
                recentSales: recentSalesRes.status,
                customerTrends: customerTrendsRes.status
            });

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                console.log('Stats data:', statsData);
                setDashboardStats(statsData);
            } else {
                console.error('Stats API error:', statsRes.status, await statsRes.text());
            }

            if (salesVsPayRes.ok) {
                const salesVsPayData = await salesVsPayRes.json();
                console.log('Sales vs Pay data:', salesVsPayData);
                setSalesVsPayments(salesVsPayData);
            } else {
                console.error('Sales vs Pay API error:', salesVsPayRes.status, await salesVsPayRes.text());
            }

            if (categoryRes.ok) {
                const categoryData = await categoryRes.json();
                console.log('Category data:', categoryData);
                setCategoryPerformance(categoryData);
            } else {
                console.error('Category API error:', categoryRes.status, await categoryRes.text());
            }

            if (recentSalesRes.ok) {
                const recentSalesData = await recentSalesRes.json();
                console.log('Recent sales data:', recentSalesData);
                setRecentSales(recentSalesData);
            } else {
                console.error('Recent sales API error:', recentSalesRes.status, await recentSalesRes.text());
            }

            if (customerTrendsRes.ok) {
                const customerTrendsData = await customerTrendsRes.json();
                console.log('Customer trends data:', customerTrendsData);
                setCustomerTrends(customerTrendsData);
            } else {
                console.error('Customer trends API error:', customerTrendsRes.status, await customerTrendsRes.text());
            }

        } catch (err) {
            console.error('Marketer dashboard fetch error:', err);
            setError(err.message);
            toast.error('Failed to load dashboard data - using mock data');
            
            // Use mock data as fallback
            setUseMockData(true);
            setDashboardStats(mockData.stats);
            setSalesVsPayments(mockData.salesVsPayments);
            setCategoryPerformance(mockData.categoryPerformance);
            setRecentSales(mockData.recentSales);
            setCustomerTrends(mockData.customerTrends);
        } finally {
            setLoading(false);
        }
    }, [axiosConfig, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        dashboardStats,
        salesVsPayments,
        categoryPerformance,
        recentSales,
        customerTrends,
        loading,
        error,
        useMockData,
        refetch: fetchData
    };
};

// --- Reusable Themed Components ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1.5, backdropFilter: 'blur(5px)' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
                {payload.map((pld, index) => (
                    <Typography key={`${pld.dataKey}-${index}`} sx={{ color: pld.color || pld.stroke, fontWeight: 500 }}>
                        {pld.name}: {typeof pld.value === 'number' ? 
                            (pld.dataKey === 'newCustomers' ? pld.value : `₹${pld.value.toLocaleString('en-IN')}`) : 
                            pld.value}
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
    const {
        dashboardStats,
        salesVsPayments,
        categoryPerformance,
        recentSales,
        customerTrends,
        loading,
        error,
        useMockData
    } = useMarketerData();

    // Process KPI data from API response
    const kpiData = useMemo(() => {
        if (!dashboardStats) return [];
        
        return [
            {
                id: '1',
                title: 'Total Sales',
                value: `₹${dashboardStats.totalSales?.toLocaleString('en-IN') || '0'}`,
                change: '+0%',
                trend: 'up',
            },
            {
                id: '2',
                title: 'Total Payments',
                value: `₹${dashboardStats.totalPayments?.toLocaleString('en-IN') || '0'}`,
                change: `${dashboardStats.conversionRate || 0}%`,
                trend: 'up',
            },
            {
                id: '3',
                title: 'Outstanding',
                value: `₹${dashboardStats.outstandingAmount?.toLocaleString('en-IN') || '0'}`,
                change: '0%',
                trend: dashboardStats.outstandingAmount > 0 ? 'down' : 'up',
            },
            {
                id: '4',
                title: 'This Month Sales',
                value: dashboardStats.thisMonthSales?.toString() || '0',
                change: '+0%',
                trend: 'up',
            },
        ];
    }, [dashboardStats]);
    
    const PIE_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, theme.palette.info.main];

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

    if (error && !useMockData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Check the browser console for more details. The API endpoints might not be available or there might be authentication issues.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            {useMockData && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Using mock data - API endpoints are not responding. Check console for details.
                </Alert>
            )}
            <Stack spacing={3}>
                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {kpiData.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <KPI {...item} variant={idx % 2 === 0 ? "blue" : (theme.palette.mode === 'dark' ? "dark" : "light")} />
                        </Grid>
                    ))}
                </Grid>

                {/* Sales vs Payments Trend Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Sales vs Payments Trend</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ height: 300 }}>
                            {salesVsPayments.length === 0 ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <Typography color="text.secondary">No data available</Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesVsPayments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                                        <Line type="monotone" dataKey="sales" name="Sales" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="payments" name="Payments" stroke={theme.palette.success.main} strokeWidth={3} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="outstanding" name="Outstanding" stroke={theme.palette.warning.main} strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Category Performance Chart */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Category Performance</Typography>
                                <Divider sx={{ mb: 2 }} />
                                {categoryPerformance.length === 0 ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                                        <Typography color="text.secondary">No category data available</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 0 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie 
                                                        data={categoryPerformance} 
                                                        cx="50%" 
                                                        cy="50%" 
                                                        innerRadius={60} 
                                                        outerRadius={100} 
                                                        dataKey="totalSales" 
                                                        nameKey="category"
                                                        paddingAngle={5}
                                                    >
                                                        {categoryPerformance.map((entry, idx) => (
                                                            <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                        <Stack direction="row" justifyContent="center" spacing={1} mt={2} flexWrap="wrap">
                                            {categoryPerformance.slice(0, 5).map((d, i) => (
                                                <Stack key={i} direction="row" alignItems="center" spacing={1}>
                                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <Typography variant="body2" fontSize={11}>{d.category}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Sales Table */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Recent Sales</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                                    <Table size="small">
                                        <TableBody>
                                            {recentSales.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        <Typography color="text.secondary">No recent sales</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                recentSales.map((sale, idx) => (
                                                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                Sale #{sale.saleId}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {sale.customerName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {sale.saleDate}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                            ₹{sale.totalAmount.toLocaleString('en-IN')}
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

                {/* Customer Acquisition Trends */}
                {customerTrends.length > 0 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Customer Acquisition Trends</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={customerTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="newCustomers" name="New Customers" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
}


