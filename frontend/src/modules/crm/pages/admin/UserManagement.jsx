// import axios from "axios";
// import React, { useEffect, useState } from 'react';
// import {
//     Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
//     TableBody, TableRow, TableCell, Button, IconButton, Chip,
//     Dialog, DialogTitle, DialogContent, DialogActions, TextField,
//     FormControl, InputLabel, Select, MenuItem, Stack,
//     InputAdornment, CircularProgress
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import GroupIcon from '@mui/icons-material/Group';
// import StoreIcon from '@mui/icons-material/Store';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import Visibility from '@mui/icons-material/Visibility';
// import { VITE_API_BASE_URL } from "../../utils/State";
// import toast from "react-hot-toast";

// async function createUserApi(userData) {
//     const authKey = localStorage.getItem("authKey");
//     const response = await axios.post(
//         `${VITE_API_BASE_URL}/admin/create-user?`,
//         userData,
//         {
//             headers: {
//                 Authorization: `Bearer ${authKey}`,
//             },
//         }
//     );
//     const returnedAuthKey = response.data.authKey || response.data.token;
//     if (returnedAuthKey) {
//         localStorage.setItem("authKey", returnedAuthKey);
//     }
//     return response.data;
// }
// async function createProfileApi(userId, profileData) {
//     try {
//         const authKey = localStorage.getItem("authKey");
//         const response = await axios.post(
//             `${VITE_API_BASE_URL}/profiles/create`,
//             { userId, ...profileData },
//             {
//                 headers: {
//                     Authorization: `Bearer ${authKey}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Failed to create profile:", error);
//         throw error;
//     }
// }

// const roleOptions = ['MARKETER', 'ENGINEER', 'DEALER', 'SUBADMIN'];

// const getRoleIcon = (role) => {
//     switch (role) {
//         case 'Marketer': return <MonetizationOnIcon fontSize="small" />;
//         case 'Dealer': return <StoreIcon fontSize="small" />;
//         case 'Sub-admin': return <GroupIcon fontSize="small" />;
//         default: return <AccountCircleIcon fontSize="small" />;
//     }
// };

// export default function UserManagement() {
//     const [showPassword, setShowPassword] = useState({});

//     // Modals State
//     const [usersData, setUsersData] = useState([]);
//     const [viewLoading, setViewLoading] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [open, setOpen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [editUser, setEditUser] = useState(null);
//     const [viewOpen, setViewOpen] = useState(false);
//     const [viewUser, setViewUser] = useState(null);
//     const [editExtraOpen, setEditExtraOpen] = useState(false);
//     const [editExtraUser, setEditExtraUser] = useState(null);

