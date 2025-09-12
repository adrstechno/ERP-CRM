import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate backend signup API
    console.log("Signup form:", form);
    navigate("/login");
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
          width: 380,
          borderRadius: 3,
          backgroundColor: theme.palette.custom.cardBg,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/login")}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
