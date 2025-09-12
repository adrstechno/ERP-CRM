// src/core/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#E0E0E0" : "#424242", // grayish accent
        contrastText: mode === "dark" ? "#000000" : "#FFFFFF",
      },
      secondary: {
        main: mode === "dark" ? "#B0B0B0" : "#757575", // lighter gray
      },
      background: {
        default: mode === "dark" ? "#2D3036" : "#FFFFFF",
        paper: mode === "dark" ? "#323232" : "#F9F9FA",
      },
      text: {
        primary: mode === "dark" ? "#FFFFFF" : "#000000",
        secondary: mode === "dark" ? "#E0E0E0" : "#424242",
      },
      custom: {
        sidebarBg: mode === "dark" ? "#2C2C2C" : "#FFFFFF",
        topBarBg: mode === "dark" ? "#2A2A2A" : "#FFFFFF",
        cardBg: mode === "dark" ? "#323232" : "#F9F9FA",
        accent: mode === "dark" ? "#E0E0E0" : "#424242",
      },
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      h6: {
        fontWeight: 600,
        color: mode === "dark" ? "#FFFFFF" : "#000000",
      },
      body1: {
        color: mode === "dark" ? "#FFFFFF" : "#000000",
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
        `,
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.topBarBg,
            color: theme.palette.text.primary,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.custom.sidebarBg,
            color: theme.palette.text.primary,
            borderRight: "1px solid rgba(255,255,255,0.12)",
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.cardBg,
            color: theme.palette.text.primary,
            borderRadius: 12,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "6px 16px",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
            opacity: 0.7,
            transition: "opacity 0.3s",
            "&:hover": {
              opacity: 1,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "40px",
            color: "inherit",
          },
        },
      },
    },
  });

export default theme;