//     const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', phone: '' });
//     const authKey = localStorage.getItem("authKey");

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${authKey}`,
//                         },
//                     }
//                 );
//                 setUsersData(response.data);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, [authKey]); // Added authKey as a dependency

//     const [createProfileData, setCreateProfileData] = useState({
//         gstNumber: "",
//         panNumber: "",
//         address: "",
//         city: "",
//         state: "",
//         pincode: "",
//         accountNo: "",
//         bankName: "",
//         ifscCode: ""
//     });
//     const [createProfileOpen, setCreateProfileOpen] = useState(false);
//     const [currentUserId, setCurrentUserId] = useState(null);

//     const handleCreateProfileOpen = () => setCreateProfileOpen(true);
//     const handleCreateProfileClose = () => {
//         setCreateProfileOpen(false);
//         setCreateProfileData({
//             gstNumber: "",
//             panNumber: "",
//             address: "",
//             city: "",
//             state: "",
//             pincode: "",
//             accountNo: "",
//             bankName: "",
//             ifscCode: ""
//         });
//     };
//     const handleCreateProfileChange = (e) => {
//         const { name, value } = e.target;
//         setCreateProfileData((prev) => ({ ...prev, [name]: value }));
//     };
//     const handleClickOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false);
//         setFormData({ name: '', email: '', password: '', role: '', phone: '' });
//     };

//     // ✅ FIX 1: Clear the password when the dialog opens.
//     const handleEditOpen = (user) => {
//         // Create a copy of the user object and explicitly set the password to empty
//         setEditUser({ ...user, password: '' });
//         setShowPassword(prev => ({ ...prev, edit: false }));
//         setEditOpen(true);
//     };

//     const handleEditClose = () => {
//         setEditOpen(false);
//         setEditUser(null);
//     };
//     const handleEditChange = (event) => {
//         const { name, value } = event.target;
//         setEditUser(prev => ({ ...prev, [name]: value }));
//     };

//     // ✅ FIX 2: Only send the password if the user entered a new one.
//     const handleEditSave = async () => {
//         if (!editUser || !editUser.userId) {
//             toast.error("User ID is missing. Cannot update.");
//             return;
//         }

//         const payload = {
//             name: editUser.name,
//             email: editUser.email,
//             phone: editUser.phone,
//             role: editUser.role.name || editUser.role,
//             isActive: editUser.status === 'Active'
//         };

//         // Only add the password to the payload if the field is not empty
//         if (editUser.password) {
//             payload.password = editUser.password;
//         }

//         try {
//             const response = await axios.put(
//                 `${VITE_API_BASE_URL}/user/update/${editUser.userId}`,
//                 payload,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${authKey}`,
//                     },
//                 }
//             );

//             // You may need to re-fetch users here to get the updated data (including new hash)
//             const updatedUsersResponse = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
//                 headers: { Authorization: `Bearer ${authKey}` },
//             });
//             setUsersData(updatedUsersResponse.data);

//             toast.success("User updated successfully!");
//             handleEditClose();
//         } catch (error) {
//             console.error("Failed to update user:", error);
//             toast.error("Failed to update user. Please try again.");
//         }
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;

//         if (name === "phone") {
//             if (/^\d*$/.test(value) && value.length <= 10) {
//                 setFormData(prevState => ({ ...prevState, [name]: value }));
//             }
//         } else {
//             setFormData(prevState => ({ ...prevState, [name]: value }));
//         }
//     };

//     const handleCreateUser = async () => {
//         if (formData.phone.length !== 10) {
//             toast.error("Phone number must be exactly 10 digits.");
//             return;
//         }

//         try {
//             await createUserApi(formData);
//             toast.success("User created successfully!");
//             handleClose();

//             const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
//                 headers: { Authorization: `Bearer ${authKey}` },
//             });
//             setUsersData(response.data);

//         } catch (error) {
//             console.error('Create user failed:', error);
//             const errorMessage = error.response?.data?.message || "Failed to create user. Please try again.";
//             toast.error(errorMessage);
//         }
//     };

//     const [profileMissing, setProfileMissing] = useState(false);

//     const handleViewOpen = async (user) => {
//         setCurrentUserId(user.userId);
//         setViewOpen(true);
//         setViewLoading(true);
//         setViewUser(null);
//         setProfileMissing(false);

//         if (!user.userId) {
//             console.error("User ID missing", user);
//             setViewLoading(false);
//             return;
//         }

//         try {
//             const authKey = localStorage.getItem("authKey");
//             const response = await axios.get(
//                 `${VITE_API_BASE_URL}/profiles/${user.userId}`,
//                 { headers: { Authorization: `Bearer ${authKey}` } }
//             );
//             setViewUser(response.data);
//         } catch (error) {
//             console.warn("No profile found for this user:", error);
//             toast.error("No profile found for this user. You can create one.");
//             setProfileMissing(true);
//         } finally {
//             setViewLoading(false);
//         }
//     };



//     const handleViewClose = () => {
//         setViewOpen(false);
//         setViewUser(null);
//     };

