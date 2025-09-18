import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, Button, IconButton, Chip, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, DialogContentText,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

// --- Mock Data ---
const usersData = [
    { id: 1, name: 'USER_1', role: 'Marketer', status: 'Active', email: 'user1@gmail.com', password: 'pass1' },
    { id: 2, name: 'USER_2', role: 'Service Engg.', status: 'Deactivate', email: 'user2@gmail.com', password: 'pass2' },
    { id: 3, name: 'USER_3', role: 'Marketer', status: 'Deactivate', email: 'user3@gmail.com', password: 'pass3' },
    { id: 4, name: 'USER_4', role: 'Dealer', status: 'Active', email: 'user4@gmail.com', password: 'pass4' },
    { id: 5, name: 'USER_5', role: 'Service Engg.', status: 'Deactivate', email: 'user5@gmail.com', password: 'pass5' },
    { id: 6, name: 'USER_6', role: 'Sub-admin', status: 'Active', email: 'user6@gmail.com', password: 'pass6' },
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
    const [showPassword, setShowPassword] = useState({}); // Track show/hide per user

    // State to control the modal's visibility
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);


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
    const handleEditOpen = (user) => {
        setEditUser(user);
        setShowPassword(prev => ({ ...prev, edit: false }));
        setEditOpen(true);
    };

     const handleEditClose = () => {
        setEditOpen(false);
        setEditUser(null);
    };
    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditUser(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSave = () => {
        console.log("Edited user:", editUser);
        setEditOpen(false);
        setEditUser(null);
        // Here you would update your usersData state if it was not mock data
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

    // Toggle password visibility for a specific user
    const handleTogglePassword = (userId) => {
        setShowPassword(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
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

                    <TableContainer
                        sx={{
                            maxHeight: 500, // Set your preferred height
                            overflowY: "auto",
                            // Optional: for dark mode, set background
                            background: isDark ? "#23242a" : "#fff",
                            borderRadius: 2,
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {['Name', 'Role', 'Status', 'E-mail', 'Password', 'Action'].map((headCell) => (
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
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TextField
                                                    type={showPassword[user.id] ? "text" : "password"}
                                                    value={user.password}
                                                    size="small"
                                                    variant="standard"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleTogglePassword(user.id)}
                                                                    edge="end"
                                                                >
                                                                    {showPassword[user.id] ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        disableUnderline: true,
                                                        style: { fontSize: 14, background: "transparent" }
                                                    }}
                                                    sx={{ width: 120 }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}  onClick={() => handleEditOpen(user)} ><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}><DeleteIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" sx={{ color: 'text.secondary' }} ><VisibilityIcon fontSize="small" /></IconButton>
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
                open={editOpen}
                onClose={handleEditClose}
                PaperProps={{ sx: { borderRadius: 4 } }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    Edit User
                </DialogTitle>
                <DialogContent>
                    {editUser && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                name="name"
                                label="Full Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={editUser.name}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={editUser.email}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type={showPassword['edit'] ? "text" : "password"}
                                fullWidth
                                variant="outlined"
                                value={editUser.password}
                                onChange={handleEditChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword['edit'] ? "Hide password" : "Show password"}
                                                onClick={() => setShowPassword(prev => ({ ...prev, edit: !prev.edit }))}
                                                edge="end"
                                            >
                                                {showPassword['edit'] ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="role-edit-select-label">Role</InputLabel>
                                <Select
                                    labelId="role-edit-select-label"
                                    name="role"
                                    value={editUser.role}
                                    label="Role"
                                    onChange={handleEditChange}
                                >
                                    {roleOptions.map((role) => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="status-edit-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-edit-select-label"
                                    name="status"
                                    value={editUser.status}
                                    label="Status"
                                    onChange={handleEditChange}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Deactivate">Deactivate</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleEditClose} color="inherit">Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained" size="large">Save Changes</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}