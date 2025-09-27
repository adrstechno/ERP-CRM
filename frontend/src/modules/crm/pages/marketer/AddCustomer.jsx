import React, { useState, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    TextField, Button, Stack, CircularProgress, Grid, InputAdornment
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

// --- Main Component ---
const AddCustomer = () => {
    // API-ready state management
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting New Customer:", form);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // Reset form or show success message
        setForm({ name: '', email: '', phone: '', address: '' });
    }, [form]);

    return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)' }}>
            <Card sx={{ maxWidth: '600px', width: '100%' }}>
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                        <PersonAddAlt1Icon color="primary" />
                        <Typography variant="h5" fontWeight="bold">Add New Customer</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Fill in the details below to create a new customer profile.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                required
                                name="name"
                                label="Customer Name"
                                value={form.name}
                                onChange={handleChange}
                                variant="filled"
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment> }}
                            />
                            <TextField
                                required
                                name="email"
                                label="Email Address"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                variant="filled"
                                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment> }}
                            />
                            <TextField
                                required
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                variant="filled"
                                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment> }}
                            />
                            <TextField
                                required
                                name="address"
                                label="Address"
                                multiline
                                rows={3}
                                value={form.address}
                                onChange={handleChange}
                                variant="filled"
                                 InputProps={{ startAdornment: <InputAdornment position="start"><HomeOutlinedIcon /></InputAdornment> }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{ py: 1.5, mt: 2 }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Customer'}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AddCustomer;

// import React, { useState, useCallback } from 'react';
// import {
//     Box, Card, CardContent, Typography,
//     TextField, Button, Stack, CircularProgress, Grid, InputAdornment
// } from '@mui/material';
// import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
// import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

// // --- Main Component ---
// const AddCustomer = () => {
//     // API-ready state management
//     const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         console.log("Submitting New Customer:", form);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         setIsSubmitting(false);
//         // Reset form or show success message
//         setForm({ name: '', email: '', phone: '', address: '' });
//     }, [form]);

//     return (
//         <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)' }}>
//             <Card sx={{ maxWidth: '600px', width: '100%' }}>
//                 <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
//                     <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
//                         <PersonAddAlt1Icon color="primary" />
//                         <Typography variant="h5" fontWeight="bold">Add New Customer</Typography>
//                     </Stack>
//                     <Typography variant="body2" color="text.secondary" mb={4}>
//                         Fill in the details below to create a new customer profile.
//                     </Typography>

//                     <Box component="form" onSubmit={handleSubmit}>
//                         <Stack spacing={3}>
//                             <TextField
//                                 required
//                                 name="name"
//                                 label="Customer Name"
//                                 value={form.name}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                             />
//                              <TextField
//                                 required
//                                 name="email"
//                                 label="Email Address"
//                                 type="email"
//                                 value={form.email}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                             />
//                             <TextField
//                                 required
//                                 name="phone"
//                                 label="Phone Number"
//                                 type="tel"
//                                 value={form.phone}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                             />
//                             <TextField
//                                 required
//                                 name="address"
//                                 label="Address"
//                                 multiline
//                                 rows={3}
//                                 value={form.address}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                             />
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 size="large"
//                                 fullWidth
//                                 disabled={isSubmitting}
//                                 startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
//                                 sx={{ py: 1.5, mt: 2 }}
//                             >
//                                 {isSubmitting ? 'Saving...' : 'Save Customer'}
//                             </Button>
//                         </Stack>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }

// export default AddCustomer;