//     const handleEditExtraOpen = () => {
//         setEditExtraUser(viewUser);
//         setEditExtraOpen(true);
//     };
//     const handleEditExtraClose = () => {
//         setEditExtraOpen(false);
//         setEditExtraUser(null);
//     };
//     const handleEditExtraChange = (event) => {
//         const { name, value } = event.target;
//         setEditExtraUser(prev => ({ ...prev, [name]: value }));
//     };
//     const handleEditExtraSave = () => {
//         setViewUser(editExtraUser);
//         handleEditExtraClose();
//     };
//     const handleDeleteProfile = async (userId) => {
//         if (!window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) return;

//         try {
//             const authKey = localStorage.getItem("authKey");
//             await axios.delete(`${VITE_API_BASE_URL}/profiles/${userId}`, {
//                 headers: {
//                     Authorization: `Bearer ${authKey}`,
//                 },
//             });

//             setUsersData((prev) => prev.filter((u) => u.userId !== userId));
//             toast.success("Profile Deleted Successfully!");
//         } catch (error) {
//             console.error("Failed to delete profile:", error);
//             toast.error("Error deleting profile. Please try again.");
//         }
//     };


//     const getStatusChip = (status) => (
//         <Chip
//             label={status}
//             size="small"
//             variant="outlined"
//             color={status === 'Active' ? 'success' : 'error'}
//             sx={{ fontWeight: 'bold' }}
//         />
//     );

//     const handleTogglePassword = (userId) => {
//         setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
//     };

//     return (
//         <Box >
//             <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
//                 <CardContent>
//                     <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User List</Typography>
//                         <Button
//                             variant="contained"
//                             startIcon={<PersonAddIcon />}
//                             onClick={handleClickOpen}
//                         >
//                             Create New User
//                         </Button>
//                     </Stack>
//                 </CardContent>
//                 <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <Table stickyHeader>
//                         <TableHead>
//                             <TableRow>
//                                 {['Name', 'Role', 'Status', 'E-mail', 'Password', 'Action'].map((headCell) => (
//                                     <TableCell key={headCell}>{headCell}</TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={6} align="center">
//                                         <CircularProgress />
//                                     </TableCell>
//                                 </TableRow>
//                             ) : usersData.length > 0 ? (
//                                 usersData.map((user) => (
//                                     <TableRow key={user.userId} hover>
//                                         <TableCell>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                                                 {getRoleIcon(user.role.name)} {user.name}
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell>{user.role.name}</TableCell>
//                                         <TableCell>{getStatusChip(user.isActive ? 'Active' : 'Deactivate')}</TableCell>
//                                         <TableCell>{user.email}</TableCell>
//                                         <TableCell>
//                                             <TextField
//                                                 type={showPassword[user.userId] ? "text" : "password"}
//                                                 value={user.password}
//                                                 size="small"
//                                                 variant="standard"
//                                                 InputProps={{
//                                                     readOnly: true,
//                                                     endAdornment: (
//                                                         <InputAdornment position="end">
//                                                             <IconButton size="small" onClick={() => handleTogglePassword(user.userId)} edge="end">
//                                                                 {showPassword[user.userId] ? <VisibilityOff /> : <Visibility />}
//                                                             </IconButton>
//                                                         </InputAdornment>
//                                                     ),
//                                                     disableUnderline: true,
//                                                 }}
//                                                 sx={{ width: 120 }}
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             <IconButton size="small" onClick={() => handleEditOpen(user)}><EditIcon fontSize="small" /></IconButton>
//                                             <IconButton size="small" onClick={() => handleDeleteProfile(user.userId)}>
//                                                 <DeleteIcon fontSize="small" />
//                                             </IconButton>
//                                             <IconButton size="small" onClick={() => handleViewOpen(user)}><VisibilityIcon fontSize="small" /></IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={6} align="center">
//                                         No users found.
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Card>

