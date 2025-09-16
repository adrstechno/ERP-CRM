import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useLocation } from "react-router-dom";

export default function CRMNavbar({ onToggleSidebar, pageTitle = "Admin" }) {
   const location = useLocation();

   const pageTitles = {
    "/crm/dashboard": "Dashboard",
    "/crm/contacts": "Contacts",
    "/crm/settings": "Settings",
    "/crm/reports": "Reports",
  };
  const currentTitle = pageTitles[location.pathname] || "CRM";
  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo + Menu */}
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src="/vite.svg" // replace with your CRM logo
            alt="CRM"
            style={{ width: 30, height: 30 }}
          />
          <Typography variant="h6" fontWeight="bold">
            CRM
          </Typography>
          <IconButton color="inherit" onClick={onToggleSidebar}>
            
          </IconButton>
          <Box display="flex" alignItems="baseline" gap={1} ml={15} my={2}>
            {/* <StarIcon fontSize="small" /> */}
            <Typography variant="body2">{currentTitle}</Typography>
          </Box>
        </Box>

        {/* Center: Page Title */}
        <Typography variant="h6" fontWeight="bold">
          {pageTitle}
        </Typography>

        {/* Right: Icons + Profile */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <Brightness4Icon />
          </IconButton>

          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Tooltip title="Profile">
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://i.pravatar.cc/40?img=5" alt="John Carter" />
              <Box>
                <Typography variant="body2" fontWeight="600">
                  John Carter
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Admin
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
