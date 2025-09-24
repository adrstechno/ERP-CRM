

// import { createTheme } from "@mui/material/styles";

// // This function creates the theme based on the provided mode ('light' or 'dark').
// const theme = (mode = "light") =>
//   createTheme({
//     // Palette defines the color scheme of the application.
//     palette: {
//       mode,
//       ...(mode === "dark"
//         ? // Dark Mode Palette
//           {
//             primary: {
//               main: "#00E5FF", // Vibrant cyan for highlights, selected items, and accents
//             },
//             secondary: {
//               main: "#64748B", // A muted grey for secondary actions or text
//             },
//             background: {
//               default: "#222831", // The main, darkest background color
//               paper: "#2D3036",   // Background for cards, sidebars, tables
//             },
//             text: {
//               primary: "#EEEEEE", // Main text color (light grey/off-white)
//               secondary: "#B0B0B0", // Lighter text for secondary info
//             },
//             // Custom colors for specific components to match your design
//             custom: {
//               sidebarBg: "#2D3036",
//               topBarBg: "#2D3036",
//               cardBg: "#2D3036",
//               tableHeader: "#393E46", // A slightly different grey for table headers
//               kpiBlue: "linear-gradient(135deg, #2B75E4 0%, #0D47A1 100%)",
//             },
//           }
//         : // Light Mode Palette
//           {
//             primary: {
//               main: "#007BFF", // A professional, strong blue for light mode
//             },
//             secondary: {
//               main: "#6C757D", // Standard grey for secondary elements
//             },
//             background: {
//               default: "#F4F6F8", // A very light grey for the main background
//               paper: "#FFFFFF",   // White for cards, sidebars, etc.
//             },
//             text: {
//               primary: "#212529", // A dark charcoal for primary text
//               secondary: "#6C757D", // Grey for secondary text
//             },
//             // Custom colors for light mode
//             custom: {
//               sidebarBg: "#FFFFFF",
//               topBarBg: "#FFFFFF",
//               cardBg: "#FFFFFF",
//               tableHeader: "#F1F3F4",
//               kpiBlue: "linear-gradient(135deg, #2B75E4 0%, #0D47A1 100%)",
//             },
//           }),
//     },
//     // Typography settings to define font styles
//     typography: {
//       fontFamily: "Poppins, sans-serif",
//       h5: { fontWeight: 600 },
//       h6: { fontWeight: 600 },
//       button: {
//         textTransform: "none", // Buttons will use normal casing, not uppercase
//         fontWeight: 500,
//       },
//     },
//     // Component overrides to style MUI components globally
//     components: {
//       MuiCssBaseline: {
//         styleOverrides: `
//           @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
//           body {
//             font-family: 'Poppins', sans-serif;
//           }
//           // A custom scrollbar that matches the dark theme aesthetic
//           ::-webkit-scrollbar {
//             width: 8px;
//           }
//           ::-webkit-scrollbar-track {
//             background: ${mode === "dark" ? "#2D3036" : "#F1F1F1"};
//           }
//           ::-webkit-scrollbar-thumb {
//             background: #888;
//             border-radius: 4px;
//           }
//           ::-webkit-scrollbar-thumb:hover {
//             background: #555;
//           }
//         `,
//       },
//       MuiAppBar: {
//         styleOverrides: {
//           root: ({ theme }) => ({
//             backgroundColor: theme.palette.custom.topBarBg,
//             color: theme.palette.text.primary,
//             boxShadow: "none", // Flatter design without shadows
//             borderBottom: `1px solid ${mode === "dark" ? "#393E46" : "#E0E0E0"}`,
//           }),
//         },
//       },
//       MuiDrawer: {
//         styleOverrides: {
//           paper: ({ theme }) => ({
//             backgroundColor: theme.palette.custom.sidebarBg,
//             color: theme.palette.text.primary,
//             borderRight: "none",
//           }),
//         },
//       },
//       MuiCard: {
//         styleOverrides: {
//           root: ({ theme }) => ({
//             backgroundColor: theme.palette.custom.cardBg,
//             color: theme.palette.text.primary,
//             borderRadius: 12,
//             boxShadow: "none",
//             border: `1px solid ${mode === "dark" ? "#393E46" : "#E0E0E0"}`,
//           }),
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 8,
//           },
//           containedPrimary: {
//             color: mode === 'dark' ? '#222831' : '#FFFFFF', // Ensure high contrast text on buttons
//           },
//         },
//       },
//       MuiTableCell: {
//         styleOverrides: {
//           root: {
//             borderBottom: `1px solid ${mode === "dark" ? "#393E46" : "#E0E0E0"}`,
//           },
//           head: ({ theme }) => ({
//             backgroundColor: theme.palette.custom.tableHeader,
//             fontWeight: 600,
//             color: theme.palette.text.primary,
//           }),
//         },
//       },
//       MuiListItemIcon: {
//         styleOverrides: {
//           root: {
//             minWidth: "40px",
//             color: "inherit",
//           },
//         },
//       },
//       MuiListItemButton: {
//         styleOverrides: {
//           root: {
//             margin: '0 8px',
//             borderRadius: 8,
//             '&.Mui-selected': {
//               backgroundColor: "rgba(0, 229, 255, 0.1)", // Primary color with opacity
//               color: '#00E5FF',
//               '&:hover': {
//                 backgroundColor: "rgba(0, 229, 255, 0.15)",
//               },
//               // The following styles ensure icons in selected items are also colored
//               '.MuiListItemIcon-root': {
//                 color: '#00E5FF',
//               }
//             },
//           },
//         },
//       },
//     },
//   });

