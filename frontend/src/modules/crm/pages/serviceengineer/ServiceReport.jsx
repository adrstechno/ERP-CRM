// ServiceVisitWorkflow.jsx - FINAL FIX

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Skeleton,
  Alert,
  Chip,
  Paper,
} from "@mui/material";
import { PlayArrow, Pause, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { VITE_API_BASE_URL } from "../../utils/State";

export default function ServiceVisitWorkflow() {
  const token = localStorage.getItem("authKey");
  
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // === STATE ===
  const [allTickets, setAllTickets] = useState([]);
  const [myVisits, setMyVisits] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [startPhoto, setStartPhoto] = useState(null);
  const [endPhoto, setEndPhoto] = useState(null);
  const [usedParts, setUsedParts] = useState("");
  const [missingPart, setMissingPart] = useState("");
  const [remarks, setRemarks] = useState("");

  // UI toggles
  const [showNeedPartForm, setShowNeedPartForm] = useState(false);
  const [showFixedForm, setShowFixedForm] = useState(false);

  const steps = ["ASSIGNED", "EN_ROUTE", "ON_SITE", "NEED_PART", "FIXED", "COMPLETED"];

  // === FETCH DATA ===
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [ticketsRes, visitsRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/tickets/get-by-user`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/service-visits/my-visits`, axiosConfig),
      ]);
      
      setAllTickets(ticketsRes.data || []);
      
      setMyVisits(visitsRes.data || []);
      console.log(visitsRes);
      const active = visitsRes.data?.find(v => v.active === true);
      if (active) {
        setActiveVisit(active);
        setSelectedTicketId(active.ticketId);
      }
    } catch (err) {
      console.error("Error fetching:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearForm = () => {
    setStartKm("");
    setEndKm("");
    setStartPhoto(null);
    setEndPhoto(null);
    setUsedParts("");
    setMissingPart("");
    setRemarks("");
    setShowNeedPartForm(false);
    setShowFixedForm(false);
  };

  const currentStepIndex = useMemo(() => {
    if (!activeVisit) return 0;
    const index = steps.indexOf(activeVisit.visitStatus);
    return index >= 0 ? index : 0;
  }, [activeVisit]);

  const isTicketLocked = !!activeVisit;
  console.log(allTickets);
  

  // Filter only ACTIVE tickets (ASSIGNED, NEED_PART, EN_ROUTE, ON_SITE)
  const availableTickets = useMemo(() => {
    return allTickets.filter(t => 
      t.status === "ASSIGNED" || 
      t.status === "NEED_PART" ||
      t.status === "EN_ROUTE" ||
      t.status === "ON_SITE"||
      t.status === "NEED_PART"
    );
  }, [allTickets]);

  console.log(availableTickets);
  
  // === API HANDLERS ===

  const handleStartVisit = async () => {
    if (!selectedTicketId) {
      setError("Please select a ticket");
      return;
    }
    if (!startKm || !startPhoto) {
      setError("Please enter Start KM and upload photo");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("startKm", startKm);
      formData.append("startKmPhoto", startPhoto);

      const res = await axios.post(
        `${VITE_API_BASE_URL}/service-visits/${selectedTicketId}/start`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      setActiveVisit(res.data);
      clearForm();
      await fetchData();
      alert("✅ Visit Started - Status: EN_ROUTE");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkArrival = async () => {
    if (!activeVisit) return;

    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/arrive`,
        {},
        axiosConfig
      );

      setActiveVisit(res.data);
      await fetchData();
      alert("✅ Arrived at site - Status: ON_SITE");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark arrival");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNeedPart = async () => {
    if (!activeVisit) return;
    if (!missingPart) {
      setError("Please enter missing part details");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/need-part`,
        {
          missingPart,
          remarks,
          partUnavailableToday: true,
        },
        axiosConfig
      );

      setActiveVisit(null);
      clearForm();
      await fetchData();
      alert("⏸️ Visit Paused - Need Part. You can start another visit now.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark need part");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkFixed = async () => {
    if (!activeVisit) return;
    if (!endKm || !endPhoto) {
      setError("Please enter End KM and upload photo");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("endKm", endKm);
      formData.append("endKmPhoto", endPhoto);
      formData.append("usedParts", usedParts || "");

      const res = await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/fixed`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      setActiveVisit(res.data);
      clearForm();
      await fetchData();
      alert("✅ Marked as FIXED - Ready to complete");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark fixed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!activeVisit) return;

    setIsSubmitting(true);
    setError("");
    
    try {
      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/complete`,
        null,
        { ...axiosConfig, params: { remarks: remarks || "" } }
      );

      setActiveVisit(null);
      setSelectedTicketId("");
      clearForm();
      await fetchData();
      alert("✅ Visit Completed Successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === RENDER UI ===

  const renderActionButtons = () => {
    if (!activeVisit) {
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            label="Select Ticket"
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
            fullWidth
            size="small"
            disabled={isTicketLocked}
          >
            {availableTickets.length === 0 ? (
              <MenuItem disabled>No active tickets available</MenuItem>
            ) : (
              availableTickets.map((t) => (
                <MenuItem key={t.ticketId} value={t.ticketId}>
                  #{t.ticketId} - {t.customerName || 'Customer'} ({t.status})
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            label="Start KM Reading"
            value={startKm}
            onChange={(e) => setStartKm(e.target.value)}
            type="number"
            size="small"
            fullWidth
          />

          <Box>
            <Typography variant="body2" mb={1}>Upload Start Photo *</Typography>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setStartPhoto(e.target.files[0])}
            />
          </Box>

          <Button 
            variant="contained" 
            onClick={handleStartVisit} 
            disabled={isSubmitting || !selectedTicketId || availableTickets.length === 0}
            startIcon={<PlayArrow />}
            fullWidth
          >
            Start Visit
          </Button>
        </Box>
      );
    }

    switch (activeVisit.visitStatus) {
      case "EN_ROUTE":
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              📍 On the way to customer location
            </Alert>
            <Button
              variant="contained"
              onClick={handleMarkArrival}
              disabled={isSubmitting}
              fullWidth
            >
              ✅ Mark Arrival at Site
            </Button>
          </Box>
        );

      case "ON_SITE":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Alert severity="info">
              🔍 Diagnose the issue and choose action
            </Alert>

            <TextField
              label="Used Parts (if any)"
              value={usedParts}
              onChange={(e) => setUsedParts(e.target.value)}
              size="small"
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              size="small"
              multiline
              rows={2}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  setShowNeedPartForm(!showNeedPartForm);
                  setShowFixedForm(false);
                }}
                startIcon={<Pause />}
                fullWidth
              >
                Need Part
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setShowFixedForm(!showFixedForm);
                  setShowNeedPartForm(false);
                }}
                startIcon={<CheckCircle />}
                fullWidth
              >
                Mark Fixed
              </Button>
            </Box>

            {showNeedPartForm && (
              <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Need Part Details
                </Typography>
                <TextField
                  label="Missing Part Details *"
                  value={missingPart}
                  onChange={(e) => setMissingPart(e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Enter part name, quantity, etc."
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleNeedPart}
                  disabled={isSubmitting || !missingPart}
                  fullWidth
                >
                  Submit Need Part (Pause Visit)
                </Button>
              </Paper>
            )}

            {showFixedForm && (
              <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: 1, borderColor: "divider" }}>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Mark as Fixed
                </Typography>
                <TextField
                  label="End KM Reading *"
                  value={endKm}
                  onChange={(e) => setEndKm(e.target.value)}
                  type="number"
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Box mb={2}>
                  <Typography variant="body2" mb={1}>Upload End Photo *</Typography>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setEndPhoto(e.target.files[0])}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleMarkFixed}
                  disabled={isSubmitting || !endKm || !endPhoto}
                  fullWidth
                >
                  Confirm Fixed
                </Button>
              </Paper>
            )}
          </Box>
        );

      case "FIXED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Alert severity="success">
              ✅ Service Fixed! Add final remarks and complete the visit.
            </Alert>

            <TextField
              label="Final Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              size="small"
              multiline
              rows={3}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleComplete}
              disabled={isSubmitting}
              fullWidth
            >
              🏁 Complete Visit
            </Button>
          </Box>
        );

      case "COMPLETED":
        return (
          <Alert severity="success">
            ✅ Visit Completed! You can start a new visit now.
          </Alert>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton height={60} />
        <Skeleton height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        🔧 Service Visit Workflow
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {activeVisit && (
            <Alert severity="info" icon={<PlayArrow />} sx={{ mb: 2 }}>
              Active Visit: Ticket #{activeVisit.ticketId} - {activeVisit.visitStatus}
            </Alert>
          )}

          <Stepper activeStep={currentStepIndex} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {renderActionButtons()}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>📋 My Visit History</Typography>
          <Divider sx={{ mb: 2 }} />

          {myVisits.length === 0 ? (
            <Typography color="text.secondary">No visits yet</Typography>
          ) : (
            myVisits.map((v) => (
              <Paper 
                key={v.id} 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 2,
                  border: v.active ? 2 : 1,
                  borderColor: v.active ? "primary.main" : "divider",
                  bgcolor: v.active ? "action.hover" : "background.paper"
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography fontWeight={600}>
                    Ticket #{v.ticketId}
                    {v.active && <Chip label="ACTIVE" color="primary" size="small" sx={{ ml: 1 }} />}
                  </Typography>
                  <Chip 
                    label={v.visitStatus} 
                    color={
                      v.visitStatus === "COMPLETED" ? "success" :
                      v.visitStatus === "NEED_PART" ? "warning" :
                      "primary"
                    }
                    size="small"
                  />
                </Box>

                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={1}>
                  <Typography variant="body2">
                    <strong>Start KM:</strong> {v.startKm || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End KM:</strong> {v.endKm || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Used Parts:</strong> {v.usedParts || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Missing Part:</strong> {v.missingPart || "-"}
                  </Typography>
                </Box>

                {v.remarks && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <strong>Remarks:</strong> {v.remarks}
                  </Typography>
                )}

                {v.nextDayRequired && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    ⏳ This visit requires next day continuation with parts
                  </Alert>
                )}
              </Paper>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}