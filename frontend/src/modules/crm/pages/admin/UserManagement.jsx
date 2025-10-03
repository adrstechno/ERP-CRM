// import React, { useState } from 'react';
// import axios from "axios";
// import {
//     Box, Card, CardContent, Typography, TableContainer, Table, TableHead,
//     TableBody, TableRow, TableCell, Button, IconButton, Chip, useTheme,
//     Dialog, DialogTitle, DialogContent, DialogActions, TextField,
//     FormControl, InputLabel, Select, MenuItem, DialogContentText,
//     InputAdornment
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
// import { Phone } from '@mui/icons-material';

// // --- Mock Data ---
// const usersData = [
//     {
//         id: 1,
//         name: 'USER_1',
//         role: 'Marketer',
//         status: 'Active',
//         email: 'user1@gmail.com',
//         password: 'pass1',
//         gstNumber: '27AAAPL1234C1ZV',
//         panNumber: 'AAAPL1234C',
//         address: '101, Market Road',
//         city: 'Mumbai',
//         state: 'Maharashtra',
//         pincode: '400001',
//         accountNo: '1234567890',
//         bankName: 'HDFC Bank',
//         ifscCode: 'HDFC0001234'
//     },
//     {
//         id: 2,
//         name: 'USER_2',
//         role: 'Service Engg.',
//         status: 'Deactivate',
//         email: 'user2@gmail.com',
//         password: 'pass2',
//         gstNumber: '29AAAPL5678D1ZW',
//         panNumber: 'AAAPL5678D',
//         address: '202, Service Lane',
//         city: 'Bangalore',
//         state: 'Karnataka',
//         pincode: '560001',
//         accountNo: '2345678901',
//         bankName: 'ICICI Bank',
//         ifscCode: 'ICIC0002345'
//     },
//     {
//         id: 3,
//         name: 'USER_3',
//         role: 'Marketer',
//         status: 'Deactivate',
//         email: 'user3@gmail.com',
//         password: 'pass3',
//         gstNumber: '07AAAPL9101E1ZX',
//         panNumber: 'AAAPL9101E',
//         address: '303, Sales Street',
//         city: 'Delhi',
//         state: 'Delhi',
//         pincode: '110001',
//         accountNo: '3456789012',
//         bankName: 'Axis Bank',
//         ifscCode: 'UTIB0003456'
//     },
//     {
//         id: 4,
//         name: 'USER_4',
//         role: 'Dealer',
//         status: 'Active',
//         email: 'user4@gmail.com',
//         password: 'pass4',
//         gstNumber: '19AAAPL1122F1ZV',
//         panNumber: 'AAAPL1122F',
//         address: '404, Dealer Plaza',
//         city: 'Kolkata',
//         state: 'West Bengal',
//         pincode: '700001',
//         accountNo: '4567890123',
//         bankName: 'SBI',
//         ifscCode: 'SBIN0004567'
//     },
//     {
//         id: 5,
//         name: 'USER_5',
//         role: 'Service Engg.',
//         status: 'Deactivate',
//         email: 'user5@gmail.com',
//         password: 'pass5',
//         gstNumber: '24AAAPL3344G1ZW',
//         panNumber: 'AAAPL3344G',
//         address: '505, Service Avenue',
//         city: 'Ahmedabad',
//         state: 'Gujarat',
//         pincode: '380001',
//         accountNo: '5678901234',
//         bankName: 'Kotak Bank',
//         ifscCode: 'KKBK0005678'
//     },
//     {
//         id: 6,
//         name: 'USER_6',
//         role: 'Sub-admin',
//         status: 'Active',
//         email: 'user6@gmail.com',
//         password: 'pass6',
//         gstNumber: '32AAAPL5566H1ZV',
//         panNumber: 'AAAPL5566H',
//         address: '606, Admin Block',
//         city: 'Chennai',
//         state: 'Tamil Nadu',
//         pincode: '600001',
//         accountNo: '6789012345',
//         bankName: 'Yes Bank',
//         ifscCode: 'YESB0006789'
//     }
// ];

// const roleOptions = ['MARKETER', 'ENGINEER', 'DEALER', 'SUBADMIN'];


