import axios from "axios";
import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
    TableBody, TableRow, TableCell, Button, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Stack,
    InputAdornment, CircularProgress
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
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";

async function createUserApi(userData) {
    const authKey = localStorage.getItem("authKey");
    const response = await axios.post(
        `${VITE_API_BASE_URL}/admin/create-user?`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${authKey}`,
            },
        }
    );
    const returnedAuthKey = response.data.authKey || response.data.token;
    if (returnedAuthKey) {
        localStorage.setItem("authKey", returnedAuthKey);
    }
    return response.data;
}
async function createProfileApi(userId, profileData) {
    try {
        const authKey = localStorage.getItem("authKey");
        const response = await axios.post(
            `${VITE_API_BASE_URL}/profiles/create-profile`,
            { userId, ...profileData },
            {
                headers: {
                    Authorization: `Bearer ${authKey}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create profile:", error);
        throw error;
    }
}

const roleOptions = ['MARKETER', 'ENGINEER', 'DEALER', 'SUBADMIN'];

const getRoleIcon = (role) => {
    switch (role) {
        case 'Marketer': return <MonetizationOnIcon fontSize="small" />;
        case 'Dealer': return <StoreIcon fontSize="small" />;
        case 'Sub-admin': return <GroupIcon fontSize="small" />;
        default: return <AccountCircleIcon fontSize="small" />;
    }
};

