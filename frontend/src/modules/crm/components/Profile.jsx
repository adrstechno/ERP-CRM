
    // import React, { useState, useEffect } from 'react';
    // import {
    // Box,
    // Card,
    // CardContent,
    // Typography,
    // TextField,
    // Button,
    // Grid,
    // Avatar,
    // Chip,
    // Divider,
    // CircularProgress,
    // Alert,
    // useTheme,
    // Badge,
    // IconButton,
    // alpha, 
    // } from '@mui/material';
    // import {
    // Edit,
    // Save,
    // X,
    // MapPin,
    // Building2,
    // FileText,
    // CreditCard,
    // Landmark,
    // User,
    // Mail,
    // Phone,
    // Shield,
    // Calendar,
    // CheckCircle,
    // XCircle,

    // } from 'lucide-react';

    // // Main Profile Component
    // const Profile = () => {
    // const theme = useTheme();
    // const [isEditing, setIsEditing] = useState(false);
    // const [loading, setLoading] = useState(true); // Start with loading true
    // const [error, setError] = useState(null);
    // const [success, setSuccess] = useState(false);
    
    // // Mock data - in a real app, this would come from an API
    // const [userData] = useState({
    //     userId: 4,
    //     role: { id: 4, name: "MARKETER" },
    //     name: "marketer",
    //     email: "marketer@gmail.com",
    //     phone: "8007894805",
    //     isActive: true,
    //     createdAt: "2025-09-29T17:28:55.8483",
    //     updatedAt: "2025-09-29T17:28:55.8483",
    // });

    // const [profileData, setProfileData] = useState({
    //     id: 1,
    //     address: "123 Main Street",
    //     city: "Mumbai",
    //     state: "Maharashtra",
    //     pincode: "400001",
    //     gstNumber: "22AAAAA0000A1Z5",
    //     panNumber: "AAAAA0000A",
    //     accountNo: "1234567890",
    //     bankName: "State Bank of India",
    //     ifscCode: "SBIN0000123"
    // });

    // const [editedData, setEditedData] = useState({});

    // // Effect to fetch data on component mount
    // useEffect(() => {
    //     fetchProfileData();
    // }, []);

    // // Simulates fetching profile data from an API
    // const fetchProfileData = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //     // Simulate API call delay
    //     await new Promise(resolve => setTimeout(resolve, 800));
    //     setProfileData(profileData);
    //     setEditedData(profileData);
    //     } catch (err) {
    //     setError('Failed to load profile data. Please refresh the page.');
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // const handleEdit = () => {
    //     setIsEditing(true);
    //     setError(null);
    //     setSuccess(false);
    // };

    // const handleCancel = () => {
    //     setIsEditing(false);
    //     setEditedData(profileData);
    //     setError(null);
    // };

    // // Simulates saving updated data to an API
    // const handleSave = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         // Simulate API call delay
    //     await new Promise(resolve => setTimeout(resolve, 1000));
        
    //     setProfileData(editedData);
    //     setIsEditing(false);
    //     setSuccess(true);
    //     setTimeout(() => setSuccess(false), 3000);
    //     } catch (err) {
    //     setError('Failed to update profile. Please try again.');
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // const handleChange = (field, value) => {
    //     setEditedData(prev => ({ ...prev, [field]: value }));
    // };

    // // Helper to format date strings
    // const formatDate = (dateString) => {
    //     return new Date(dateString).toLocaleDateString('en-US', {
    //     year: 'numeric', month: 'long', day: 'numeric'
    //     });
    // };

    // // Reusable component for displaying/editing a field
    // const InfoField = ({ label, value, field, icon: Icon }) => (
    //     <Box sx={{ mb: 2.5 }}>
    //     <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
    //         {Icon && <Icon size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />}
    //         <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
    //         {label}
    //         </Typography>
    //     </Box>
    //     {isEditing ? (
    //         <TextField
    //         fullWidth
    //         variant="outlined"
    //         size="small"
    //         value={editedData[field]}
    //         onChange={(e) => handleChange(field, e.target.value)}
    //         sx={{
    //             '& .MuiOutlinedInput-root': {
    //             backgroundColor: alpha(theme.palette.action.selected, 0.5),
    //             }
    //         }}
    //         />
    //     ) : (
    //         <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
    //         {value || '—'}
    //         </Typography>
    //     )}
    //     </Box>
    // );

    // // Main loading state for the whole page
    // if (loading && !profileData.id) {
    //     return (
    //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
    //         <CircularProgress />
    //     </Box>
    //     );
    // }

    // return (
    //     <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
    //     {/* --- NOTIFICATION ALERTS --- */}
    //     {success && (
    //         <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle size={20} />}>
    //         Profile updated successfully!
    //         </Alert>
    //     )}
    //     {error && (
    //         <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} icon={<XCircle size={20} />}>
    //         {error}
    //         </Alert>
    //     )}

    //     <Card sx={{ mb: 3, overflow: 'visible' }}>
    //         <Box
    //         sx={{
    //             height: 90,
                
    //         }}
    //         />
    //         <CardContent sx={{ pt: 0 }}>
    //         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 3 }}>
    //             <Badge
    //             overlap="circular"
    //             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //             sx={{ mt: -8 }}
    //             >
    //             <Avatar
    //                 sx={{
    //                 width: 140,
    //                 height: 140,
    //                 border: `4px solid ${theme.palette.background.paper}`,
    //                 fontSize: '3rem',
    //                 fontWeight: 600,
    //                 color: 'primary.contrastText',
    //                 backgroundColor: 'primary.main',
    //                 }}
    //             >
    //                 {userData.name.charAt(0).toUpperCase()}
    //             </Avatar>
    //             </Badge>

    //             <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
    //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
    //                 <Typography variant="h4" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
    //                 {userData.name}
    //                 </Typography>
    //                 <Chip
    //                 icon={userData.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
    //                 label={userData.isActive ? "Active" : "Inactive"}
    //                 size="small"
    //                 color={userData.isActive ? "success" : "error"}
    //                 variant="outlined"
    //                 />
    //             </Box>
                
    //             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
    //                 <Chip
    //                 icon={<Shield size={16} />}
    //                 label={userData.role.name}
    //                 size="small"
    //                 variant="outlined"
    //                 color="primary"
    //                 />
    //                 <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                 <Mail size={14} /> {userData.email}
    //                 </Typography>
    //                 <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
    //                 <Phone size={14} /> {userData.phone}
    //                 </Typography>
    //             </Box>

    //             <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }}}>
    //                 <Calendar size={12} /> Joined: {formatDate(userData.createdAt)}
    //             </Typography>
    //             </Box>

    //             <Box sx={{ display: 'flex', gap: 1.5, mt: { xs: 2, md: 0 }, alignSelf: { md: 'flex-start'} }}>
    //             {!isEditing ? (
    //                 <Button variant="contained" startIcon={<Edit size={18} />} onClick={handleEdit}>
    //                 Edit Profile
    //                 </Button>
    //             ) : (
    //                 <>
    //                 <Button variant="outlined" color="secondary" startIcon={<X size={18} />} onClick={handleCancel} disabled={loading}>
    //                     Cancel
    //                 </Button>
    //                 <Button
    //                     variant="contained"
    //                     startIcon={loading ? <CircularProgress color="inherit" size={18} /> : <Save size={18} />}
    //                     onClick={handleSave}
    //                     disabled={loading}
    //                 >
    //                     Save Changes
    //                 </Button>
    //                 </>
    //             )}
    //             </Box>
    //         </Box>
    //         </CardContent>
    //     </Card>

    //     <Grid container spacing={3}>
    //         {/* --- BUSINESS INFORMATION --- */}
    //         <Grid item xs={12} lg={6}>
    //         <Card sx={{ height: '100%' }}>
    //             <CardContent sx={{ p: 3 }}>
    //                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //                     <Building2 size={22} style={{ color: theme.palette.text.secondary }} />
    //                     Business Information
    //                 </Typography>
    //                 <Divider sx={{ mb: 3 }} />
    //                 <InfoField label="Address" value={profileData.address} field="address" icon={MapPin} />
    //                 <InfoField label="City" value={profileData.city} field="city" icon={Building2} />
    //                 <InfoField label="State" value={profileData.state} field="state" icon={MapPin} />
    //                 <InfoField label="Pincode" value={profileData.pincode} field="pincode" icon={MapPin} />
    //             </CardContent>
    //         </Card>
    //         </Grid>

    //         {/* --- TAX INFORMATION --- */}
    //         <Grid item xs={12} lg={6}>
    //         <Card sx={{ height: '100%' }}>
    //             <CardContent sx={{ p: 3 }}>
    //                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //                     <FileText size={22} style={{ color: theme.palette.text.secondary }} />
    //                     Tax Information
    //                 </Typography>
    //                 <Divider sx={{ mb: 3 }} />
    //                 <InfoField label="GST Number" value={profileData.gstNumber} field="gstNumber" icon={FileText} />
    //                 <InfoField label="PAN Number" value={profileData.panNumber} field="panNumber" icon={CreditCard} />
    //             </CardContent>
    //         </Card>
    //         </Grid>

    //         {/* --- BANKING INFORMATION --- */}
    //         <Grid item xs={12}>
    //         <Card>
    //             <CardContent sx={{ p: 3 }}>
    //                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
    //                     <Landmark size={22} style={{ color: theme.palette.text.secondary }} />
    //                     Banking Information
    //                 </Typography>
    //             <Divider sx={{ mb: 3 }} />
    //             <Grid container spacing={3}>
    //                 <Grid item xs={12} md={4}>
    //                 <InfoField label="Account Number" value={profileData.accountNo} field="accountNo" icon={CreditCard} />
    //                 </Grid>
    //                 <Grid item xs={12} md={4}>
    //                 <InfoField label="Bank Name" value={profileData.bankName} field="bankName" icon={Landmark} />
    //                 </Grid>
    //                 <Grid item xs={12} md={4}>
    //                 <InfoField label="IFSC Code" value={profileData.ifscCode} field="ifscCode" icon={FileText} />
    //                 </Grid>
    //             </Grid>
    //             </CardContent>
    //         </Card>
    //         </Grid>
    //     </Grid>
    //     </Box>
    // );
    // };

    // export default Profile;


    import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Badge,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Edit,
  Save,
  X,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Landmark,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Camera,
} from 'lucide-react';
import { VITE_API_BASE_URL } from '../utils/State';
// Base URL for your API. Centralizing this makes it easy to change.