// // --- Helper Functions ---
// async function createUserApi(userData) {
//     try {
//         const authKey = localStorage.getItem("authKey");
//         const response = await axios.post(
//             "http://localhost:8080/api/admin/create-user?",
//             userData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${authKey}`,
//                 },
//             }
//         );
//         const returnedAuthKey = response.data.authKey || response.data.token;
//         if (returnedAuthKey) {
//             localStorage.setItem("authKey", returnedAuthKey);
//         }
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }
// const getRoleIcon = (role) => {
//     switch (role) {
//         case 'Marketer': return <MonetizationOnIcon fontSize="small" />;
//         case 'Dealer': return <StoreIcon fontSize="small" />;
//         case 'Sub-admin': return <GroupIcon fontSize="small" />;
//         default: return <AccountCircleIcon fontSize="small" />;
//     }
// };

// export default function UserManagementMainContent() {
//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';
//     const [showPassword, setShowPassword] = useState({}); // Track show/hide per user

//     // State to control the modal's visibility
//     const [open, setOpen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [editUser, setEditUser] = useState(null);
//     const [viewOpen, setViewOpen] = useState(false);
//     const [viewUser, setViewUser] = useState(null);
//     const [editExtraOpen, setEditExtraOpen] = useState(false);
//     const [editExtraUser, setEditExtraUser] = useState(null);

//     // State to hold the form data
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         role: '',
//         phone: '',
//     });

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         // Reset form on close
//         setFormData({ name: '', email: '', password: '', role: '' });
//     };
//     const handleEditOpen = (user) => {
//         setEditUser(user);
//         setShowPassword(prev => ({ ...prev, edit: false }));
//         setEditOpen(true);
//     };

//     const handleEditClose = () => {
//         setEditOpen(false);
//         setEditUser(null);
//     };
//     const handleEditChange = (event) => {
//         const { name, value } = event.target;
//         setEditUser(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleEditSave = () => {
//         console.log("Edited user:", editUser);
//         setEditOpen(false);
//         setEditUser(null);
//         // Here you would update your usersData state if it was not mock data
//     };


//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const handleCreateUser = async () => {
//         try {
//             const result = await createUserApi(formData);
//             console.log('User created:', result);
//             handleClose();
//             // Optionally, refresh user list or show a success message
//         } catch (error) {
//             console.error('Create user failed:', error);
//             // Optionally, show error message to user
//         }
//     };

//     const handleViewOpen = (user) => {
//         setViewUser(user);
//         setViewOpen(true);
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
//         setEditExtraUser(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleEditExtraSave = () => {
//         // Here you would update your usersData state if it was not mock data
//         console.log("Edited extra fields:", editExtraUser);
//         setEditExtraOpen(false);
//         setEditExtraUser(null);
//         setViewUser(editExtraUser); // Update the view dialog with new data
//     };

//     const getStatusChip = (status) => {
//         const is_active = status === 'Active';
//         return (
//             <Chip
//                 label={status}
//                 size="small"
//                 sx={{
//                     backgroundColor: is_active ? theme.palette.success.light + '30' : theme.palette.error.light + '30',
//                     color: is_active ? theme.palette.success.main : theme.palette.error.main,
//                     fontWeight: 'bold',
//                 }}
//             />
//         );
//     };

//     // Toggle password visibility for a specific user
//     const handleTogglePassword = (userId) => {
//         setShowPassword(prev => ({
//             ...prev,
//             [userId]: !prev[userId]
//         }));
//     };

//     return (
//         <Box p={3}>
//             <Card
//                 sx={{
//                     borderRadius: 2,
//                     boxShadow: 'none',
//                     background: isDark
//                         ? 'linear-gradient(135deg, #3A414B 0%, #20262E 100%)'
//                         : 'linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)',
//                     p: 3,
//                 }}
//             >
//                 <CardContent>
//                     <Typography variant="h6" mb={3} sx={{ fontWeight: 'bold' }}>
//                         USER LIST
//                     </Typography>

