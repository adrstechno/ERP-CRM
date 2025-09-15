import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import CRMSidebar from "../components/CRMSidebar";
import CRMNavbar from "./CRMNavbar"; // Import your custom navbar

const drawerWidth = 240;

export default function CRMLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <CRMNavbar />

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
