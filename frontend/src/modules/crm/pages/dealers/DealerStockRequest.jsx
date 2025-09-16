import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function StockRequest() {
  return (
    <Grid container spacing={3}>
      {/* 🔹 First Container - Stock Request Form */}
      <Grid item xs={12}>
        <Card sx={{ p: 3 }} md>
          <Typography variant="h6" gutterBottom>
            Stock Request
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Product Name" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Quantity" type="number" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Comments" fullWidth />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Grid item>
              <Button variant="outlined">Add More</Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Submit</Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* 🔹 Second Container - Stock Table */}
      {'\n'}
      {/* 🔹 Third Container - Requests Table */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Requests History
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Product No.</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>30-08-2024</TableCell>
                <TableCell>X_AC</TableCell>
                <TableCell>#15V85TH</TableCell>
                <TableCell>87</TableCell>
                <TableCell>$8000</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
}