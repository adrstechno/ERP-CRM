// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Button,
//   InputLabel,
//   MenuItem,
//   Select,
//   FormControl,
//   useTheme,
// } from "@mui/material";

// export default function DealerNotice() {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   const cardStyle = {
//     borderRadius: 2,
//     boxShadow: theme.shadows[3],
//     background: isDark
//       ? "linear-gradient(135deg, #3A414B 0%, #20262E 100%)"
//       : "linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)",
//     color: isDark ? "white" : "black",
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: isDark ? "#23242a" : "#F5F6FA",
//         color: isDark ? "white" : "black",
//         display: "flex",
//         flexDirection: "row",
//         gap: 3,
//         p: 3,
//       }}
//     >
//       {/* Notification Sidebar */}
//       <Box
//         sx={{
//           width: 260,
//           minWidth: 200,
//           maxWidth: 300,
//           background: "transparent",
//         }}
//       >
//         <Card sx={{ ...cardStyle, height: "100%" }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Notifications
//             </Typography>
//             <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
//             <List dense sx={{ p: 0 }}>
//               <ListItem selected sx={{ borderRadius: 1 }}>
//                 <ListItemText
//                   primary="GO OLD TOWN"
//                   secondary="7:00PM, 9/09"
//                   primaryTypographyProps={{ sx: { color: "#fff" } }}
//                   secondaryTypographyProps={{ sx: { color: "#aaa" } }}
//                 />
//               </ListItem>
//               <Divider sx={{ bgcolor: "#333" }} />
//               <ListItem>
//                 <ListItemText
//                   primary="TASK1"
//                   secondary="7:00PM, 9/09"
//                   primaryTypographyProps={{ sx: { color: "#fff" } }}
//                   secondaryTypographyProps={{ sx: { color: "#aaa" } }}
//                 />
//               </ListItem>
//               <Divider sx={{ bgcolor: "#333" }} />
//               <ListItem>
//                 <ListItemText
//                   primary="TASK2"
//                   secondary="11:00AM"
//                   primaryTypographyProps={{ sx: { color: "#fff" } }}
//                   secondaryTypographyProps={{ sx: { color: "#aaa" } }}
//                 />
//               </ListItem>
//             </List>
//           </CardContent>
//         </Card>
//       </Box>

//       {/* Main Notice Content */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "stretch",
//           justifyContent: "flex-start",
//         }}
//       >
//         <Card sx={{ ...cardStyle, height: "100%", display: "flex", flexDirection: "column", p: 0 }}>
//           <CardContent sx={{ flex: 1 }}>
//             <Typography
//               variant="h4"
//               sx={{ fontWeight: 700, letterSpacing: 2, mb: 2 }}
//             >
//               GO OLD TOWN
//             </Typography>
//             <Typography sx={{ mb: 2 }}>
//               YOU HAVE TO DELIVER TO OLD TOWN CLIENT <br />
//               <b>NAME:- LAL SINGH CHADHA</b> <br />
//               <b>MOBILE NO:- 9898989898</b> <br />
//               <b>ADDRESS:- WARD NO - 08, OLD TOWN</b>
//             </Typography>
//             <img
//               src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
//               alt="Old Town"
//               style={{
//                 width: "320px",
//                 borderRadius: 8,
//                 marginTop: 8,
//                 marginBottom: 8,
//                 display: "block",
//               }}
//             />

//             {/* Reply Form at the bottom right */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 mt: 4,
//               }}
//             >
//               <Card
//                 sx={{
//                   ...cardStyle,
//                   minWidth: 320,
//                   maxWidth: 350,
//                   boxShadow: "none",
//                   background: isDark ? "#23242a" : "#fff",
//                   color: isDark ? "#fff" : "#222",
//                   border: isDark ? "1px solid #333" : "1px solid #eee",
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                     Reply form
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     sx={{ color: "#aaa", mb: 2, display: "block" }}
//                   >
//                     Lorem ipsum dolor sit amet consectetur adipisicing.
//                   </Typography>
//                   <FormControl fullWidth sx={{ mb: 2 }}>
//                     <InputLabel sx={{ color: "#aaa" }}>Title</InputLabel>
//                     <Select
//                       label="Title"
//                       defaultValue=""
//                       sx={{
//                         color: isDark ? "#fff" : "#222",
//                         ".MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#444",
//                         },
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#7A3EF3",
//                         },
//                       }}
//                     >
//                       <MenuItem value="title">title</MenuItem>
//                     </Select>
//                   </FormControl>
//                   <TextField
//                     label="Message"
//                     multiline
//                     minRows={3}
//                     fullWidth
//                     sx={{
//                       mb: 2,
//                       "& .MuiOutlinedInput-root": {
//                         color: isDark ? "#fff" : "#222",
//                         "& fieldset": { borderColor: "#444" },
//                         "&:hover fieldset": { borderColor: "#7A3EF3" },
//                         "&.Mui-focused fieldset": { borderColor: "#7A3EF3" },
//                       },
//                       "& .MuiInputLabel-root": { color: "#aaa" },
//                     }}
//                   />
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       mt: 2,
//                       background: "#23242a",
//                       color: "#fff",
//                       border: "1px solid #7A3EF3",
//                       "&:hover": {
//                         background: "#7A3EF3",
//                         color: "#fff",
//                       },
//                     }}
//                   >
//                     Submit
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     </Box>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, Typography,
    List, ListItem, ListItemButton, ListItemText,
    Stack, Skeleton, InputLabel, Grid, Divider, FormControl, Select, MenuItem, TextField, Button, CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';

