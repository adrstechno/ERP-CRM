// // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // import axios from "axios";
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   TextField,
// //   MenuItem,
// //   Button,
// //   IconButton,
// //   Divider,
// //   Chip,
// //   useTheme,
// //   CircularProgress,
// //   Skeleton
// // } from '@mui/material';
// // import { CloudUpload, ArrowDownward } from '@mui/icons-material';
// // import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import dayjs from 'dayjs';
// // import { VITE_API_BASE_URL } from '../../utils/State';

// // // --- Main Component ---
// // export default function ServiceReport() {
// //   const theme = useTheme();
// //   const [form, setForm] = useState({
// //     ticketId: '',
// //     partsUsed: '',
// //     address: '',
// //     additionalCharges: '',
// //     description: '',
// //   });
// //   const [date, setDate] = useState(dayjs());
// //   const [receipt, setReceipt] = useState(null);
  
// //   const [ticketOptions, setTicketOptions] = useState([]);
// //   const [partsOptions, setPartsOptions] = useState([]);
// //   const [recentReports, setRecentReports] = useState([]); // State for the reports table
  
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isLoadingData, setIsLoadingData] = useState(true);
// //   const [error, setError] = useState(null);

// //   const token = localStorage.getItem("authKey");
// //   const axiosConfig = useMemo(() => {
// //     return {
// //       headers: { Authorization: `Bearer ${token}` },
// //     };
// //   }, [token]);

// //   const fetchInitialData = useCallback(async () => {
// //     try {
// //         const [ticketsRes, productsRes] = await Promise.all([
// //             axios.get(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, axiosConfig),
// //             axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
// //         ]);

// //         if (Array.isArray(ticketsRes.data)) {
// //             setTicketOptions(ticketsRes.data.map(t => ({ value: t.ticketId, label: `#${t.ticketId}` })));
// //         }
        
// //         if (Array.isArray(productsRes.data)) {
// //             setPartsOptions(productsRes.data.map(p => ({ value: p.name, label: p.name })));
// //         }
// //     } catch (err) {
// //         console.error("Error fetching dropdown data:", err);
// //         setError(err.message);
// //     }
// //   }, [axiosConfig]);

// //   const fetchRecentReports = useCallback(async () => {
// //     try {
// //       const response = await axios.get(`${VITE_API_BASE_URL}/reports/engineer`, axiosConfig);
// //       if (response.data && Array.isArray(response.data.data)) {
// //         setRecentReports(response.data.data);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching recent reports:", err);
// //       setError(err.message);
// //     }
// //   }, [axiosConfig]);

// //   useEffect(() => {
// //     const loadAllData = async () => {
// //       setIsLoadingData(true);
// //       await Promise.all([fetchInitialData(), fetchRecentReports()]);
// //       setIsLoadingData(false);
// //     };
// //     loadAllData();
// //   }, [fetchInitialData, fetchRecentReports]);


// //   const handleChange = (field) => (e) => {
// //     setForm({ ...form, [field]: e.target.value });
// //   };

// //   const handleFileChange = (e) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setReceipt(e.target.files[0]);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!form.ticketId || !receipt) {
// //       alert("Please select a ticket ID and upload a receipt.");
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     setError(null);
    
// //     const formData = new FormData();
// //     formData.append('receipt', receipt);
// //     formData.append('ticketId', form.ticketId);
// //     formData.append('partsUsed', form.partsUsed);
// //     formData.append('additionalCharges', form.additionalCharges);
// //     formData.append('description', form.description);

// //     try {
// //       await axios.post(`${VITE_API_BASE_URL}/reports/create`, formData, {
// //         headers: {
// //             ...axiosConfig.headers,
// //             'Content-Type': 'multipart/form-data',
// //         },
// //       });

// //       alert('Service report submitted successfully!');
      
// //       // Reset form and refresh the reports table
// //       setForm({ ticketId: '', partsUsed: '', address: '', additionalCharges: '', description: '' });
// //       setReceipt(null);
// //       document.getElementById('upload-receipt').value = '';
// //       fetchRecentReports(); // <-- Refresh the table data

