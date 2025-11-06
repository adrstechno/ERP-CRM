import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";

const engineerCategories = [
  { value: "TRAVEL", label: "Travel" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "SALARY", label: "Salary" },
  { value: "OTHER", label: "Other" },
];

const MAX_AMOUNT = 999999999999; // 12-digit limit

export default function EngineerReimbursement() {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: "TRAVEL",
    amount: "",
    remarks: "",
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") {
      // Allow only positive numbers, block -, e, E, +, .
      const cleanValue = value.replace(/[^0-9]/g, "");
      const numValue = cleanValue === "" ? "" : Number(cleanValue);

      if (cleanValue === "" || (numValue > 0 && numValue <= MAX_AMOUNT)) {
        setFormData((prev) => ({ ...prev, amount: cleanValue }));
        setError("");
      } else if (numValue > MAX_AMOUNT) {
        setError(`Amount cannot exceed ₹${MAX_AMOUNT.toLocaleString("en-IN")}`);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Only image files are allowed (JPG, PNG, WebP)");
      return;
    }

    if (file.size > maxSize) {
      setError("Image size must be under 5MB");
      return;
    }

    setReceipt(file);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Final validation
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    if (Number(formData.amount) > MAX_AMOUNT) {
      setError(`Amount cannot exceed ₹${MAX_AMOUNT.toLocaleString("en-IN")}`);
      return;
    }
    if (!receipt) {
      setError("Please upload a receipt image");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("authKey");
    const apiFormData = new FormData();
    apiFormData.append("date", selectedDate.format("YYYY-MM-DD"));
    apiFormData.append("category", formData.category);
    apiFormData.append("amount", formData.amount);
    apiFormData.append("remarks", formData.remarks);
    apiFormData.append("receipt", receipt);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/expense/add-expense`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit expense");
      }

      toast.success("Reimbursement submitted successfully!");
      setFormData({ category: "TRAVEL", amount: "", remarks: "" });
      setSelectedDate(dayjs());
      setReceipt(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
    maxWidth: "900px",
    width: "100%",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0px 4px 20px rgba(0,0,0,0.6)"
        : "0px 4px 20px rgba(0,0,0,0.1)",
  };

  const uploadBoxStyle = {
    border: `2px dashed ${receipt ? theme.palette.success.main : theme.palette.mode === "dark" ? "#475569" : "#CBD5E1"}`,
    borderRadius: "12px",
    padding: theme.spacing(5),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: receipt ? "rgba(76, 175, 80, 0.05)" : "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      borderColor: theme.palette.primary.main,
    },
  };

  const fieldRow = { display: "flex", gap: "20px", flexWrap: "wrap", mb: 3 };
  const fieldItem = { flex: "1 1 45%", minWidth: "280px" };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Card sx={cardStyle}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Reimbursement Request
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Fill the details below to claim your expenses.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Expense Date *"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={fieldItem}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category *"
                  >
                    {engineerCategories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  required
                  name="amount"
                  label="Amount (₹)"
                  value={formData.amount}
                  onChange={handleChange}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    min: 1,
                    max: MAX_AMOUNT,
                  }}
                  placeholder="e.g. 1299"
                  error={!!error && error.includes("Amount")}
                  helperText={
                    error && error.includes("Amount")
                      ? error
                      : `Max: ₹${MAX_AMOUNT.toLocaleString("en-IN")}`
                  }
                />
              </Box>

              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="remarks"
                  label="Remarks (Optional)"
                  value={formData.remarks}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="e.g. Lunch with client at XYZ Restaurant"
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload Receipt Image * (JPG, PNG, WebP only)
              </Typography>
              <Box sx={uploadBoxStyle} onClick={handleUploadClick}>
                <CloudUploadOutlined sx={{ fontSize: "2.8rem", mb: 1, color: receipt ? "success.main" : "inherit" }} />
                <Typography variant="body2" fontWeight="600" color={receipt ? "success.main" : "inherit"}>
                  {receipt ? `✓ ${receipt.name}` : "Click to upload receipt image"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {receipt ? "Click to change • Max 5MB" : "Supports: JPG, PNG, WebP • Max 5MB"}
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || !formData.amount || !receipt}
                sx={{
                  px: 12,
                  py: 1.8,
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={28} color="inherit" />
                ) : (
                  "Submit Reimbursement"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}