import React from "react";
import { Routes, Route } from "react-router-dom";
import CRMLayout from "./layouts/CRMLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DealerDashboard from "./pages/dealers/DealerDashboard";
import MarketerDashboard from "./pages/marketer/MarketerDashboard";
import SubadminDashboard from "./pages/subadmin/SubadminDashboard";
import ServiceEngineerDashboard from "./pages/serviceengineer/ServiceEngineerDashboard";
import ErrorPage from "./pages/ErrorPage";
import { useCRMAuth } from "./context/CRMAuthContext";
import NewSales from "./pages/marketer/NewSales";

export default function CRMModule() {
  const { crmUser } = useCRMAuth();

  return (
    <Routes>
      <Route element={<CRMLayout />}>
        {crmUser?.role === "admin" && (
          <Route path="admin" element={<AdminDashboard />} />

        )}
        {crmUser?.role === "dealer" && (
          <Route path="dealer" element={<DealerDashboard />} />
        )}
        {crmUser?.role === "marketer" && (
          <>
          <Route path="marketer" element={<MarketerDashboard />} />
          <Route path="new-sales" element={<NewSales />} />
          </>

        )}
        {crmUser?.role === "subadmin" && (
          <Route path="subadmin" element={<SubadminDashboard />} />
        )}
        {crmUser?.role === "service engineer" && ( 
          <Route path="serviceengineer" element={<ServiceEngineerDashboard />} />
        )}
        {!crmUser?.role && <Route path="*" element={<ErrorPage />} />}
      </Route>
    </Routes>
  );
}
