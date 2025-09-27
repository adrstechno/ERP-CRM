
// // NewSales.jsx
// import React, { useState } from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   useTheme,
//   Button,
//   TextField,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Avatar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper
// } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import Inventory2Icon from '@mui/icons-material/Inventory2';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import PhoneIcon from '@mui/icons-material/Phone';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import EmailIcon from '@mui/icons-material/Email';

// // Mock data for client names dropdown (Image 1)
// const clientNames = [
//   { value: 'John Doe', label: 'John Doe' },
//   { value: 'Jane Smith', label: 'Jane Smith' },
//   { value: 'Mark Johnson', label: 'Mark Johnson' },
// ];

// // Mock data for product names dropdown (Image 2)
// const productNames = [
//   { value: 'Product A', label: 'Product A' },
//   { value: 'Product B', label: 'Product B' },
//   { value: 'Product C', label: 'Product C' },
// ];

// // Reusable styled components/styles to match Figma
// const getFigmaCardStyle = (isDark, theme) => ({
//   borderRadius: 2,
//   boxShadow: 'none', // Figma design seems to have minimal to no shadow on these internal cards
//   background: isDark
//     ? 'linear-gradient(135deg, #3A414B 0%, #20262E 100%)' // Darker gradient from Figma
//     : 'linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)', // Lighter gradient from Figma
//   color: isDark ? 'white' : 'black',
//   border: `1px solid ${isDark ? '#424242' : '#E0E0E0'}`, // Subtle border as in Figma
//   height: '100%', // Ensure cards fill height
//   display: 'flex',
//   flexDirection: 'column',
// });

// const getFigmaTextFieldStyle = (isDark) => ({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px', // Rounded corners for text fields
//     backgroundColor: isDark ? '#2D323A' : '#F0F0F0', // Background color for input fields
//     '& fieldset': {
//       borderColor: isDark ? '#424242' : '#D0D0D0', // Border color
//     },
//     '&:hover fieldset': {
//       borderColor: isDark ? '#606060' : '#A0A0A0', // Hover border color
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#2B75E4', // Focus border color
//     },
//   },
//   '& .MuiInputBase-input': {
//     color: isDark ? 'white' : 'black', // Text color
//   },
//   '& .MuiInputLabel-root': {
//     color: isDark ? '#B0B0B0' : '#616161', // Label color
//   },
//   '& .MuiInputLabel-root.Mui-focused': {
//     color: '#2B75E4', // Focused label color
//   },
// });

// const getFigmaButtonStyle = (isDark) => ({
//   borderRadius: '8px',
//   textTransform: 'none',
//   padding: '10px 20px',
//   fontWeight: 600,
//   fontSize: '1rem',
//   background: isDark
//     ? 'linear-gradient(90deg, #2B75E4 0%, #00C6FF 100%)' // Blue gradient for dark mode
//     : 'linear-gradient(90deg, #2B75E4 0%, #00C6FF 100%)', // Blue gradient for light mode
//   color: 'white',
//   '&:hover': {
//     opacity: 0.9,
//     background: isDark
//     ? 'linear-gradient(90deg, #2B75E4 0%, #00C6FF 100%)' // Blue gradient for dark mode
//     : 'linear-gradient(90deg, #2B75E4 0%, #00C6FF 100%)', // Blue gradient for light mode
//   },
// });

// const getSidebarButtonStyle = (isActive, isDark) => ({
//   width: '100%',
//   justifyContent: 'flex-start',
//   textTransform: 'none',
//   padding: '10px 15px',
//   borderRadius: '8px',
//   color: isActive ? (isDark ? 'white' : 'white') : (isDark ? '#B0B0B0' : '#616161'),
//   backgroundColor: isActive ? '#2B75E4' : 'transparent',
//   '&:hover': {
//     backgroundColor: isActive ? '#2B75E4' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
//   },
//   marginBottom: '8px',
// });

// // Component for Personal Information form (Image 1)
// const PersonalInformationForm = ({ onNext }) => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   const figmaTextFieldStyle = getFigmaTextFieldStyle(isDark);
//   const figmaButtonStyle = getFigmaButtonStyle(isDark);