// //     } catch (err) {
// //       console.error("Submission failed:", err);
// //       const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
// //       setError(errorMessage);
// //       alert(`Error: ${errorMessage}`);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDayjs}>
// //       <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: '100vh' }}>
// //         <Typography variant="h6" fontWeight="bold" mb={1}>
// //           Service Report
// //         </Typography>
// //         <Typography variant="body2" color="text.secondary" mb={3}>
// //           Create and submit a new service report for a ticket.
// //         </Typography>
// //         <Box display="flex" gap={3} mb={6}>
// //           {/* Left Form */}
// //           <Card sx={{ flex: 2, background: theme.palette.background.paper, borderRadius: 2 }}>
// //             <CardContent>
// //               <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
// //                 <TextField
// //                   select
// //                   label="Ticket id"
// //                   value={form.ticketId}
// //                   onChange={handleChange('ticketId')}
// //                   fullWidth
// //                   size="small"
// //                   sx={{ gridColumn: '1/2' }}
// //                   disabled={isLoadingData}
// //                   required
// //                 >
// //                   {isLoadingData ? <MenuItem disabled>Loading...</MenuItem> :
// //                    ticketOptions.map((opt) => (
// //                     <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
// //                   ))}
// //                 </TextField>
// //                 <TextField
// //                   select
// //                   label="Parts used"
// //                   value={form.partsUsed}
// //                   onChange={handleChange('partsUsed')}
// //                   fullWidth
// //                   size="small"
// //                   sx={{ gridColumn: '2/3' }}
// //                   disabled={isLoadingData}
// //                 >
// //                    {isLoadingData ? <MenuItem disabled>Loading...</MenuItem> :
// //                     partsOptions.map((opt) => (
// //                     <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
// //                   ))}
// //                 </TextField>
// //                 <TextField
// //                   label="Address"
// //                   value={form.address}
// //                   onChange={handleChange('address')}
// //                   fullWidth
// //                   size="small"
// //                   sx={{ gridColumn: '1/3' }}
// //                 />
// //                 <TextField
// //                   label="Additional charges"
// //                   value={form.additionalCharges}
// //                   onChange={handleChange('additionalCharges')}
// //                   type="number"
// //                   fullWidth
// //                   size="small"
// //                   sx={{ gridColumn: '1/3' }}
// //                 />
// //                 <TextField
// //                   label="Description"
// //                   value={form.description}
// //                   onChange={handleChange('description')}
// //                   fullWidth
// //                   multiline
// //                   rows={2}
// //                   size="small"
// //                   sx={{ gridColumn: '1/3' }}
// //                 />
// //               </Box>
// //             </CardContent>
// //           </Card>
// //           {/* Right Upload & Submit */}
// //           <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
// //             <Card sx={{ width: '100%', background: theme.palette.background.paper, borderRadius: 2, mb: 2 }}>
// //               <CardContent sx={{ textAlign: 'center' }}>
// //                 <input
// //                   accept="image/*,application/pdf"
// //                   style={{ display: 'none' }}
// //                   id="upload-receipt"
// //                   type="file"
// //                   onChange={handleFileChange}
// //                 />
// //                 <label htmlFor="upload-receipt">
// //                   <Button
// //                     component="span"
// //                     startIcon={<CloudUpload />}
// //                     sx={{ border: '1px dashed', borderRadius: 2, py: 2, px: 4 }}
// //                   >
// //                     Upload Receipt
// //                   </Button>
// //                 </label>
// //                 <Typography variant="caption" color="text.secondary" mt={1} display="block" noWrap>
// //                   {receipt ? receipt.name : 'No file selected'}
// //                 </Typography>
// //               </CardContent>
// //             </Card>
// //             <Button
// //               type="submit"
// //               variant="contained"
// //               sx={{ width: '100%', py: 1.5, borderRadius: 3, fontWeight: 700 }}
// //               onClick={handleSubmit}
// //               disabled={isSubmitting || isLoadingData}
// //             >
// //               {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
// //             </Button>
// //           </Box>
// //         </Box>
        
// //         {/* Recent Services Table */}
// //         <Card sx={{ background: theme.palette.background.paper, borderRadius: 2, mt: 2 }}>
// //           <CardContent>
// //             <Typography variant="h6" fontWeight="bold" mb={2}>
// //               Recent Reports
// //             </Typography>
// //             <Divider sx={{ mb: 2 }} />
// //             <Box display="flex" justifyContent="flex-end" mb={1}>
// //               <DatePicker
// //                 value={date}
// //                 onChange={(newDate) => setDate(newDate)}
// //                 slotProps={{ textField: { size: 'small' } }}
// //               />
// //             </Box>
// //             <Box sx={{ overflowX: 'auto' }}>
// //               <Box sx={{ minWidth: '900px' }}>
// //                 <Box display="flex" fontWeight={600} p={1} sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${theme.palette.divider}` }}>
// //                   <Box sx={{ flexBasis: '10%' }}>Ticket ID</Box>
// //                   <Box sx={{ flexBasis: '20%' }}>Date</Box>
// //                   <Box sx={{ flexBasis: '15%' }}>Engineer</Box>
// //                   <Box sx={{ flexBasis: '15%' }}>Parts Used</Box>
// //                   <Box sx={{ flexBasis: '15%' }}>Charges</Box>
// //                   <Box sx={{ flexBasis: '15%' }}>Description</Box>
// //                   <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>Receipt</Box>
// //                 </Box>
// //                 {isLoadingData ? (
// //                   Array.from(new Array(5)).map((_, idx) => (
// //                       <Skeleton key={idx} height={48} animation="wave" sx={{ my: 0.5 }} />
// //                   ))
// //                 ) : (
// //                   recentReports.map((report) => (
// //                     <Box
// //                       key={report.reportId}
// //                       display="flex"
// //                       alignItems="center"
// //                       p={1}
// //                       sx={{ borderBottom: `1px solid ${theme.palette.divider}`, '&:hover': { backgroundColor: 'action.hover' } }}
// //                     >
// //                       <Box sx={{ flexBasis: '10%', fontWeight: 600 }}>#{report.ticketId}</Box>
// //                       <Box sx={{ flexBasis: '20%', color: theme.palette.text.secondary }}>{dayjs(report.createdAt).format('DD MMM YYYY, h:mm A')}</Box>
// //                       <Box sx={{ flexBasis: '15%' }}>{report.engineerName}</Box>
// //                       <Box sx={{ flexBasis: '15%' }}>{report.partsUsed || 'N/A'}</Box>
// //                       <Box sx={{ flexBasis: '15%' }}>
// //   ₹{(report?.additionalCharges ?? 0).toFixed(2)}
// // </Box>

