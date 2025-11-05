import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { VITE_API_BASE_URL } from "../../utils/State";

const DetailItem = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 500, textTransform: "uppercase" }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

export default function DealerManagement() {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [approveDialog, setApproveDialog] = useState({
    open: false,
    requestId: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const validateSearch = (value) => {
    const regex = /^[a-zA-Z0-9\s@._-]*$/;
    if (!regex.test(value)) {
      setSearchError(
        "Only letters, numbers, spaces, and basic symbols are allowed"
      );
      return false;
    }
    setSearchError("");
    return true;
  };

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const authKey = localStorage.getItem("authKey");
        if (!authKey) throw new Error("No auth key found");

        const { data } = await axios.get(`${VITE_API_BASE_URL}/admin/dealers`, {
          headers: { Authorization: `Bearer ${authKey}` },
        });

        if (Array.isArray(data)) setDealers(data);
        else setDealers([]);
      } catch (error) {
        console.error("Error fetching dealers:", error);
        setDealers([]);
      } finally {
        setLoadingDealers(false);
      }
    };

    fetchDealers();
  }, []);

  const handleDealerSelect = async (dealer) => {
    setSelectedDealer(null);
    setRequests([]);
    setLoadingRequests(true);

    try {
      const authKey = localStorage.getItem("authKey");
      if (!authKey) throw new Error("No auth key found");

      const profileRes = await axios.get(
        `${VITE_API_BASE_URL}/profiles/${dealer.userId}`,
        { headers: { Authorization: `Bearer ${authKey}` } }
      );
      const profileData = profileRes.data || {};

      const requestRes = await axios.get(
        `${VITE_API_BASE_URL}/stock-requests/user/${dealer.userId}`,
        { headers: { Authorization: `Bearer ${authKey}` } }
      );

      const reqData = Array.isArray(requestRes.data)
        ? requestRes.data.map((req) => ({
            id: req.requestId,
            reqNo: `REQ-${String(req.requestId).padStart(4, "0")}`,
            product: req.productName,
            qty: req.quantity,
            status:
              req.status === "PENDING"
                ? "Pending"
                : req.status === "APPROVED"
                ? "Approved"
                : req.status,
            date: new Date(req.requestDate).toLocaleDateString(),
            notes: req.notes || "—",
          }))
        : [];

      setSelectedDealer({ ...dealer, profile: profileData });
      setRequests(reqData);
    } catch (error) {
      console.error("Error fetching dealer data:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApproveClick = (requestId) => {
    setApproveDialog({ open: true, requestId });
  };

  const handleApproveConfirm = async () => {
    const { requestId } = approveDialog;
    try {
      const authKey = localStorage.getItem("authKey");
      if (!authKey) throw new Error("No auth key found");

      await axios.patch(
        `${VITE_API_BASE_URL}/stock-requests/update-status/${requestId}?status=APPROVED`,
        {},
        { headers: { Authorization: `Bearer ${authKey}` } }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "Approved" } : r
        )
      );

      setSuccessMessage("Request approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setApproveDialog({ open: false, requestId: null });
    }
  };

  const filteredDealers = useMemo(() => {
    return dealers.filter((d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dealers, searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (validateSearch(value)) {
      setSearchTerm(value);
    }
  };

  return (
<Box sx={{ p: 3 }}>
  <Grid
    container
    spacing={3}
    sx={{
      height: { xs: "auto", md: "calc(100vh - 120px)" },
      flexWrap: { xs: "wrap", md: "nowrap" },
    }}
  >
    {/* LEFT: Dealer List */}
    <Grid
      item
      xs={12}
      md={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "auto", md: "100%" },
      }}
    >
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Dealer List
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search Dealers..."
            value={searchTerm}
            onChange={handleSearchChange}
            error={!!searchError}
            helperText={searchError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>

        {/* Scrollable Dealer List */}
        <CardContent
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 0,
          }}
        >
          <List sx={{ p: 2, pt: 0 }}>
            {loadingDealers ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                Loading dealers...
              </Typography>
            ) : filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => (
                <ListItem key={dealer.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    selected={selectedDealer?.id === dealer.id}
                    onClick={() => handleDealerSelect(dealer)}
                  >
                    <ListItemAvatar>
                      <Avatar alt={dealer.name} src={dealer.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {dealer.name}
                          </Typography>
                          {!dealer.isActive && (
                            <Chip
                              label="Deactivated"
                              color="error"
                              size="small"
                            />
                          )}
                        </Box>
                      }
                      secondary={dealer.email}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 2 }}>
                No dealers found
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>

    {/* RIGHT: Dealer Info + Requests */}
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "auto", md: "100%" },
      }}
    >
      <Card
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          height: { xs: "auto", md: "100%" },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <BusinessIcon color="primary" sx={{ mr: 1 }} />
          Dealer Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {selectedDealer ? (
          <>
            {!selectedDealer.isActive && (
              <Alert severity="error" sx={{ mb: 3 }}>
                This dealer account is <strong>Deactivated</strong>.
              </Alert>
            )}

            {/* Dynamic Info Table */}
            <TableContainer sx={{ mb: 4 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <DetailItem label="Name" value={selectedDealer.name} />
                    </TableCell>
                    <TableCell>
                      <DetailItem
                        label="Mobile No"
                        value={selectedDealer.phone}
                      />
                    </TableCell>
                    <TableCell>
                      <DetailItem
                        label="E-Mail"
                        value={selectedDealer.email}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <DetailItem
                        label="Address"
                        value={selectedDealer.profile?.address}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <DetailItem
                        label="City"
                        value={selectedDealer.profile?.city}
                      />
                    </TableCell>
                    <TableCell>
                      <DetailItem
                        label="State"
                        value={selectedDealer.profile?.state}
                      />
                    </TableCell>
                    <TableCell>
                      <DetailItem
                        label="Pincode"
                        value={selectedDealer.profile?.pincode}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Requests */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Request Approval Table
            </Typography>
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {["Request No.", "Product", "QTY", "Action"].map((head) => (
                      <TableCell key={head}>{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingRequests ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Loading requests...
                      </TableCell>
                    </TableRow>
                  ) : requests.length > 0 ? (
                    requests.map((req) => (
                      <TableRow key={req.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {req.reqNo}
                        </TableCell>
                        <TableCell>{req.product}</TableCell>
                        <TableCell>{req.qty}</TableCell>
                        <TableCell>
                          {req.status === "Pending" ? (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleApproveClick(req.id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Chip
                              icon={
                                <CheckCircleOutlineIcon fontSize="small" />
                              }
                              label="Approved"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography variant="body2">Select a dealer to view details</Typography>
        )}
      </Card>
    </Grid>
  </Grid>
</Box>

  );
}