//   return (
//     <Box sx={{ p: 3, flexGrow: 1 }}>
//       <Typography variant="h6" mb={2} color={isDark ? 'white' : 'black'}>
//         Client Information
//       </Typography>
//       <Typography variant="body2" mb={3} color={isDark ? 'text.secondary' : 'gray'}>
//         Lorem ipsum dolor sit amet consectetur adipiscing.
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <PersonIcon sx={{ color: isDark ? '#B0B0B0' : '#616161', fontSize: '1.2rem' }} />
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Client Name</Typography>
//           </Box>
//           <TextField
//             select
//             fullWidth
//             label="NAME"
//             defaultValue="John Doe"
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           >
//             {clientNames.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <PhoneIcon sx={{ color: isDark ? '#B0B0B0' : '#616161', fontSize: '1.2rem' }} />
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Mobile no.</Typography>
//           </Box>
//           <TextField
//             fullWidth
//             label="Mobile no."
//             defaultValue="9876543210" // Example default value
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <LocationOnIcon sx={{ color: isDark ? '#B0B0B0' : '#616161', fontSize: '1.2rem' }} />
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Address</Typography>
//           </Box>
//           <TextField
//             fullWidth
//             label="New York, NY"
//             defaultValue="123 Main St, New York, NY" // Example default value
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <EmailIcon sx={{ color: isDark ? '#B0B0B0' : '#616161', fontSize: '1.2rem' }} />
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Email</Typography>
//           </Box>
//           <TextField
//             fullWidth
//             label="dashdark@gmail.com"
//             defaultValue="dashdark@gmail.com" // Example default value
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sx={{ mt: 4 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             endIcon={<ArrowForwardIcon />}
//             onClick={onNext}
//             sx={figmaButtonStyle}
//           >
//             Next
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// // Component for Product Information form (Image 2)
// const ProductInformationForm = ({ onBack }) => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   const figmaTextFieldStyle = getFigmaTextFieldStyle(isDark);
//   const figmaButtonStyle = getFigmaButtonStyle(isDark);

//   // Example state for product table
//   const [products, setProducts] = useState([
//     { productName: 'X_AC', productNo: '#15V85TH', unitPrice: 100, qty: 87, totalPrice: 8700 },
//   ]);

//   return (
//     <Box sx={{ p: 3, flexGrow: 1 }}>
//       <Typography variant="h6" mb={2} color={isDark ? 'white' : 'black'}>
//         Product Information
//       </Typography>
//       <Typography variant="body2" mb={3} color={isDark ? 'text.secondary' : 'gray'}>
//         Lorem ipsum dolor sit amet consectetur adipiscing.
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <Inventory2Icon sx={{ color: isDark ? '#B0B0B0' : '#616161', fontSize: '1.2rem' }} />
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Product Name</Typography>
//           </Box>
//           <TextField
//             select
//             fullWidth
//             label="NAME"
//             defaultValue="Product A"
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           >
//             {productNames.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <Typography variant="body2" color={isDark ? '#B0B0B0' : '#616161'}>Qty.</Typography>
//           </Box>
//           <TextField
//             fullWidth
//             label="New York, NY" // Placeholder, might be quantity input
//             defaultValue="1"
//             type="number"
//             sx={figmaTextFieldStyle}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <Box sx={{mt: {xs: 0, sm: 3}}} /> {/* Spacer for alignment on larger screens */}
//           <Button
//             fullWidth
//             variant="contained"
//             sx={{
//               ...figmaButtonStyle,
//               background: isDark
//                 ? 'linear-gradient(90deg, #6C757D 0%, #A9B0B8 100%)' // Gray gradient for Add More
//                 : 'linear-gradient(90deg, #6C757D 0%, #A9B0B8 100%)',
//               '&:hover': {
//                 background: isDark
//                 ? 'linear-gradient(90deg, #6C757D 0%, #A9B0B8 100%)'
//                 : 'linear-gradient(90deg, #6C757D 0%, #A9B0B8 100%)',
//               },
//             }}
//           >
//             Add More
//           </Button>
//         </Grid>
//         <Grid item xs={12} sx={{ mt: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             sx={figmaButtonStyle}
//           >
//             Submit
//           </Button>
//         </Grid>
//       </Grid>

//       {/* Product Table */}
//       <Box mt={4}>
//         <TableContainer component={Paper} sx={{ 
//           background: isDark ? '#2D323A' : '#FFFFFF', 
//           boxShadow: 'none', 
//           borderRadius: '8px',
//           border: `1px solid ${isDark ? '#424242' : '#E0E0E0'}`
//         }}>
//           <Table sx={{ minWidth: 650 }} aria-label="product table">
//             <TableHead>
//               <TableRow sx={{ borderBottom: `1px solid ${isDark ? '#424242' : '#E0E0E0'}` }}>
//                 <TableCell sx={{ color: isDark ? '#B0B0B0' : '#616161', fontWeight: 600, borderBottom: 'none' }}>Product Name</TableCell>
//                 <TableCell sx={{ color: isDark ? '#B0B0B0' : '#616161', fontWeight: 600, borderBottom: 'none' }}>Product No.</TableCell>
//                 <TableCell align="right" sx={{ color: isDark ? '#B0B0B0' : '#616161', fontWeight: 600, borderBottom: 'none' }}>Unit Price</TableCell>
//                 <TableCell align="right" sx={{ color: isDark ? '#B0B0B0' : '#616161', fontWeight: 600, borderBottom: 'none' }}>Qty</TableCell>
//                 <TableCell align="right" sx={{ color: isDark ? '#B0B0B0' : '#616161', fontWeight: 600, borderBottom: 'none' }}>Total Price</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map((row, index) => (
//                 <TableRow
//                   key={index}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${isDark ? '#424242' : '#E0E0E0'}` }}
//                 >
//                   <TableCell component="th" scope="row" sx={{ color: isDark ? 'white' : 'black', borderBottom: 'none' }}>
//                     {row.productName}
//                   </TableCell>
//                   <TableCell sx={{ color: isDark ? 'white' : 'black', borderBottom: 'none' }}>{row.productNo}</TableCell>
//                   <TableCell align="right" sx={{ color: isDark ? 'white' : 'black', borderBottom: 'none' }}>{row.unitPrice}</TableCell>
//                   <TableCell align="right" sx={{ color: isDark ? 'white' : 'black', borderBottom: 'none' }}>{row.qty}</TableCell>
//                   <TableCell align="right" sx={{ color: isDark ? 'white' : 'black', borderBottom: 'none' }}>{row.totalPrice}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };


// export default function NewSales() {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   const figmaCardStyle = getFigmaCardStyle(isDark, theme);

//   const [currentStep, setCurrentStep] = useState('personal'); // 'personal' or 'product'

//   const handleNext = () => setCurrentStep('product');
//   const handleBack = () => setCurrentStep('personal'); // This is not used in Figma design, but good for completeness

//   return (
//     <Box
//       sx={{
//         backgroundColor: isDark ? '#1E2328' : '#F5F6FA', // Figma background color
//         minHeight: '100vh',
//         color: isDark ? 'white' : 'black',
//         p: 3, // Padding around the main content
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <Grid container spacing={3} sx={{ flexGrow: 1 }}>
//         {/* Left Section: Credentials */}
//         <Grid item xs={12} md={4}>
//           <Card sx={figmaCardStyle}>
//             <CardContent sx={{ flexGrow: 1 }}>
//               <Typography variant="h6" mb={2}>
//                 Credentials
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: isDark ? '#424242' : '#E0E0E0' }} />
//               <List>
//                 <ListItem disablePadding>
//                   <Button
//                     startIcon={<PersonIcon />}
//                     sx={getSidebarButtonStyle(currentStep === 'personal', isDark)}
//                     onClick={() => setCurrentStep('personal')}
//                   >
//                     Personal Information
//                   </Button>
//                 </ListItem>
//                 <ListItem disablePadding>
//                   <Button
//                     startIcon={<Inventory2Icon />}
//                     sx={getSidebarButtonStyle(currentStep === 'product', isDark)}
//                     onClick={() => setCurrentStep('product')}
//                   >
//                     Product
//                   </Button>
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Section: Form Content */}
//         <Grid item xs={12} md={8}>
//           <Card sx={figmaCardStyle}>
//             {currentStep === 'personal' ? (
//               <PersonalInformationForm onNext={handleNext} />
//             ) : (
//               <ProductInformationForm onBack={handleBack} />
//             )}
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

