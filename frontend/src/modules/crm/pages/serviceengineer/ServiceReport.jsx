import { useState, useEffect, useMemo, useCallback } from "react";
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
  Collapse,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";
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
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [imageDialog, setImageDialog] = useState({ open: false, url: "", title: "" });

  // Form Fields
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [startPhoto, setStartPhoto] = useState(null);
  const [endPhoto, setEndPhoto] = useState(null);
  const [usedParts, setUsedParts] = useState("");
  const [missingPart, setMissingPart] = useState("");
  const [remarks, setRemarks] = useState("");

  // UI Toggles
  const [showNeedPartForm, setShowNeedPartForm] = useState(false);
  const [showFixedForm, setShowFixedForm] = useState(false);

  const steps = ["ASSIGNED", "EN_ROUTE", "ON_SITE", "NEED_PART", "FIXED", "COMPLETED"];

  // === FETCH DATA + AUTO-RESUME ===
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [ticketsRes, visitsRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/tickets/get-by-user`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/service-visits/my-visits`, axiosConfig),
      ]);

      const tickets = ticketsRes.data || [];
      const visits = visitsRes.data || [];

      setAllTickets(tickets);
      setMyVisits(visits);

      const active = visits.find((v) => v.active === true);
      if (active) {
        setActiveVisit(active);
        setSelectedTicketId(active.ticketId);

        // Pre-fill form from active visit
        setStartKm(active.startKm || "");
        setEndKm(active.endKm || "");
        setUsedParts(active.usedParts || "");
        setMissingPart(active.missingPart || "");
        setRemarks(active.remarks || "");

        // Auto-open correct form
        if (active.visitStatus === "ON_SITE") {
          setShowNeedPartForm(false);
          setShowFixedForm(false);
        } else if (active.visitStatus === "FIXED") {
          setShowNeedPartForm(false);
          setShowFixedForm(false);
        }
      } else {
        clearForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === UTILS ===
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
    const idx = steps.indexOf(activeVisit.visitStatus);
    return idx >= 0 ? idx : 0;
  }, [activeVisit]);

  const isTicketLocked = !!activeVisit;

  // Only ASSIGNED & NEED_PART tickets can start new visit
  const availableTickets = useMemo(() => {
    return allTickets.filter((t) => ["ASSIGNED", "NEED_PART"].includes(t.status));
  }, [allTickets]);

  const getTicketVisits = (ticketId) =>
    myVisits.filter((v) => v.ticketId === ticketId);

  const toggleTicketDetails = (ticketId) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openImageDialog = (url, title) =>
    setImageDialog({ open: true, url, title });
  const closeImageDialog = () =>
    setImageDialog({ open: false, url: "", title: "" });

  // === VALIDATIONS ===
  const validateStartVisit = () => {
    if (!selectedTicketId) return "Please select a ticket";
    if (!startKm) return "Start KM is required";
    if (!startPhoto) return "Start KM Photo is required";
    return null;
  };

  const validateNeedPart = () => {
    if (!missingPart.trim()) return "Missing Part details are required";
    if (!endKm) return "End KM is required for Need Part";
    if (!endPhoto) return "End KM Photo is required for Need Part";
    if (activeVisit?.startKm && Number(endKm) <= Number(activeVisit.startKm))
      return `End KM must be greater than Start KM (${activeVisit.startKm})`;
    return null;
  };

  const validateMarkFixed = () => {
    if (!endKm) return "End KM is required";
    if (!endPhoto) return "End KM Photo is required";
    if (activeVisit?.startKm && Number(endKm) <= Number(activeVisit.startKm))
      return `End KM must be greater than Start KM (${activeVisit.startKm})`;
    return null;
  };

  // === API HANDLERS ===
  const handleStartVisit = async () => {
    const err = validateStartVisit();
    if (err) { setError(err); return; }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("startKm", startKm);
    formData.append("startKmPhoto", startPhoto);

    try {
      const res = await axios.post(
        `${VITE_API_BASE_URL}/service-visits/${selectedTicketId}/start`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      setActiveVisit(res.data);
      await fetchData();
      alert("Visit Started - Status: EN_ROUTE");
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
      alert("Arrived at site - Status: ON_SITE");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark arrival");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNeedPart = async () => {
    const err = validateNeedPart();
    if (err) { setError(err); return; }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("missingPart", missingPart);
    formData.append("endKm", endKm);
    formData.append("endKmPhoto", endPhoto);
    formData.append("usedParts", usedParts || "");
    formData.append("remarks", remarks || "");
    formData.append("partUnavailableToday", "true");

    try {
      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/need-part`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      setActiveVisit(null);
      clearForm();
      await fetchData();
      alert("Visit Paused - Need Part. You can start another visit.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark need part");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkFixed = async () => {
    const err = validateMarkFixed();
    if (err) { setError(err); return; }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("endKm", endKm);
    formData.append("endKmPhoto", endPhoto);
    formData.append("usedParts", usedParts || "");

    try {
      const res = await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${activeVisit.id}/fixed`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      setActiveVisit(res.data);
      clearForm();
      await fetchData();
      alert("Marked as FIXED - Ready to complete");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark fixed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
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
      alert("Visit Completed Successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === RENDER ACTION BUTTONS (LIVE STATUS TRACKING) ===
  const renderActionButtons = () => {
    // No active visit → Start new
    if (!activeVisit) {
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            label="Select Ticket *"
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
            fullWidth
            size="small"
            disabled={isTicketLocked}
            required
          >
            {availableTickets.length === 0 ? (
              <MenuItem disabled>No tickets available</MenuItem>
            ) : (
              availableTickets.map((t) => (
                <MenuItem key={t.ticketId} value={t.ticketId}>
                  #{t.ticketId} - {t.customerName || "Customer"} ({t.status})
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            label="Start KM Reading *"
            value={startKm}
            onChange={(e) => setStartKm(e.target.value)}
            type="number"
            size="small"
            fullWidth
            required
          />

          <Box>
            <Typography variant="body2" mb={1}>Upload Start Photo *</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setStartPhoto(e.target.files[0])}
              required
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleStartVisit}
            disabled={isSubmitting || !selectedTicketId || !startKm || !startPhoto}
            startIcon={<PlayArrow />}
            fullWidth
          >
            Start Visit
          </Button>
        </Box>
      );
    }

    // === LIVE RESUME FROM CURRENT STATUS ===
    switch (activeVisit.visitStatus) {
      case "EN_ROUTE":
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              On the way to customer
            </Alert>
            <Button
              variant="contained"
              onClick={handleMarkArrival}
              disabled={isSubmitting}
              fullWidth
            >
              Mark Arrival at Site
            </Button>
          </Box>
        );

      case "ON_SITE":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Alert severity="info">Diagnose and take action</Alert>

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

            {/* Need Part Form */}
            {showNeedPartForm && (
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Need Part Details
                </Typography>

                <TextField
                  label="End KM Reading *"
                  value={endKm}
                  onChange={(e) => setEndKm(e.target.value)}
                  type="number"
                  size="small"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <Box mb={2}>
                  <Typography variant="body2" mb={1}>Upload End Photo *</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEndPhoto(e.target.files[0])}
                    required
                  />
                </Box>

                <TextField
                  label="Missing Part Details *"
                  value={missingPart}
                  onChange={(e) => setMissingPart(e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleNeedPart}
                  disabled={
                    isSubmitting ||
                    !endKm ||
                    !endPhoto ||
                    !missingPart.trim() ||
                    (activeVisit.startKm && Number(endKm) <= Number(activeVisit.startKm))
                  }
                  fullWidth
                >
                  Submit Need Part (Pause Visit)
                </Button>

                {activeVisit.startKm && Number(endKm) <= Number(activeVisit.startKm) && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    End KM must be greater than Start KM ({activeVisit.startKm})
                  </Alert>
                )}
              </Paper>
            )}

            {/* Mark Fixed Form */}
            {showFixedForm && (
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider" }}>
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
                  required
                  sx={{ mb: 2 }}
                />

                <Box mb={2}>
                  <Typography variant="body2" mb={1}>Upload End Photo *</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEndPhoto(e.target.files[0])}
                    required
                  />
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleMarkFixed}
                  disabled={
                    isSubmitting ||
                    !endKm ||
                    !endPhoto ||
                    (activeVisit.startKm && Number(endKm) <= Number(activeVisit.startKm))
                  }
                  fullWidth
                >
                  Confirm Fixed
                </Button>

                {activeVisit.startKm && Number(endKm) <= Number(activeVisit.startKm) && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    End KM must be greater than Start KM ({activeVisit.startKm})
                  </Alert>
                )}
              </Paper>
            )}
          </Box>
        );

      case "FIXED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Alert severity="success">Service Fixed! Complete the visit.</Alert>

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
              Complete Visit
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  // === RENDER UI ===
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
        Service Visit Workflow
      </Typography>

      {/* Active Workflow */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {activeVisit && (
            <Alert severity="info" icon={<PlayArrow />} sx={{ mb: 2 }}>
              Active Visit: #{activeVisit.ticketId} -{" "}
              <strong>{activeVisit.visitStatus}</strong>
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

      {/* Visit History */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            My Visit History
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {allTickets.length === 0 ? (
            <Typography color="text.secondary">No tickets assigned</Typography>
          ) : (
            allTickets.map((ticket) => {
              const ticketVisits = getTicketVisits(ticket.ticketId);
              const isExpanded = expandedTicketId === ticket.ticketId;

              return (
                <Paper
                  key={ticket.ticketId}
                  elevation={1}
                  sx={{ p: 2, mb: 2, border: 1, borderColor: "divider" }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Ticket #{ticket.ticketId}
                        <Chip
                          label={ticket.status}
                          size="small"
                          color={
                            ticket.status === "COMPLETED"
                              ? "success"
                              : ticket.status === "NEED_PART"
                              ? "warning"
                              : "primary"
                          }
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                      <Box display="flex" gap={3} mt={1}>
                        <Typography variant="body2">
                          <strong>Due:</strong>{" "}
                          {ticket.dueDate
                            ? new Date(ticket.dueDate).toLocaleDateString("en-IN")
                            : "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Product:</strong> {ticket.productName || "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Customer:</strong> {ticket.customerName || "-"}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleTicketDetails(ticket.ticketId)}
                      endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                    >
                      {isExpanded ? "Hide" : "View"} ({ticketVisits.length})
                    </Button>
                  </Box>

                  <Collapse in={isExpanded}>
                    <Divider sx={{ mb: 2 }} />
                    {ticketVisits.length === 0 ? (
                      <Alert severity="info">No visits recorded</Alert>
                    ) : (
                      ticketVisits.map((visit, index) => {
                        const totalTravelled =
                          visit.startKm && visit.endKm
                            ? Number(visit.endKm) - Number(visit.startKm)
                            : null;

                        return (
                          <Paper
                            key={visit.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 2,
                              border: visit.active ? 2 : 1,
                              borderColor: visit.active ? "primary.main" : "divider",
                              bgcolor: visit.active ? "action.hover" : "background.paper",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                Visit #{index + 1} - {visit.engineerName}
                                {visit.active && (
                                  <Chip
                                    label="ACTIVE"
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              <Chip
                                label={visit.visitStatus}
                                size="small"
                                color={
                                  visit.visitStatus === "COMPLETED"
                                    ? "success"
                                    : visit.visitStatus === "NEED_PART"
                                    ? "warning"
                                    : visit.visitStatus === "FIXED"
                                    ? "info"
                                    : "primary"
                                }
                              />
                            </Box>

                            <Box
                              display="grid"
                              gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                              gap={2}
                              mb={2}
                            >
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Start KM
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {visit.startKm || "-"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  End KM
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {visit.endKm || "-"}
                                </Typography>
                              </Box>
                              {totalTravelled !== null && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Travelled
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    {totalTravelled} KM
                                  </Typography>
                                </Box>
                              )}
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Started At
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {formatDate(visit.startedAt)}
                                </Typography>
                              </Box>
                              {visit.endedAt && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Ended At
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDate(visit.endedAt)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            {(visit.startKmPhotoUrl || visit.endKmPhotoUrl) && (
                              <Box mb={2}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  mb={1}
                                >
                                  Photos:
                                </Typography>
                                <Box display="flex" gap={2}>
                                  {visit.startKmPhotoUrl && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<ImageIcon />}
                                      onClick={() =>
                                        openImageDialog(
                                          visit.startKmPhotoUrl,
                                          `Visit #${index + 1} - Start KM`
                                        )
                                      }
                                    >
                                      Start
                                    </Button>
                                  )}
                                  {visit.endKmPhotoUrl && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<ImageIcon />}
                                      onClick={() =>
                                        openImageDialog(
                                          visit.endKmPhotoUrl,
                                          `Visit #${index + 1} - End KM`
                                        )
                                      }
                                    >
                                      End
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            )}

                            {visit.usedParts && (
                              <Box mb={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Used Parts:
                                </Typography>
                                <Typography variant="body2">{visit.usedParts}</Typography>
                              </Box>
                            )}
                            {visit.missingPart && (
                              <Box mb={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Missing Part:
                                </Typography>
                                <Typography variant="body2" color="warning.main">
                                  {visit.missingPart}
                                </Typography>
                              </Box>
                            )}
                            {visit.remarks && (
                              <Box mb={1}>
                                <Typography variant="caption" color="text.secondary">
                                  Remarks:
                                </Typography>
                                <Typography variant="body2">{visit.remarks}</Typography>
                              </Box>
                            )}
                            {visit.lastUpdatedBy && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mt={1}
                              >
                                Updated by {visit.lastUpdatedBy} at{" "}
                                {formatDate(visit.lastUpdatedAt)}
                              </Typography>
                            )}
                          </Paper>
                        );
                      })
                    )}
                  </Collapse>
                </Paper>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog open={imageDialog.open} onClose={closeImageDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {imageDialog.title}
          <IconButton
            onClick={closeImageDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imageDialog.url && (
            <img
              src={imageDialog.url}
              alt={imageDialog.title}
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}