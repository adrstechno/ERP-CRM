
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
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { VITE_API_BASE_URL } from "../../utils/State"; // adjust your import

// 🔹 Small reusable display component
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
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // 🔹 Fetch all dealers
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

  // 🔹 Handle Dealer Selection (Profile + Requests)
  const handleDealerSelect = async (dealer) => {
    setSelectedDealer(null);
    setRequests([]);
    setLoadingRequests(true);

    try {
      const authKey = localStorage.getItem("authKey");
      if (!authKey) throw new Error("No auth key found");

      // --- Fetch Dealer Profile ---
      const profileRes = await axios.get(
        `${VITE_API_BASE_URL}/profiles/${dealer.userId}`,
        { headers: { Authorization: `Bearer ${authKey}` } }
      );

      const profileData = profileRes.data || {};

      // --- Fetch Requests for that Dealer ---
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

  // 🔹 Approve Request
  const handleApprove = async (requestId) => {
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
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // 🔹 Filter Dealers
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dealers, searchTerm]);

  // return (
  //   <Box sx={{ p: 3 }}>
  //     <Grid container spacing={3}>
  //       {/* LEFT: Dealer List */}
  //       <Grid item xs={12} md={3}>
  //         <Card
  //           sx={{
  //             height: "calc(100vh - 120px)",
  //             display: "flex",
  //             flexDirection: "column",
  //           }}
  //         >
  //           <CardContent>
  //             <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
  //               Dealer List
  //             </Typography>
  //             <TextField
  //               fullWidth
  //               variant="outlined"
  //               size="small"
  //               placeholder="Search Dealers..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">
  //                     <SearchIcon />
  //                   </InputAdornment>
  //                 ),
  //               }}
  //             />
  //           </CardContent>
  //           <CardContent sx={{ flexGrow: 1, p: 0 }}>
  //             <List sx={{ height: "100%", overflowY: "auto", p: 2 }}>
  //               {loadingDealers ? (
  //                 <Typography sx={{ p: 2 }}>Loading dealers...</Typography>
  //               ) : filteredDealers.length > 0 ? (
  //                 filteredDealers.map((dealer) => (
  //                   <ListItem key={dealer.id} disablePadding sx={{ mb: 1 }}>
  //                     <ListItemButton
  //                       selected={selectedDealer?.id === dealer.id}
  //                       onClick={() => handleDealerSelect(dealer)}
  //                     >
  //                       <ListItemAvatar>
  //                         <Avatar alt={dealer.name} src={dealer.avatar} />
  //                       </ListItemAvatar>
  //                       <ListItemText
  //                         primary={
  //                           <Typography
  //                             variant="subtitle2"
  //                             sx={{ fontWeight: "bold" }}
  //                           >
  //                             {dealer.name}
  //                           </Typography>
  //                         }
  //                         secondary={dealer.email}
  //                       />
  //                     </ListItemButton>
  //                   </ListItem>
  //                 ))
  //               ) : (
  //                 <Typography sx={{ p: 2 }}>No dealers found</Typography>
  //               )}
  //             </List>
  //           </CardContent>
  //         </Card>
  //       </Grid>

  //       {/* RIGHT: Dealer Info & Requests */}
  //       <Grid item xs={12} md={9}>
  //         <Stack spacing={3}>
  //           {/* Dealer Info */}
  //           <Card>
  //             <CardContent>
  //               <Stack direction="row" spacing={2} alignItems="center" mb={2}>
  //                 <BusinessIcon color="primary" />
  //                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
  //                   Dealer Information
  //                 </Typography>
  //               </Stack>
  //               <Divider sx={{ mb: 3 }} />
  //               {selectedDealer ? (
  //                 <TableContainer sx={{ maxHeight: 180 }}>
  //                   <Table size="small">
  //                     <TableBody>
  //                       <TableRow>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Name"
  //                             value={selectedDealer.name}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Mobile"
  //                             value={selectedDealer.phone}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Email"
  //                             value={selectedDealer.email}
  //                           />
  //                         </TableCell>
  //                       </TableRow>
  //                       <TableRow>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Address"
  //                             value={selectedDealer.profile?.address}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="City"
  //                             value={selectedDealer.profile?.city}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="State"
  //                             value={selectedDealer.profile?.state}
  //                           />
  //                         </TableCell>
  //                       </TableRow>
  //                       <TableRow>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Pincode"
  //                             value={selectedDealer.profile?.pincode}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="GST No"
  //                             value={selectedDealer.profile?.gstNumber}
  //                           />
  //                         </TableCell>
  //                         <TableCell>
  //                           <DetailItem
  //                             label="Account No"
  //                             value={selectedDealer.profile?.accountNo}
  //                           />
  //                         </TableCell>
  //                       </TableRow>
  //                     </TableBody>
  //                   </Table>
  //                 </TableContainer>
  //               ) : (
  //                 <Typography>Select a dealer to view details</Typography>
  //               )}
  //             </CardContent>
  //           </Card>

  //           {/* Requests Table */}
  //           <Card>
  //             <CardContent>
  //               <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
  //                 Request Approval Table
  //               </Typography>
  //               <TableContainer sx={{ maxHeight: "calc(100vh - 540px)" }}>
  //                 <Table stickyHeader size="small">
  //                   <TableHead>
  //                     <TableRow>
  //                       <TableCell>Request No.</TableCell>
  //                       <TableCell>Product</TableCell>
  //                       <TableCell>QTY</TableCell>
  //                       <TableCell>Status / Action</TableCell>
  //                     </TableRow>
  //                   </TableHead>
  //                   <TableBody>
  //                     {loadingRequests ? (
  //                       <TableRow>
  //                         <TableCell colSpan={4} align="center">
  //                           Loading requests...
  //                         </TableCell>
  //                       </TableRow>
  //                     ) : requests.length > 0 ? (
  //                       requests.map((req) => (
  //                         <TableRow key={req.id}>
  //                           <TableCell>{req.reqNo}</TableCell>
  //                           <TableCell>{req.product}</TableCell>
  //                           <TableCell>{req.qty}</TableCell>
  //                           <TableCell>
  //                             {req.status === "Pending" ? (
  //                               <Button
  //                                 variant="contained"
  //                                 size="small"
  //                                 onClick={() => handleApprove(req.id)}
  //                               >
  //                                 Approve
  //                               </Button>
  //                             ) : (
  //                               <Chip
  //                                 icon={
  //                                   <CheckCircleOutlineIcon fontSize="small" />
  //                                 }
  //                                 label="Approved"
  //                                 color="success"
  //                                 size="small"
  //                               />
  //                             )}
  //                           </TableCell>
  //                         </TableRow>
  //                       ))
  //                     ) : (
  //                       <TableRow>
  //                         <TableCell colSpan={4} align="center">
  //                           No requests found
  //                         </TableCell>
  //                       </TableRow>
  //                     )}
  //                   </TableBody>
  //                 </Table>
  //               </TableContainer>
  //             </CardContent>
  //           </Card>
  //         </Stack>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );
   return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column: Dealer List */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Dealer List
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Dealers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
            <CardContent sx={{ flexGrow: 1, overflow: 'hidden', p: 0 }}>
              <List sx={{ height: '100%', overflowY: 'auto', p: 2, pt: 0 }}>
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
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {dealer.name}
                            </Typography>
                          }
                          secondary={dealer.handle}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {dealer.time}
                        </Typography>
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

        {/* Right Column: Details and Table */}
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            {/* Dealer Information Card */}
            <Card sx={{ width: '100%', minWidth:'830px' }} >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <BusinessIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Dealer Information
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                {selectedDealer ? (
                  <TableContainer
                    sx={{
                      maxWidth: 800,
                      maxHeight: 160,
                      overflowY: 'auto',
                      overflowX: 'auto',
                    }}
                  >
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <DetailItem label="Name" value={selectedDealer.name} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="Mobile No" value={selectedDealer.phone} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="E-Mail" value={selectedDealer.email} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <DetailItem label="Address" value={selectedDealer.profile?.address} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="City" value={selectedDealer.profile?.city} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="State" value={selectedDealer.profile?.state} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <DetailItem label="Pincode" value={selectedDealer.profile?.pincode} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="GST No" value={selectedDealer.profile?.gstNumber} />
                          </TableCell>
                          <TableCell>
                            <DetailItem label="Account No" value={selectedDealer.profile?.accountNo} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2">Select a dealer to view details</Typography>
                )}
              </CardContent>
            </Card>

            {/* Request Approval Table Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Request Approval Table
                </Typography>
                <TableContainer
                  sx={{
                    maxHeight: 'calc(100vh - 540px)',
                    overflowY: 'auto',
                    overflowX: 'auto',
                  }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {['Request No.', 'Product', 'QTY', 'Action'].map((head) => (
                          <TableCell key={head}>{head}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingRequests ? (
                             <TableRow>
                                <TableCell colSpan={4} align="center">Loading requests...</TableCell>
                            </TableRow>
                        ) : requests.length > 0 ? (
                            requests.map((req) => (
                                <TableRow key={req.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{req.reqNo}</TableCell>
                                <TableCell>{req.product}</TableCell>
                                <TableCell>{req.qty}</TableCell>
                                <TableCell>
                                    {req.status === 'Pending' ? (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        Approve
                                    </Button>
                                    ) : (
                                    <Chip
                                        icon={<CheckCircleOutlineIcon fontSize="small" />}
                                        label="Approved"
                                        color="success"
                                        size="small"
                                        variant="outlained"
                                    />
                                    )}
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No requests found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  ); 

}

