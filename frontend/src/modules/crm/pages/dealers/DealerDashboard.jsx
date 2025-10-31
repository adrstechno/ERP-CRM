import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, useTheme,
    Stack, Divider, Skeleton
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';
import KPI from '../../components/KPIs'; // Assuming KPI component is themed
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';

// --- API Simulation ---
const mockApiData = {
    kpis: [
        { title: "Allocated Stock", value: "7,000", change: "+1.01%", trend: "up" },
        { title: "Stock Sold", value: "2,360", change: "-0.03%", trend: "down" },
        // { title: "Revenue Generated", value: "₹70,00,000", change: "+1.01%", trend: "up" },
        // { title: "Pending Payments", value: "₹36,00,000", change: "-0.03%", trend: "down" },
    ],
    salesOverview: [
        { month: "Jan", sold: 4000, unsold: 2400 },
        { month: "Feb", sold: 3000, unsold: 1398 },
        { month: "Mar", sold: 2000, unsold: 9800 },
        { month: "Apr", sold: 2780, unsold: 3908 },
        { month: "May", sold: 1890, unsold: 4800 },
    ],
    stockPerformance: { total: 7000, sold: 2360 },
    trafficByDevice: [
        { name: "AC_01", value: 12000 },
        { name: "AC_02", value: 18000 },
        { name: "AC_03", value: 9000 },
        { name: "AC_04", value: 25000 },
        { name: "AC_05", value: 16000 },
    ]
};

// --- Reusable Themed Components ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Card sx={{ p: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>
                {payload.map(pld => (
                    <Typography key={pld.dataKey} sx={{ color: pld.stroke || pld.fill, fontWeight: 500 }}>
                        {`${pld.name}: ${pld.value.toLocaleString('en-IN')}`}
                    </Typography>
                ))}
            </Card>
        );
    }
    return null;
};

// --- Main Dashboard Component ---
export default function DealerDashboard() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // API-ready state
    const [kpiData, setKpiData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [stockData, setStockData] = useState(null);
    const [trafficData, setTrafficData] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setKpiData(mockApiData.kpis);
        setSalesData(mockApiData.salesOverview);
        setStockData(mockApiData.stockPerformance);
        setTrafficData(mockApiData.trafficByDevice);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stockPerformanceChartData = stockData ? [{ name: 'Sold', value: stockData.sold, fill: theme.palette.primary.main }] : [];

    return (
        <Box>
            <Stack spacing={3}>
                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {isLoading ? (
                        Array.from(new Array(4)).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}><Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} /></Grid>
                        ))
                    ) : (
                        kpiData.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <KPI {...item} variant={["blue", "dark", "light", "dark"][idx % 4]} />
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Sales Line Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} mb={2}>Total Sales Overview</Typography>
                        <Box sx={{ height: 300 }}>
                            {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                                        <Line type="monotone" dataKey="sold" name="Stock Sold" stroke={theme.palette.primary.main} strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="unsold" name="Stock Unsold" stroke={theme.palette.warning.main} strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Stock Performance */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ height: '100%', width: 550 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <InventoryIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Stock Performance</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                {isLoading || !stockData ? <Skeleton variant="rectangular" height={300} /> : (
                                    <Box sx={{ height: 300, position: 'relative' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                             <RadialBarChart innerRadius="80%" outerRadius="100%" data={stockPerformanceChartData} startAngle={90} endAngle={-270} barSize={25}>
                                                <RadialBar background clockWise dataKey="value" cornerRadius={12} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{`${((stockData.sold / stockData.total) * 100).toFixed(0)}%`}</Typography>
                                            <Typography variant="body2" color="text.secondary">Sold vs Allocated</Typography>
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Selling Products */}
                    <Grid item xs={12} lg={9}>
                        <Card sx={{ height: '100%' , width: 550 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <TrendingUpIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Top Selling Products</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ height: 300 }}>
                                {isLoading ? <Skeleton variant="rectangular" height="100%" /> : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={trafficData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor={theme.palette.primary.dark} stopOpacity={0.9}/>
                                                    <stop offset="100%" stopColor={theme.palette.primary.light} stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider}/>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={60} stroke={theme.palette.text.secondary} fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }}/>
                                            <Bar dataKey="value" name="Units Sold" fill="url(#barGradient)" barSize={20} radius={[0, 10, 10, 0]}/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

