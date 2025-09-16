import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  useTheme,
} from "@mui/material";

// If you have a layout with sidebar/navbar, import and use it here
// import CRMLayout from "../../components/CRMLayout";

export default function DealerNotice() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Card style from AdminDashboard
  const cardStyle = {
    borderRadius: 2,
    boxShadow: theme.shadows[3],
    background: isDark
      ? "linear-gradient(135deg, #3A414B 0%, #20262E 100%)"
      : "linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)",
    color: isDark ? "white" : "black",
  };

  return (
    // If you have a layout, wrap this in <CRMLayout>...</CRMLayout>
    <Box
      p={3}
      sx={{
        backgroundColor: isDark ? "#1E2328" : "#F5F6FA",
        minHeight: "100vh",
        color: isDark ? "white" : "black",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, letterSpacing: 2, mb: 4 }}
      >
        
      </Typography>
      <Grid container spacing={3}>
        {/* Notifications List */}
        <Grid item xs={12} md={2}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
              <Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  GO OLD TOWN
                </Typography>
                <Typography variant="caption" color="gray">
                  7:00PM, 9/09
                </Typography>
              </Box>
              <Divider sx={{ my: 2, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
              <Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  TASK1
                </Typography>
                <Typography variant="caption" color="gray">
                  7:00PM, 9/09
                </Typography>
              </Box>
              <Divider sx={{ my: 2, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
              <Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  TASK2
                </Typography>
                <Typography variant="caption" color="gray">
                  11:00AM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notice Content */}
        <Grid item xs={12} md={7}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, letterSpacing: 2, mb: 2 }}
              >
                GO OLD TOWN
              </Typography>
              <Typography sx={{ mb: 2 }}>
                YOU HAVE TO DELIVER TO OLD TOWN CLIENT <br />
                <b>NAME:- LAL SINGH CHADHA</b> <br />
                <b>MOBILE NO:- 9898989898</b> <br />
                <b>ADDRESS:- WARD NO - 08, OLD TOWN</b>
              </Typography>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                alt="Old Town"
                style={{
                  width: "320px",
                  borderRadius: 8,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Reply Form */}
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Reply form
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#aaa", mb: 2, display: "block" }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: "#aaa" }}>Title</InputLabel>
                <Select
                  label="Title"
                  defaultValue=""
                  sx={{
                    color: isDark ? "#fff" : "#222",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7A3EF3",
                    },
                  }}
                >
                  <MenuItem value="title">title</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Message"
                multiline
                minRows={3}
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: isDark ? "#fff" : "#222",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#7A3EF3" },
                    "&.Mui-focused fieldset": { borderColor: "#7A3EF3" },
                  },
                  "& .MuiInputLabel-root": { color: "#aaa" },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  background: "#23242a",
                  color: "#fff",
                  border: "1px solid #7A3EF3",
                  "&:hover": {
                    background: "#7A3EF3",
                    color: "#fff",
                  },
                }}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}