

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
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCRMAuth } from "../context/CRMAuthContext";
import { VITE_API_BASE_URL } from "../utils/State";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, crmUser } = useCRMAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (crmUser?.role) {
      redirectToDashboard(crmUser.role);
    }
  }, [crmUser]);

  const redirectToDashboard = (role) => {
    let dashboardPath = "";
    switch (role.toLowerCase()) {
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
        dashboardPath = "/crm/subadmindashboard";
        break;
      case "engineer":
        dashboardPath = "/crm/serviceengineer";
        break;
      default:
        dashboardPath = "/crm";
    }
    navigate(dashboardPath, { replace: true });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post(`${VITE_API_BASE_URL}/auth/login`, {
      email: form.email,
      password: form.password,
    });
   
    const { token, username, role } = response.data;

    // This is the correct flow:
    // 1. Set the token in localStorage
    // 2. Update the context state
    // 3. Let the useEffect handle the redirect
    const normalizedRole = role.toLowerCase();
    localStorage.setItem("authKey", token); 
    login({ email: username, role: normalizedRole, token }); // This updates crmUser
    toast.success("Login Successfully!");

    // REMOVE THIS LINE - The useEffect will handle the redirect now
    // redirectToDashboard(normalizedRole); 

  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Invalid email or password!");
    toast.error(err.response?.data?.message || "Login failed!");
  } finally {
    setLoading(false);
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
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
