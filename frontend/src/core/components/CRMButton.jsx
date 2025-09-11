import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function CRMButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/crm/dashboard"
      sx={{ mt: 4, fontSize: "16px", px: 3 }}
    >
      Go to CRM
    </Button>
  );
}