// //                       <Box sx={{ flexBasis: '15%' }}>{report.description}</Box>
// //                       <Box sx={{ flexBasis: '10%', textAlign: 'center' }}>
// //                         {report.receiptURL ? (
// //                           <IconButton component="a" href={report.receiptURL} target="_blank" rel="noopener noreferrer" size="small">
// //                             <ArrowDownward fontSize="small" />
// //                           </IconButton>
// //                         ) : 'N/A' }
// //                       </Box>
// //                     </Box>
// //                   ))
// //                 )}
// //               </Box>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       </Box>
// //     </LocalizationProvider>
// //   );
// // }

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import axios from "axios";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Stepper,
//   Step,
//   StepLabel,
//   IconButton,
//   Divider,
//   CircularProgress,
//   Chip,
//   useTheme,
//   Skeleton,
// } from "@mui/material";
// import { CloudUpload, ArrowDownward } from "@mui/icons-material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { VITE_API_BASE_URL } from "../../utils/State";

// export default function ServiceReport() {
//   const theme = useTheme();
//   const [form, setForm] = useState({
//     ticketId: "",
//     partsUsed: "",
//     description: "",
//     additionalCharges: "",
//     missingPart: "",
//   });
//   const [date, setDate] = useState(dayjs());
//   const [photo, setPhoto] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [error, setError] = useState(null);

//   const [ticketOptions, setTicketOptions] = useState([]);
//   const [partsOptions, setPartsOptions] = useState([]);
//   const [recentReports, setRecentReports] = useState([]);

//   const [activeStep, setActiveStep] = useState(0);
//   const steps = [
//     "ASSIGNED",
//     "EN_ROUTE",
//     "ON_SITE",
//     "NEED_PART",
//     "PART_COLLECTED",
//     "FIXED",
//     "COMPLETED",
//   ];

//   const token = localStorage.getItem("authKey");
//   const axiosConfig = useMemo(() => ({
//     headers: { Authorization: `Bearer ${token}` },
//   }), [token]);

//   const fetchInitialData = useCallback(async () => {
//     try {
//       const [ticketsRes, productsRes] = await Promise.all([
//         axios.get(`${VITE_API_BASE_URL}/tickets/get-services-by-user`, axiosConfig),
//         axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
//       ]);
//       setTicketOptions(ticketsRes.data.map(t => ({ value: t.ticketId, label: `#${t.ticketId}` })));
//       setPartsOptions(productsRes.data.map(p => ({ value: p.name, label: p.name })));
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     }
//   }, [axiosConfig]);

//   const fetchRecentReports = useCallback(async () => {
//     try {
//       const res = await axios.get(`${VITE_API_BASE_URL}/reports/engineer`, axiosConfig);
//       if (res.data?.data) setRecentReports(res.data.data);
//     } catch (err) {
//       console.error("Error fetching recent reports:", err);
//     }
//   }, [axiosConfig]);

//   useEffect(() => {
//     const load = async () => {
//       setIsLoadingData(true);
//       await Promise.all([fetchInitialData(), fetchRecentReports()]);
//       setIsLoadingData(false);
//     };
//     load();
//   }, [fetchInitialData, fetchRecentReports]);

//   const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setPhoto(e.target.files[0]);
//     }
//   };

//   const handleStageAction = async (nextStatus) => {
//     if (!form.ticketId) {
//       alert("Please select a Ticket ID first.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       if (photo) formData.append("photo", photo);
//       formData.append("ticketId", form.ticketId);
//       formData.append("status", nextStatus);
//       formData.append("partsUsed", form.partsUsed || "");
//       formData.append("missingPart", form.missingPart || "");
//       formData.append("additionalCharges", form.additionalCharges || "");
//       formData.append("description", form.description || "");

