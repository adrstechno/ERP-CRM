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