export default function UserManagement() {
    const [showPassword, setShowPassword] = useState({});

    // Modals State
    const [usersData, setUsersData] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [editExtraOpen, setEditExtraOpen] = useState(false);
    const [editExtraUser, setEditExtraUser] = useState(null);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', phone: '' });
    const authKey = localStorage.getItem("authKey");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${authKey}`,
                        },
                    }
                );
                setUsersData(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [authKey]); // Added authKey as a dependency

    const [createProfileData, setCreateProfileData] = useState({
        gstNumber: "",
        panNumber: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        accountNo: "",
        bankName: "",
        ifscCode: ""
    });
    const [createProfileOpen, setCreateProfileOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleCreateProfileOpen = () => setCreateProfileOpen(true);
    const handleCreateProfileClose = () => {
        setCreateProfileOpen(false);
        setCreateProfileData({
            gstNumber: "",
            panNumber: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            accountNo: "",
            bankName: "",
            ifscCode: ""
        });
    };
    const handleCreateProfileChange = (e) => {
        const { name, value } = e.target;
        setCreateProfileData((prev) => ({ ...prev, [name]: value }));
    };
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ name: '', email: '', password: '', role: '', phone: '' });
    };

    // ✅ FIX 1: Clear the password when the dialog opens.
    const handleEditOpen = (user) => {
        // Create a copy of the user object and explicitly set the password to empty
        setEditUser({ ...user, password: '' });
        setShowPassword(prev => ({ ...prev, edit: false }));
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditUser(null);
    };
    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditUser(prev => ({ ...prev, [name]: value }));
    };
    
    // ✅ FIX 2: Only send the password if the user entered a new one.
    const handleEditSave = async () => {
        if (!editUser || !editUser.userId) {
            toast.error("User ID is missing. Cannot update.");
            return;
        }

        const payload = {
            name: editUser.name,
            email: editUser.email,
            phone: editUser.phone,
            role: editUser.role.name || editUser.role,
            isActive: editUser.status === 'Active'
        };

        // Only add the password to the payload if the field is not empty
        if (editUser.password) {
            payload.password = editUser.password;
        }

        try {
            const response = await axios.put(
                `${VITE_API_BASE_URL}/user/update/${editUser.userId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                    },
                }
            );

            // You may need to re-fetch users here to get the updated data (including new hash)
            const updatedUsersResponse = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${authKey}` },
            });
            setUsersData(updatedUsersResponse.data);
            
            toast.success("User updated successfully!");
            handleEditClose();
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error("Failed to update user. Please try again.");
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "phone") {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData(prevState => ({ ...prevState, [name]: value }));
            }
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleCreateUser = async () => {
        if (formData.phone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }

        try {
            await createUserApi(formData);
            toast.success("User created successfully!");
            handleClose();

            const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${authKey}` },
            });
            setUsersData(response.data);

        } catch (error) {
            console.error('Create user failed:', error);
            const errorMessage = error.response?.data?.message || "Failed to create user. Please try again.";
            toast.error(errorMessage);
        }
    };

    const [profileMissing, setProfileMissing] = useState(false);

    const handleViewOpen = async (user) => {
        setCurrentUserId(user.userId);
        setViewOpen(true);
        setViewLoading(true);
        setViewUser(null);
        setProfileMissing(false);

        const userId = user.userId;
        if (!userId) {
            console.error("User ID missing", user);
            setViewLoading(false);
            return;
        }

        try {
            const authKey = localStorage.getItem("authKey");
            const response = await axios.get(
                `${VITE_API_BASE_URL}/profiles/${userId}`,
                { headers: { Authorization: `Bearer ${authKey}` } }
            );
            setViewUser(response.data);
        } catch (error) {
            console.warn("No profile found for this user:", error);
            setProfileMissing(true);
            setViewUser(null);
        } finally {
            setViewLoading(false);
        }
    };


    const handleViewClose = () => {
        setViewOpen(false);
        setViewUser(null);
    };

    const handleEditExtraOpen = () => {
        setEditExtraUser(viewUser);
        setEditExtraOpen(true);
    };
    const handleEditExtraClose = () => {
        setEditExtraOpen(false);
        setEditExtraUser(null);
    };
    const handleEditExtraChange = (event) => {
        const { name, value } = event.target;
        setEditExtraUser(prev => ({ ...prev, [name]: value }));
    };
    const handleEditExtraSave = () => {
        setViewUser(editExtraUser);
        handleEditExtraClose();
    };
    const handleDeleteProfile = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) return;

        try {
            const authKey = localStorage.getItem("authKey");
            await axios.delete(`${VITE_API_BASE_URL}/profiles/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authKey}`,
                },
            });

            setUsersData((prev) => prev.filter((u) => u.userId !== userId));
            toast.success("Profile Deleted Successfully!");
        } catch (error) {
            console.error("Failed to delete profile:", error);
            toast.error("Error deleting profile. Please try again.");
        }
    };


    const getStatusChip = (status) => (
        <Chip
            label={status}
            size="small"
            variant="outlined"
            color={status === 'Active' ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
        />
    );

    const handleTogglePassword = (userId) => {
        setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    return (
        <Box >
            <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User List</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={handleClickOpen}
                        >
                            Create New User
                        </Button>
                    </Stack>
                </CardContent>
                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {['Name', 'Role', 'Status', 'E-mail', 'Password', 'Action'].map((headCell) => (
                                    <TableCell key={headCell}>{headCell}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : usersData.length > 0 ? (
                                usersData.map((user) => (
                                    <TableRow key={user.userId} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {getRoleIcon(user.role.name)} {user.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.role.name}</TableCell>
                                        <TableCell>{getStatusChip(user.isActive ? 'Active' : 'Deactivate')}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type={showPassword[user.userId] ? "text" : "password"}
                                                value={user.password}
                                                size="small"
                                                variant="standard"
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton size="small" onClick={() => handleTogglePassword(user.userId)} edge="end">
                                                                {showPassword[user.userId] ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    disableUnderline: true,
                                                }}
                                                sx={{ width: 120 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleEditOpen(user)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteProfile(user.userId)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleViewOpen(user)}><VisibilityIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create User</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField name="name" label="Full Name" fullWidth variant="outlined" value={formData.name} onChange={handleChange} required />
                        <TextField name="email" label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} required />
                        <TextField name="phone" label="Phone Number (10 digits)" fullWidth variant="outlined" value={formData.phone} onChange={handleChange} required />
                        <TextField name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} required />
                        <FormControl fullWidth required>
                            <InputLabel>Role</InputLabel>
                            <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
                                {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained">Create User</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            {editUser && (
                <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Edit User</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField name="name" label="Full Name" fullWidth variant="outlined" value={editUser.name} onChange={handleEditChange} />
                            <TextField name="email" label="Email Address" fullWidth variant="outlined" value={editUser.email} onChange={handleEditChange} />
                            <TextField 
                                name="password" 
                                label="New Password (leave blank to keep unchanged)" 
                                type={showPassword['edit'] ? "text" : "password"} 
                                fullWidth 
                                variant="outlined" 
                                value={editUser.password || ''} 
                                onChange={handleEditChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(prev => ({ ...prev, edit: !prev.edit }))} edge="end">
                                                {showPassword['edit'] ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select name="role" value={editUser.role.name || editUser.role} label="Role" onChange={handleEditChange}>
                                    {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select name="status" value={editUser.isActive ? 'Active' : 'Deactivate'} label="Status" onChange={handleEditChange}>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Deactivate">Deactivate</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleEditClose} color="inherit">Cancel</Button>
                        <Button onClick={handleEditSave} variant="contained">Save Changes</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Other Dialogs (View, Edit Extra, Create Profile) remain unchanged */}
            
        </Box>
    );
}