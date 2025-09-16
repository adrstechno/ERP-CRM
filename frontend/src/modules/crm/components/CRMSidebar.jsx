import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
  Typography,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crmMenuConfig } from "../config/menuConfig";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useThemeContext } from "../../../core/theme/ThemeProvider";

const drawerWidth = 240;

export default function CRMSidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { crmUser } = useCRMAuth();
  const { mode, toggleMode } = useThemeContext();

  const role = crmUser?.role;
  const menuItems = crmMenuConfig[role] || [];

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          position: "fixed",
          top: 10,
          left: 200,
          zIndex: 1301,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Toolbar />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Attractive Theme Toggle Switch at the bottom */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brightness7Icon sx={{ color: mode === "light" ? "#fbc02d" : "#bdbdbd" }} />
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
                    backgroundColor: mode === "dark" ? "#bdbdbd" : "#fbc02d",
                  },
                }}
              />
              <Brightness4Icon sx={{ color: mode === "dark" ? "#424242" : "#bdbdbd" }} />
            </Box>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {mode === "light" ? "Light Mode" : "Dark Mode"}
            </Typography>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  );
}