import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CRMLayout from "./layouts/CRMLayout";
import { useCRMAuth } from "./context/CRMAuthContext";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";


//Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement"
import DealerManagement from "./pages/admin/DealerManagement"
import InventoryManagement from "./pages/admin/InventoryManagement"
import Sales from "./pages/admin/Sales"
import Service from "./pages/admin/Service"
import BillingNInvoice from "./pages/admin/BillingNInvoice"
import Setting from "./pages/admin/settings"



//Dealer
import DealerDashboard from "./pages/dealers/DealerDashboard";
import DealerStockRequests from "./pages/dealers/DealerStockRequest";
import Notices from "./pages/dealers/dealerNotice";

//Subadmin
import SubadminDashboard from "./pages/subadmin/SubadminDashboard";
import Dealers from "./pages/subadmin/Dealers";
import ApproveExpenses from "./pages/subadmin/ApproveExpenses";
import ServiceTicket from "./pages/subadmin/ServiceTicket";
import Reports from "./pages/subadmin/Reports";




//ServiceEngg.
import ServiceEngineerDashboard from "./pages/serviceengineer/ServiceEngineerDashboard"
import AssignReport from "./pages/serviceengineer/AssignReport";
import ServiceReport from "./pages/serviceengineer/ServiceReport";
import Rimburesement from "./pages/serviceengineer/Rimbersment";



//Marketer
import MarketerDashboard from "./pages/marketer/MarketerDashboard";
import NewSales from "./pages/marketer/NewSales";
import MySales from "./pages/marketer/MySales";
import MarketerExpenses from "./pages/marketer/MarketerExpenses";
import PayStatus from "./pages/marketer/PayStatus";
import AddCustomer from "./pages/marketer/AddCustomer";
import InvoicePage from "./components/InvoicePage";




export default function CRMModule() {
  const { crmUser } = useCRMAuth();

  return (
    <Routes>
      <Route path="/crm" element={<Navigate to="/login" replace />} />
      <Route element={<CRMLayout />}>

    
      


        {crmUser?.role === "admin" && (
          <>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="dealers" element={<DealerManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="sales" element={<Sales />} />
            <Route path="service" element={<Service />} />
            <Route path="invoices" element={<BillingNInvoice />} />
            <Route path="settings" element={<Setting />} />

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
            <Route path="New-Customer" element={<AddCustomer />} />
            <Route path="new-sales" element={<NewSales />} />
            <Route path="mysales" element={<MySales />} />
            <Route path="expenses" element={<MarketerExpenses />} />
            <Route path="paystatus" element={<PayStatus />} />
            <Route path="invoice" element ={<InvoicePage />}/>
          </>
        )}

        {crmUser?.role === "subadmin" && (
          <>
            <Route path="subadmindashboard" element={<SubadminDashboard />} />
            <Route path="subadmin/dealers" element={<Dealers />} />
            <Route path="expenses/approve" element={<ApproveExpenses />} />
            <Route path="service/assign" element={<ServiceTicket />} />
            <Route path="/sub/reports" element={<Reports />} />
          </>
        )}
        {crmUser?.role === "engineer" && (
          <>
            <Route path="serviceengineer" element={<ServiceEngineerDashboard />} />
            <Route path="service/reports" element={<Reports />} />
            <Route path="service/assign-report" element={<AssignReport />} />
            <Route path="service/rimbursement" element={<Rimburesement />} />
            <Route path="service/report" element={<ServiceReport />} />
          </>
        )}


        {!crmUser?.role && <Route path="*" element={<ErrorPage />} />}

      </Route>
    </Routes>
  );
}
