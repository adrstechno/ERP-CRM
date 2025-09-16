import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import CRMSidebar from "../components/CRMSidebar";
import CRMNavbar from "../components/CRMNavbar";


const drawerWidth = 240;

export default function CRMLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      {/* Navbar */}
      <CRMNavbar onToggleSidebar={() => setOpen(!open)} pageTitle="Admin" />
      
        <Toolbar>
          <Typography variant="h6" noWrap>
            CRM Module
          </Typography>
        </Toolbar>
     

      {/* Sidebar */}
      <CRMSidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

// import React, { useState } from "react";
// import { Box, AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
// import { Outlet } from "react-router-dom";
// import CRMSidebar from "../components/CRMSidebar";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import MenuIcon from "@mui/icons-material/Menu";


// const drawerWidth = 240;

// export default function CRMLayout() {
//   const { mode, toggleMode } = useThemeContext ();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Top Navbar */}
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Left: menu toggle + title */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <IconButton
//               color="inherit"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2, display: { sm: "none" } }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" noWrap>
//               CRM Module
//             </Typography>
//           </Box>

//           {/* Right: theme toggle + user avatar */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <IconButton color="inherit" onClick={toggleMode}>
//               {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
//             </IconButton>
//             <Avatar sx={{ ml: 2 }}>A</Avatar>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <CRMSidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
//       >
//         <Toolbar /> {/* space below AppBar */}
//         <Outlet />  {/* CRM pages will load here */}
//       </Box>
//     </Box>
//   );
// }
