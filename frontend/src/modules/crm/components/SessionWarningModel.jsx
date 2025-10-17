
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import LogoutIcon from "@mui/icons-material/Logout";
// export default function SessionWarningModal({
//   open,
//   onStay,
//   onLogout,
//   totalSeconds,
// }) {
//   const [timeLeft, setTimeLeft] = useState(totalSeconds);

//   // Reset timer whenever modal opens or totalSeconds changes
//   useEffect(() => {
//     if (open) setTimeLeft(totalSeconds);
//   }, [open, totalSeconds]);

//   useEffect(() => {
//     if (!open) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [open, totalSeconds]); // add totalSeconds to dependencies

//   return (
//     <Dialog open={open} onClose={onStay} maxWidth="xs" fullWidth>
//       <DialogContent sx={{ textAlign: "center", py: 4 }}>
//         <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
//           <CircularProgress
//             variant="determinate"
//             value={(timeLeft / totalSeconds) * 100}
//             size={80}
//             thickness={4}
//             color="error"
//           />
//           <Typography
//             variant="h6"
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: 80,
//               height: 80,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {timeLeft}s
//           </Typography>
//         </Box>

//         <Typography variant="h6" gutterBottom>
//           Your session will expire soon!
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Please "Save Your Work".
//         </Typography>
//       </DialogContent>
//       <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//         <Button
//           variant="contained"
//           startIcon={<LogoutIcon />}
//           onClick={onLogout}
//           sx={{
//             backgroundColor: "#e74c3c", // solid attractive red
//             color: "#fff",
//             fontWeight: 600,
//             textTransform: "none",
//             borderRadius: 2,
//             px: 3,
//             py: 1,
//             boxShadow: "0px 3px 6px rgba(0,0,0,0.15)",
//             transition: "all 0.2s ease",
//             "&:hover": {
//               backgroundColor: "#c0392b", // slightly darker on hover
//               boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
//             },
//           }}
//         >
//           Logout Now
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, useTheme } from "@mui/material";

export default function SessionWarningToast({ open, totalSeconds }) {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  // Reset timer whenever toast opens or totalSeconds changes
  useEffect(() => {
    if (open) setTimeLeft(totalSeconds);
  }, [open, totalSeconds]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, totalSeconds]);

  if (!open) return null;

  const backgroundColor =
    theme.palette.mode === "light" ? "#424242" : "#e0e0e0"; // inverted
  const textColor =
    theme.palette.mode === "light" ? "#ffffff" : "#000000"; // contrasting text

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 300,
        p: 2.5,
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.25)",
        backgroundColor: backgroundColor,
        color: textColor,
        zIndex: 2000,
      }}
    >
      <Box sx={{ position: "relative", mr: 2 }}>
        <CircularProgress
          variant="determinate"
          value={(timeLeft / totalSeconds) * 100}
          size={60}
          thickness={5}
          sx={{
            color: "#e74c3c",
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#e74c3c",
          }}
        >
          {timeLeft}s
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Session Expiring
        </Typography>
        <Typography variant="body2">
          Your session will end soon. Please save your work!
        </Typography>
      </Box>
    </Paper>
  );
}
