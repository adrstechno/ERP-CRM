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
  Tooltip,
  Typography,
  Switch,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crmMenuConfig } from "../config/menuConfig";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useThemeContext } from "../../../core/theme/ThemeProvider";

const drawerWidth = 240;

export default function CRMSidebar({ mobileOpen, onDrawerToggle }) {
  const navigate = useNavigate();
  const { crmUser } = useCRMAuth();
  const { mode, toggleMode } = useThemeContext();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const role = crmUser?.role;
  const menuItems = crmMenuConfig[role] || [];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onDrawerToggle(); // close sidebar on mobile
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Theme Switch */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Tooltip
          title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brightness7Icon
              sx={{ color: mode === "light" ? "#fbc02d" : "#bdbdbd" }}
            />
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              color="primary"
              sx={{
                mx: 1,
                "& .MuiSwitch-thumb": {
                  backgroundColor: mode === "dark" ? "#424242" : "#fff",
                },
                "& .MuiSwitch-track": {
                  backgroundColor:
                    mode === "dark" ? "#bdbdbd" : "#fbc02d",
                },
              }}
            />
            <Brightness4Icon
              sx={{ color: mode === "dark" ? "#424242" : "#bdbdbd" }}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1 }}>
            {mode === "light" ? "Light Mode" : "Dark Mode"}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }} // improves performance
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
        // Desktop drawer (always open)
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
