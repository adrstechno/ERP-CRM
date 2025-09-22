import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/Theme"; // adjust path if needed

// Create context
const ThemeModeContext = createContext();

// Hook for consuming theme context
export const useThemeContext = () => useContext(ThemeModeContext);

export default function ThemeProvider({ children }) {
  // Load initial mode from localStorage or default to "light"
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  // Toggle function
  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Build theme dynamically
  const muiTheme = useMemo(() => theme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

