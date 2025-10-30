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
  useTheme,
  IconButton,
  Chip,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { VITE_API_BASE_URL } from "../../utils/State";

/**
 * ServiceReport.jsx
 *
 * Single-page service visit workflow UI. Matches the workflow:
 * ASSIGNED → EN_ROUTE → ON_SITE → NEED_PART → PART_COLLECTED → FIXED → COMPLETED
 *
 * Endpoints used (assumed):
 * POST  ${VITE_API_BASE_URL}/tickets/start
 * POST  ${VITE_API_BASE_URL}/tickets/arrive
 * POST  ${VITE_API_BASE_URL}/tickets/need-part
 * POST  ${VITE_API_BASE_URL}/tickets/part-collected
 * POST  ${VITE_API_BASE_URL}/tickets/start-next-day
 * POST  ${VITE_API_BASE_URL}/tickets/fixed
 * POST  ${VITE_API_BASE_URL}/tickets/complete
 *
 * GET   ${VITE_API_BASE_URL}/tickets/get-services-by-user
 * GET   ${VITE_API_BASE_URL}/products/all
 * GET   ${VITE_API_BASE_URL}/service-visits/ticket/{ticketId}
 * GET   ${VITE_API_BASE_URL}/service-visits/my-visits
 *
 * Keep your CSS/theme externally; this file uses MUI theme and inline sx similar to your previous page.
 */

export default function ServiceReport() {
  const theme = useTheme();
  const token = localStorage.getItem("authKey");

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const [tickets, setTickets] = useState([]);
  const [visits, setVisits] = useState([]);
  const [form, setForm] = useState({
    ticketId: "",
    startKm: "",
    endKm: "",
    usedParts: "",
    missingPart: "",
    remarks: "",
  });
  const [photo, setPhoto] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const steps = ["ASSIGNED", "EN_ROUTE", "ON_SITE", "NEED_PART", "FIXED", "COMPLETED"];

  // Fetch all tickets and my visits
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ticketsRes, visitsRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/tickets/get-by-user`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/service-visits/my-visits`, axiosConfig),
      ]);
      setTickets(ticketsRes.data);
      setVisits(visitsRes.data);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  // ----------- Stage Actions (API Calls) -----------
  const handleStartVisit = async () => {
    if (!form.ticketId || !form.startKm || !photo) {
      alert("Please enter Start KM and upload Start Photo.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("startKm", form.startKm);
      formData.append("startKmPhoto", photo);

      const res = await axios.post(
        `${VITE_API_BASE_URL}/service-visits/${form.ticketId}/start`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      alert("Visit Started — Status: EN_ROUTE");
      setActiveStep(steps.indexOf("EN_ROUTE"));
      setPhoto(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error starting visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrival = async (visitId) => {
    setIsSubmitting(true);
    try {
      await axios.patch(`${VITE_API_BASE_URL}/service-visits/${visitId}/arrive`, {}, axiosConfig);
      alert("Marked as Arrived — Status: ON_SITE");
      setActiveStep(steps.indexOf("ON_SITE"));
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error marking arrival");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNeedPart = async (visitId) => {
    if (!form.missingPart) {
      alert("Please enter missing part details.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${visitId}/need-part`,
        {
          missingPart: form.missingPart,
          remarks: form.remarks,
          partUnavailableToday: true,
        },
        axiosConfig
      );
      alert("Marked as NEED_PART");
      setActiveStep(steps.indexOf("NEED_PART"));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error marking need part");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFixed = async (visitId) => {
    if (!form.endKm || !photo) {
      alert("Please provide End KM and Photo");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("endKm", form.endKm);
      formData.append("usedParts", form.usedParts);
      formData.append("endKmPhoto", photo);

      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${visitId}/fixed`,
        formData,
        { headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" } }
      );

      alert("Marked as FIXED");
      setActiveStep(steps.indexOf("FIXED"));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error marking fixed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (visitId) => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${VITE_API_BASE_URL}/service-visits/${visitId}/complete`,
        null,
        { ...axiosConfig, params: { remarks: form.remarks || "" } }
      );
      alert("Visit Completed Successfully ✅");
      setActiveStep(steps.indexOf("COMPLETED"));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error completing visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------- Render UI -----------
  const renderStageFields = () => {
    const current = steps[activeStep];

    switch (current) {
      case "ASSIGNED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Start KM Reading"
              value={form.startKm}
              onChange={handleChange("startKm")}
              type="number"
              size="small"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleStartVisit} disabled={isSubmitting}>
              Start Visit
            </Button>
          </Box>
        );
      case "EN_ROUTE":
        return (
          <Button
            variant="contained"
            color="info"
            onClick={() => handleArrival(visits[0]?.id)}
            disabled={isSubmitting}
          >
            Mark Arrival
          </Button>
        );
      case "ON_SITE":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Diagnose and choose next action.</Typography>

            <TextField
              label="Used Parts"
              value={form.usedParts}
              onChange={handleChange("usedParts")}
              size="small"
            />

            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={handleChange("remarks")}
              size="small"
              multiline
              rows={2}
            />

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleNeedPart(visits[0]?.id)}
              >
                Fixed (upload end KM)
              </Button>

              <Button variant="outlined" color="warning" onClick={() => setActiveStep(steps.indexOf("NEED_PART"))}>
                Need Part
              </Button>
              <Button variant="contained" color="success" onClick={() => setActiveStep(steps.indexOf("FIXED"))}>
                Fixed
              </Button>
            </Box>
          </Box>
        );
      case "FIXED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Record missing part details.</Typography>
            <TextField
              label="End KM Reading"
              value={form.endKm}
              onChange={handleChange("endKm")}
              type="number"
              size="small"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleFixed(visits[0]?.id)}
              disabled={isSubmitting}
            >
              Mark Fixed
            </Button>
          </Box>
        );
      case "COMPLETED":
        return (
          <Typography color="success.main" fontWeight="bold">
            Ticket Completed ✅
          </Typography>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Service Visit Workflow
        </Typography>

        <Card sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>


          <Divider sx={{ my: 2 }} />

          <TextField
            select
            label="Select Ticket"
            value={form.ticketId}
            onChange={handleChange("ticketId")}
            fullWidth
            size="small"
          >
            {tickets.map((t) => (
              <MenuItem key={t.ticketId} value={t.ticketId}>
                #{t.ticketId}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={3}>{renderStageFields()}</Box>
        </Card>

        {/* My Visits */}
        <Card>
          <CardContent>
            <Typography variant="h6">My Recent Visits</Typography>
            <Divider sx={{ my: 1 }} />
            {isLoading ? (
              Array.from(new Array(5)).map((_, i) => (
                <Skeleton key={i} height={40} sx={{ my: 0.5 }} />
              ))
            ) : (
              visits.map((v) => (
                <Box
                  key={v.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    p: 1,
                  }}
                >
                  <Typography>#{v.ticketId}</Typography>
                  <Chip label={v.visitStatus} color="primary" />
                  <Typography>{dayjs(v.startedAt).format("DD MMM, hh:mm A")}</Typography>
                  <Typography>{v.usedParts || "N/A"}</Typography>
                  <Typography>{v.missingPart || "-"}</Typography>
                  <Typography>{v.remarks || "-"}</Typography>
                  {v.endKmPhotoUrl ? (
                    <IconButton component="a" href={v.endKmPhotoUrl} target="_blank">
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                  ) : (
                    "N/A"
                  )}
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
