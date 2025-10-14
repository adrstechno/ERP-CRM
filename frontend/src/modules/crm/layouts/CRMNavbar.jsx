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
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useCRMAuth } from "../context/CRMAuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../core/theme/ThemeProvider";

const notifications = [
  { id: 1, primary: "New lead assigned", secondary: "John Doe - Tech Corp" },
  { id: 2, primary: "Task due today", secondary: "Follow up with Jane Smith" },
  {
    id: 3,
    primary: "New message received",
    secondary: "From: Project Manager",
  },
  {
    id: 4,
    primary: "Contract signed",
    secondary: "Innovate LLC deal is closed.",
  },
  {
    id: 5,
    primary: "System Update",
    secondary: "A new software version is available.",
  },
  {
    id: 6,
    primary: "Meeting Reminder",
    secondary: "1-on-1 with Sarah at 3:00 PM.",
  },
  {
    id: 7,
    primary: "Expense report approved",
    secondary: "Q3 expenses have been processed.",
  },
];

export default function CRMNavbar({ onMenuClick }) {
  const { crmUser, setCrmUser } = useCRMAuth();
  const { mode } = useThemeContext();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    setCrmUser(null);
    localStorage.removeItem("authKey");
    handleClose();
    handleNotificationClose();
    navigate("/login", { replace: true });
  };

  const logoSrc = mode === "light" ? "/light.png" : "/dark.png";
  const notificationCount = notifications.length;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
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

        {/* Right Side */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{ mr: 1.5 }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsActiveIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                borderRadius: 2,
                mt: 1.5,
                minWidth: 320,
                maxHeight: "50vh",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box sx={{ p: 2, flexShrink: 0 }}>
              <Typography variant="h6" component="div">
                Notifications
              </Typography>
            </Box>
            <Divider sx={{ flexShrink: 0 }} />
            <List sx={{ overflow: "auto", flexGrow: 1 }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <ListItem
                    button
                    key={notification.id}
                    // CHANGED: Removed the 'onClick' handler from here.
                    // Now, clicking a single notification will NOT close the dropdown.
                  >
                    <ListItemText
                      primary={notification.primary}
                      secondary={notification.secondary}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              )}
            </List>
            {/* REMOVED: The Divider and the "View All Notifications" MenuItem footer have been deleted. */}
          </Menu>

          <IconButton
            onClick={handleAvatarClick}
            sx={{
              ml: 1,
              p: 0.5,
              border: (theme) => `2px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.primary.main),
              }}
            >
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