//       await axios.post(`${VITE_API_BASE_URL}/tickets/update-status`, formData, {
//         headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" },
//       });

//       alert(`Ticket moved to ${nextStatus}`);
//       setActiveStep(steps.indexOf(nextStatus));
//       fetchRecentReports();
//       setPhoto(null);
//       document.getElementById("upload-photo").value = "";
//     } catch (err) {
//       console.error("Error updating stage:", err);
//       alert(err.response?.data?.message || err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderStageFields = () => {
//     const current = steps[activeStep];
//     switch (current) {
//       case "ASSIGNED":
//         return (
//           <Button
//             variant="contained"
//             onClick={() => handleStageAction("EN_ROUTE")}
//             disabled={isSubmitting}
//           >
//             Start Visit
//           </Button>
//         );
//       case "EN_ROUTE":
//         return (
//           <Box display="flex" flexDirection="column" gap={2}>
//             <Typography>Upload Start KM Photo</Typography>
//             <input id="upload-photo" type="file" accept="image/*" onChange={handleFileChange} />
//             <Button
//               variant="contained"
//               onClick={() => handleStageAction("ON_SITE")}
//               disabled={isSubmitting || !photo}
//             >
//               Mark Arrived On-Site
//             </Button>
//           </Box>
//         );
//       case "ON_SITE":
//         return (
//           <Box display="flex" flexDirection="column" gap={2}>
//             <TextField
//               select
//               label="Parts Used"
//               value={form.partsUsed}
//               onChange={handleChange("partsUsed")}
//               size="small"
//             >
//               {partsOptions.map((p) => (
//                 <MenuItem key={p.value} value={p.value}>
//                   {p.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               label="Additional Charges"
//               type="number"
//               value={form.additionalCharges}
//               onChange={handleChange("additionalCharges")}
//               size="small"
//             />
//             <TextField
//               label="Description"
//               multiline
//               rows={2}
//               value={form.description}
//               onChange={handleChange("description")}
//               size="small"
//             />
//             <Box display="flex" gap={2}>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => handleStageAction("FIXED")}
//                 disabled={isSubmitting}
//               >
//                 Fixed & Complete
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => handleStageAction("NEED_PART")}
//               >
//                 Need Part
//               </Button>
//             </Box>
//           </Box>
//         );
//       case "NEED_PART":
//         return (
//           <Box display="flex" flexDirection="column" gap={2}>
//             <TextField
//               label="Missing Part"
//               value={form.missingPart}
//               onChange={handleChange("missingPart")}
//               size="small"
//             />
//             <Button
//               variant="contained"
//               color="info"
//               onClick={() => handleStageAction("PART_COLLECTED")}
//               disabled={isSubmitting}
//             >
//               Mark Part Collected
//             </Button>
//           </Box>
//         );
//       case "PART_COLLECTED":
//         return (
//           <Box display="flex" flexDirection="column" gap={2}>
//             <TextField
//               select
//               label="Parts Used"
//               value={form.partsUsed}
//               onChange={handleChange("partsUsed")}
//               size="small"
//             >
//               {partsOptions.map((p) => (
//                 <MenuItem key={p.value} value={p.value}>
//                   {p.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => handleStageAction("FIXED")}
//             >
//               Mark Fixed
//             </Button>
//           </Box>
//         );
//       case "FIXED":
//         return (
//           <Box display="flex" flexDirection="column" gap={2}>
//             <Typography>Upload End KM Photo</Typography>
//             <input id="upload-photo" type="file" accept="image/*" onChange={handleFileChange} />
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => handleStageAction("COMPLETED")}
//               disabled={isSubmitting || !photo}
//             >
//               Complete Ticket
//             </Button>
//           </Box>
//         );
//       default:
//         return <Typography color="success.main">Ticket Completed ✅</Typography>;
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: "100vh" }}>
//         <Typography variant="h6" fontWeight="bold" mb={1}>
//           Service Visit Workflow
//         </Typography>
//         <Typography variant="body2" color="text.secondary" mb={3}>
//           Manage and update service visit stages in real time.
//         </Typography>

//         {/* Stepper Section */}
//         <Card sx={{ p: 3, mb: 4 }}>
//           <Stepper activeStep={activeStep} alternativeLabel>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//           <Divider sx={{ my: 2 }} />

//           <Box display="grid" gap={2}>
//             <TextField
//               select
//               label="Select Ticket"
//               value={form.ticketId}
//               onChange={handleChange("ticketId")}
//               fullWidth
//               size="small"
//             >
//               {ticketOptions.map((t) => (
//                 <MenuItem key={t.value} value={t.value}>
//                   {t.label}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {renderStageFields()}
//           </Box>
//         </Card>

