
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   useTheme,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useCRMAuth } from "../context/CRMAuthContext";

// // Simulated credentials with roles
// const credentials = {
//   "admin@crm.com": { password: "123456", role: "admin" },
//   "dealer@crm.com": { password: "123456", role: "dealer" },
//   "marketer@crm.com": { password: "123456", role: "marketer" },
//   "subadmin@crm.com": { password: "123456", role: "subadmin" },
//   "service@crm.com": { password: "123456", role: "serviceengineer" },
// };

// export default function Login() {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { login, crmUser } = useCRMAuth();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (crmUser?.role) {
//       // Already logged in, redirect to their dashboard
//       let dashboardPath = "";
//       switch (crmUser.role) {
//         case "admin":
//           dashboardPath = "/crm/admin";
//           break;
//         case "dealer":
//           dashboardPath = "/crm/dealer";
//           break;
//         case "marketer":
//           dashboardPath = "/crm/marketer";
//           break;
//         case "subadmin":
//           dashboardPath = "/crm/subadmin";
//           break;
//         case "serviceengineer":
//           dashboardPath = "/crm/serviceengineer";
//           break;
//         default:
//           dashboardPath = "/crm";
//       }
//       navigate(dashboardPath, { replace: true });
//     }
//   }, [crmUser, navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const user = credentials[form.email];
//     if (user && user.password === form.password) {
//       login({ email: form.email, role: user.role });
//       // Redirect to role-specific dashboard
      
//       let dashboardPath = "";
//       switch (user.role) {
//         case "admin":
//           dashboardPath = "/crm/admin";
//           break;
//         case "dealer":
//           dashboardPath = "/crm/dealer";
//           break;
//         case "marketer":
//           dashboardPath = "/crm/marketer";
//           break;
//         case "subadmin":
//           dashboardPath = "/crm/subadmin";
//           break;
//         case "serviceengineer":
//           dashboardPath = "/crm/serviceengineer";
//           break;
//         default:
//           dashboardPath = "/crm";
//       }
//       navigate(dashboardPath);
//     } else {
//       setError("Invalid email or password!");
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       sx={{ backgroundColor: theme.palette.background.default }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           p: 4,
//           width: 360,
//           borderRadius: 3,
//           backgroundColor: theme.palette.custom?.cardBg || "#fff",
//         }}
//       >
//         <Typography variant="h5" align="center" gutterBottom>
//           Login
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Email"
//             name="email"
//             type="email"
//             fullWidth
//             margin="normal"
//             value={form.email}
//             onChange={handleChange}
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={form.password}
//             onChange={handleChange}
//           />

//           {error && (
//             <Typography color="error" variant="body2" align="center">
//               {error}
//             </Typography>
//           )}

//           <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
//             Login
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// }

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
import { REACT_APP_BASE_URL } from "../utils/State";
import axios from "axios";

const BASE_URL = REACT_APP_BASE_URL;

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
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: form.email, 
       // ✅ Correct field
      password: form.password,
    });
   
    const { token, username, role } = response.data;

    const normalizedRole = role.toLowerCase();

    login({ email: username, role: normalizedRole, token });

    redirectToDashboard(normalizedRole);
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data || "Invalid email or password!");
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