//                     <TableContainer
//                         sx={{
//                             maxHeight: 500, // Set your preferred height
//                             overflowY: "auto",
//                             // Optional: for dark mode, set background
//                             background: isDark ? "#23242a" : "#fff",
//                             borderRadius: 2,
//                         }}
//                     >
//                         <Table stickyHeader>
//                             <TableHead>
//                                 <TableRow>
//                                     {['Name', 'Role', 'Status', 'E-mail', 'Password', 'Action'].map((headCell) => (
//                                         <TableCell key={headCell} sx={{ color: 'text.secondary', borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
//                                             {headCell}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {usersData.map((user) => (
//                                     <TableRow key={user.id}>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                                                 {getRoleIcon(user.role)} {user.name}
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{user.role}</TableCell>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{getStatusChip(user.status)}</TableCell>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>{user.email}</TableCell>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                 <TextField
//                                                     type={showPassword[user.id] ? "text" : "password"}
//                                                     value={user.password}
//                                                     size="small"
//                                                     variant="standard"
//                                                     InputProps={{
//                                                         readOnly: true,
//                                                         endAdornment: (
//                                                             <InputAdornment position="end">
//                                                                 <IconButton
//                                                                     size="small"
//                                                                     onClick={() => handleTogglePassword(user.id)}
//                                                                     edge="end"
//                                                                 >
//                                                                     {showPassword[user.id] ? <VisibilityOff /> : <Visibility />}
//                                                                 </IconButton>
//                                                             </InputAdornment>
//                                                         ),
//                                                         disableUnderline: true,
//                                                         style: { fontSize: 14, background: "transparent" }
//                                                     }}
//                                                     sx={{ width: 120 }}
//                                                 />
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell sx={{ borderBottomColor: isDark ? '#4F5761' : '#E0E0E0' }}>
//                                             <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleEditOpen(user)} ><EditIcon fontSize="small" /></IconButton>
//                                             <IconButton size="small" sx={{ color: 'text.secondary' }}><DeleteIcon fontSize="small" /></IconButton>
//                                             <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleViewOpen(user)}><VisibilityIcon fontSize="small" /></IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     <Button
//                         variant="contained"
//                         onClick={handleClickOpen}
//                         sx={{
//                             mt: 4, bgcolor: '#424242', color: 'white', '&:hover': { bgcolor: '#616161' },
//                             px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none',
//                         }}
//                     >
//                         Create New User
//                     </Button>
//                 </CardContent>
//             </Card>

//             <Dialog


//                 open={editOpen}
//                 onClose={handleEditClose}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 4,
//                         minHeight: 400,
//                     }
//                 }}
//                 maxWidth="sm"
//                 fullWidth
//                 Height="800px"


//             >
//                 <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
//                     Edit User
//                 </DialogTitle>
//                 <DialogContent>
//                     {editUser && (
//                         <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, padding: 2 }}>
//                             <TextField
//                                 name="name"
//                                 label="Full Name"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editUser.name}
//                                 onChange={handleEditChange}
//                             />
//                             <TextField
//                                 name="email"
//                                 label="Email Address"
//                                 type="email"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editUser.email}
//                                 onChange={handleEditChange}
//                             />
//                             <TextField
//                                 name="password"
//                                 label="Password"
//                                 type={showPassword['edit'] ? "text" : "password"}
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editUser.password}
//                                 onChange={handleEditChange}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 aria-label={showPassword['edit'] ? "Hide password" : "Show password"}
//                                                 onClick={() => setShowPassword(prev => ({ ...prev, edit: !prev.edit }))}
//                                                 edge="end"
//                                             >
//                                                 {showPassword['edit'] ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <FormControl fullWidth>
//                                 <InputLabel id="role-edit-select-label">Role</InputLabel>
//                                 <Select
//                                     labelId="role-edit-select-label"
//                                     name="role"
//                                     value={editUser.role}
//                                     label="Role"
//                                     onChange={handleEditChange}
//                                 >
//                                     {roleOptions.map((role) => (
//                                         <MenuItem key={role} value={role}>{role}</MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <FormControl fullWidth>
//                                 <InputLabel id="status-edit-select-label">Status</InputLabel>
//                                 <Select
//                                     labelId="status-edit-select-label"
//                                     name="status"
//                                     value={editUser.status}
//                                     label="Status"
//                                     onChange={handleEditChange}
//                                 >
//                                     <MenuItem value="Active">Active</MenuItem>
//                                     <MenuItem value="Deactivate">Deactivate</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Box>
//                     )}
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleEditClose} color="inherit">Cancel</Button>
//                     <Button onClick={handleEditSave} variant="contained" size="large">Save Changes</Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog
//                 open={open}
//                 onClose={handleClose}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 4,
//                         minHeight: 400,
//                     }
//                 }}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
//                     Create User
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, padding: 2 }}>
//                         <TextField
//                             name="name"
//                             label="Full Name"
//                             type="text"
//                             fullWidth
//                             variant="outlined"
//                             value={formData.name}
//                             onChange={handleChange}
//                         />
//                         <TextField
//                             name="email"
//                             label="Email Address"
//                             type="email"
//                             fullWidth
//                             variant="outlined"
//                             value={formData.email}
//                             onChange={handleChange}
//                         />
//                         <TextField
//                             name="phone"
//                             label="Phone Number"
//                             type="text"
//                             fullWidth
//                             variant="outlined"

