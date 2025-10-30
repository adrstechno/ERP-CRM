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
import { VITE_API_BASE_URL } from '../../utils/State';
import toast from 'react-hot-toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const authKey = localStorage.getItem("authKey");
      const res = await fetch(`${VITE_API_BASE_URL}/customer`, {
        headers: { Authorization: `Bearer ${authKey}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
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

  // 🔹 Get Customer By Name
  const getCustomerByName = async (name) => {
    try {
      const authKey = localStorage.getItem("authKey");
      const res = await fetch(`${VITE_API_BASE_URL}/customer/name/${name}`, {
        headers: { Authorization: `Bearer ${authKey}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch customer by name: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("getCustomerByName error:", err);
    }
  };

  // 🔹 Handle Search (by name)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        getCustomerByName(searchTerm.trim());
      } else {
        fetchCustomers();
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchCustomers]);

  // 🔹 Validation helper
  const validateForm = (data, isEdit = false) => {
    const newErrors = {};
    if (!data.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!data.address.trim()) newErrors.address = "Address is required";

    if (isEdit) setEditErrors(newErrors);
    else setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Add Customer
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    setIsSubmitting(true);
    try {
      const authKey = localStorage.getItem("authKey");
      const res = await fetch(`${VITE_API_BASE_URL}/customer/create-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authKey}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const newCustomer = await res.json();
      setCustomers(prev => [newCustomer, ...prev]);
      handleCloseAddDialog();
      toast.success("Customer added successfully!");
    } catch (err) {
      console.error('Create customer error:', err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setForm({ customerName: '', email: '', phone: '', address: '' });
    setErrors({});
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Edit Customer
  const handleOpenEditDialog = (customer) => {
    setEditingCustomer({ ...customer });
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCustomer(null);
    setEditErrors({});
  };
  const handleEditChange = (e) => setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!validateForm(editingCustomer, true)) return;
    setIsSubmitting(true);
    try {
      const authKey = localStorage.getItem("authKey");
      const res = await fetch(`${VITE_API_BASE_URL}/customer/${editingCustomer.customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authKey}`,
        },
        body: JSON.stringify(editingCustomer),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updatedCustomer = await res.json();
      setCustomers(prev => prev.map(c =>
        c.customerId === updatedCustomer.customerId ? updatedCustomer : c
      ));
      handleCloseEditDialog();
      toast.success("Customer updated successfully!");
    } catch (err) {
      console.error('Update customer error:', err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [editingCustomer]);

  // 🔹 Filtered List
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
                placeholder="Search Customers by Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                onClick={handleOpenAddDialog}
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
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box component="form" id="add-customer-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                required
                name="customerName"
                label="Customer Name"
                value={form.customerName}
                onChange={handleChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
              <TextField
                required
                name="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                required
                name="phone"
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                required
                name="address"
                label="Address"
                multiline
                rows={3}
                value={form.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
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
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogContent>
            <Box component="form" id="edit-customer-form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  required
                  name="customerName"
                  label="Customer Name"
                  value={editingCustomer.customerName || ''}
                  onChange={handleEditChange}
                  error={!!editErrors.customerName}
                  helperText={editErrors.customerName}
                />
                <TextField
                  required
                  name="email"
                  label="Email Address"
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={handleEditChange}
                  error={!!editErrors.email}
                  helperText={editErrors.email}
                />
                <TextField
                  required
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  value={editingCustomer.phone || ''}
                  onChange={handleEditChange}
                  error={!!editErrors.phone}
                  helperText={editErrors.phone}
                />
                <TextField
                  required
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={editingCustomer.address || ''}
                  onChange={handleEditChange}
                  error={!!editErrors.address}
                  helperText={editErrors.address}
                />
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
