import { Button, Container, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function App() {
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
          Click below to enter the CRM module.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/crm/dashboard"
          sx={{ mt: 2 }}
        >
          Go to CRM
        </Button>
      </Box>
    </Container>
  );
}
