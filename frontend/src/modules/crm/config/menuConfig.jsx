
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import WorkIcon from "@mui/icons-material/Work";
import MailIcon from "@mui/icons-material/Mail";
import PaymentIcon from "@mui/icons-material/Payment";

export const crmMenuConfig = {
  admin: [
    { label: "Dashboard", path: "/crm/admin", icon: <DashboardIcon /> },
    { label: "User Management", path: "/crm/users", icon: <PeopleIcon /> },
    { label: "Dealers Management", path: "/crm/dealers", icon: <WorkIcon /> },
    { label: "Inventory", path: "/crm/inventory", icon: <InventoryIcon /> },
    { label: "Sales", path: "/crm/sales", icon: <ShoppingCartIcon /> },
    { label: "Service", path: "/crm/service", icon: <AssignmentIcon /> },
    { label: "Billing & Invoices", path: "/crm/invoices", icon: <ReceiptIcon /> },
    { label: "Reports & Analytics", path: "/crm/reports", icon: <BarChartIcon /> },
    { label: "Settings", path: "/crm/settings", icon: <SettingsIcon /> },
    { label: "Audit Logs", path: "/crm/audit-logs", icon: <HistoryIcon /> },
  ],

  subadmin: [
    { label: "Dashboard", path: "/crm/subadmindashboard", icon: <DashboardIcon /> },
    { label: "Dealers", path: "/crm/subadmin/dealers", icon: <WorkIcon /> },
    { label: "Approve Expenses", path: "/crm/expenses/approve", icon: <ReceiptIcon /> },
    { label: "Assign Service Tickets", path: "/crm/service/assign", icon: <AssignmentIcon /> },
    { label: "Reports", path: "/crm/sub/reports", icon: <BarChartIcon /> },
  ],

  dealer: [
    { label: "Dashboard", path: "/crm/dealer", icon: <DashboardIcon /> },
    { label: "Stock Requests", path: "/crm/stock-requests", icon: <InventoryIcon /> },
    
    { label: "Notices", path: "/crm/notices", icon: <MailIcon /> },
    {/* label: "Sales Entry", path: "/crm/sales/entry", icon: <ShoppingCartIcon /> */},
    { /*label: "Invoices & Payments", path: "/crm/invoices", icon: <ReceiptIcon /> */},
    {/* label: "Profile", path: "/crm/profile", icon: <PersonIcon /> */},
  ],

   marketer :[
  { label: "Dashboard", path: "/crm/marketer", icon: <DashboardIcon /> },
  { label: "Add Customers", path: "/crm/customers", icon: <PeopleIcon /> },
  { label: "My Sales", path: "/crm/mysales", icon: <ShoppingCartIcon /> },
  { label: "Expenses", path: "/crm/expenses", icon: <ReceiptIcon /> },
  { label: "Pay Status", path: "/crm/paystatus", icon: <PaymentIcon /> }, // ✅ Added new menu
  ],
  engineer: [
    { label: "Dashboard", path: "/crm/serviceengineer", icon: <DashboardIcon /> },
    { label: "Assigned Tickets", path: "/crm/service/assign-report", icon: <AssignmentIcon /> },
    { label: "Service Reports", path: "/crm/service/report", icon: <WorkIcon /> },
    { label: "Rimbursement", path: "/crm/service/rimbursement", icon: <ReceiptIcon /> },
   
  ],

  // customers won’t log in → no sidebar needed
};