//                             value={formData.phone}

//                             onChange={handleChange}
//                         />
//                         <TextField
//                             name="password"
//                             label="Password"
//                             type={showPassword['create'] ? "text" : "password"}
//                             fullWidth
//                             variant="outlined"
//                             value={formData.password}
//                             onChange={handleChange}
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             aria-label={showPassword['create'] ? "Hide password" : "Show password"}
//                                             onClick={() => setShowPassword(prev => ({ ...prev, create: !prev.create }))}
//                                             edge="end"
//                                         >
//                                             {showPassword['create'] ? <VisibilityOff /> : <Visibility />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                         <FormControl fullWidth>
//                             <InputLabel id="role-create-select-label">Role</InputLabel>
//                             <Select
//                                 labelId="role-create-select-label"
//                                 name="role"
//                                 value={formData.role}
//                                 label="Role"
//                                 onChange={handleChange}
//                             >
//                                 {roleOptions.map((role) => (
//                                     <MenuItem key={role} value={role}>{role}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleClose} color="inherit">Cancel</Button>
//                     <Button onClick={handleCreateUser} variant="contained" size="large">Create User</Button>
//                 </DialogActions>
//             </Dialog>

//             <Dialog
//                 open={viewOpen}
//                 onClose={handleViewClose}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 4,
//                         minWidth: 400,
//                         minHeight: 400,
//                     }
//                 }}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
//                     User Details
//                 </DialogTitle>
//                 <DialogContent>
//                     {viewUser && (
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
//                             <Typography><b>GST Number:</b> {viewUser.gstNumber}</Typography>
//                             <Typography><b>PAN Number:</b> {viewUser.panNumber}</Typography>
//                             <Typography><b>Address:</b> {viewUser.address}</Typography>
//                             <Typography><b>City:</b> {viewUser.city}</Typography>
//                             <Typography><b>State:</b> {viewUser.state}</Typography>
//                             <Typography><b>Pincode:</b> {viewUser.pincode}</Typography>
//                             <Typography><b>Account No:</b> {viewUser.accountNo}</Typography>
//                             <Typography><b>Bank Name:</b> {viewUser.bankName}</Typography>
//                             <Typography><b>IFSC Code:</b> {viewUser.ifscCode}</Typography>
//                         </Box>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleEditExtraOpen} variant="contained" color="primary">Edit</Button>

//                     <Button onClick={handleViewClose} color="primary">Close</Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog
//                 open={editExtraOpen}
//                 onClose={handleEditExtraClose}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 4,
//                         minWidth: 400,
//                         minHeight: 400,
//                     }
//                 }}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
//                     Edit User Extra Details
//                 </DialogTitle>
//                 <DialogContent>
//                     {editExtraUser && (
//                         <Box
//                             component="form"
//                             sx={{
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 gap: 2.5,
//                                 padding: 2,
//                                 minWidth: 300,
//                                 maxHeight: 400,
//                                 overflowY: 'auto',
//                             }}
//                         >
//                             <TextField
//                                 name="gstNumber"
//                                 label="GST Number"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.gstNumber}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="panNumber"
//                                 label="PAN Number"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.panNumber}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="address"
//                                 label="Address"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.address}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="city"
//                                 label="City"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.city}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="state"
//                                 label="State"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.state}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="pincode"
//                                 label="Pincode"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.pincode}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="accountNo"
//                                 label="Account No"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.accountNo}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="bankName"
//                                 label="Bank Name"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.bankName}
//                                 onChange={handleEditExtraChange}
//                             />
//                             <TextField
//                                 name="ifscCode"
//                                 label="IFSC Code"
//                                 type="text"
//                                 fullWidth
//                                 variant="outlined"
//                                 value={editExtraUser.ifscCode}
//                                 onChange={handleEditExtraChange}
//                             />
//                         </Box>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleEditExtraClose} color="inherit">Cancel</Button>
//                     <Button onClick={handleEditExtraSave} variant="contained" size="large">Save Changes</Button>
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


