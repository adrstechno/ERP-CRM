

import axios from "axios";

import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
    TableBody, TableRow, TableCell, Button, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Stack,
    InputAdornment,CircularProgress
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
import { REACT_APP_BASE_URL } from "../../utils/State";

const VITE_API_BASE_URL= import.meta.env.VITE_API_BASE_URL;


const user = localStorage.getItem("user");

async function createUserApi(userData) {
    try {
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
    } catch (error) {
        throw error;
    }
}
async function createProfileApi(userId, profileData) {
  try {
    const authKey = localStorage.getItem("authKey");
    const response = await axios.post(
      `${VITE_API_BASE_URL}/profiles/create-profile`,
      { userId, ...profileData },   // send full details
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
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const authKey = localStorage.getItem("authKey");
                const response = await axios.get(`${REACT_APP_BASE_URL}/admin/users`,
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
    }, []);
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
        setEditUser(prev => ({ ...prev, [name]: value }));
    };
     const handleEditSave = async () => {
        if (!editUser) return;

        // This payload sends the role name as a simple string to match the backend's expectation.
        const payload = {
            name: editUser.name,
            email: editUser.email,
            phone: editUser.phone,
            password: editUser.password, // Only send password if it's being changed
            role: editUser.role, // Sending the role name as a string
            isActive: editUser.status === 'Active'
        };

        try {
            const authKey = localStorage.getItem("authKey");
            const response = await axios.put(
                `${REACT_APP_BASE_URL}/profiles/update/${user.userId}`,
                payload, {
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                    },
                }
            );

            // Update the user in the local state to reflect changes immediately
            setUsersData(prevUsers =>
                prevUsers.map(user =>
                    user.userId === editUser.userId ? { ...user, ...editUser } : user
                )
            );
            console.log("User updated successfully:", response.data);
            handleEditClose(); // Close the dialog on success
        } catch (error) {
            console.error("Failed to update user:", error);
            // Optionally, show an error message to the user here
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateUser = async () => {
        try {
            const result = await createUserApi(formData);
            console.log('User created:', result);
            handleClose();
            // Optionally, refresh user list or show a success message
        } catch (error) {
            console.error('Create user failed:', error);
            // Optionally, show error message to user
        }
    };

//    const handleViewOpen = async (user) => {
//         // This console.log is the most important tool to debug this.
//         // Please check your browser's developer console to see what the 'user' object contains.
//         console.log("Inspecting user object on click:", user);

//         setViewOpen(true);
//         setViewLoading(true);
//         setViewUser(null);

//         // Ensure we have a valid ID before making the call.
//         const userId = user.userId;
//         if (!userId) {
//             console.error("User ID is missing or invalid", user);
//             setViewLoading(false);
//             return;
//         }

//         try {
//             const authKey = localStorage.getItem("authKey");
//             const response = await axios.get(
//                 `${REACT_APP_BASE_URL}/profiles/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${authKey}`,
//                     },
//                 }
//             );
//             setViewUser(response.data);
//         } catch (error) {
//             console.error("Failed to fetch user profile:", error);
//             setViewUser(null);
//         } finally {
//             setViewLoading(false);
//         }
//     };
const [profileMissing, setProfileMissing] = useState(false);

const handleViewOpen = async (user) => {
  console.log("Inspecting user object on click:", user);
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
      `${REACT_APP_BASE_URL}/profiles/${userId}`,
      { headers: { Authorization: `Bearer ${authKey}` } }
    );
    setViewUser(response.data);
  } catch (error) {
    console.warn("No profile found for this user:", error);
    setProfileMissing(true);  // flag that profile is missing
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
        console.log("Edited extra fields:", editExtraUser);
        setViewUser(editExtraUser); // Update the view dialog with new data
        handleEditExtraClose();
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
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : usersData.length > 0 ? (
                                usersData.map((user) => (

                                    <TableRow key={user.userid} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {getRoleIcon(user.role.name)} {user.name}

                                                {user.name.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.role.name}</TableCell>
                                        <TableCell>{getStatusChip(user.isActive ? 'Active' : 'Deactivate')}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type={showPassword[user.id] ? "text" : "password"}
                                                value={user.password}
                                                size="small"
                                                variant="standard"
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton size="small" onClick={() => handleTogglePassword(user.userid)} edge="end">
                                                                {showPassword[user.userid] ? <VisibilityOff /> : <Visibility />}
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
                                            <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
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
                        <TextField name="name" label="Full Name" fullWidth variant="outlined" value={formData.name} onChange={handleChange} />
                        <TextField name="email" label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} />
                        <TextField name="phone" label="Phone Number" fullWidth variant="outlined" value={formData.phone} onChange={handleChange} />
                        <TextField name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} />
                        <FormControl fullWidth>
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
{editUser && (
                <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Edit User</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField name="name" label="Full Name" fullWidth variant="outlined" value={editUser.name} onChange={handleEditChange} />
                            <TextField name="email" label="Email Address" fullWidth variant="outlined" value={editUser.email} onChange={handleEditChange} />
                            <TextField name="password" label="Password" type={showPassword['edit'] ? "text" : "password"} fullWidth variant="outlined" value={editUser.password} onChange={handleEditChange}
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
                                <Select name="role" value={editUser.role} label="Role" onChange={handleEditChange}>
                                    {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select name="status" value={editUser.status} label="Status" onChange={handleEditChange}>
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

            {/* View User Details Dialog */}
            <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
                <DialogActions sx={{ p: '16px 24px' }}>
  <Button onClick={handleViewClose}>Close</Button>
  {profileMissing && (
    <Button
      variant="contained"
      color="primary"
      onClick={handleCreateProfileOpen}
    >
      Create Profile
    </Button>
  )}
  {!profileMissing && (
    <Button onClick={handleEditExtraOpen} variant="contained" disabled={!viewUser}>
      Edit Details
    </Button>
  )}
</DialogActions>
                <DialogTitle sx={{ fontWeight: 'bold' }}>User Details</DialogTitle>
                <DialogContent>
                    {viewLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <CircularProgress />
                        </Box>
                    ) : viewUser ? (
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                            <Typography><b>GST Number:</b> {viewUser.gstNumber || 'N/A'}</Typography>
                            <Typography><b>PAN Number:</b> {viewUser.panNumber || 'N/A'}</Typography>
                            <Typography><b>Address:</b> {viewUser.address ? `${viewUser.address}, ${viewUser.city}, ${viewUser.state} - ${viewUser.pincode}` : 'N/A'}</Typography>
                            <Typography><b>Account No:</b> {viewUser.accountNo || 'N/A'}</Typography>
                            <Typography><b>Bank Name:</b> {viewUser.bankName || 'N/A'}</Typography>
                            <Typography><b>IFSC Code:</b> {viewUser.ifscCode || 'N/A'}</Typography>
                        </Stack>
                    ) : (
                         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <Typography color="error">Could not load user details.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleViewClose}>Close</Button>
                    <Button onClick={handleEditExtraOpen} variant="contained" disabled={!viewUser}>Edit Details</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Extra Details Dialog */}
            {editExtraUser && (
                <Dialog open={editExtraOpen} onClose={handleEditExtraClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Extra Details</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField name="gstNumber" label="GST Number" fullWidth variant="outlined" value={editExtraUser.gstNumber} onChange={handleEditExtraChange} />
                            <TextField name="panNumber" label="PAN Number" fullWidth variant="outlined" value={editExtraUser.panNumber} onChange={handleEditExtraChange} />
                            <TextField name="address" label="Address" fullWidth variant="outlined" value={editExtraUser.address} onChange={handleEditExtraChange} />
                            <TextField name="city" label="City" fullWidth variant="outlined" value={editExtraUser.city} onChange={handleEditExtraChange} />
                            <TextField name="state" label="State" fullWidth variant="outlined" value={editExtraUser.state} onChange={handleEditExtraChange} />
                            <TextField name="pincode" label="Pincode" fullWidth variant="outlined" value={editExtraUser.pincode} onChange={handleEditExtraChange} />
                            <TextField name="accountNo" label="Account No" fullWidth variant="outlined" value={editExtraUser.accountNo} onChange={handleEditExtraChange} />
                            <TextField name="bankName" label="Bank Name" fullWidth variant="outlined" value={editExtraUser.bankName} onChange={handleEditExtraChange} />
                            <TextField name="ifscCode" label="IFSC Code" fullWidth variant="outlined" value={editExtraUser.ifscCode} onChange={handleEditExtraChange} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleEditExtraClose}>Cancel</Button>
                        <Button onClick={handleEditExtraSave} variant="contained">Save Changes</Button>
                    </DialogActions>
                </Dialog>
                
                
            )}

            <Dialog open={createProfileOpen} onClose={handleCreateProfileClose} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ fontWeight: 'bold' }}>Create Profile</DialogTitle>
  <DialogContent>
    <Stack spacing={2} sx={{ mt: 2 }}>
      <TextField name="gstNumber" label="GST Number" fullWidth value={createProfileData.gstNumber} onChange={handleCreateProfileChange} />
      <TextField name="panNumber" label="PAN Number" fullWidth value={createProfileData.panNumber} onChange={handleCreateProfileChange} />
      <TextField name="address" label="Address" fullWidth value={createProfileData.address} onChange={handleCreateProfileChange} />
      <TextField name="city" label="City" fullWidth value={createProfileData.city} onChange={handleCreateProfileChange} />
      <TextField name="state" label="State" fullWidth value={createProfileData.state} onChange={handleCreateProfileChange} />
      <TextField name="pincode" label="Pincode" fullWidth value={createProfileData.pincode} onChange={handleCreateProfileChange} />
      <TextField name="accountNo" label="Account No" fullWidth value={createProfileData.accountNo} onChange={handleCreateProfileChange} />
      <TextField name="bankName" label="Bank Name" fullWidth value={createProfileData.bankName} onChange={handleCreateProfileChange} />
      <TextField name="ifscCode" label="IFSC Code" fullWidth value={createProfileData.ifscCode} onChange={handleCreateProfileChange} />
    </Stack>
  </DialogContent>
  <DialogActions sx={{ p: '16px 24px' }}>
    <Button onClick={handleCreateProfileClose}>Cancel</Button>
    <Button
      variant="contained"   
      onClick={async () => {
        try {
        //   const createdProfile = await createProfileApi(viewUser ? viewUser.userId : userBeingViewed.userId, createProfileData);
        const createdProfile = await createProfileApi(currentUserId, createProfileData);
          console.log("Profile created:", createdProfile);
          setViewUser(createdProfile);
          setProfileMissing(false);
          handleCreateProfileClose();
        } catch (err) {
          console.error("Error creating profile:", err);
        }
      }}
    >
      Save Profile
    </Button>
  </DialogActions>
</Dialog>


        </Box>
    );
}