// export default theme;


import { createTheme } from "@mui/material/styles";

// This function creates the theme based on the provided mode ('light' or 'dark').
const theme = (mode = "light") =>
  createTheme({
    // Palette defines the color scheme of the application.
    palette: {
      mode,
      ...(mode === "dark"
        ? // Dark Mode Palette
          {
            primary: {
              main: "#00E5FF", // Vibrant cyan for highlights, selected items, and accents
            },
            secondary: {
              main: "#64748B", // A muted grey for secondary actions or text
            },
            background: {
              default: "#222831", // The main, darkest background color
              paper: "#2D3036",   // Background for cards, sidebars, tables
            },
            text: {
              primary: "#EEEEEE", // Main text color (light grey/off-white)
              secondary: "#B0B0B0", // Lighter text for secondary info
            },
            // Custom colors for specific components to match your design
            custom: {
              sidebarBg: "#2D3036",
              topBarBg: "#2D3036",
              cardBg: "#2D3036",
              tableHeader: "#393E46", // A slightly different grey for table headers
              kpiBlue: "linear-gradient(135deg, #2B75E4 0%, #0D47A1 100%)",
            },
          }
        : // Light Mode Palette
          {
            primary: {
              main: "#007BFF", // A professional, strong blue for light mode
            },
            secondary: {
              main: "#6C757D", // Standard grey for secondary elements
            },
            background: {
              default: "#F4F6F8", // A very light grey for the main background
              paper: "#FFFFFF",   // White for cards, sidebars, etc.
            },
            text: {
              primary: "#212529", // A dark charcoal for primary text
              secondary: "#6C757D", // Grey for secondary text
            },
            // Custom colors for light mode
            custom: {
              sidebarBg: "#FFFFFF",
              topBarBg: "#FFFFFF",
              cardBg: "#FFFFFF",
              tableHeader: "#F1F3F4",
              kpiBlue: "linear-gradient(135deg, #2B75E4 0%, #0D47A1 100%)",
            },
          }),
    },
    // Typography settings to define font styles
    typography: {
      fontFamily: "Poppins, sans-serif",
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: "none", // Buttons will use normal casing, not uppercase
        fontWeight: 500,
      },
    },
    // Component overrides to style MUI components globally
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
          // A custom scrollbar that matches the theme aesthetic
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: ${mode === "dark" ? "#2D3036" : "#F1F1F1"};
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `,
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.topBarBg,
            color: theme.palette.text.primary,
            boxShadow: "none", // Flatter design without shadows
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.custom.sidebarBg,
            color: theme.palette.text.primary,
            borderRight: "none",
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.cardBg,
            color: theme.palette.text.primary,
            borderRadius: 12,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          containedPrimary: ({ theme }) => ({
            color: theme.palette.getContrastText(theme.palette.primary.main),
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
          head: ({ theme }) => ({
            backgroundColor: theme.palette.custom.tableHeader,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }),
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
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            margin: '0 8px',
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected, // Theme-aware background
              color: theme.palette.primary.main, // Theme-aware text color
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '.MuiListItemIcon-root': {
                color: theme.palette.primary.main, // Theme-aware icon color
              }
            },
          }),
        },
      },
    },
  });

export default theme;

