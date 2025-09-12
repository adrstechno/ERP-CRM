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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { crmMenuConfig } from "../config/menuConfig";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function CRMSidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // Later: get role from AuthContext
  const role = "admin"; // 👈 hardcoded for now, will make dynamic
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
          },
        }}
      >
        {/* Align below top AppBar */}
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
      </Drawer>
    </>
  );
}