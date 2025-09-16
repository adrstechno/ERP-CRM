


import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, Button, IconButton, Chip, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// --- Mock Data ---
const usersData = [
    { id: 1, name: 'USER_1', role: 'Marketer', status: 'Active', email: 'user1@gmail.com' },
    { id: 2, name: 'USER_2', role: 'Service Engg.', status: 'Deactivate', email: 'user2@gmail.com' },
    { id: 3, name: 'USER_3', role: 'Marketer', status: 'Deactivate', email: 'user3@gmail.com' },
    { id: 4, name: 'USER_4', role: 'Dealer', status: 'Active', email: 'user4@gmail.com' },
    { id: 5, name: 'USER_5', role: 'Service Engg.', status: 'Deactivate', email: 'user5@gmail.com' },
    { id: 6, name: 'USER_6', role: 'Sub-admin', status: 'Active', email: 'user6@gmail.com' },
];

const roleOptions = ['Marketer', 'Service Engg.', 'Dealer', 'Sub-admin'];

// --- Helper Functions ---
const getRoleIcon = (role) => {
    switch (role) {
      case 'Marketer': return <MonetizationOnIcon fontSize="small" />;
      case 'Dealer': return <StoreIcon fontSize="small" />;
      case 'Sub-admin': return <GroupIcon fontSize="small" />;
      default: return <AccountCircleIcon fontSize="small" />;
    }
};

export default function UserManagementMainContent() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // State to control the modal's visibility
    const [open, setOpen] = useState(false);

    // State to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // Reset form on close
        setFormData({ name: '', email: '', password: '', role: '' });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateUser = () => {
        console.log('New User Data:', formData);
        handleClose();
    };

    const getStatusChip = (status) => {
        const is_active = status === 'Active';
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    backgroundColor: is_active ? theme.palette.success.light + '30' : theme.palette.error.light + '30',
                    color: is_active ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 'bold',
                }}
            />
        );
    };

    return (
        <Box p={3}>
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: 'none',
                    background: isDark
                        ? 'linear-gradient(135deg, #3A414B 0%, #20262E 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)',
                    p: 3,
                }}
            >
                <CardContent>
                    <Typography variant="h6" mb={3} sx={{ fontWeight: 'bold' }}>
                        USER LIST
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Name', 'Role', 'Status', 'E-mail', 'Action'].map((headCell) => (
                                        <TableCell key={headCell} sx={{ color: 'text.secondary', borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
                                            {headCell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersData.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {getRoleIcon(user.role)} {user.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{user.role}</TableCell>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{getStatusChip(user.status)}</TableCell>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{user.email}</TableCell>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}><DeleteIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}><VisibilityIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        sx={{
                            mt: 4, bgcolor: '#424242', color: 'white', '&:hover': { bgcolor: '#616161' },
                            px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none',
                        }}
                    >
                        Create New User
                    </Button>
                </CardContent>
            </Card>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                PaperProps={{ sx: { borderRadius: 4 } }}
                maxWidth="sm" // <-- Increased width
                fullWidth      // <-- Ensures it uses the full available width
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    <PersonAddIcon />
                    Create a New User
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please fill in the details to create a new user account. The user will receive an email to set up their profile.
                    </DialogContentText>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField autoFocus name="name" label="Full Name" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleChange} />
                        <TextField name="email" label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} />
                        <TextField name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} />
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select labelId="role-select-label" name="role" value={formData.role} label="Role" onChange={handleChange}>
                                {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained" size="large">Create User</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}