import React, { useState, useMemo, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    TextField, Button, Stack, CircularProgress, Grid, InputLabel, Select, MenuItem, FormControl, InputAdornment
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- API Simulation & Mock Data ---
const mockDealers = ['CoolAir Traders', 'Arctic Systems', 'Zenith Corp'];
const mockCustomers = ['Lal Singh Chaddha', 'ACME Corp', 'Global Tech'];
const mockMarketers = ['Rajesh Kumar', 'Priya Singh', 'Anjali Mehta'];
const mockProducts = [
    { name: '1.5 Ton 5 Star AC', price: 38000 },
    { name: 'Cooling Coils (Set)', price: 4500 },
    { name: 'Digital Thermostat', price: 1200 },
];

// --- Main Component ---
export default function NewSales() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        dealer: '',
        customer: '',
        marketer: '',
        salesItem: '',
        date: dayjs(),
        quantity: 1,
        perUnit: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        // Ensure quantity is a positive number (at least 1)
        if (name === 'quantity' && value !== '' && Number(value) < 1) {
            processedValue = 1;
        }
        // Ensure per unit price is not negative
        if (name === 'perUnit' && value !== '' && Number(value) < 0) {
            processedValue = 0;
        }

        const newForm = { ...form, [name]: processedValue };

        if (name === 'salesItem') {
            const product = mockProducts.find(p => p.name === value);
            newForm.perUnit = product ? product.price : 0;
        }

        setForm(newForm);
    };

    const handleDateChange = (newDate) => {
        setForm({ ...form, date: newDate });
    };

    const amount = useMemo(() => {
        const qty = parseFloat(form.quantity);
        const price = parseFloat(form.perUnit);
        return isNaN(qty) || isNaN(price) ? 0 : qty * price;
    }, [form.quantity, form.perUnit]);


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const finalData = { ...form, amount, date: form.date.format('YYYY-MM-DD') };
        console.log("Submitting New Sale:", finalData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // Reset form or show success message
    }, [form, amount]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Card sx={{ maxWidth: '600px', width: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                            <PointOfSaleIcon color="primary" />
                            <Typography variant="h5" fontWeight="bold">New Sale Entry</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Enter the details for the new sales transaction.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={2.5}>
                                <FormControl fullWidth><InputLabel>Dealer</InputLabel><Select name="dealer" label="Dealer" value={form.dealer} onChange={handleChange} startAdornment={<InputAdornment position="start"><StorefrontOutlinedIcon /></InputAdornment>}>{mockDealers.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</Select></FormControl>
                                <FormControl fullWidth><InputLabel>Customer</InputLabel><Select name="customer" label="Customer" value={form.customer} onChange={handleChange} startAdornment={<InputAdornment position="start"><PeopleAltOutlinedIcon /></InputAdornment>}>{mockCustomers.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select></FormControl>
                                <FormControl fullWidth><InputLabel>Marketer</InputLabel><Select name="marketer" label="Marketer" value={form.marketer} onChange={handleChange} startAdornment={<InputAdornment position="start"><BadgeOutlinedIcon /></InputAdornment>}>{mockMarketers.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl>
                                <FormControl fullWidth><InputLabel>Sales Item</InputLabel><Select name="salesItem" label="Sales Item" value={form.salesItem} onChange={handleChange} startAdornment={<InputAdornment position="start"><CategoryOutlinedIcon /></InputAdornment>}>{mockProducts.map(p => <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>)}</Select></FormControl>
                                
                                <DatePicker label="Sale Date" value={form.date} onChange={handleDateChange} slotProps={{ textField: { fullWidth: true } }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}><TextField fullWidth name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><NumbersOutlinedIcon /></InputAdornment> }} inputProps={{ min: 1 }} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth name="perUnit" label="Per Unit (₹)" type="number" value={form.perUnit} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyOutlinedIcon /></InputAdornment> }} inputProps={{ min: 0 }} /></Grid>
                                </Grid>
                                
                                <TextField fullWidth name="amount" label="Total Amount (₹)" value={amount.toLocaleString('en-IN')} InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><Typography fontWeight="bold">₹</Typography></InputAdornment> }} variant="filled" />
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{ py: 1.25, mt: 1.5 }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Sale'}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </LocalizationProvider>
    );
}

