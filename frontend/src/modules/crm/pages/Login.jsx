import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCRMAuth } from "../context/CRMAuthContext";

// Simulated credentials with roles
const credentials = {
  "admin@crm.com": { password: "123456", role: "admin" },
  "dealer@crm.com": { password: "123456", role: "dealer" },
  "marketer@crm.com": { password: "123456", role: "marketer" },
  "subadmin@crm.com": { password: "123456", role: "subadmin" },
  "service@crm.com": { password: "123456", role: "service engineer" },
};

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, crmUser } = useCRMAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (crmUser?.role) {
      // Already logged in, redirect to their dashboard
      let dashboardPath = "";
      switch (crmUser.role) {
        case "admin":
          dashboardPath = "/crm/admin";
          break;
        case "dealer":
          dashboardPath = "/crm/dealer";
          break;
        case "marketer":
          dashboardPath = "/crm/marketer";
          break;
        case "subadmin":
          dashboardPath = "/crm/subadmin";
          break;
        case "service engineer":
          dashboardPath = "/crm/serviceengineer";
          break;
        default:
          dashboardPath = "/crm";
      }
      navigate(dashboardPath, { replace: true });
    }
  }, [crmUser, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = credentials[form.email];
    if (user && user.password === form.password) {
      login({ email: form.email, role: user.role });
      // Redirect to role-specific dashboard
      let dashboardPath = "";
      switch (user.role) {
        case "admin":
          dashboardPath = "/crm/admin";
          break;
        case "dealer":
          dashboardPath = "/crm/dealer";
          break;
        case "marketer":
          dashboardPath = "/crm/marketer";
          break;
        case "subadmin":
          dashboardPath = "/crm/subadmin";
          break;
        case "service engineer":
          dashboardPath = "/crm/serviceengineer";
          break;
        default:
          dashboardPath = "/crm";
      }
      navigate(dashboardPath);
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 360,
          borderRadius: 3,
          backgroundColor: theme.palette.custom?.cardBg || "#fff",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
