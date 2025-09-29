
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


// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import {
//     Box, Card, CardContent, Typography,
//     TextField, Button, Stack, CircularProgress, Grid, InputAdornment,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
//     Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar
// } from '@mui/material';
// import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import SearchIcon from '@mui/icons-material/Search';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// // --- API Simulation & Mock Data ---
// const mockCustomersData = [
//     { id: 'CUST-001', name: 'Lal Singh Chaddha', email: 'lal.singh@example.com', phone: '9876543210', address: '123 Film City, Mumbai' },
//     { id: 'CUST-002', name: 'ACME Corp', email: 'contact@acme.com', phone: '9123456780', address: '456 Industrial Area, Bangalore' },
//     { id: 'CUST-003', name: 'Global Tech', email: 'support@globaltech.net', phone: '9988776655', address: '789 IT Park, Pune' },
// ];

// // --- Main Component ---
// export default function Customers() {
//     // State for the customer list and loading
//     const [customers, setCustomers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');

//     // State for the dialogs and forms
//     const [addDialogOpen, setAddDialogOpen] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
//     const [editingCustomer, setEditingCustomer] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchCustomers = useCallback(async () => {
//         setIsLoading(true);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         setCustomers(mockCustomersData);
//         setIsLoading(false);
//     }, []);

//     useEffect(() => {
//         fetchCustomers();
//     }, [fetchCustomers]);

//     // --- Add Dialog Handlers ---
//     const handleOpenAddDialog = () => setAddDialogOpen(true);
//     const handleCloseAddDialog = () => {
//         setAddDialogOpen(false);
//         setForm({ name: '', email: '', phone: '', address: '' });
//     };
//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         console.log("Submitting New Customer:", form);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         mockCustomersData.unshift({ id: `CUST-00${mockCustomersData.length + 1}`, ...form });
//         setIsSubmitting(false);
//         handleCloseAddDialog();
//         fetchCustomers();
//     }, [form, fetchCustomers]);

//     // --- Edit Dialog Handlers ---
//     const handleOpenEditDialog = (customer) => {
//         setEditingCustomer(customer);
//         setEditDialogOpen(true);
//     };
//     const handleCloseEditDialog = () => {
//         setEditDialogOpen(false);
//         setEditingCustomer(null);
//     };
//     const handleEditChange = (e) => setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });
//     const handleEditSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         console.log("Updating Customer:", editingCustomer);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         // Find and update the customer in the mock data
//         const index = mockCustomersData.findIndex(c => c.id === editingCustomer.id);
//         if (index !== -1) {
//             mockCustomersData[index] = editingCustomer;
//         }
//         setIsSubmitting(false);
//         handleCloseEditDialog();
//         fetchCustomers();
//     }, [editingCustomer, fetchCustomers]);


//     const filteredCustomers = useMemo(() =>
//         customers.filter(c =>
//             c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             c.email.toLowerCase().includes(searchTerm.toLowerCase())
//         ),
//         [customers, searchTerm]
//     );

//     return (
//         <Box>
//             <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
//                 <CardContent>
//                     <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                             <PeopleAltIcon color="primary" />
//                             <Typography variant="h6" fontWeight="bold">Customers</Typography>
//                         </Stack>
//                         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
//                             <TextField
//                                 size="small"
//                                 placeholder="Search Customers..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
//                                 sx={{ width: { xs: '100%', sm: 300 } }}
//                             />
//                             <Button
//                                 variant="contained"
//                                 startIcon={<PersonAddAlt1Icon />}
//                                 onClick={handleOpenAddDialog}
//                                 sx={{ width: { xs: '100%', sm: 'auto' } }}
//                             >
//                                 Add Customer
//                             </Button>
//                         </Stack>
//                     </Stack>
//                 </CardContent>

//                 <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <Table stickyHeader size="small">
//                         <TableHead>
//                             <TableRow>{['Customer', 'Email', 'Phone', 'Address', 'Actions'].map(h => <TableCell key={h}>{h}</TableCell>)}</TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {isLoading ?
//                                 Array.from(new Array(5)).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>) :
//                                 filteredCustomers.map((customer) => (
//                                     <TableRow key={customer.id} hover>
//                                         <TableCell>
//                                             <Stack direction="row" spacing={2} alignItems="center">
//                                                 <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>{customer.name.charAt(0)}</Avatar>
//                                                 <Typography variant="body2" fontWeight="500">{customer.name}</Typography>
//                                             </Stack>
//                                         </TableCell>
//                                         <TableCell>{customer.email}</TableCell>
//                                         <TableCell>{customer.phone}</TableCell>
//                                         <TableCell>{customer.address}</TableCell>
//                                         <TableCell>
//                                             <IconButton size="small" onClick={() => handleOpenEditDialog(customer)}><EditIcon fontSize="small" /></IconButton>
//                                             <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             }
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Card>

