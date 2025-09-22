import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const categories = [
  { value: "Food", label: "Food" },
  { value: "Travel", label: "Travel" },
  { value: "Stay", label: "Stay" },
  { value: "Other", label: "Other" },
];

export default function Rimbersment() {
  const theme = useTheme();
  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    distance: "",
    area: "",
    note: "",
  });
  const [receipt, setReceipt] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: "100vh" }}>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Reimbursement
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Lorem ipsum dolor sit amet consectetur adipisicing.
      </Typography>
      <Box display="flex" justifyContent="center">
        <Card sx={{ width: 600, background: theme.palette.background.paper, borderRadius: 3 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={handleChange("category")}
                fullWidth
                size="small"
              >
                {categories.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount"
                value={form.amount}
                onChange={handleChange("amount")}
                fullWidth
                size="small"
              />
              <TextField
                label="Distance travelled"
                value={form.distance}
                onChange={handleChange("distance")}
                fullWidth
                size="small"
                placeholder="distance in kms"
              />
              <TextField
                label="Area"
                value={form.area}
                onChange={handleChange("area")}
                fullWidth
                size="small"
              />
              <TextField
                label="Note"
                value={form.note}
                onChange={handleChange("note")}
                fullWidth
                multiline
                rows={2}
                size="small"
              />
              <Box mt={2} mb={2}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  id="upload-receipt"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-receipt">
                  <Button
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      background: "none",
                      color: theme.palette.text.secondary,
                      border: "1px dashed",
                      borderRadius: 2,
                      py: 2,
                      px: 4,
                      fontWeight: 600,
                      width: "100%",
                    }}
                  >
                    Upload Receipt
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" mt={1} display="block" align="center">
                  {receipt ? receipt.name : "Upload Receipt"}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "50%",
                  mx: "auto",
                  py: 1.5,
                  borderRadius: 3,
                  background: "linear-gradient(90deg,#434343 0%,#000000 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: 2,
                  mt: 2,
                }}
              >
                ADD
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}