//         {/* Recent Reports Table */}
//         <Card sx={{ borderRadius: 2, background: theme.palette.background.paper }}>
//           <CardContent>
//             <Typography variant="h6" mb={2}>
//               Recent Reports
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             <Box sx={{ overflowX: "auto" }}>
//               {isLoadingData ? (
//                 Array.from(new Array(5)).map((_, idx) => (
//                   <Skeleton key={idx} height={48} animation="wave" sx={{ my: 0.5 }} />
//                 ))
//               ) : (
//                 <Box minWidth="900px">
//                   {recentReports.map((r) => (
//                     <Box
//                       key={r.reportId}
//                       display="flex"
//                       alignItems="center"
//                       p={1}
//                       sx={{
//                         borderBottom: `1px solid ${theme.palette.divider}`,
//                         "&:hover": { backgroundColor: "action.hover" },
//                       }}
//                     >
//                       <Box flex={1}>#{r.ticketId}</Box>
//                       <Box flex={2}>{dayjs(r.createdAt).format("DD MMM YYYY, h:mm A")}</Box>
//                       <Box flex={1}>{r.engineerName}</Box>
//                       <Box flex={2}>{r.partsUsed || "N/A"}</Box>
//                       <Box flex={1}>₹{(r.additionalCharges ?? 0).toFixed(2)}</Box>
//                       <Box flex={3}>{r.description}</Box>
//                       <Box flex={1} textAlign="center">
//                         {r.receiptURL ? (
//                           <IconButton
//                             component="a"
//                             href={r.receiptURL}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <ArrowDownward fontSize="small" />
//                           </IconButton>
//                         ) : (
//                           "N/A"
//                         )}
//                       </Box>
//                     </Box>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     </LocalizationProvider>
//   );
// }