// Main Profile Component
const Profile = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    // On component mount, get user auth token from local storage.
    // This would typically be set when a user logs in.
    

    const token = localStorage.getItem('authKey');
    console.log(token);
    
    if (token) {
      fetchProfileData();
    } else {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Fetches all necessary data from the API using the auth token
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authKey');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Fetch the primary user data based on the token.
      // Assumption: The API has an endpoint like '/users/me' that identifies the user from the token.
      const userResponse = await fetch(`${VITE_API_BASE_URL}/profiles/me`, { headers });
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data (HTTP ${userResponse.status})`);
      }
      const fetchedUserData = await userResponse.json();
      const userId = fetchedUserData.userId;

      // 2. Once we have the userId, fetch the associated detailed profile.
      const profileResponse = await fetch(`${VITE_API_BASE_URL}/profiles/user/${userId}`, { headers });
      
      let fetchedProfileData = {};
      if (profileResponse.ok) {
        fetchedProfileData = await profileResponse.json();
      } else {
        // Gracefully handle cases where a profile might not exist for a user yet.
        console.warn(`Could not fetch profile data (HTTP ${profileResponse.status}). A profile may not have been created yet.`);
      }

      // Add profileImageUrl for the avatar, as it's not in the API response.
      const userDataWithImage = {
        ...fetchedUserData,
        profileImageUrl: `https://i.pravatar.cc/150?u=${userId}`
      };

      setUserData(userDataWithImage);
      setProfileData(fetchedProfileData);
      // Combine all editable fields into one state object for the form
      setEditedData({ ...userDataWithImage, ...fetchedProfileData });

    } catch (err) {
      setError(err.message || 'Failed to load profile data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData, ...profileData }); // Reset changes
    setError(null);
  };

  // Saves updated data to the API
  const handleSave = async () => {
    setSaveLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      // 1. Separate data for their respective API endpoints
      // Assumption: A user updates their own data via a `/api/users/{id}` endpoint, not an admin-only route.
      const userPayload = { name: editedData.name, email: editedData.email, phone: editedData.phone };
      const profilePayload = {
        address: editedData.address, city: editedData.city, state: editedData.state,
        pincode: editedData.pincode, gstNumber: editedData.gstNumber, panNumber: editedData.panNumber,
        accountNo: editedData.accountNo, bankName: editedData.bankName, ifscCode: editedData.ifscCode,
      };
      
      // 2. Define the API update calls
      const updateUserCall = fetch(`${VITE_API_BASE_URL}/users/${userData.userId}`, {
        method: 'PUT', headers, body: JSON.stringify(userPayload)
      });
      
      // Only attempt to update the profile if a profile ID exists.
      // If not, we might need a POST to create one, but for this scope, we'll stick to PUT.
      const updateProfileCall = profileData?.id
        ? fetch(`${VITE_API_BASE_URL}/profiles/${profileData.id}`, { method: 'PUT', headers, body: JSON.stringify(profilePayload) })
        : Promise.resolve({ ok: true, json: () => Promise.resolve(profilePayload) }); // If no profile, resolve immediately

      // 3. Execute both calls in parallel
      const [userResponse, profileResponse] = await Promise.all([updateUserCall, updateProfileCall]);

      if (!userResponse.ok || !profileResponse.ok) {
        throw new Error('One or more updates failed. Please try again.');
      }

      const updatedUserData = await userResponse.json();
      const updatedProfileData = await profileResponse.json();
      
      // 4. Update the local state with the confirmed data from the server
      const combinedResult = { ...updatedUserData, ...updatedProfileData };
      setUserData(prev => ({ ...prev, ...combinedResult }));
      setProfileData(prev => ({ ...prev, ...combinedResult }));

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 4000);

    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };


  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageUrl = reader.result;
        setUserData(prev => ({...prev, profileImageUrl: newImageUrl}));
        setEditedData(prev => ({...prev, profileImageUrl: newImageUrl}));
        setSuccess('Profile image changed. Click "Save Changes" to make it permanent.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const InfoField = ({ label, value, field, icon: Icon }) => (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        {Icon && <Icon size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />}
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>{label}</Typography>
      </Box>
      {isEditing ? (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={editedData[field] || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { backgroundColor: alpha(theme.palette.action.selected, 0.5) }}}
        />
      ) : (
        <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>{value || '—'}</Typography>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  if (error && !userData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} icon={<CheckCircle size={20} />}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} icon={<XCircle size={20} />}>{error}</Alert>}

      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent sx={{ position: 'relative', p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 2, md: 3 } }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" hidden />
                  <IconButton onClick={triggerFileSelect} size="small" sx={{ backgroundColor: 'background.paper', border: `1px solid ${theme.palette.divider}`, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) } }}>
                    <Camera size={16} />
                  </IconButton>
                </>
              }
            >
              <Avatar src={userData.profileImageUrl} sx={{ width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 }, border: `4px solid ${theme.palette.background.paper}` }} />
            </Badge>

            <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{userData.name}</Typography>
                <Chip icon={userData.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />} label={userData.isActive ? "Active" : "Inactive"} size="small" color={userData.isActive ? "success" : "error"} variant="outlined" />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 2 }, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
                <Chip icon={<Shield size={16} />} label={userData.role.name} size="small" variant="outlined" color="primary" />
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}><Mail size={14} /> {userData.email}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}><Phone size={14} /> {userData.phone}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}><Calendar size={12} /> Joined: {formatDate(userData.createdAt)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
              {!isEditing ? (
                <Button fullWidth sx={{ width: { xs: '100%', md: 'auto' } }} variant="contained" startIcon={<Edit size={18} />} onClick={handleEdit}>Edit Profile</Button>
              ) : (
                <>
                  <Button fullWidth sx={{ width: { xs: '50%', md: 'auto' } }} variant="outlined" color="secondary" startIcon={<X size={18} />} onClick={handleCancel} disabled={saveLoading}>Cancel</Button>
                  <Button fullWidth sx={{ width: { xs: '50%', md: 'auto' } }} variant="contained" startIcon={saveLoading ? <CircularProgress color="inherit" size={18} /> : <Save size={18} />} onClick={handleSave} disabled={saveLoading}>Save Changes</Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}><Building2 size={22} style={{ color: theme.palette.text.secondary }} /> Business Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <InfoField label="Address" value={profileData?.address} field="address" icon={MapPin} />
            <InfoField label="City" value={profileData?.city} field="city" icon={Building2} />
            <InfoField label="State" value={profileData?.state} field="state" icon={MapPin} />
            <InfoField label="Pincode" value={profileData?.pincode} field="pincode" icon={MapPin} />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}><FileText size={22} style={{ color: theme.palette.text.secondary }} /> Tax Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <InfoField label="GST Number" value={profileData?.gstNumber} field="gstNumber" icon={FileText} />
            <InfoField label="PAN Number" value={profileData?.panNumber} field="panNumber" icon={CreditCard} />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}><Landmark size={22} style={{ color: theme.palette.text.secondary }} /> Banking Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={4}><InfoField label="Account Number" value={profileData?.accountNo} field="accountNo" icon={CreditCard} /></Grid>
              <Grid item xs={12} md={4}><InfoField label="Bank Name" value={profileData?.bankName} field="bankName" icon={Landmark} /></Grid>
              <Grid item xs={12} md={4}><InfoField label="IFSC Code" value={profileData?.ifscCode} field="ifscCode" icon={FileText} /></Grid>
            </Grid>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

