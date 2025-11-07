import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import {
    RadialBarChart, RadialBar, ResponsiveContainer
} from 'recharts';
import KPI from '../../components/KPIs';
import BuildIcon from '@mui/icons-material/Build';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';

// API: GET {VITE_API_BASE_URL}/dashboard/engineer

// --- Main Dashboard Component ---
export default function EngineerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    
    // API-ready state
    const [kpiData, setKpiData] = useState([]);
    const [serviceData, setServiceData] = useState(null);
    const [recentServices, setRecentServices] = useState([]);
    const token = localStorage.getItem('authKey');
    const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${VITE_API_BASE_URL}/dashboard/engineer`, {
                headers: axiosConfig.headers,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Dashboard API error: ${res.status} ${text}`);
            }

            const json = await res.json();
            if (!json.success || !json.data) {
                throw new Error(json.message || 'Invalid dashboard response');
            }

            const data = json.data;
            console.log(data);
            

            // Map KPI objects (title, value, change?, trend?) — ensure strings for value
            const mappedKpis = (data.kpis || []).map(k => ({
                title: k.title,
                value: k.value != null ? String(k.value) : '0',
                change: k.change || '',
                trend: k.trend || 'neutral'
            }));

            // Service breakdown and recent services map directly
            const mappedServiceBreakdown = data.serviceBreakdown || null;
            const mappedRecents = (data.recentServices || []).map(r => ({
                id: r.id,
                date: r.date,
                cost: r.cost,
                description: r.description
            }));

            setKpiData(mappedKpis);
            setServiceData(mappedServiceBreakdown);
            setRecentServices(mappedRecents);
        } catch (err) {
            console.error('Failed to load engineer dashboard', err);
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
        <Box>
            <Stack spacing={5}>
                {/* KPI Cards */}
                <Grid container spacing={6}>
                    {isLoading ? (
                        Array.from(new Array(3)).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={6}  key={idx}><Skeleton variant="rectangular" height={120}  sx={{ borderRadius: 3 }} /></Grid>
                        ))
                    ) : (
                        kpiData.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx} width={300} height={120}>
                                <KPI {...item} variant={["blue", "dark", "light"][idx % 3]} />
                            </Grid>
                        ))
                    )}
                </Grid>

                <Grid container spacing={3}>
                    {/* Service Breakdown Radial Chart */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ height: '100%' ,width: 400}}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <BuildIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service Breakdown</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                {isLoading || !serviceData ? <Skeleton variant="rectangular" height={350} /> : (
                                    <>
                                        <Box sx={{ height: 250, position: "relative" }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ value: serviceData.total }]} startAngle={90} endAngle={-270} barSize={25}>
                                                    <RadialBar background clockWise dataKey="value" cornerRadius={12} fill={theme.palette.primary.main} />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                            <Stack sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                                <Typography variant="h3" sx={{ fontWeight: "bold", color: 'primary.main' }}>{serviceData.total.toLocaleString()}</Typography>
                                                <Typography variant="body2" color="text.secondary">Total Units Serviced</Typography>
                                            </Stack>
                                        </Box>
                                        <Stack spacing={1.5} mt={2}>
                                            {serviceData.data.map((item, index) => (
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" key={item.name}>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: RADIAL_COLORS[index] }} />
                                                        <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                                                    </Stack>
                                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.value.toLocaleString()}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Services Table */}
                    <Grid item xs={12} lg={6}> 
                        <Card sx={{ height: '100%' ,width: 500 }}>
                             <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <EventNoteIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Services</Typography>
                                </Stack>
                                <Divider sx={{ mb: 1 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                             {isLoading ? (
                                                 Array.from(new Array(5)).map((_, index) => (
                                                    <TableRow key={index}><TableCell colSpan={2}><Skeleton animation="wave" /></TableCell></TableRow>
                                                ))
                                            ) : (
                                                recentServices.map((service) => (
                                                    <TableRow key={service.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{service.date}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{service.description}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                            ₹{service.cost.toLocaleString('en-IN')}
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

