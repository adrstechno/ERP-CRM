import React from "react";
import { Routes, Route } from "react-router-dom";

// CRM Pages
import Dashboard from "./pages/Dashboard";
import CRMLayout from "./layouts/CRMLayout";
import Contact from "./pages/Contact";


export default function CRMModule() {
return (
    <Routes>
      <Route element={<CRMLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="contacts" element={<Contact />} />
 
      </Route>
    </Routes>
  );
}