//             {/* Create User Dialog */}
//             <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>Create User</DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={2} sx={{ mt: 2 }}>
//                         <TextField name="name" label="Full Name" fullWidth variant="outlined" value={formData.name} onChange={handleChange} required />
//                         <TextField name="email" label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} required />
//                         <TextField name="phone" label="Phone Number (10 digits)" fullWidth variant="outlined" value={formData.phone} onChange={handleChange} required />
//                         <TextField name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} required />
//                         <FormControl fullWidth required>
//                             <InputLabel>Role</InputLabel>
//                             <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
//                                 {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
//                             </Select>
//                         </FormControl>
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleClose} color="inherit">Cancel</Button>
//                     <Button onClick={handleCreateUser} variant="contained">Create User</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Create Profile Dialog */}
//             <Dialog open={createProfileOpen} onClose={handleCreateProfileClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>Create Profile</DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={2} sx={{ mt: 2 }}>
//                         {Object.entries(createProfileData).map(([key, value]) => (
//                             <TextField
//                                 key={key}
//                                 name={key}
//                                 label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                                 value={value}
//                                 fullWidth
//                                 onChange={handleCreateProfileChange}
//                             />
//                         ))}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleCreateProfileClose} color="inherit">Cancel</Button>
//                     <Button
//                         onClick={async () => {
//                             try {
//                                 await createProfileApi(currentUserId, createProfileData);
//                                 toast.success("Profile created successfully!");
//                                 handleCreateProfileClose();
//                                 const res = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
//                                     headers: { Authorization: `Bearer ${authKey}` },
//                                 });
//                                 setUsersData(res.data);
//                             } catch (error) {
//                                 toast.error("Failed to create profile. Please try again.");
//                             }
//                         }}
//                         variant="contained"
//                     >
//                         Create
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Update Profile Dialog */}
//             <Dialog open={editExtraOpen} onClose={handleEditExtraClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>Update Profile</DialogTitle>
//                 <DialogContent>
//                     {editExtraUser && (
//                         <Stack spacing={2} sx={{ mt: 2 }}>
//                             {Object.entries(editExtraUser).map(([key, value]) => (
//                                 <TextField
//                                     key={key}
//                                     name={key}
//                                     label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                                     value={value || ""}
//                                     fullWidth
//                                     onChange={handleEditExtraChange}
//                                 />
//                             ))}
//                         </Stack>
//                     )}
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleEditExtraClose} color="inherit">Cancel</Button>
//                     <Button
//                         onClick={async () => {
//                             try {
//                                 await updateProfileApi(currentUserId, editExtraUser);
//                                 toast.success("Profile updated successfully!");
//                                 handleEditExtraClose();

//                                 const updated = await axios.get(`${VITE_API_BASE_URL}/profiles/${currentUserId}`, {
//                                     headers: { Authorization: `Bearer ${authKey}` },
//                                 });
//                                 setViewUser(updated.data);
//                                 setViewOpen(true);
//                             } catch (error) {
//                                 console.error("Failed to update profile:", error);
//                                 toast.error("Failed to update profile. Please try again.");
//                             }
//                         }}
//                         variant="contained"
//                     >
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>