// --- API Simulation ---
const mockNotices = [
    { 
        id: 1, 
        title: 'GO OLD TOWN', 
        timestamp: '2025-09-26T19:00:00Z', 
        content: `YOU HAVE TO DELIVER TO OLD TOWN CLIENT.<br/>
                  <b>NAME:- LAL SINGH CHADHA</b><br/>
                  <b>MOBILE NO:- 9898989898</b><br/>
                  <b>ADDRESS:- WARD NO - 08, OLD TOWN</b>`,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    },
    { id: 2, title: 'TASK1', timestamp: '2025-09-26T19:00:00Z', content: 'Details for TASK1 will be shown here.' },
    { id: 3, title: 'TASK2', timestamp: '2025-09-26T11:00:00Z', content: 'Details for TASK2 will be shown here.' },
    { id: 4, title: 'New Stock Arrival', timestamp: '2025-09-25T15:30:00Z', content: 'New shipment of 1.5 Ton AC units has arrived. Please update your inventory.' },
];

// --- Main Component ---
export default function DealerNotice() {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNotices(mockNotices);
        setSelectedNotice(mockNotices[0]); // Select the first notice by default
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);
    
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting reply...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // show success message
    };

    return (
        <Box>
            <Grid container spacing={3} sx={{ height: { md: 'calc(100vh - 120px)' }}}>
                {/* Left Notifications List */}
                <Grid item xs={12} md={3} sx={{ height: '100%',width: '25%' }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                <NotificationsIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                            </Stack>
                        </CardContent>
                        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            {isLoading ? (
                                Array.from(new Array(4)).map((_, index) => (
                                    <ListItem key={index}><Skeleton variant="rounded" height={50} /></ListItem>
                                ))
                            ) : (
                                notices.map((notice) => (
                                    <ListItem key={notice.id} disablePadding sx={{ mb: 1 }}>
                                        <ListItemButton
                                            selected={selectedNotice?.id === notice.id}
                                            onClick={() => setSelectedNotice(notice)}
                                        >
                                            <ListItemText
                                                primary={<Typography variant="body2" fontWeight="bold">{notice.title}</Typography>}
                                                secondary={new Date(notice.timestamp).toLocaleString()}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Card>
                </Grid>

                {/* Right Notice Content */}
                <Grid item xs={12} md={9} sx={{ height: '100%',width:'50%' }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {isLoading || !selectedNotice ? (
                            <CardContent><Skeleton variant="rectangular" height="100%" /></CardContent>
                        ) : (
                            <>
                                <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1, mb: 2 }}>
                                        {selectedNotice.title}
                                    </Typography>
                                    <Typography dangerouslySetInnerHTML={{ __html: selectedNotice.content }} sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }} />
                                    {selectedNotice.image && (
                                        <Box
                                            component="img"
                                            src={selectedNotice.image}
                                            alt={selectedNotice.title}
                                            sx={{ maxWidth: '100%', height: 'auto', borderRadius: 2, mt: 1, mb: 2 }}
                                        />
                                    )}
                                </CardContent>
                                <Divider />
                                <CardContent component="form" onSubmit={handleSubmitReply}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Reply Form</Typography>
                                    <Stack spacing={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Title</InputLabel>
                                            <Select label="Title" defaultValue="">
                                                <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                                                <MenuItem value="Query">Query</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField label="Message" multiline minRows={3} fullWidth size="small"/>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={isSubmitting}>
                                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Reply'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

