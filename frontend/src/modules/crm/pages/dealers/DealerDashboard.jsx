import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Chip
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    BarChart, Bar
} from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1.5, boxShadow: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 'bold' }}>{label}</Typography>
                {payload.map((pld, i) => (
                    <Typography key={i} sx={{ color: pld.stroke || pld.fill, fontWeight: 500 }}>
                        {`${pld.name}: ${pld.value.toLocaleString()} units`}
                    </Typography>
                ))}
            </Card>
        );
    }
    return null;
};

export default function DealerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    const fetchDealerDashboard = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem("authKey");

        try {
            const response = await fetch(`${VITE_API_BASE_URL}/dashboard/dealer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch dashboard data');

            const result = await response.json();
            if (result.success) {
                setDashboardData(result.data);
            } else {
                throw new Error(result.message || 'Failed to load data');
            }
        } catch (err) {
            console.error("API Error:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDealerDashboard();
    }, [fetchDealerDashboard]);

    if (!dashboardData && !isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No data available</Typography>
            </Box>
        );
    }

    // Correct field mapping based on API response
    const {
        stockApproved = 0,
        stockRequested = 0,
        stockRejected = 0,
        totalRequests = 0,
        monthlyTrends = []
    } = dashboardData || {};

    const approvedStock = stockApproved;
    const rejectedStock = stockRejected;
    const totalStock = totalRequests;

    // Pending = Requested - (Approved + Rejected)
    const pendingStock = Math.max(stockRequested - stockApproved - stockRejected, 0);

    const monthlyTrend = monthlyTrends;

    const barChartData = [
        { name: "Approved", value: approvedStock, fill: theme.palette.success.main },
        { name: "Pending", value: pendingStock, fill: theme.palette.warning.main },
        { name: "Rejected", value: rejectedStock, fill: theme.palette.error.main },
    ];

    return (
        <Box>
            <Stack spacing={4}>
                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {isLoading ? (
                        <>
                            <Grid item xs={12} sm={6}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} /></Grid>
                            <Grid item xs={12} sm={6}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} /></Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Total Stock Requests</Typography>
                                                <Typography variant="h4" fontWeight="bold" mt={1}>
                                                    {totalStock.toLocaleString()}
                                                </Typography>
                                                <Chip
                                                    icon={<PendingActionsIcon fontSize="small" />}
                                                    label={`${pendingStock} Pending • ${rejectedStock} Rejected`}
                                                    size="small"
                                                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                                />
                                            </Box>
                                            <InventoryIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%', bgcolor: 'success.main', color: 'white' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Approved Stock</Typography>
                                                <Typography variant="h4" fontWeight="bold" mt={1}>
                                                    {approvedStock.toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                                                    Ready for sale
                                                </Typography>
                                            </Box>
                                            <CheckCircleOutlineIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}
                </Grid>

                {/* Monthly Trend Chart */}
                <Card>
                    <CardContent>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                            <InventoryIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Stock Request & Approval Trend (Last 6 Months)
                            </Typography>
                        </Stack>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ height: 350 }}>
                            {isLoading ? (
                                <Skeleton variant="rectangular" height="100%" />
                            ) : monthlyTrend.length === 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">No trend data available</Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyTrend}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 13 }} />
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />

                                        <Line type="monotone" dataKey="requested" name="Requested" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="approved" name="Approved" stroke={theme.palette.success.main} strokeWidth={3} dot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="pending" name="Pending" stroke={theme.palette.warning.main} strokeWidth={2} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Current Stock Status
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            {isLoading ? (
                                <Skeleton variant="rectangular" height="100%" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}
