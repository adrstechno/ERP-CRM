import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline, useTheme } from "@mui/material";
import theme from "./Theme";


const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);
export { useTheme };

export default function ThemeProvider({ children }) {
<<<<<<< HEAD
  const [mode, setMode] = useState("dark");

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
=======
  const [mode, setMode] = useState("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
>>>>>>> 07bf7762e445d1fa0158ee87f3da9e91015134ee
  };

  const muiTheme = useMemo(() => theme(mode), [mode]);

  return (
<<<<<<< HEAD
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
=======
    <ThemeModeContext.Provider value={{ toggleMode }}>
>>>>>>> 07bf7762e445d1fa0158ee87f3da9e91015134ee
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// import React, { createContext, useContext, useMemo, useState } from "react";
// import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
// import theme from "./Theme";


// // Create context for theme toggle
// const ThemeContext = createContext();

// export const useThemeContext = () => useContext(ThemeContext);

// export default function ThemeProvider({ children }) {
//   const [mode, setMode] = useState("light"); // default to light mode

//   const toggleMode = () => {
//     setMode((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   const muiTheme = useMemo(() => theme(mode), [mode]);

//   return (
//     <ThemeContext.Provider value={{ mode, toggleMode }}>
//       <MuiThemeProvider theme={muiTheme}>
//         <CssBaseline />
//         {children}
//       </MuiThemeProvider>
//     </ThemeContext.Provider>
//   );
// }