const REACT_APP_BASE_URL =  "http://localhost:8080";

// --- Mock Data (Expanded for Scrolling) ---
// const usersData = [
//     { id: 1, name: 'USER_1', role: 'Marketer', status: 'Active', email: 'user1@gmail.com', password: 'pass1', gstNumber: '27AAAPL1234C1ZV', panNumber: 'AAAPL1234C', address: '101, Market Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', accountNo: '1234567890', bankName: 'HDFC Bank', ifscCode: 'HDFC0001234' },
//     { id: 2, name: 'USER_2', role: 'Service Engg.', status: 'Deactivate', email: 'user2@gmail.com', password: 'pass2', gstNumber: '29AAAPL5678D1ZW', panNumber: 'AAAPL5678D', address: '202, Service Lane', city: 'Bangalore', state: 'Karnataka', pincode: '560001', accountNo: '2345678901', bankName: 'ICICI Bank', ifscCode: 'ICIC0002345' },
//     { id: 3, name: 'USER_3', role: 'Marketer', status: 'Deactivate', email: 'user3@gmail.com', password: 'pass3', gstNumber: '07AAAPL9101E1ZX', panNumber: 'AAAPL9101E', address: '303, Sales Street', city: 'Delhi', state: 'Delhi', pincode: '110001', accountNo: '3456789012', bankName: 'Axis Bank', ifscCode: 'UTIB0003456' },
//     { id: 4, name: 'USER_4', role: 'Dealer', status: 'Active', email: 'user4@gmail.com', password: 'pass4', gstNumber: '19AAAPL1122F1ZV', panNumber: 'AAAPL1122F', address: '404, Dealer Plaza', city: 'Kolkata', state: 'West Bengal', pincode: '700001', accountNo: '4567890123', bankName: 'SBI', ifscCode: 'SBIN0004567' },
//     { id: 5, name: 'USER_5', role: 'Service Engg.', status: 'Deactivate', email: 'user5@gmail.com', password: 'pass5', gstNumber: '24AAAPL3344G1ZW', panNumber: 'AAAPL3344G', address: '505, Service Avenue', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', accountNo: '5678901234', bankName: 'Kotak Bank', ifscCode: 'KKBK0005678' },
//     { id: 6, name: 'USER_6', role: 'Sub-admin', status: 'Active', email: 'user6@gmail.com', password: 'pass6', gstNumber: '32AAAPL5566H1ZV', panNumber: 'AAAPL5566H', address: '606, Admin Block', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', accountNo: '6789012345', bankName: 'Yes Bank', ifscCode: 'YESB0006789' },
//     { id: 7, name: 'USER_7', role: 'Marketer', status: 'Active', email: 'user7@gmail.com', password: 'pass7', gstNumber: '22AAAPL7788I1ZY', panNumber: 'AAAPL7788I', address: '707, Commerce Tower', city: 'Pune', state: 'Maharashtra', pincode: '411001', accountNo: '7890123456', bankName: 'HDFC Bank', ifscCode: 'HDFC0007890' },
// ];
async function createUserApi(userData) {
    try {
        const authKey = localStorage.getItem("authKey");
        const response = await axios.post(
            `${REACT_APP_BASE_URL}/api/admin/create-user?`,
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
      `${REACT_APP_BASE_URL}/api/profiles/create-profile`,
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
// async function createProfileApi(userId) {
//   try {
//     const authKey = localStorage.getItem("authKey");
//     const response = await axios.post(
//       `${REACT_APP_BASE_URL}/api/profiles/create-profile`,
//       { userId },  // send userId in body
//       {
//         headers: {
//           Authorization: `Bearer ${authKey}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Failed to create profile:", error);
//     throw error;
//   }
// }

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
                const response = await axios.get(`${REACT_APP_BASE_URL}/api/admin/users`,
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
                `${REACT_APP_BASE_URL}/api/profiles/update/${user.userId}`,
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
//                 `${REACT_APP_BASE_URL}/api/profiles/${userId}`, {
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
      `${REACT_APP_BASE_URL}/api/profiles/${userId}`,
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

