// import React, { useRef, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   useTheme,
//   Grid,
// } from "@mui/material";
// import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";

// // Categories for dropdown
// const expenseCategories = [
//   "Food",
//   "Travel",
//   "Accommodation",
//   "Utilities",
//   "Other",
// ];

// export default function MarketerExpenses() {
//   const theme = useTheme();
//   const fileInputRef = useRef(null);
//   const [selectedDate, setSelectedDate] = useState(dayjs());

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       console.log("Selected file:", file.name);
//     }
//   };

//   const cardStyle = {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: "16px",
//     maxWidth: "800px",
//     width: "100%",
//     boxShadow:
//       theme.palette.mode === "dark"
//         ? "0px 4px 20px rgba(0,0,0,0.6)"
//         : "0px 4px 20px rgba(0,0,0,0.1)",
//   };

//   const uploadBoxStyle = {
//     border: `2px dashed ${
//       theme.palette.mode === "dark" ? "#475569" : "#CBD5E1"
//     }`,
//     borderRadius: "12px",
//     padding: theme.spacing(5),
//     textAlign: "center",
//     cursor: "pointer",
//     color: theme.palette.text.secondary,
//     transition: "all 0.3s ease",
//     "&:hover": {
//       backgroundColor:
//         theme.palette.mode === "dark"
//           ? "rgba(255, 255, 255, 0.05)"
//           : "rgba(0, 0, 0, 0.03)",
//       borderColor: theme.palette.primary.main,
//     },
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       p={3}
//       sx={{
//         backgroundColor: theme.palette.background.default,
//         minHeight: "calc(100vh - 64px)", // adjust for navbar
//       }}
//     >
//       <Card sx={cardStyle}>
//         <CardContent sx={{ p: { xs: 3, md: 5 } }}>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Reimbursement Request
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mb={4}>
//             Fill the details below to claim your expenses.
//           </Typography>

//           <Box component="form" noValidate autoComplete="off">
//             <Grid container spacing={3}>
//               {/* Date Picker */}
//               <Grid item xs={12} md={6}>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <DatePicker
//                     label="Date"
//                     value={selectedDate}
//                     onChange={(newValue) => setSelectedDate(newValue)}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         size: "medium",
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </Grid>

//               {/* Category */}
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Category</InputLabel>
//                   <Select defaultValue="Food" label="Category">
//                     {expenseCategories.map((category) => (
//                       <MenuItem key={category} value={category}>
//                         {category}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {/* Amount */}
//               <Grid item xs={12} md={6}>
//                 <TextField fullWidth label="Amount" placeholder="Enter amount" />
//               </Grid>

//               {/* Distance */}
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Distance Travelled"
//                   placeholder="in kms"
//                 />
//               </Grid>

//               {/* Area */}
//               <Grid item xs={12}>
//                 <TextField fullWidth label="Area" placeholder="Enter area" />
//               </Grid>

//               {/* Notes */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Note"
//                   multiline
//                   rows={3}
//                   placeholder="Add additional notes..."
//                 />
//               </Grid>

//               {/* Upload Receipt */}
//               <Grid item xs={12}>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ mb: 1 }}
//                 >
//                   Upload Receipt
//                 </Typography>
//                 <Box sx={uploadBoxStyle} onClick={handleUploadClick}>
//                   <CloudUploadOutlined sx={{ fontSize: "2.5rem", mb: 1 }} />
//                   <Typography variant="body2" fontWeight="600">
//                     Upload Receipt
//                   </Typography>
//                   <Typography variant="caption">
//                     Drag & drop or click to upload
//                   </Typography>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: "none" }}
//                     accept="image/*,.pdf"
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* Submit Button */}
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 sx={{
//                   px: 10,
//                   py: 1.5,
//                   borderRadius: "12px",
//                   textTransform: "none",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Submit
//               </Button>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
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

const expenseCategories = [
  "Food",
  "Travel",
  "Accommodation",
  "Utilities",
  "Other",
];

export default function MarketerExpenses() {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) console.log("Selected file:", file.name);
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

          <Box component="form" noValidate autoComplete="off">
            {/* Date + Category */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slotProps={{
                      textField: { fullWidth: true, size: "medium" },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={fieldItem}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select defaultValue="Food" label="Category">
                    {expenseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Amount + Distance */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField fullWidth label="Amount" placeholder="Enter amount" />
              </Box>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  label="Distance Travelled"
                  placeholder="in kms"
                />
              </Box>
            </Box>

            {/* Area + Note */}
            <Box sx={fieldRow}>
              <Box sx={fieldItem}>
                <TextField fullWidth label="Area" placeholder="Enter area" />
              </Box>
              <Box sx={fieldItem}>
                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={3}
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
                  Upload Receipt
                </Typography>
                <Typography variant="caption">
                  Drag & drop or click to upload
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
