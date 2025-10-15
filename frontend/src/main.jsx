// import React from "react";
// import ReactDOM from "react-dom/client";
// import ThemeProvider from "./core/theme/ThemeProvider";
// import AppRoutes from "./routes/AppRoutes";


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ThemeProvider>
//         <Toaster
//           position="top-right"
//           reverseOrder={false}
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: "#2c3e50",
//               color: "#fff",
//               fontWeight: "500",
//               borderRadius: "8px",
//             },
//           }}
//         />
//       <AppRoutes />
//     </ThemeProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast"; // ✅ Add this import
import ThemeProvider from "./core/theme/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            color: "#000000",
            fontWeight: "500",
            borderRadius: "8px",
          },
        }}
      />
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
 