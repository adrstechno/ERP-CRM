import React, { useState, useCallback, useEffect } from 'react';
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
  // State
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const authKey = localStorage.getItem('authKey');
      const res = await fetch(`${VITE_API_BASE_URL}/customer`, {
        headers: { Authorization: `Bearer ${authKey}` },
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchCustomers error:', err);
      setCustomers([]);
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Search by name (debounced)
  const getCustomerByName = async (name) => {
    setIsSearching(true);
    try {
      const authKey = localStorage.getItem('authKey');
      const encoded = encodeURIComponent(name.trim());
      const res = await fetch(`${VITE_API_BASE_URL}/customer/name/${encoded}`, {
        headers: { Authorization: `Bearer ${authKey}` },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setCustomers([]);
          return;
        }
        throw new Error(`Search failed: ${res.status}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data ? [data] : [];
      setCustomers(list);
    } catch (err) {
      console.error('getCustomerByName error:', err);
      setCustomers([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();
      if (trimmed.length >= 2) {
        getCustomerByName(trimmed);
      } else if (trimmed.length === 0) {
        fetchCustomers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchCustomers]);

  // Check email exists (matches your POST /check-email/{email} → returns true if available)
  const checkEmailExists = async (email) => {
    if (!email || email.trim() === '') return false;

    setEmailChecking(true);
    try {
      const authKey = localStorage.getItem('authKey');
      const encoded = encodeURIComponent(email.trim());
      const res = await fetch(`${VITE_API_BASE_URL}/customer/check-email/${encoded}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authKey}` },
      });

      if (!res.ok) throw new Error('Email check failed');
      const isAvailable = await res.json(); // true = available, false = taken
      return !isAvailable; // return true if TAKEN
    } catch (err) {
      console.error('checkEmailExists error:', err);
      toast.error('Could not verify email');
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  // Add Customer
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check email
    const emailTaken = await checkEmailExists(form.email);
    if (emailTaken) {
      toast.error('A customer with this email already exists');
      setIsSubmitting(false);
      return;
    }

    // Create
    try {
      const authKey = localStorage.getItem('authKey');
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

      setCustomers((prev) => [newCustomer, ...prev]);
      handleCloseAddDialog();
      toast.success('Customer added successfully');
    } catch (err) {
      console.error('Create customer error:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setForm({ customerName: '', email: '', phone: '', address: '' });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Edit Customer
  const handleOpenEditDialog = (customer) => {
    setEditingCustomer({ ...customer });
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCustomer(null);
  };
  const handleEditChange = (e) => setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSubmitting(true);
    try {
      const authKey = localStorage.getItem('authKey');
      const res = await fetch(`${VITE_API_BASE_URL}/customer/${editingCustomer.customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authKey}`,
        },
        body: JSON.stringify(editingCustomer),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();

      setCustomers((prev) =>
        prev.map((c) => (c.customerId === updated.customerId ? updated : c))
      );
      handleCloseEditDialog();
      toast.success('Customer updated');
    } catch (err) {
      console.error('Update customer error:', err);
      toast.error('Update failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingCustomer]);

  const filteredCustomers = customers;

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
                placeholder="Search by name (min 2 chars)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                    </InputAdornment>
                  ),
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
                {['Customer', 'Email', 'Phone', 'Address', 'Actions'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoading || isSearching) ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm.trim()
                        ? searchTerm.trim().length < 2
                          ? 'Type at least 2 characters to search'
                          : `No customers found for "${searchTerm}"`
                        : 'No customers yet. Click "Add Customer".'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((c) => (
                  <TableRow key={c.customerId} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                          {c.customerName?.charAt(0) ?? '?'}
                        </Avatar>
                        <Typography variant="body2" fontWeight="500">
                          {c.customerName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell>{c.phone || '-'}</TableCell>
                    <TableCell>{c.address || '-'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenEditDialog(c)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Dialog */}
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
              />
              <TextField
                required
                name="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  endAdornment: emailChecking ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <TextField
                required
                name="phone"
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
              <TextField
                required
                name="address"
                label="Address"
                multiline
                rows={3}
                value={form.address}
                onChange={handleChange}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleCloseAddDialog} disabled={isSubmitting || emailChecking}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-customer-form"
            variant="contained"
            disabled={isSubmitting || emailChecking}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
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
                />
                <TextField
                  required
                  name="email"
                  label="Email Address"
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={handleEditChange}
                />
                <TextField
                  required
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  value={editingCustomer.phone || ''}
                  onChange={handleEditChange}
                />
                <TextField
                  required
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={editingCustomer.address || ''}
                  onChange={handleEditChange}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseEditDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-customer-form"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}