// ServiceReport.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  useTheme,
  Skeleton,
} from "@mui/material";
import { CloudUpload, ArrowDownward } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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

  const steps = [
    "ASSIGNED",
    "EN_ROUTE",
    "ON_SITE",
    "NEED_PART",
    "PART_COLLECTED",
    "FIXED",
    "COMPLETED",
  ];

  const token = localStorage.getItem("authKey");
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: token ? `Bearer ${token}` : "" } }),
    [token]
  );

  // Form state for inputs that persist across steps
  const [form, setForm] = useState({
    ticketId: "",
    startKm: "",
    endKm: "",
    partCollectedKm: "",
    partsUsed: "",
    missingPart: "",
    remarks: "",
    additionalCharges: "",
  });

  // file states (separate inputs to avoid collision)
  const [startKmPhoto, setStartKmPhoto] = useState(null);
  const [endKmPhoto, setEndKmPhoto] = useState(null);
  const [partCollectedPhoto, setPartCollectedPhoto] = useState(null);

  const [ticketOptions, setTicketOptions] = useState([]);
  const [partsOptions, setPartsOptions] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [activeStep, setActiveStep] = useState(0);

  // --- Fetch initial data: tickets, products, my visits ---
  const fetchInitialData = useCallback(async () => {
    try {
      const [ticketsRes, productsRes, myVisitsRes] = await Promise.all([
        axios.get(`${VITE_API_BASE_URL}/tickets/get-by-user`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/products/all`, axiosConfig),
        axios.get(`${VITE_API_BASE_URL}/service-visits/my-visits`, axiosConfig),
      ]);

      // Map tickets for selector. ticketsRes expected to be array of ticket objects.
      const ticketsList = (ticketsRes?.data || []).map((t) => ({
        value: t.ticketId,
        label: `#${t.ticketId} — ${t.title ?? t.issue ?? ""}`,
        raw: t,
      }));
      setTicketOptions(ticketsList);

      // products -> parts options
      const partsList = (productsRes?.data || []).map((p) => ({
        value: p.name,
        label: p.name,
      }));
      setPartsOptions(partsList);

      setRecentVisits(myVisitsRes?.data?.data || myVisitsRes?.data || []);
    } catch (err) {
      console.error("fetchInitialData error:", err);
      setError(err?.response?.data?.message || err.message);
    }
  }, [axiosConfig]);

  useEffect(() => {
    const load = async () => {
      setIsLoadingData(true);
      await fetchInitialData();
      setIsLoadingData(false);
    };
    load();
  }, [fetchInitialData]);

  // When ticket changes, fetch its visit history and set active step from ticket.serviceStatus if provided
  useEffect(() => {
    if (!form.ticketId) {
      setVisitHistory([]);
      setActiveStep(0);
      return;
    }
    const fetchHistory = async () => {
      setIsLoadingData(true);
      try {
        const res = await axios.get(
          `${VITE_API_BASE_URL}/service-visits/ticket/${form.ticketId}`,
          axiosConfig
        );
        const visits = res?.data?.data || res?.data || [];
        setVisitHistory(visits);

        // Determine current step from latest ticket/service status if available (try to infer)
        // find ticket in ticketOptions raw
        const ticketRaw = ticketOptions.find((t) => t.value === form.ticketId)?.raw;
        const statusFromTicket =
          ticketRaw?.serviceStatus || (visits.length ? visits[visits.length - 1].visitStatus : null);

        if (statusFromTicket) {
          const idx = steps.indexOf(statusFromTicket);
          setActiveStep(idx >= 0 ? idx : 0);
        } else {
          setActiveStep(0);
        }
      } catch (err) {
        console.error("Error fetching visit history:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.ticketId]);

  // Generic change handler
  const handleChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // File handlers
  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  // Helper to update ticket status via specific endpoints
  const callEndpoint = async (endpoint, data, isMultipart = true) => {
    setIsSubmitting(true);
    try {
      if (isMultipart) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            fd.append(k, v);
          }
        });
        const res = await axios.post(`${VITE_API_BASE_URL}${endpoint}`, fd, {
          headers: { ...axiosConfig.headers, "Content-Type": "multipart/form-data" },
        });
        return res;
      } else {
        const res = await axios.post(`${VITE_API_BASE_URL}${endpoint}`, data, axiosConfig);
        return res;
      }
    } catch (err) {
      console.error(`API ${endpoint} error:`, err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step actions (use the endpoints from your workflow)
  const startVisit = async () => {
    if (!form.ticketId) return alert("Select a ticket first.");
    if (!form.startKm) return alert("Enter start KM.");
    if (!startKmPhoto) return alert("Upload start KM photo.");

    try {
      await callEndpoint("/tickets/start", {
        ticketId: form.ticketId,
        startKm: form.startKm,
        startKmPhoto,
      });

      alert("Visit started — EN_ROUTE");
      setActiveStep(steps.indexOf("EN_ROUTE"));
      // refresh visit history and my visits
      await fetchInitialData();
      const hist = await axios.get(
        `${VITE_API_BASE_URL}/service-visits/ticket/${form.ticketId}`,
        axiosConfig
      );
      setVisitHistory(hist?.data?.data || hist?.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const markArrival = async () => {
    if (!form.ticketId) return alert("Select a ticket first.");
    try {
      await callEndpoint("/tickets/arrive", {
        ticketId: form.ticketId,
      }, false);
      alert("Arrival marked — ON_SITE");
      setActiveStep(steps.indexOf("ON_SITE"));
      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const needPart = async () => {
    if (!form.ticketId) return alert("Select ticket.");
    if (!form.missingPart) return alert("Provide missing part.");
    try {
      await callEndpoint("/tickets/need-part", {
        ticketId: form.ticketId,
        missingPart: form.missingPart,
        remarks: form.remarks || "",
      }, false);
      alert("Marked NEED_PART");
      setActiveStep(steps.indexOf("NEED_PART"));
      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const partCollected = async () => {
    if (!form.ticketId) return alert("Select ticket.");
    if (!form.partCollectedKm) return alert("Enter part collected KM.");
    if (!partCollectedPhoto) return alert("Upload part collected photo.");
    try {
      await callEndpoint("/tickets/part-collected", {
        ticketId: form.ticketId,
        partCollectedKm: form.partCollectedKm,
        partCollectedPhoto,
      });
      alert("Part collected — PART_COLLECTED");
      setActiveStep(steps.indexOf("PART_COLLECTED"));
      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const startNextDayVisit = async () => {
    if (!form.ticketId) return alert("Select ticket.");
    if (!form.startKm) return alert("Enter start KM for next day.");
    if (!startKmPhoto) return alert("Upload start KM photo for next day.");

    try {
      await callEndpoint("/tickets/start-next-day", {
        ticketId: form.ticketId,
        startKm: form.startKm,
        startKmPhoto,
        previousVisitId: visitHistory.length ? visitHistory[visitHistory.length - 1].visitId : undefined,
      });
      alert("Next-day visit started — EN_ROUTE");
      setActiveStep(steps.indexOf("EN_ROUTE"));
      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const fixed = async ({ directlyComplete = false } = {}) => {
    if (!form.ticketId) return alert("Select ticket.");
    if (!form.endKm) return alert("Enter end KM.");
    if (!endKmPhoto) return alert("Upload end KM photo.");

    try {
      await callEndpoint("/tickets/fixed", {
        ticketId: form.ticketId,
        endKm: form.endKm,
        endKmPhoto,
        partsUsed: form.partsUsed || "",
        directlyComplete,
      });

      if (directlyComplete) {
        setActiveStep(steps.indexOf("COMPLETED"));
        alert("Fixed and Completed");
      } else {
        setActiveStep(steps.indexOf("FIXED"));
        alert("Marked FIXED (you may still complete the ticket).");
      }

      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const complete = async () => {
    if (!form.ticketId) return alert("Select ticket.");
    try {
      await callEndpoint("/tickets/complete", {
        ticketId: form.ticketId,
        remarks: form.remarks || "",
      }, false);
      setActiveStep(steps.indexOf("COMPLETED"));
      alert("Ticket completed ✅");
      await fetchInitialData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  // Helper to clear file inputs programmatically
  const clearFileInput = (id, setter) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
    setter(null);
  };

  // Render fields per step (reflects specified workflow)
  const renderStageFields = () => {
    const current = steps[activeStep];

    switch (current) {
      case "ASSIGNED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Start the visit and log starting odometer.</Typography>
            <TextField
              label="Start KM"
              value={form.startKm}
              onChange={handleChange("startKm")}
              size="small"
              type="number"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Start KM Photo
              </Typography>
              <input id="start-km-photo" type="file" accept="image/*" onChange={handleFileChange(setStartKmPhoto)} />
            </Box>
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={startVisit} disabled={isSubmitting}>
                Start Visit (EN_ROUTE)
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // allow starting next day immediately (rare), maps to same startVisit endpoint normally
                  startNextDayVisit();
                }}
                disabled={isSubmitting}
              >
                Start Next Day Visit
              </Button>
            </Box>
          </Box>
        );

      case "EN_ROUTE":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>You're en route — mark arrival when on-site.</Typography>
            <Button variant="contained" onClick={markArrival} disabled={isSubmitting}>
              Mark Arrival (ON_SITE)
            </Button>
          </Box>
        );

      case "ON_SITE":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Diagnose and choose next action.</Typography>

            <TextField
              select
              label="Parts Used"
              value={form.partsUsed}
              onChange={handleChange("partsUsed")}
              size="small"
            >
              <MenuItem value="">— none —</MenuItem>
              {partsOptions.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Additional Charges"
              type="number"
              value={form.additionalCharges}
              onChange={handleChange("additionalCharges")}
              size="small"
            />

            <TextField
              label="Remarks / Description"
              multiline
              rows={3}
              value={form.remarks}
              onChange={handleChange("remarks")}
              size="small"
            />

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => fixed({ directlyComplete: true })}
                disabled={isSubmitting}
                title="Fix and mark complete in one go"
              >
                Fixed & Complete (direct)
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  // go to FIXED but upload endKM and photo
                  // we need endKm + endKmPhoto — show a small inline UI
                  const proceed = window.confirm(
                    "You will be asked to upload end KM and end KM photo in the next modal/section below. Continue?"
                  );
                  if (proceed) {
                    // quickly move to FIXED so the UI shows that section where user can upload endKmPhoto
                    setActiveStep(steps.indexOf("FIXED"));
                  }
                }}
              >
                Fixed (upload end KM)
              </Button>

              <Button variant="outlined" color="warning" onClick={() => setActiveStep(steps.indexOf("NEED_PART"))}>
                Need Part
              </Button>
            </Box>
          </Box>
        );

      case "NEED_PART":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Record missing part details.</Typography>
            <TextField
              label="Missing Part"
              value={form.missingPart}
              onChange={handleChange("missingPart")}
              size="small"
            />
            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={handleChange("remarks")}
              size="small"
            />
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={needPart} disabled={isSubmitting}>
                Save NEED_PART
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // If part not available today — end visit (we interpret as leave visit as inactive)
                  const confirmEnd = window.confirm(
                    "Mark this visit ended for today (part unavailable)? This will set active=false for this visit."
                  );
                  if (confirmEnd) {
                    // Some APIs may require a specific endpoint to end visit; using need-part with a flag:
                    callEndpoint("/tickets/need-part", {
                      ticketId: form.ticketId,
                      missingPart: form.missingPart,
                      remarks: form.remarks || "",
                      partUnavailableToday: true,
                    }, false).then(() => {
                      alert("Visit ended for today; Ticket remains NEED_PART");
                      setActiveStep(steps.indexOf("NEED_PART"));
                    }).catch(err => alert(err?.response?.data?.message || err.message));
                  }
                }}
              >
                End Visit Today (part unavailable)
              </Button>
            </Box>
          </Box>
        );

      case "PART_COLLECTED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Collect part from store/office.</Typography>
            <TextField
              label="Part Collected KM"
              type="number"
              value={form.partCollectedKm}
              onChange={handleChange("partCollectedKm")}
              size="small"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Part Collected Photo
              </Typography>
              <input id="part-collected-photo" type="file" accept="image/*" onChange={handleFileChange(setPartCollectedPhoto)} />
            </Box>
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={partCollected} disabled={isSubmitting}>
                Mark Part Collected
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // After collecting part, typically go back to site and fix — we move to ON_SITE to re-fix
                  setActiveStep(steps.indexOf("ON_SITE"));
                }}
              >
                Return to Site
              </Button>
            </Box>
          </Box>
        );

      case "FIXED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Upload end KM + photo to close the visit or mark fixed.</Typography>
            <TextField
              label="End KM"
              type="number"
              value={form.endKm}
              onChange={handleChange("endKm")}
              size="small"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                End KM Photo
              </Typography>
              <input id="end-km-photo" type="file" accept="image/*" onChange={handleFileChange(setEndKmPhoto)} />
            </Box>

            <TextField
              select
              label="Parts Used"
              value={form.partsUsed}
              onChange={handleChange("partsUsed")}
              size="small"
            >
              <MenuItem value="">— none —</MenuItem>
              {partsOptions.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => fixed({ directlyComplete: true })}
                disabled={isSubmitting}
              >
                Fixed & Complete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => fixed({ directlyComplete: false })}
                disabled={isSubmitting}
              >
                Mark Fixed (stay open)
              </Button>
            </Box>
          </Box>
        );

      case "COMPLETED":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography color="success.main">Ticket Completed ✅</Typography>
            <TextField
              label="Final Remarks"
              multiline
              rows={3}
              value={form.remarks}
              onChange={handleChange("remarks")}
              size="small"
            />
            <Button variant="contained" onClick={complete} disabled={isSubmitting}>
              Confirm Complete
            </Button>
          </Box>
        );

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, background: theme.palette.background.default, minHeight: "100vh" }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Service Visit Workflow
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Follow the engineer workflow: start → arrive → diagnose → collect part → fix → complete.
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

          <Box display="grid" gap={2}>

            <TextField
              select
              label="Select Ticket"
              value={form.ticketId}
              onChange={(e) => {
                handleChange("ticketId")(e);
                // clear some fields when ticket changes
                setStartKmPhoto(null);
                setEndKmPhoto(null);
                setPartCollectedPhoto(null);
                clearFileInput("start-km-photo", setStartKmPhoto);
                clearFileInput("end-km-photo", setEndKmPhoto);
                clearFileInput("part-collected-photo", setPartCollectedPhoto);
              }}
              fullWidth
              size="small"
            >
              <MenuItem value="">— Select —</MenuItem>
              {ticketOptions.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Render the UI fields for the active stage */}
            <Card variant="outlined" sx={{ p: 2 }}>
              {isLoadingData ? (
                <Box>
                  <Skeleton height={24} width="40%" />
                  <Skeleton height={24} width="70%" />
                </Box>
              ) : (
                renderStageFields()
              )}
            </Card>

            {/* Quick controls */}
            <Box display="flex" gap={2} alignItems="center">
              <Button
                onClick={() => {
                  // move to previous step if possible
                  if (activeStep > 0) setActiveStep((s) => s - 1);
                }}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
                }}
              >
                Forward
              </Button>

              <Box sx={{ ml: "auto" }}>
                {isSubmitting ? (
                  <Chip label="Submitting..." icon={<CircularProgress size={14} />} />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Visit History / Recent Reports */}
        <Card sx={{ borderRadius: 2, background: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Visit History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ overflowX: "auto" }}>
              {isLoadingData ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <Skeleton key={idx} height={48} animation="wave" sx={{ my: 0.5 }} />
                ))
              ) : (
                <Box minWidth="900px">
                  {visitHistory.length === 0 ? (
                    <Typography color="text.secondary">No visit history for this ticket.</Typography>
                  ) : (
                    visitHistory.map((v) => (
                      <Box
                        key={v.visitId || `${v.createdAt}-${v.visitStatus}`}
                        display="flex"
                        alignItems="center"
                        p={1}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <Box flex={1}>Visit #{v.visitId ?? "-"}</Box>
                        <Box flex={2}>{dayjs(v.startedAt || v.createdAt).format("DD MMM YYYY, h:mm A")}</Box>
                        <Box flex={1}>{v.visitStatus}</Box>
                        <Box flex={2}>{v.startKm ? `${v.startKm} km` : "-"}</Box>
                        <Box flex={2}>{v.endKm ? `${v.endKm} km` : "-"}</Box>
                        <Box flex={3}>{v.remarks || v.description || "-"}</Box>
                        <Box flex={1} textAlign="center">
                          {v.startKmPhotoURL || v.endKmPhotoURL ? (
                            <IconButton
                              component="a"
                              href={v.endKmPhotoURL || v.startKmPhotoURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ArrowDownward fontSize="small" />
                            </IconButton>
                          ) : (
                            "—"
                          )}
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
