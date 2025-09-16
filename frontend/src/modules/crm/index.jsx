import React from "react";
import { Routes, Route } from "react-router-dom";
import CRMLayout from "./layouts/CRMLayout";
import { useCRMAuth } from "./context/CRMAuthContext";
import ErrorPage from "./pages/ErrorPage";

//Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement"
import DealerManagement from "./pages/admin/DealerManagement"
import InventoryManagement from "./pages/admin/InventoryManagement"
import Sales from "./pages/admin/Sales"
import Service from "./pages/admin/Service"
import BillingNInvoice from "./pages/admin/BillingNInvoice"
import ReportsAnalytics from "./pages/admin/ReportsAnalytics"
import Setting from "./pages/admin/Settings"
import AuditLogs from "./pages/admin/AuditLogs"


//Dealer
import DealerDashboard from "./pages/dealers/DealerDashboard";
import DealerStockRequests from "./pages/dealers/DealerStockRequest";
import Notices from "./pages/dealers/dealerNotice";

//Subadmin
import SubadminDashboard from "./pages/subadmin/SubadminDashboard";


//ServiceEngg.
import ServiceEngineerDashboard from "./pages/serviceengineer/ServiceEngineerDashboard";

//Marketer
import MarketerDashboard from "./pages/marketer/MarketerDashboard";
import NewSales from "./pages/marketer/NewSales";
import Customers from "./pages/marketer/Customers";
import MySales from "./pages/marketer/MySales";
import MarketerExpenses from "./pages/marketer/MarketerExpenses";
import FreeServiceTracker from "./pages/marketer/FreeServiceTracker";
import PayStatus from "./pages/marketer/PayStatus";


export default function CRMModule() {
  const { crmUser } = useCRMAuth();

  return (
    <Routes>
      <Route element={<CRMLayout />}>
      
        {crmUser?.role === "admin" && (
          <>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="users" element ={<UserManagement />} />
          <Route path="dealers" element ={<DealerManagement />} />
          <Route path="inventory" element ={<InventoryManagement />} /> 
          <Route path="sales" element ={<Sales />} />
          <Route path="service" element = {<Service />} />
          <Route path="invoices" element = {<BillingNInvoice />} />
          <Route path="reports" element = {<ReportsAnalytics />} />
         <Route path="settings" element  ={<Setting />} />
          <Route path="audit-logs" element = {<AuditLogs />} />
           </>

        )}
      
        {crmUser?.role === "dealer" && (
          <>
          <Route path="dealer" element={<DealerDashboard />} />


          <Route path="stock-requests" element={<DealerStockRequests />} />
          <Route path="notices" element={<Notices />} />

          
          </>
        )}


        {crmUser?.role === "marketer" && (
          <>
            <Route path="marketer" element={<MarketerDashboard />} />
            <Route path="new-sales" element={<NewSales />} />
            <Route path="mysales" element ={<MySales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="expenses" element={<MarketerExpenses />} />
            <Route path="paystatus" element={<PayStatus />} />
          </>
        )}

        {crmUser?.role === "subadmin" && (
          <>
          <Route path="dashboard" element={<SubadminDashboard />} />
         
          </>       
        )}

        {crmUser?.role === "service engineer" && (
          <>
          <Route path="serviceengineer" element={<ServiceEngineerDashboard />}/>
          </>
        )}
        {!crmUser?.role && <Route path="*" element={<ErrorPage />} />}
      </Route>
    </Routes>
  );
}
