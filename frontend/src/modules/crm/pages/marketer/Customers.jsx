import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  useTheme, // Import the useTheme hook
} from '@mui/material';
import PersonOutline from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';

// You can replace this with your actual client data source
const clientOptions = [
    { label: 'Lal Singh Chaddha' },
    { label: 'John Carter' },
    { label: 'Peter Parker' },
];

export default function NewSalesPage() {
  const theme = useTheme(); // Get the current theme
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  // Define styles that change based on the theme mode
  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    borderRadius: '12px',
    height: '100%',
  };
  
  const selectedListItemStyle = {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.contrastText,
      },
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
  };

  return (
    <Box p={3} sx={{ backgroundColor: theme.palette.background.default, minHeight: 'calc(100vh - 64px)' /* Adjust height based on your header */ }}>
      <Grid container spacing={4}>
        {/* Left Column: Credentials Stepper */}
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Credentials
              </Typography>
              <List component="nav">
                <ListItemButton 
                  selected={activeStep === 0} 
                  onClick={() => handleStepClick(0)}
                  sx={activeStep === 0 ? selectedListItemStyle : {}}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <PersonOutline />
                  </ListItemIcon>
                  <ListItemText primary="Personal Information" />
                </ListItemButton>
                <ListItemButton 
                  selected={activeStep === 1} 
                  onClick={() => handleStepClick(1)}
                  sx={activeStep === 1 ? selectedListItemStyle : {}}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <ShoppingBagOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Product" />
                </ListItemButton>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Client Information Form */}
        <Grid item xs={12} md={9}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Client Information
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Enter the details for the new sales record.
              </Typography>

              <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12}>
                    <Autocomplete
                      fullWidth
                      options={clientOptions}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Client Name"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mobile no."
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <PhoneOutlined sx={{ color: 'text.secondary', mr: 1.5 }} />
                        ),
                      }}
                    />
                  </Grid>
                   <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      variant="outlined"
                       defaultValue="New York, NY"
                      InputProps={{
                        startAdornment: (
                          <LocationOnOutlined sx={{ color: 'text.secondary', mr: 1.5 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      defaultValue="davidclark@gmail.com"
                      InputProps={{
                        startAdornment: (
                          <EmailOutlined sx={{ color: 'text.secondary', mr: 1.5 }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ px: 8, py: 1.5, color: theme.palette.primary.contrastText }}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}