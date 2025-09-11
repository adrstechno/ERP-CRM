import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "./core/theme/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
