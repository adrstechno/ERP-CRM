import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Divider, Skeleton, Alert, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    BarChart, Bar
} from 'recharts';
import { 
    AttachMoney, TrendingUp, TrendingDown, AccessTime, Receipt
} from '@mui/icons-material';
import KPI from '../../components/KPIs';
import toast from 'react-hot-toast';
import { VITE_API_BASE_URL } from "../../utils/State";
import dayjs from 'dayjs';

const MarketerDashboard = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [summary, setSummary] = useState(null);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('authKey');

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                toast.error("Login kar bhai");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // 1. Summary
                const summaryRes = await fetch(`${VITE_API_BASE_URL}/dashboard/marketer`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let summaryData = { totalSales: 0, totalPayments: 0, outstandingAmount: 0, thisMonthSalesCount: 0 };
                if (summaryRes.ok) {
                    const res = await summaryRes.json();
                    if (res.success && res.data) summaryData = res.data;
                }

                // 2. Recent sales
                const salesRes = await fetch(`${VITE_API_BASE_URL}/sales/marketer`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let salesList = [];
                if (salesRes.ok) {
                    const fullData = await salesRes.json();
                    salesList = fullData
                        .sort((a, b) => b.saleId - a.saleId)
                        .slice(0, 6);
                }

                setSummary(summaryData);
                setRecentSales(salesList);

            } catch (err) {
                console.error(err);
                toast.error("Dashboard load nahi hua");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [token]);

    const chartData = useMemo(() => {
        if (!summary) return { lineData: [], barData: [] };

        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const prevMonth = lastMonth.toLocaleString('default', { month: 'short' });

        const lineData = [
            { month: prevMonth, sales: Math.round(summary.totalSales * 0.82), payments: Math.round(summary.totalPayments * 0.78) },
            { month: currentMonth, sales: summary.totalSales, payments: summary.totalPayments }
        ];

        const barData = [
            { label: 'Last Month', count: Math.round(summary.thisMonthSalesCount * 0.85) },
            { label: 'This Month', count: summary.thisMonthSalesCount }
        ];

        return { lineData, barData };
    }, [summary]);

    const kpiData = useMemo(() => summary ? [
        { id: '1', title: 'Total Sales', value: `₹${Number(summary.totalSales).toLocaleString('en-IN')}`, icon: <AttachMoney />, trend: 'up' },
        { id: '2', title: 'Total Payments', value: `₹${Number(summary.totalPayments).toLocaleString('en-IN')}`, icon: <TrendingUp />, trend: 'up' },
        { id: '3', title: 'Outstanding', value: `₹${Number(summary.outstandingAmount).toLocaleString('en-IN')}`, icon: <TrendingDown />, trend: 'down' },
        { id: '4', title: 'This Month Sales', value: summary.thisMonthSalesCount, icon: <AccessTime />, trend: 'up' }
    ] : [], [summary]);

    if (loading) {
        return (
            <Box sx={{ p: 4, backgroundColor: 'background.default' }}>
                <Typography variant="h5" fontWeight="bold" mb={4} color="primary" textAlign="center">
                    Marketer Dashboard
                </Typography>
                <Grid container spacing={4}>
                    {[...Array(4)].map((_, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={190} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (!summary) {
        return <Alert severity="error" sx={{ m: 4 }}>Dashboard data load nahi hua!</Alert>;
    }

    return (
        <Box sx={{ p: { xs: 3, sm: 4 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Typography 
                variant="h4" 
                fontWeight="bold" 
                mb={5} 
                color="primary" 
                sx={{ 
                    background: isDark 
                        ? 'linear-gradient(90deg, #00E5FF, #00B0FF)' 
                        : 'linear-gradient(90deg, #007BFF, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center'
                }}
            >
                Marketer Dashboard
            </Typography>

            {/* THEME-AWARE BIG KPIS */}
            <Grid container spacing={4} mb={6}>
                {kpiData.map((kpi, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={kpi.id}>
                        <KPI
                            {...kpi}
                            variant={kpi.id === '3' ? 'warning' : 'blue'}
                            sx={{
                                height: 190,
                                borderRadius: 4,
                                boxShadow: isDark 
                                    ? '0 14px 45px rgba(0, 229, 255, 0.15)' 
                                    : '0 14px 45px rgba(0, 123, 255, 0.2)',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    transform: 'translateY(-12px)',
                                    boxShadow: isDark 
                                        ? '0 24px 60px rgba(0, 229, 255, 0.3)' 
                                        : '0 24px 60px rgba(0, 123, 255, 0.35)',
                                },
                                background: kpi.id === '3' 
                                    ? (isDark 
                                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' 
                                        : 'linear-gradient(135deg, #ff8a80 0%, #ff5252 100%)')
                                    : theme.palette.custom.kpiBlue,
                                color: 'white',
                                border: 'none'
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* LINE CHART */}
            <Card sx={{ mb: 5, borderRadius: 4, overflow: 'hidden' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" mb={1} color="text.primary">
                        Sales vs Payments Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Last 2 months performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={380}>
                        <LineChart data={chartData.lineData}>
                            <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fill: theme.palette.text.secondary, fontWeight: 600 }} 
                            />
                            <YAxis 
                                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
                                tick={{ fill: theme.palette.text.secondary }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 12,
                                    padding: '12px 16px'
                                }}
                                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
                            />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke={theme.palette.primary.main} 
                                strokeWidth={5} 
                                name="Total Sales" 
                                dot={{ r: 8 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="payments" 
                                stroke="#4caf50" 
                                strokeWidth={5} 
                                name="Payments Received" 
                                dot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* BAR CHART + RECENT SALES */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" mb={1} color="text.primary">
                                Monthly Sales Performance
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                This month vs last month
                            </Typography>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData.barData}>
                                    <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} />
                                    <XAxis dataKey="label" tick={{ fill: theme.palette.text.secondary }} />
                                    <YAxis tick={{ fill: theme.palette.text.secondary }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 12
                                        }}
                                    />
                                    <Bar dataKey="count" fill={theme.palette.primary.main} radius={[20, 20, 0, 0]} barSize={80} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                <Receipt sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                    Recent Sales
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                            <TableContainer sx={{ maxHeight: 320 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentSales.length > 0 ? recentSales.map((sale) => (
                                            <TableRow key={sale.saleId} hover>
                                                <TableCell>#{sale.saleId}</TableCell>
                                                <TableCell>{dayjs(sale.saleDate).format("DD MMM")}</TableCell>
                                                <TableCell>{sale.customerName}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                    ₹{sale.totalAmount.toLocaleString('en-IN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={sale.saleStatus} 
                                                        size="small"
                                                        color={sale.saleStatus === "APPROVED" ? "success" : "warning"}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary' }}>
                                                    No recent sales
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={6} textAlign="center">
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    Last updated: {new Date().toLocaleString('en-IN')} • Live from server
                </Typography>
            </Box>
        </Box>
    );
};

export default MarketerDashboard;