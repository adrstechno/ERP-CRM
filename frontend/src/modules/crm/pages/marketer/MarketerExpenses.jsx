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
} from "@mui/material";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { VITE_API_BASE_URL } from "../../utils/State";
import toast from "react-hot-toast";

const expenseCategories = [
  { value: "TRAVEL", label: "Travel" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "SALARY", label: "Salary" },
  { value: "OTHER", label: "Other" },
];

export default function MarketerExpenses() {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: "TRAVEL",
    amount: "",
    remarks: "",
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setReceipt(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate) newErrors.date = "Date is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.amount) newErrors.amount = "Amount is required.";
    else if (Number(formData.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0.";
    if (!formData.remarks.trim()) newErrors.remarks = "Remarks are required.";
    // Uncomment below if receipt should be mandatory
    // if (!receipt) newErrors.receipt = "Receipt is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("authKey");

    const apiFormData = new FormData();
    apiFormData.append("date", selectedDate.format("YYYY-MM-DD"));
    apiFormData.append("category", formData.category);
    apiFormData.append("amount", formData.amount);
    apiFormData.append("remarks", formData.remarks);
    if (receipt) apiFormData.append("receipt", receipt);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/expense/add-expense`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: apiFormData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit expense.");

      toast.success("Reimbursement submitted successfully!");
      setFormData({ category: "TRAVEL", amount: "", remarks: "" });
      setSelectedDate(dayjs());
      setReceipt(null);
      setErrors({});
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(`Error: ${error.message}`);
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
    border: `2px dashed ${theme.palette.mode === "dark" ? "#475569" : "#CBD5E1"}`,
    borderRadius: "12px",
    padding: theme.spacing(5),
    textAlign: "center",
    cursor: "pointer",
    color: theme.palette.text.secondary,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)",
      borderColor: theme.palette.primary.main,
    },
  };

  const fieldRow = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  };

  const fieldItem = {
    flex: "1 1 45%",
    minWidth: "200px",
  };

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

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            {/* Date + Category */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      setErrors((prev) => ({ ...prev, date: "" }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={fieldItem}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {expenseCategories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Amount + Remarks */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  error={!!errors.amount}
                  helperText={errors.amount}
                />
              </Box>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="remarks"
                  label="Remarks"
                  multiline
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Add additional remarks..."
                  error={!!errors.remarks}
                  helperText={errors.remarks}
                />
              </Box>
            </Box>

            {/* Upload Receipt */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload Receipt
              </Typography>
              <Box sx={uploadBoxStyle} onClick={handleUploadClick}>
                <CloudUploadOutlined sx={{ fontSize: "2.5rem", mb: 1 }} />
                <Typography variant="body2" fontWeight="600">
                  {receipt ? receipt.name : "Upload Receipt"}
                </Typography>
                <Typography variant="caption">
                  {receipt ? "Click to change" : "Drag & drop or click to upload"}
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*,.pdf"
                />
              </Box>
              {errors.receipt && (
                <Typography variant="caption" color="error">
                  {errors.receipt}
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{
                  px: 10,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
