import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App"; // ERP Home
import CRMModule from "../modules/crm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ERP Home */}
        <Route path="/" element={<App />} />

        {/* CRM has its own layout */}
        <Route path="/crm/*" element={<CRMModule />} />

        {/* Future modules (each will have their own layout later) */}
        {/* <Route path="/hr/*" element={<HRModule />} /> */}
        {/* <Route path="/finance/*" element={<FinanceModule />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
