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
  useTheme, // Import useTheme
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { crmMenuConfig } from "../config/menuConfig";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useThemeContext } from "../../../core/theme/ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const drawerWidth = 280;

// Custom styled toggle switch using theme variables
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
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M9.305 1.667a7.5 7.5 0 00-4.004 12.336 7.5 7.5 0 0012.336-4.004C17.637 5.61 13.991 1.667 9.305 1.667z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#fbc02d',
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
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M10 7a3 3 0 100 6 3 3 0 000-6zM10 18a8 8 0 110-16 8 8 0 010 16z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.secondary.light,
    borderRadius: 20 / 2,
  },
}));

export default function CRMSidebar({ mobileOpen, onDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // Use the theme hook
  const { crmUser } = useCRMAuth();
  const { mode, toggleMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        bgcolor: "background.paper", // Uses theme's paper color
        overflow: "hidden",
      }}
    >
      <Box>
        <Toolbar />
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive(item.path)} // Let MUI handle selected styles via theme
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onDrawerToggle();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Theme Switch */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brightness7Icon sx={{ color: mode === "light" ? "#fbc02d" : "text.secondary" }} />
          <ThemeSwitch checked={mode === "dark"} onChange={toggleMode} />
          <Brightness4Icon sx={{ color: mode === "dark" ? "primary.main" : "text.secondary" }} />
        </Box>
        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', display: "block" }}>
          {mode === "light" ? "Light Mode" : "Dark Mode"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={isMobile ? mobileOpen : true}
      onClose={onDrawerToggle}
      ModalProps={{ keepMounted: true }}
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
  );
}
