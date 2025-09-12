import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "./core/theme/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./core/context/AuthContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      
    </ThemeProvider>
  </React.StrictMode>
);
