// import React from "react";
// import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useCRMAuth } from "../context/CRMAuthContext";
// import { useNavigate } from "react-router-dom";
// import { useThemeContext } from "../../../core/theme/ThemeProvider";

// export default function CRMNavbar({ onMenuClick }) {
//   const { mode, toggleMode } = useThemeContext();
//   const { crmUser, setCrmUser } = useCRMAuth();
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleAvatarClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     setCrmUser(null);
//     navigate("/login", { replace: true });
//     handleClose();
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={onMenuClick}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             CRM Module
//           </Typography>
//         </Box>

//         {/* Right: theme toggle + user avatar */}
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton onClick={handleAvatarClick} sx={{ ml: 2 }}>
//             <Avatar>{crmUser?.email?.[0]?.toUpperCase() || "U"}</Avatar>
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             <MenuItem disabled>
//               {crmUser?.email} ({crmUser?.role})
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../core/theme/ThemeProvider"; // import your theme context

export default function CRMNavbar({ onMenuClick }) {
  const { crmUser, setCrmUser } = useCRMAuth();
  const { mode } = useThemeContext(); // get current theme
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setCrmUser(null);
    navigate("/login", { replace: true });
    handleClose();
  };

  // Choose logo based on theme
  const logoSrc = mode === "light" ? "/light.png" : "/dark.png"; // replace with your light/dark logo paths

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Hamburger + Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoSrc}
              alt="Website Logo"
              style={{ height: 50, marginRight: 16 }}
            />
          </Box>
        </Box>

        {/* Right: User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleAvatarClick} sx={{ ml: 2 }}>
            <Avatar>{crmUser?.email?.[0]?.toUpperCase() || "U"}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              {crmUser?.email} ({crmUser?.role})
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
