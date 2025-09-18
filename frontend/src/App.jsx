import { Button, Container, Box, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useCRMAuth } from "./modules/crm/context/CRMAuthContext";

export default function App() {
  const { crmUser } = useCRMAuth();

  // CRM dashboard path based on role
  let crmPath = "/login";
  if (crmUser?.role) {
    switch (crmUser.role) {
      case "admin":
        crmPath = "/crm/admin";
        break;
      case "dealer":
        crmPath = "/crm/dealer";
        break;
      case "marketer":
        crmPath = "/crm/marketer";
        break;
      case "subadmin":
        crmPath = "/crm/subadmin";
        break;
      case "serviceengineer":
        crmPath = "/crm/serviceengineer";
        break;
      default:
        crmPath = "/login";
    }
  }

  // Example HR path (extend as needed)
  const hrPath = "/hr"; // Replace with your HR module route

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to ERP
        </Typography>
        <Typography variant="body1" gutterBottom>
          Choose a module to continue.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={crmPath}
          >
            Go to CRM
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to={hrPath}
          >
            Go to HR
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