//             {/* Edit User Dialog */}
//             {editUser && (
//                 <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
//                     <DialogTitle sx={{ fontWeight: 'bold' }}>Edit User</DialogTitle>
//                     <DialogContent>
//                         <Stack spacing={2} sx={{ mt: 2 }}>
//                             <TextField name="name" label="Full Name" fullWidth variant="outlined" value={editUser.name} onChange={handleEditChange} />
//                             <TextField name="email" label="Email Address" fullWidth variant="outlined" value={editUser.email} onChange={handleEditChange} />
//                             <TextField
//                                 name="password"
//                                 label="New Password (leave blank to keep unchanged)"
//                                 type={showPassword['edit'] ? "text" : "password"}
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editUser.password || ''}
//                                 onChange={handleEditChange}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword(prev => ({ ...prev, edit: !prev.edit }))} edge="end">
//                                                 {showPassword['edit'] ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <FormControl fullWidth>
//                                 <InputLabel>Role</InputLabel>
//                                 <Select name="role" value={editUser.role.name || editUser.role} label="Role" onChange={handleEditChange}>
//                                     {roleOptions.map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
//                                 </Select>
//                             </FormControl>
//                             <FormControl fullWidth>
//                                 <InputLabel>Status</InputLabel>
//                                 <Select name="status" value={editUser.isActive ? 'Active' : 'Deactivate'} label="Status" onChange={handleEditChange}>
//                                     <MenuItem value="Active">Active</MenuItem>
//                                     <MenuItem value="Deactivate">Deactivate</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Stack>
//                     </DialogContent>
//                     <DialogActions sx={{ p: '16px 24px' }}>
//                         <Button onClick={handleEditClose} color="inherit">Cancel</Button>
//                         <Button onClick={handleEditSave} variant="contained">Save Changes</Button>
//                     </DialogActions>
//                 </Dialog>
//             )}

//             {/* Other Dialogs (View, Edit Extra, Create Profile) remain unchanged */}
//             {/* View Profile Dialog */}
//             <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>User Profile</DialogTitle>
//                 <DialogContent>
//                     {viewLoading ? (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
//                             <CircularProgress />
//                         </Box>
//                     ) : profileMissing ? (
//                         <Stack spacing={2} sx={{ mt: 2, textAlign: 'center' }}>
//                             <Typography color="text.secondary">
//                                 No profile found for this user.
//                             </Typography>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => {
//                                     setCreateProfileOpen(true);
//                                     setViewOpen(false);
//                                 }}
//                             >
//                                 Create Profile
//                             </Button>
//                         </Stack>
//                     ) : viewUser ? (
//                         <Stack spacing={1.5} sx={{ mt: 2 }}>
//                             {Object.entries(viewUser).map(([key, value]) => (
//                                 <Typography key={key}>
//                                     <b>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</b> {value || '—'}
//                                 </Typography>
//                             ))}
//                         </Stack>
//                     ) : (
//                         <Typography align="center">Error loading profile data.</Typography>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     {viewUser && (
//                         <Button
//                             onClick={() => {
//                                 setEditExtraUser(viewUser);
//                                 setEditExtraOpen(true);
//                                 setViewOpen(false);
//                             }}
//                             variant="contained"
//                         >
//                             Update Profile
//                         </Button>
//                     )}
//                     <Button onClick={handleViewClose}>Close</Button>
//                 </DialogActions>
//             </Dialog>


//         </Box>
//     );
// }



import axios from "axios";
import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
    TableBody, TableRow, TableCell, Button, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Stack,
    InputAdornment, CircularProgress,
    FormControlLabel,
    Switch
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

/* ---------- API helpers ---------- */
async function createUserApi(userData) {
    const authKey = localStorage.getItem("authKey");
    const response = await axios.post(
        `${VITE_API_BASE_URL}/admin/create-user`,
        userData,
        {
            headers: { Authorization: `Bearer ${authKey}` },
        }
    );
    const returnedAuthKey = response.data.authKey || response.data.token;
    if (returnedAuthKey) localStorage.setItem("authKey", returnedAuthKey);
    return response.data;
}

async function createProfileApi(userId, profileData) {
    if (!userId) throw new Error("Missing userId for profile creation");
    const authKey = localStorage.getItem("authKey");
    const response = await axios.post(
        `${VITE_API_BASE_URL}/profiles/create`,
        { userId, ...profileData },
        { headers: { Authorization: `Bearer ${authKey}` } }
    );
    return response.data;
}

async function updateProfileApi(userId, profileData) {
    if (!userId) throw new Error("Missing userId for profile update");
    const authKey = localStorage.getItem("authKey");
    // Send data without userId in body (userId is in URL)
    const payload = { ...profileData };
    delete payload.userId;
    const response = await axios.put(
        `${VITE_API_BASE_URL}/profiles/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${authKey}` } }
    );
    return response.data;
}

