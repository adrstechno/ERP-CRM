// // import React from "react";
// // import { Box, Toolbar } from "@mui/material";
// // import { Outlet } from "react-router-dom";
// // import CRMSidebar from "../components/CRMSidebar";
// // import CRMNavbar from "./CRMNavbar"; // Import your custom navbar

// // const drawerWidth = 240;

// // export default function CRMLayout() {
// //   return (
// //     <Box sx={{ display: "flex" }}>
// //       {/* Top Navbar */}
// //       <CRMNavbar />

// //       {/* Sidebar */}
// //       <CRMSidebar />

// //       {/* Main Content */}
// //       <Box
// //         component="main"
// //         sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
// //       >
// //         <Toolbar />
// //         <Outlet />
// //       </Box>
// //     </Box>
// //   );
// // }

// import React, { useState } from "react";
// import { Box, Toolbar } from "@mui/material";
// import { Outlet } from "react-router-dom";
// import CRMSidebar from "../components/CRMSidebar";
// import CRMNavbar from "./CRMNavbar";

// const drawerWidth = 240;

// export default function CRMLayout() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Navbar with hamburger + logo */}
//       <CRMNavbar onMenuClick={handleDrawerToggle} />

//       {/* Sidebar: responsive */}
//       <CRMSidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//         }}
//       >
//         {/* Pushes content below the AppBar */}
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }


import React, { useState } from "react";
import { Box, Toolbar, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import CRMSidebar from "../components/CRMSidebar";
import CRMNavbar from "./CRMNavbar";

const drawerWidth = 0; // Should match the sidebar's width

export default function CRMLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: '100vh' }}>
      <CRMNavbar onMenuClick={handleDrawerToggle} />
      <CRMSidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // Correctly calculate width based on permanent drawer on desktop
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` } // Add margin for persistent drawer
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
