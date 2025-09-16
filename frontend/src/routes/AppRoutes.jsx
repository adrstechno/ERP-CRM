import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import CRMModule from "../modules/crm";
import PrivateRoute from "./PrivateRoute";
import Login from "../modules/crm/pages/Login";
import { CRMAuthProvider } from "../modules/crm/context/CRMAuthContext";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CRMAuthProvider>
              <App />
            </CRMAuthProvider>
          }
        />

        {/* Wrap Login with CRMAuthProvider */}
        <Route
          path="/login"
          element={
            <CRMAuthProvider>
              <Login />
            </CRMAuthProvider>
          }
        />

        <Route
          path="/crm/*"
          element={
            <CRMAuthProvider>
              <PrivateRoute>
                <CRMModule />
              </PrivateRoute>
            </CRMAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
