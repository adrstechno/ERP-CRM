// import React, { useState } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   IconButton,
//   Box,
//   Tooltip,
//   Typography,
//   Switch,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { crmMenuConfig } from "../config/menuConfig";
// import MenuIcon from "@mui/icons-material/Menu";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import { useCRMAuth } from "../context/CRMAuthContext";
// import { useThemeContext } from "../../../core/theme/ThemeProvider";

// const drawerWidth = 240;

// export default function CRMSidebar() {
//   const [open, setOpen] = useState(true);
//   const navigate = useNavigate();
//   const { crmUser } = useCRMAuth();
//   const { mode, toggleMode } = useThemeContext();

//   const role = crmUser?.role;
//   const menuItems = crmMenuConfig[role] || [];

//   return (
//     <>
     
//       <Drawer
//         variant="persistent"
//         open={open}
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           },
//         }}
//       >
//         <Box>
//           <Toolbar />
//           <List>
//             {menuItems.map((item) => (
//               <ListItem key={item.path} disablePadding>
//                 <ListItemButton onClick={() => navigate(item.path)}>
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//         {/* Attractive Theme Toggle Switch at the bottom */}
//         <Box sx={{ p: 2, textAlign: "center" }}>
//           <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Brightness7Icon sx={{ color: mode === "light" ? "#fbc02d" : "#bdbdbd" }} />
//               <Switch
//                 checked={mode === "dark"}
//                 onChange={toggleMode}
//                 color="primary"
//                 sx={{
//                   mx: 1,
//                   "& .MuiSwitch-thumb": {
//                     backgroundColor: mode === "dark" ? "#424242" : "#fff",
//                   },
//                   "& .MuiSwitch-track": {
//                     backgroundColor: mode === "dark" ? "#bdbdbd" : "#fbc02d",
//                   },
//                 }}
//               />
//               <Brightness4Icon sx={{ color: mode === "dark" ? "#424242" : "#bdbdbd" }} />
//             </Box>
//             <Typography variant="caption" sx={{ mt: 1 }}>
//               {mode === "light" ? "Light Mode" : "Dark Mode"}
//             </Typography>
//           </Tooltip>
//         </Box>
//       </Drawer>
//     </>
//   );
// }
// src/modules/crm/components/CRMSidebar.js
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
  Switch,
  styled,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { crmMenuConfig } from "../config/menuConfig";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useThemeContext } from "../../../core/theme/ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// ✅ Sidebar width
const drawerWidth = 280;

// ✅ Custom styled toggle switch
const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='white' d='M4.2 10a5.8 5.8 0 0 0 11.6 0A5.8 5.8 0 0 0 4.2 10z'/></svg>")`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#fbc02d",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='black' d='M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z'/></svg>")`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#2C333C" : "#E0E0E0",
    borderRadius: 20 / 2,
  },
}));

export default function CRMSidebar({ mobileOpen, onDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { crmUser } = useCRMAuth();
  const { mode, toggleMode } = useThemeContext();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const role = crmUser?.role;
  const menuItems = crmMenuConfig[role] || [];

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: mode === "dark" ? "#2A3039" : "#fff",
        overflow: "hidden", // ✅ no scrollbar
      }}
    >
      <Box>
        <Toolbar />
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(item.path)
                    ? mode === "dark"
                      ? "#2C333C"
                      : "#f5f5f5"
                    : "transparent",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "#3A414D" : "#eeeeee",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? mode === "dark"
                        ? "#fff"
                        : "#000"
                      : mode === "dark"
                      ? "#b0bec5"
                      : "#616161",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? "bold" : "normal",
                    color: isActive(item.path)
                      ? mode === "dark"
                        ? "#fff"
                        : "#000"
                      : mode === "dark"
                      ? "#cfd8dc"
                      : "#424242",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* ✅ Theme Switch */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderTop: mode === "dark" ? "1px solid #3A414D" : "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brightness7Icon sx={{ color: mode === "light" ? "#fbc02d" : "#757575" }} />
          <ThemeSwitch checked={mode === "dark"} onChange={toggleMode} />
          <Brightness4Icon sx={{ color: mode === "dark" ? "#90caf9" : "#757575" }} />
        </Box>
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          {mode === "light" ? "Light Mode" : "Dark Mode"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