/* ---------- Constants ---------- */
const roleOptions = ['MARKETER', 'ENGINEER', 'DEALER', 'SUBADMIN'];

const getRoleIcon = (role) => {
    switch ((role || "").toLowerCase()) {
        case 'marketer': return <MonetizationOnIcon fontSize="small" />;
        case 'dealer': return <StoreIcon fontSize="small" />;
        case 'sub-admin':
        case 'subadmin': return <GroupIcon fontSize="small" />;
        default: return <AccountCircleIcon fontSize="small" />;
    }
};

/* ---------- Component ---------- */
export default function UserManagement() {
    const [showPassword, setShowPassword] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [profileMissing, setProfileMissing] = useState(false);

    const [editExtraOpen, setEditExtraOpen] = useState(false);
    const [editExtraUser, setEditExtraUser] = useState(null);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', phone: '' });
    const [createProfileData, setCreateProfileData] = useState({
        gstNumber: "", panNumber: "", address: "", city: "", state: "", pincode: "", accountNo: "", bankName: "", ifscCode: ""
    });
    const [createProfileOpen, setCreateProfileOpen] = useState(false);

    const [currentUserId, setCurrentUserId] = useState(null); // used for create/update profile requests
    const authKey = localStorage.getItem("authKey");

    /* ---------- Fetch users ---------- */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${authKey}` },
                });
                setUsersData(response.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [authKey]);

    /* ---------- Create / Edit user ---------- */
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ name: '', email: '', password: '', role: '', phone: '' });
    };

    const handleEditOpen = (user) => {
        // keep userId internally but DO NOT show it in the form
        setEditUser({ ...user, password: '' });
        setShowPassword(prev => ({ ...prev, edit: false }));
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        setEditUser(null);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        // handle status conversion separately
        if (name === "status") {
            setEditUser(prev => ({
                ...prev,
                isActive: value === "Active"
            }));
        } else {
            setEditUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleEditSave = async () => {
        if (!editUser || !editUser.userId) {
            toast.error("User ID is missing. Cannot update.");
            return;
        }
        const payload = {
            name: editUser.name,
            email: editUser.email,
            phone: editUser.phone,
            role: editUser.role?.name || editUser.role,
            isActive: editUser.isActive,
        };
        if (editUser.password) payload.password = editUser.password;

        try {
            await axios.put(`${VITE_API_BASE_URL}/user/update/${editUser.userId}`, payload, {
                headers: { Authorization: `Bearer ${authKey}` },
            });
            const updatedUsersResponse = await axios.get(`${VITE_API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${authKey}` } });
            setUsersData(updatedUsersResponse.data || []);
            toast.success("User updated successfully!");
            handleEditClose();
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error(error.response?.data?.message || "Failed to update user. Please try again.");
        }
    };

    /* ---------- Create user ---------- */
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "phone") {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateUser = async () => {
        if (formData.phone && formData.phone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }
        try {
            await createUserApi(formData);
            toast.success("User created successfully!");
            handleClose();
            const response = await axios.get(`${VITE_API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${authKey}` } });
            setUsersData(response.data || []);
        } catch (error) {
            console.error('Create user failed:', error);
            toast.error(error.response?.data?.message || "Failed to create user.");
        }
    };

    /* ---------- View profile (and set currentUserId) ---------- */
    const handleViewOpen = async (user) => {
        setCurrentUserId(user.userId); // ensure this is set for create/update flows
        setViewOpen(true);
        setViewLoading(true);
        setViewUser(null);
        setProfileMissing(false);

        if (!user.userId) {
            console.error("User ID missing", user);
            setViewLoading(false);
            toast.error("User ID missing.");
            return;
        }
        try {
            const response = await axios.get(`${VITE_API_BASE_URL}/profiles/${user.userId}`, {
                headers: { Authorization: `Bearer ${authKey}` }
            });
            setViewUser(response.data || null);
        } catch (error) {
            console.warn("No profile found for this user:", error);
            setProfileMissing(true);
            toast.error("No profile found for this user. You can create one.");
        } finally {
            setViewLoading(false);
        }
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewUser(null);
        setProfileMissing(false);
    };

    /* ---------- Create profile ---------- */
    const handleCreateProfileOpen = (userId) => {
        if (userId) setCurrentUserId(userId);
        setCreateProfileOpen(true);
    };
    const handleCreateProfileClose = () => {
        setCreateProfileOpen(false);
        setCreateProfileData({
            gstNumber: "", panNumber: "", address: "", city: "", state: "", pincode: "", accountNo: "", bankName: "", ifscCode: ""
        });
    };
    const handleCreateProfileChange = (e) => {
        const { name, value } = e.target;
        setCreateProfileData(prev => ({ ...prev, [name]: value }));
    };

    const submitCreateProfile = async () => {
        try {
            if (!currentUserId) throw new Error("Missing user context for profile creation");
            await createProfileApi(currentUserId, createProfileData);
            toast.success("Profile created successfully!");
            handleCreateProfileClose();

            // Refresh both profile view and users list
            const [profileResp, usersResp] = await Promise.all([
                axios.get(`${VITE_API_BASE_URL}/profiles/${currentUserId}`, { headers: { Authorization: `Bearer ${authKey}` } }),
                axios.get(`${VITE_API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${authKey}` } })
            ]);
            setViewUser(profileResp.data || null);
            setUsersData(usersResp.data || []);
        } catch (error) {
            console.error("Failed to create profile:", error);
            toast.error(error.response?.data?.message || "Failed to create profile. Please try again.");
        }
    };

    /* ---------- Update profile (admin or self depending on backend RBAC) ---------- */
    const handleEditExtraOpen = (userProfile) => {
        // copy profile but remove userId from items shown in form
        const copy = { ...userProfile };
        setEditExtraUser(copy);
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

    const submitUpdateProfile = async () => {
        try {
            if (!currentUserId) throw new Error("Missing userId for profile update");
            // Ensure we do NOT send userId in payload (server takes userId from URL or token)
            const payload = { ...editExtraUser };
            delete payload.userId;
            await updateProfileApi(currentUserId, payload);
            toast.success("Profile updated successfully!");
            handleEditExtraClose();

            // refresh profile view
            const updated = await axios.get(`${VITE_API_BASE_URL}/profiles/${currentUserId}`, { headers: { Authorization: `Bearer ${authKey}` } });
            setViewUser(updated.data || null);
            setViewOpen(true);
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    /* ---------- Delete profile ---------- */
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) return;
        try {
            await axios.delete(`${VITE_API_BASE_URL}/user/delete/${userId}`, { headers: { Authorization: `Bearer ${authKey}` } });
            // refresh list
            const usersResp = await axios.get(`${VITE_API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${authKey}` } });
            setUsersData(usersResp.data || []);
            toast.success("Profile Deleted Successfully!");
        } catch (error) {
            console.error("Failed to delete profile:", error);
            toast.error(error.response?.data?.message || "Error deleting profile. Please try again.");
        }
    };

    const getStatusChip = (status) => (
        <Chip label={status} size="small" variant="outlined" color={status === 'Active' ? 'success' : 'error'} sx={{ fontWeight: 'bold' }} />
    );

    const handleTogglePassword = (userId) => {
        setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    /* ---------- Render ---------- */
    return (
        <Box>
            <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User List</Typography>
                        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleClickOpen}>Create New User</Button>
                    </Stack>
                </CardContent>

                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>{['Name', 'Role', 'Status', 'E-mail', 'Password', 'Action'].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                            ) : usersData.length > 0 ? (
                                usersData.map(user => (
                                    <TableRow key={user.userId} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {getRoleIcon(user.role?.name || user.role)} {user.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.role?.name || user.role}</TableCell>
                                        <TableCell>{getStatusChip(user.isActive ? 'Active' : 'Deactivate')}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type={showPassword[user.userId] ? "text" : "password"}
                                                value={user.password || ''}
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
                                                sx={{ width: 140 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleEditOpen(user)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteUser(user.userId)}><DeleteIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => handleViewOpen(user)}><VisibilityIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={6} align="center">No users found.</TableCell></TableRow>
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
                        <TextField name="phone" label="Phone Number (10 digits)" fullWidth variant="outlined" value={formData.phone} onChange={handleChange} />
                        <TextField name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
                                {roleOptions.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained">Create User</Button>
                </DialogActions>
            </Dialog>

            {/* Create Profile Dialog */}
            <Dialog open={createProfileOpen} onClose={handleCreateProfileClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create Profile</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {Object.entries(createProfileData).map(([key, value]) => (
                            <TextField key={key} name={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                value={value}
                                fullWidth
                                onChange={handleCreateProfileChange}
                            />
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCreateProfileClose} color="inherit">Cancel</Button>
                    <Button onClick={submitCreateProfile} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Update Profile Dialog (hide userId from form) */}
            <Dialog open={editExtraOpen} onClose={handleEditExtraClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Update Profile</DialogTitle>
                <DialogContent>
                    {editExtraUser ? (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {Object.entries(editExtraUser)
                                // never show internal ids or audit fields in editable form
                                .filter(([key]) => key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt')
                                .map(([key, value]) => (
                                    <TextField key={key}
                                        name={key}
                                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        value={value || ""}
                                        fullWidth
                                        onChange={handleEditExtraChange}
                                    />
                                ))}
                        </Stack>
                    ) : (
                        <Box sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">No profile loaded.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleEditExtraClose} color="inherit">Cancel</Button>
                    <Button onClick={submitUpdateProfile} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            {editUser && (
                <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Edit User</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField name="name" label="Full Name" fullWidth variant="outlined" value={editUser.name || ''} onChange={handleEditChange} />
                            <TextField name="email" label="Email Address" fullWidth variant="outlined" value={editUser.email || ''} onChange={handleEditChange} />
                            <TextField name="password" label="New Password (leave blank to keep unchanged)"
                                type={showPassword['edit'] ? "text" : "password"} fullWidth variant="outlined"
                                value={editUser.password || ''} onChange={handleEditChange}
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
                                <Select name="role" value={editUser.role?.name || editUser.role || ''} label="Role" onChange={handleEditChange}>
                                    {roleOptions.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editUser.isActive}
                                        onChange={(e) => setEditUser(prev => ({ ...prev, isActive: e.target.checked }))}
                                    />
                                }
                                label={editUser.isActive ? "Active" : "Deactivated"}
                            />


                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={handleEditClose} color="inherit">Cancel</Button>
                        <Button onClick={handleEditSave} variant="contained">Save Changes</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* View Profile Dialog */}
            <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>User Profile</DialogTitle>
                <DialogContent>
                    {viewLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
                            <CircularProgress />
                        </Box>
                    ) : profileMissing ? (
                        <Stack spacing={2} sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography color="text.secondary">No profile found for this user.</Typography>
                            <Button variant="contained" onClick={() => { setCreateProfileOpen(true); setViewOpen(false); }}>Create Profile</Button>
                        </Stack>
                    ) : viewUser ? (
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                            {Object.entries(viewUser)
                                .filter(([key]) => key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt')
                                .map(([key, value]) => (
                                    <Typography key={key}><b>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</b> {value || '—'}</Typography>
                                ))}
                        </Stack>
                    ) : (
                        <Typography align="center">Error loading profile data.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    {viewUser && (
                        <Button onClick={() => { handleEditExtraOpen(viewUser); setViewOpen(false); }} variant="contained">Update Profile</Button>
                    )}
                    <Button onClick={handleViewClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
