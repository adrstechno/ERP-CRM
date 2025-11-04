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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { VITE_API_BASE_URL } from '../utils/State';

const Profile = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [showCreateProfileDialog, setShowCreateProfileDialog] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('/bussiness-man.png');
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      isActive: false,
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      accountNo: '',
      bankName: '',
      ifscCode: '',
    },
  });

  // Validation rules
  const validationRules = {
    name: {
      required: 'Name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters long'
      },
      maxLength: {
        value: 50,
        message: 'Name cannot exceed 50 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Name can only contain letters and spaces'
      }
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Please enter a valid 10-digit Indian mobile number'
      }
    },
    address: {
      maxLength: {
        value: 200,
        message: 'Address cannot exceed 200 characters'
      }
    },
    city: {
      maxLength: {
        value: 50,
        message: 'City name cannot exceed 50 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s]*$/,
        message: 'City can only contain letters and spaces'
      }
    },
    state: {
      maxLength: {
        value: 50,
        message: 'State name cannot exceed 50 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s]*$/,
        message: 'State can only contain letters and spaces'
      }
    },
    pincode: {
      pattern: {
        value: /^[1-9][0-9]{5}$/,
        message: 'Please enter a valid 6-digit pincode'
      }
    },
    gstNumber: {
      pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)'
      }
    },
    panNumber: {
      pattern: {
        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: 'Please enter a valid PAN number (e.g., ABCDE1234F)'
      }
    },
    accountNo: {
      pattern: {
        value: /^[0-9]{9,18}$/,
        message: 'Account number must be 9-18 digits'
      }
    },
    bankName: {
      maxLength: {
        value: 100,
        message: 'Bank name cannot exceed 100 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s&.-]*$/,
        message: 'Bank name can only contain letters, spaces, &, ., and -'
      }
    },
    ifscCode: {
      pattern: {
        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        message: 'Please enter a valid IFSC code (e.g., SBIN0001234)'
      }
    }
  };

  // Fetch profile data on mount
  useEffect(() => {
    const token = localStorage.getItem('authKey');
    if (token) {
      fetchProfileData();
    } else {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
    }
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authKey');
      if (!token) throw new Error('No auth token found');

      const headers = { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      };

      // Fetch user data
      const userRes = await fetch(`${VITE_API_BASE_URL}/user/me`, { headers });
      if (!userRes.ok) throw new Error('Failed to fetch user data');
      const user = await userRes.json();
      setUserData(user);

      // Try to fetch profile data
      try {
        const profileRes = await fetch(`${VITE_API_BASE_URL}/profiles/me`, { headers });
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setProfileData(profile);
          setProfileExists(true);
          
          // Combine user and profile data
          const combinedData = {
            ...user,
            ...profile,
            role: typeof user.role === 'object' ? user.role.name : user.role,
          };
          reset(combinedData);
          setProfileImageUrl(combinedData.profileImageUrl || '/bussiness-man.png');
        } else if (profileRes.status === 404 || profileRes.status === 500) {
          // Profile doesn't exist (404) or runtime exception (500 - "Profile not found")
          setProfileExists(false);
          setProfileData(null);
          // Reset form with user data only
          reset({
            ...user,
            role: typeof user.role === 'object' ? user.role.name : user.role,
            address: '',
            city: '',
            state: '',
            pincode: '',
            gstNumber: '',
            panNumber: '',
            accountNo: '',
            bankName: '',
            ifscCode: '',
          });
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (profileErr) {
        // Profile doesn't exist, only user data available
        console.log('Profile not found, will create new profile',profileErr);
        setProfileExists(false);
        setProfileData(null);
        reset({
          ...user,
          role: typeof user.role === 'object' ? user.role.name : user.role,
          address: '',
          city: '',
          state: '',
          pincode: '',
          gstNumber: '',
          panNumber: '',
          accountNo: '',
          bankName: '',
          ifscCode: '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!profileExists) {
      setShowCreateProfileDialog(true);
    } else {
      setIsEditing(true);
      setError(null);
      setSuccess(null);
    }
  };

  const handleCreateProfile = () => {
    setShowCreateProfileDialog(false);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCreateProfileDialog(false);
    
    if (userData) {
      const resetData = {
        ...userData,
        role: typeof userData.role === 'object' ? userData.role.name : userData.role,
      };
      
      if (profileData) {
        Object.assign(resetData, profileData);
      } else {
        // Reset profile fields to empty if no profile exists
        Object.assign(resetData, {
          address: '',
          city: '',
          state: '',
          pincode: '',
          gstNumber: '',
          panNumber: '',
          accountNo: '',
          bankName: '',
          ifscCode: '',
        });
      }
      
      reset(resetData);
      setProfileImageUrl(userData.profileImageUrl || '/bussiness-man.png');
    }
    setError(null);
  };

  const onSubmit = async (data) => {
    setSaveLoading(true);
    setError(null);
    
    try {
      // Additional client-side validation
      const validationErrors = [];
      
      // Check if GST and PAN are both provided or both empty
      if ((data.gstNumber && !data.panNumber) || (!data.gstNumber && data.panNumber)) {
        validationErrors.push('Both GST Number and PAN Number should be provided together or left empty');
      }
      
      // Check if banking details are complete if any banking field is filled
      const bankingFields = [data.accountNo, data.bankName, data.ifscCode];
      const filledBankingFields = bankingFields.filter(field => field && field.trim());
      if (filledBankingFields.length > 0 && filledBankingFields.length < 3) {
        validationErrors.push('All banking details (Account Number, Bank Name, IFSC Code) must be provided together');
      }
      
      if (validationErrors.length > 0) {
        setError(validationErrors.join('. '));
        setSaveLoading(false);
        return;
      }

      const token = localStorage.getItem('authKey');
      const headers = { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      };

      // Prepare user payload - trim whitespace
      const userPayload = {
        name: data.name?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        isActive: data.isActive,
      };

      // Prepare profile payload - trim whitespace and convert to uppercase where needed
      const profilePayload = {
        userId: userData.userId,
        address: data.address?.trim() || '',
        city: data.city?.trim() || '',
        state: data.state?.trim() || '',
        pincode: data.pincode?.trim() || '',
        gstNumber: data.gstNumber?.trim().toUpperCase() || '',
        panNumber: data.panNumber?.trim().toUpperCase() || '',
        accountNo: data.accountNo?.trim() || '',
        bankName: data.bankName?.trim() || '',
        ifscCode: data.ifscCode?.trim().toUpperCase() || '',
      };

      // Update user data
      const userResponse = await fetch(`${VITE_API_BASE_URL}/user/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userPayload),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update user data');
      }

      const updatedUser = await userResponse.json();

      // Create or update profile
      let profileResponse;
      if (profileExists) {
        // Update existing profile
        profileResponse = await fetch(`${VITE_API_BASE_URL}/profiles/me`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(profilePayload),
        });
      } else {
        // Create new profile
        profileResponse = await fetch(`${VITE_API_BASE_URL}/profiles/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify(profilePayload),
        });
      }

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${profileExists ? 'update' : 'create'} profile`);
      }

      const updatedProfile = await profileResponse.json();

      // Update state
      setUserData(updatedUser);
      setProfileData(updatedProfile);
      setProfileExists(true);
      
      const combinedData = {
        ...updatedUser,
        ...updatedProfile,
        role: typeof updatedUser.role === 'object' ? updatedUser.role.name : updatedUser.role,
      };
      
      reset(combinedData);
      setIsEditing(false);
      setSuccess(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
        setSuccess('Profile image changed. Click "Save Changes" to make it permanent.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : '—';

  const InfoField = React.memo(({ label, field, icon: Icon, isEditing, register, errors, validationRules, placeholder, transform }) => {
    const theme = useTheme();
    
    const handleTransform = (e) => {
      if (transform === 'uppercase') {
        e.target.value = e.target.value.toUpperCase();
      } else if (transform === 'numbers') {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      } else if (transform === 'alphanumeric') {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
      }
    };

    return (
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {Icon && <Icon size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />}
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
        {isEditing ? (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={placeholder}
            {...register(field, validationRules)}
            error={!!errors[field]}
            helperText={errors[field]?.message}
            onInput={transform ? handleTransform : undefined}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                backgroundColor: alpha(theme.palette.action.selected, 0.5) 
              } 
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
            {(userData?.[field] || profileData?.[field]) || '—'}
          </Typography>
        )}
      </Box>
    );
  });

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
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} icon={<CheckCircle size={20} />}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} icon={<XCircle size={20} />}>
          {error}
        </Alert>
      )}

      {/* Create Profile Dialog */}
      <Dialog open={showCreateProfileDialog} onClose={handleCancel}>
        <DialogTitle>Create Profile</DialogTitle>
        <DialogContent>
          <Typography>
            You haven't created a profile yet. Would you like to create one now?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateProfile} variant="contained" startIcon={<Plus size={18} />}>
            Create Profile
          </Button>
        </DialogActions>
      </Dialog>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3, overflow: 'visible' }}>
          <CardContent sx={{ position: 'relative', p: { xs: 2, md: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: 'center', 
              gap: { xs: 2, md: 3 } 
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isEditing ? (
                    <IconButton
                      onClick={triggerFileSelect}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      <Camera size={20} />
                    </IconButton>
                  ) : null
                }
              >
                <Avatar
                  src={profileImageUrl}
                  sx={{ 
                    width: { xs: 100, md: 140 }, 
                    height: { xs: 100, md: 140 }, 
                    border: `4px solid ${theme.palette.background.paper}` 
                  }}
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  hidden 
                />
              </Badge>

              <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  justifyContent: { xs: 'center', md: 'flex-start' }, 
                  mb: 1 
                }}>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Enter your full name"
                      {...register('name', validationRules.name)}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ maxWidth: 300 }}
                    />
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {userData?.name || '—'}
                    </Typography>
                  )}
                  <Chip
                    icon={userData?.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    label={userData?.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={userData?.isActive ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: { xs: 1, md: 2 }, 
                  justifyContent: { xs: 'center', md: 'flex-start' }, 
                  mb: 2 
                }}>
                  <Chip
                    icon={<Shield size={16} />}
                    label={typeof userData?.role === 'object' ? userData?.role?.name || '—' : userData?.role || '—'}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                {isEditing ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    {...register('email')}
                    value={userData?.email || ''}
                    disabled
                    sx={{ maxWidth: 300 }}
                    InputProps={{
                      style: { backgroundColor: '#f5f5f5', cursor: 'not-allowed' },
                    }}
                  />
                     ): (
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5 
                    }}>
                      <Mail size={14} /> {userData?.email || '—'}
                    </Typography>
                  )}
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Enter 10-digit mobile number"
                      {...register('phone', validationRules.phone)}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{ maxWidth: 200 }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5 
                    }}>
                      <Phone size={14} /> {userData?.phone || '—'}
                    </Typography>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={{ 
                    color: 'text.secondary', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    justifyContent: { xs: 'center', md: 'flex-start' } 
                  }}
                >
                  <Calendar size={12} /> Joined: {formatDate(userData?.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
                {!isEditing ? (
                  <Button
                    fullWidth
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                    variant="contained"
                    startIcon={profileExists ? <Edit size={18} /> : <Plus size={18} />}
                    onClick={handleEdit}
                  >
                    {profileExists ? 'Edit Profile' : 'Create Profile'}
                  </Button>
                ) : (
                  <>
                    <Button
                      fullWidth
                      sx={{ width: { xs: '50%', md: 'auto' } }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<X size={18} />}imageUrl
                      onClick={handleCancel}
                      disabled={saveLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      sx={{ width: { xs: '50%', md: 'auto' } }}
                      variant="contained"
                      type="submit"
                      startIcon={saveLoading ? <CircularProgress color="inherit" size={18} /> : <Save size={18} />}
                      disabled={saveLoading}
                    >
                      {profileExists ? 'Save Changes' : 'Create Profile'}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5 
                }}>
                  <Building2 size={22} style={{ color: theme.palette.text.secondary }} /> 
                  Business Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <InfoField 
                  label="Address" 
                  field="address" 
                  icon={MapPin} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.address}
                  placeholder="Enter your complete address"
                />
                <InfoField 
                  label="City" 
                  field="city" 
                  icon={Building2} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.city}
                  placeholder="Enter city name"
                />
                <InfoField 
                  label="State" 
                  field="state" 
                  icon={MapPin} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.state}
                  placeholder="Enter state name"
                />
                <InfoField 
                  label="Pincode" 
                  field="pincode" 
                  icon={MapPin} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.pincode}
                  placeholder="Enter 6-digit pincode"
                  transform="numbers"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Tax Info */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5 
                }}>
                  <FileText size={22} style={{ color: theme.palette.text.secondary }} /> 
                  Tax Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <InfoField 
                  label="GST Number" 
                  field="gstNumber" 
                  icon={FileText} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.gstNumber}
                  placeholder="e.g., 22AAAAA0000A1Z5"
                  transform="alphanumeric"
                />
                <InfoField 
                  label="PAN Number" 
                  field="panNumber" 
                  icon={CreditCard} 
                  isEditing={isEditing} 
                  register={register} 
                  errors={errors} 
                  validationRules={validationRules.panNumber}
                  placeholder="e.g., ABCDE1234F"
                  transform="alphanumeric"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Banking Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5 
                }}>
                  <Landmark size={22} style={{ color: theme.palette.text.secondary }} /> 
                  Banking Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12} md={4}>
                    <InfoField 
                      label="Account Number" 
                      field="accountNo" 
                      icon={CreditCard} 
                      isEditing={isEditing} 
                      register={register} 
                      errors={errors} 
                      validationRules={validationRules.accountNo}
                      placeholder="Enter 9-18 digit account number"
                      transform="numbers"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoField 
                      label="Bank Name" 
                      field="bankName" 
                      icon={Landmark} 
                      isEditing={isEditing} 
                      register={register} 
                      errors={errors} 
                      validationRules={validationRules.bankName}
                      placeholder="Enter bank name"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoField 
                      label="IFSC Code" 
                      field="ifscCode" 
                      icon={FileText} 
                      isEditing={isEditing} 
                      register={register} 
                      errors={errors} 
                      validationRules={validationRules.ifscCode}
                      placeholder="e.g., SBIN0001234"
                      transform="alphanumeric"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Profile;