//             {/* Add Customer Dialog */}
//             <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
//                 <DialogTitle>
//                     <Stack direction="row" spacing={1.5} alignItems="center">
//                         <PersonAddAlt1Icon color="primary" />
//                         <Typography variant="h6" fontWeight="bold">Add New Customer</Typography>
//                     </Stack>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box component="form" id="add-customer-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                         <Stack spacing={3}>
//                             <TextField required name="name" label="Customer Name" value={form.name} onChange={handleChange} />
//                             <TextField required name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} />
//                             <TextField required name="phone" label="Phone Number" type="tel" value={form.phone} onChange={handleChange} />
//                             <TextField required name="address" label="Address" multiline rows={3} value={form.address} onChange={handleChange} />
//                         </Stack>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions sx={{ p: '16px 24px' }}>
//                     <Button onClick={handleCloseAddDialog} disabled={isSubmitting}>Cancel</Button>
//                     <Button type="submit" form="add-customer-form" variant="contained" disabled={isSubmitting}>
//                         {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Customer'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Edit Customer Dialog */}
//             {editingCustomer && (
//                 <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
//                     <DialogTitle>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                             <EditIcon color="primary" />
//                             <Typography variant="h6" fontWeight="bold">Edit Customer</Typography>
//                         </Stack>
//                     </DialogTitle>
//                     <DialogContent>
//                         <Box component="form" id="edit-customer-form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
//                             <Stack spacing={3}>
//                                 <TextField required name="name" label="Customer Name" value={editingCustomer.name} onChange={handleEditChange} />
//                                 <TextField required name="email" label="Email Address" type="email" value={editingCustomer.email} onChange={handleEditChange} />
//                                 <TextField required name="phone" label="Phone Number" type="tel" value={editingCustomer.phone} onChange={handleEditChange} />
//                                 <TextField required name="address" label="Address" multiline rows={3} value={editingCustomer.address} onChange={handleEditChange} />
//                             </Stack>
//                         </Box>
//                     </DialogContent>
//                     <DialogActions sx={{ p: '16px 24px' }}>
//                         <Button onClick={handleCloseEditDialog} disabled={isSubmitting}>Cancel</Button>
//                         <Button type="submit" form="edit-customer-form" variant="contained" disabled={isSubmitting}>
//                             {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             )}
//         </Box>
//     );
// }


import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Stack, CircularProgress, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Use REACT_APP_BASE_URL from .env (e.g. REACT_APP_BASE_URL="http://localhost:8080/api")
const BASE_URL =  'http://localhost:8080/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // form fields use API field names to keep everything consistent
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
        const authkey = localStorage.getItem("authKey");
      const res = await fetch(`${BASE_URL}/customer`,
         {
                    headers: {
                        Authorization: `Bearer ${authkey}`,
                    },
                }
            

      );
      if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []); // ensure array
    } catch (err) {
      console.error('fetchCustomers error:', err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Add dialog handlers
  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setForm({ customerName: '', email: '', phone: '', address: '' });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Create customer (POST)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        
        const authKey = localStorage.getItem("authKey");
        if (!authKey) {
    console.error("Authentication token not found in localStorage!");
    // You should probably alert the user or redirect to login here.
    return;
  }
      const res = await fetch(`${BASE_URL}/customer/create-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${authKey}`,
             
        },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          email: form.email,
          address: form.address
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create failed: ${res.status} ${text}`);
      }

      const newCustomer = await res.json();
      // Optimistically update list with returned object
      setCustomers(prev => [newCustomer, ...prev]);
      handleCloseAddDialog();
    } catch (err) {
      console.error('Create customer error:', err);
      // You may want to show a toast/snackbar here
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  // Edit handlers
  const handleOpenEditDialog = (customer) => {
    // Ensure we pass a fresh copy
    setEditingCustomer({ ...customer });
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCustomer(null);
  };
  const handleEditChange = (e) => setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });

  // Update (PUT)
  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/customer/${editingCustomer.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: editingCustomer.customerId,
          customerName: editingCustomer.customerName,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          address: editingCustomer.address
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${text}`);
      }

      const updatedCustomer = await res.json();
      setCustomers(prev => prev.map(c => (c.customerId === updatedCustomer.customerId ? updatedCustomer : c)));
      handleCloseEditDialog();
    } catch (err) {
      console.error('Update customer error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingCustomer]);

  // Delete (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`${BASE_URL}/customer/${id}`, { method: 'DELETE' });
      if (res.status !== 204) {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} ${text}`);
      }
      setCustomers(prev => prev.filter(c => c.customerId !== id));
    } catch (err) {
      console.error('Delete customer error:', err);
    }
  };

  // Filtered list for search
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(c =>
      (c.customerName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

  return (
    <Box>
      <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PeopleAltIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Customers</Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <TextField
                size="small"
                placeholder="Search Customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                onClick={handleOpenAddDialog}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Add Customer
              </Button>
            </Stack>
          </Stack>
        </CardContent>

        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {['Customer', 'Email', 'Phone', 'Address', 'Actions'].map(h => <TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>
                ))
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.customerId} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                          {customer.customerName ? customer.customerName.charAt(0) : '?'}
                        </Avatar>
                        <Typography variant="body2" fontWeight="500">{customer.customerName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenEditDialog(customer)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(customer.customerId)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PersonAddAlt1Icon color="primary" />
            <Typography variant="h6" fontWeight="bold">Add New Customer</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="add-customer-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField required name="customerName" label="Customer Name" value={form.customerName} onChange={handleChange} />
              <TextField required name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} />
              <TextField required name="phone" label="Phone Number" type="tel" value={form.phone} onChange={handleChange} />
              <TextField required name="address" label="Address" multiline rows={3} value={form.address} onChange={handleChange} />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleCloseAddDialog} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="add-customer-form" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Dialog */}
      {editingCustomer && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EditIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Edit Customer</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box component="form" id="edit-customer-form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField required name="customerName" label="Customer Name" value={editingCustomer.customerName || ''} onChange={handleEditChange} />
                <TextField required name="email" label="Email Address" type="email" value={editingCustomer.email || ''} onChange={handleEditChange} />
                <TextField required name="phone" label="Phone Number" type="tel" value={editingCustomer.phone || ''} onChange={handleEditChange} />
                <TextField required name="address" label="Address" multiline rows={3} value={editingCustomer.address || ''} onChange={handleEditChange} />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseEditDialog} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" form="edit-customer-form" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
