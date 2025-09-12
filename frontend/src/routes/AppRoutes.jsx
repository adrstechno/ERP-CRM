import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App"; // ERP Home
import CRMModule from "../modules/crm";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ERP Home */}
        <Route path="/" element={<App />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CRM has its own layout */}
        <Route path="/crm/*" element={<PrivateRoute>
            <CRMModule />
          </PrivateRoute>} />

        {/* Future modules (each will have their own layout later) */}
        {/* <Route path="/hr/*" element={<HRModule />} /> */}
        {/* <Route path="/finance/*" element={<FinanceModule />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
