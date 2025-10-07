// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   useTheme,
// } from "@mui/material";
// import { CloudUpload } from "@mui/icons-material";

// const categories = [
//   { value: "Food", label: "Food" },
//   { value: "Travel", label: "Travel" },
//   { value: "Stay", label: "Stay" },
//   { value: "Other", label: "Other" },
// ];

// export default function Rimbersment() {
//   const theme = useTheme();
//   const [form, setForm] = useState({
//     date: "",
//     category: "",
//     amount: "",
//     distance: "",
//     area: "",
//     note: "",
//   });
//   const [receipt, setReceipt] = useState(null);

//   const handleChange = (field) => (e) => {
//     setForm({ ...form, [field]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setReceipt(e.target.files[0]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Submit logic here
//   };

//   return (
//     <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: "100vh" }}>
//       <Typography variant="h6" fontWeight="bold" mb={1}>
//         Reimbursement
//       </Typography>
//       <Typography variant="body2" color="text.secondary" mb={3}>
//         Lorem ipsum dolor sit amet consectetur adipisicing.
//       </Typography>
//       <Box display="flex" justifyContent="center">
//         <Card sx={{ width: 600, background: theme.palette.background.paper, borderRadius: 3 }}>
//           <CardContent>
//             <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//               <TextField
//                 label="Date"
//                 type="date"
//                 value={form.date}
//                 onChange={handleChange("date")}
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//                 size="small"
//               />
//               <TextField
//                 select
//                 label="Category"
//                 value={form.category}
//                 onChange={handleChange("category")}
//                 fullWidth
//                 size="small"
//               >
//                 {categories.map((opt) => (
//                   <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 label="Amount"
//                 value={form.amount}
//                 onChange={handleChange("amount")}
//                 fullWidth
//                 size="small"
//               />
//               <TextField
//                 label="Distance travelled"
//                 value={form.distance}
//                 onChange={handleChange("distance")}
//                 fullWidth
//                 size="small"
//                 placeholder="distance in kms"
//               />
//               <TextField
//                 label="Area"
//                 value={form.area}
//                 onChange={handleChange("area")}
//                 fullWidth
//                 size="small"
//               />
//               <TextField
//                 label="Note"
//                 value={form.note}
//                 onChange={handleChange("note")}
//                 fullWidth
//                 multiline
//                 rows={2}
//                 size="small"
//               />
//               <Box mt={2} mb={2}>
//                 <input
//                   accept="image/*,application/pdf"
//                   style={{ display: "none" }}
//                   id="upload-receipt"
//                   type="file"
//                   onChange={handleFileChange}
//                 />
//                 <label htmlFor="upload-receipt">
//                   <Button
//                     component="span"
//                     startIcon={<CloudUpload />}
//                     sx={{
//                       background: "none",
//                       color: theme.palette.text.secondary,
//                       border: "1px dashed",
//                       borderRadius: 2,
//                       py: 2,
//                       px: 4,
//                       fontWeight: 600,
//                       width: "100%",
//                     }}
//                   >
//                     Upload Receipt
//                   </Button>
//                 </label>
//                 <Typography variant="caption" color="text.secondary" mt={1} display="block" align="center">
//                   {receipt ? receipt.name : "Upload Receipt"}
//                 </Typography>
//               </Box>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 sx={{
//                   width: "50%",
//                   mx: "auto",
//                   py: 1.5,
//                   borderRadius: 3,
//                   background: "linear-gradient(90deg,#434343 0%,#000000 100%)",
//                   color: "white",
//                   fontWeight: 700,
//                   fontSize: "1rem",
//                   boxShadow: 2,
//                   mt: 2,
//                 }}
//               >
//                 ADD
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     </Box>
//   );
// }

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
} from "@mui/material";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Categories for the engineer's reimbursement form
const engineerCategories = [
  { value: "Food", label: "Food" },
  { value: "Travel", label: "Travel" },
  { value: "Stay", label: "Stay" },
  { value: "Other", label: "Other" },
];

export default function EngineerReimbursement() {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  // State for all form fields in a single object
  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
    distance: "",
    area: "",
    note: "",
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [receipt, setReceipt] = useState(null);

  // Generic handler for text fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setReceipt(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submissionData = {
        ...formData,
        date: selectedDate.format("YYYY-MM-DD"),
        receipt: receipt ? receipt.name : null,
    };
    console.log("Submitting Reimbursement:", submissionData);
    // Add your submission logic here (e.g., API call)
  };

  // --- Styles copied from MarketerExpenses for consistency ---

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
    border: `2px dashed ${
      theme.palette.mode === "dark" ? "#475569" : "#CBD5E1"
    }`,
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
    flex: "1 1 45%", // half width on desktop, full on mobile
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
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slotProps={{
                      textField: { fullWidth: true, name: "date" },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={fieldItem}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
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

            {/* Amount + Distance */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="amount"
                  label="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </Box>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="distance"
                  label="Distance Travelled"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="in kms"
                />
              </Box>
            </Box>

            {/* Area + Note */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="area"
                  label="Area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                />
              </Box>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  name="note"
                  label="Note"
                  value={formData.note}
                  onChange={handleChange}
                  multiline
                  rows={3} // Adjusted for better alignment
                  placeholder="Add additional notes..."
                />
              </Box>
            </Box>

            {/* Upload Receipt */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
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
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 10,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}