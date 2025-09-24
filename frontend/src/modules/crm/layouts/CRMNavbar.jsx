// // import React from "react";
// // import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
// // import MenuIcon from "@mui/icons-material/Menu";
// // import { useCRMAuth } from "../context/CRMAuthContext";
// // import { useNavigate } from "react-router-dom";
// // import { useThemeContext } from "../../../core/theme/ThemeProvider";

// // export default function CRMNavbar({ onMenuClick }) {
// //   const { mode, toggleMode } = useThemeContext();
// //   const { crmUser, setCrmUser } = useCRMAuth();
// //   const navigate = useNavigate();
// //   const [anchorEl, setAnchorEl] = React.useState(null);

// //   const handleAvatarClick = (event) => {
// //     setAnchorEl(event.currentTarget);
// //   };

// //   const handleClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleLogout = () => {
// //     setCrmUser(null);
// //     navigate("/login", { replace: true });
// //     handleClose();
// //   };

// //   return (
// //     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
// //       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
// //         <Box sx={{ display: "flex", alignItems: "center" }}>
// //           <IconButton
// //             color="inherit"
// //             edge="start"
// //             onClick={onMenuClick}
// //             sx={{ mr: 2, display: { sm: "none" } }}
// //           >
// //             <MenuIcon />
// //           </IconButton>
// //           <Typography variant="h6" noWrap>
// //             CRM Module
// //           </Typography>
// //         </Box>

// //         {/* Right: theme toggle + user avatar */}
// //         <Box sx={{ display: "flex", alignItems: "center" }}>
// //           <IconButton onClick={handleAvatarClick} sx={{ ml: 2 }}>
// //             <Avatar>{crmUser?.email?.[0]?.toUpperCase() || "U"}</Avatar>
// //           </IconButton>
// //           <Menu
// //             anchorEl={anchorEl}
// //             open={Boolean(anchorEl)}
// //             onClose={handleClose}
// //             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //             transformOrigin={{ vertical: "top", horizontal: "right" }}
// //           >
// //             <MenuItem disabled>
// //               {crmUser?.email} ({crmUser?.role})
// //             </MenuItem>
// //             <MenuItem onClick={handleLogout}>Logout</MenuItem>
// //           </Menu>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // }
// import React from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Box,
//   Avatar,
//   Menu,
//   MenuItem,
//   Typography,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useCRMAuth } from "../context/CRMAuthContext";
// import { useNavigate } from "react-router-dom";
// import { useThemeContext } from "../../../core/theme/ThemeProvider";

// export default function CRMNavbar({ onMenuClick }) {
//   const { crmUser, setCrmUser } = useCRMAuth();
//   const { mode } = useThemeContext();
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleLogout = () => {
//     setCrmUser(null);
//     navigate("/login", { replace: true });
//     handleClose();
//   };

//   // Different colors for light/dark
//   const isLight = mode === "light";
//   const appBarBg = isLight ? "#ffffff" : "#353C45";
//   const textColor = isLight ? "#000000" : "#ffffff";
//   const menuHover = isLight ? "#f5f5f5" : "#2a2f36";

//   const logoSrc = isLight ? "/light.png" : "/dark.png";

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         backgroundColor: appBarBg,
//         color: textColor,
//         boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Left: Hamburger + Logo + Title */}
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton
//             edge="start"
//             onClick={onMenuClick}
//             sx={{
//               mr: 2,
//               display: { sm: "block", md: "none" },
//               color: textColor,
//               "&:hover": { backgroundColor: menuHover },
//             }}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <img
//               src={logoSrc}
//               alt="Website Logo"
//               style={{
//                 height: 45,
//                 marginRight: 12,
//                 objectFit: "contain",
//               }}
//             />
//             {/* <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 color: textColor,
//                 letterSpacing: 0.5,
//               }}
//             >
//               CRM Dashboard
//             </Typography> */}
//           </Box>
//         </Box>

//         {/* Right: Avatar */}
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton
//             onClick={handleAvatarClick}
//             sx={{
//               ml: 2,
//               p: 0.5,
//               border: `2px solid ${isLight ? "#ddd" : "#4a525d"}`,
//             }}
//           >
//             <Avatar
//               sx={{
//                 bgcolor: isLight ? "#1976d2" : "#90caf9",
//                 color: "#fff",
//                 fontWeight: 600,
//               }}
//             >
//               {crmUser?.email?.[0]?.toUpperCase() || "U"}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//             PaperProps={{
//               sx: {
//                 backgroundColor: appBarBg,
//                 color: textColor,
//                 boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
//                 borderRadius: 2,
//               },
//             }}
//           >
//             <MenuItem disabled>
//               {crmUser?.email} ({crmUser?.role})
//             </MenuItem>
//             <MenuItem
//               onClick={handleLogout}
//               sx={{
//                 "&:hover": {
//                   backgroundColor: menuHover,
//                 },
//               }}
//             >
//               Logout
//             </MenuItem>
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
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../core/theme/ThemeProvider";

export default function CRMNavbar({ onMenuClick }) {
  const { crmUser, setCrmUser } = useCRMAuth();
  const { mode } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setCrmUser(null);
    navigate("/login", { replace: true });
    handleClose();
  };

  const logoSrc = mode === "light" ? "/light.png" : "/dark.png";

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Removed width and ml properties to revert to previous state
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Hamburger + Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { md: "none" }, // Show only on mobile/tablet
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoSrc}
              alt="Website Logo"
              style={{
                height: 45,
                marginRight: 12,
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>

        {/* Right: Avatar + Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              ml: 2,
              p: 0.5,
              border: (theme) => `2px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", color: (theme) => theme.palette.getContrastText(theme.palette.primary.main) }}>
              {crmUser?.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                borderRadius: 2,
                mt: 1.5,
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" noWrap>
                {crmUser?.email} ({crmUser?.role})
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}


