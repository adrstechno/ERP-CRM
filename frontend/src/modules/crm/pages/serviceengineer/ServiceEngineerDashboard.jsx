import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Table, TableBody, TableCell,
    TableContainer, TableRow, Chip, useMediaQuery
} from '@mui/material';
import {
    RadialBarChart, RadialBar, ResponsiveContainer
} from 'recharts';
import KPI from '../../components/KPIs';
import BuildIcon from '@mui/icons-material/Build';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EngineerDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [isLoading, setIsLoading] = useState(true);

    const [kpiData, setKpiData] = useState([]);
    const [serviceData, setServiceData] = useState(null);
    const [recentServices, setRecentServices] = useState([]);

    const token = localStorage.getItem('authKey');
    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [dashboardRes, ticketsRes] = await Promise.all([
                axios.get(`${VITE_API_BASE_URL}/dashboard/engineer`, axiosConfig),
                axios.get(`${VITE_API_BASE_URL}/tickets/get-by-user`, axiosConfig)
            ]);

            // KPIs & Service Breakdown
            if (dashboardRes.data.success && dashboardRes.data.data) {
                const data = dashboardRes.data.data;
                const mappedKpis = (data.kpis || []).map(k => ({
                    title: k.title,
                    value: k.value != null ? String(k.value) : '0',
                    change: k.change || '',
                    trend: k.trend || 'neutral'
                }));
                setKpiData(mappedKpis);
                setServiceData(data.serviceBreakdown || null);
            }

            // Recent Services from Tickets
            const tickets = ticketsRes.data || [];
            const completedTickets = tickets
                .filter(t => ['COMPLETED', 'CLOSED'].includes(t.status))
                .sort((a, b) => new Date(b.dueDate || b.createdAt) - new Date(a.dueDate || a.createdAt))
                .slice(0, 6); // Show 6 on mobile

            const mappedRecents = completedTickets.map(ticket => ({
                id: ticket.ticketId,
                date: new Date(ticket.dueDate || ticket.createdAt).toLocaleDateString('en-IN'),
                description: `#${ticket.ticketId} · ${ticket.customerName}`,
                product: ticket.productName?.length > 40 ? ticket.productName.substring(0, 37) + '...' : ticket.productName,
                entitlement: ticket.entitlementType
            }));

            setRecentServices(mappedRecents);

        } catch (err) {
            console.error('Dashboard error:', err);
            toast.error('Failed to load dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const RADIAL_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, width:'100%' , pb: 10 }}>
            <Stack spacing={4}>
                {/* Header */}
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} align="center">
                    Engineer Dashboard
                </Typography>

                {/* KPI Cards - Responsive Grid */}
                <Grid container spacing={isMobile ? 2 : 7}>
                    {isLoading ? (
                        Array.from(new Array(3)).map((_, i) => (
                            <Grid item xs={12} sm={4} key={i} sx={{  width:'50vw' , pb: 10 }}>
                                <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))
                    ) : (
                        kpiData.map((item, idx) => (
                            <Grid item xs={12} sm={4} key={idx} sx={{width:'20vw'}}>
                                <KPI
                                    {...item}
                                    variant={["blue", "dark", "light"][idx % 2]}
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Charts & Recent Services */}
                <Grid container spacing={isMobile ? 3 : 4}>
                    {/* Service Breakdown */}
                    <Grid item xs={12} lg={6}>
                        <Card elevation={3} sx={{ height: '100%', borderRadius: 3 , width: '20vw'}}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <BuildIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                                    <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold">
                                        Service Breakdown
                                    </Typography>
                                </Stack>
                                <Divider sx={{ mb: 3 }} />

                                {isLoading || !serviceData ? (
                                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
                                ) : (
                                    <>
                                        <Box sx={{ height: isMobile ? 220 : 280, position: "relative" }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart
                                                    innerRadius="70%"
                                                    outerRadius="95%"
                                                    data={[{ value: serviceData.total }]}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <RadialBar
                                                        background
                                                        clockWise
                                                        dataKey="value"
                                                        cornerRadius={15}
                                                        fill={theme.palette.primary.main}
                                                    />
                                                </RadialBarChart>
                                            </ResponsiveContainer>

                                            <Stack
                                                sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    textAlign: "center"
                                                }}
                                            >
                                                <Typography
                                                    variant={isMobile ? "h4" : "h3"}
                                                    fontWeight="bold"
                                                    color="primary.main"
                                                >
                                                    {serviceData.total.toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Serviced
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Stack spacing={1.5} mt={3}>
                                            {serviceData.data.map((item, i) => (
                                                <Stack direction="row" justifyContent="space-between" key={i}>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: RADIAL_COLORS[i] }} />
                                                        <Typography variant="body2" color="text.secondary" fontSize={isMobile ? 13 : 14}>
                                                            {item.name}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {item.value.toLocaleString()}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Services */}
                    <Grid item xs={12} lg={6}>
                        <Card elevation={3} sx={{ height: '100%', borderRadius: 3 , width: '50vw'}}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <EventNoteIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                                        <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold">
                                            Recent Services
                                        </Typography>
                                    </Stack>
                                    <Chip
                                        label={recentServices.length}
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <TableContainer sx={{ maxHeight: isMobile ? 340 : 380 }}>
                                    <Table size="small" stickyHeader={isMobile}>
                                        <TableBody>
                                            {isLoading ? (
                                                Array.from(new Array(5)).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell colSpan={2}><Skeleton height={60} /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : recentServices.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                                                        <Typography color="text.secondary">
                                                            No completed services yet
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                recentServices.map((service) => (
                                                    <TableRow key={service.id} hover>
                                                        <TableCell sx={{ py: 1.5 }}>
                                                            <Typography variant="body2" fontWeight={600} fontSize={14}>
                                                                {service.date}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="primary"
                                                                fontWeight={500}
                                                                sx={{ mt: 0.5 }}
                                                            >
                                                                {service.description}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                display="block"
                                                                sx={{ mt: 0.5, fontSize: 11 }}
                                                            >
                                                                {service.product}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ py: 1.5 }}>
                                                            <Chip
                                                                label={service.entitlement}
                                                                size="small"
                                                                color={service.entitlement === 'FREE' ? 'success' : 'warning'}
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: 10,
                                                                    height: 24
                                                                }}
                                                            />
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
            </Stack>
        </Box>
    );
}