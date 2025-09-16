import React from "react";
import { Navigate } from "react-router-dom";
import { useCRMAuth } from "../modules/crm/context/CRMAuthContext";

const PrivateRoute = ({ children }) => {
  const { crmUser } = useCRMAuth();
  if (!crmUser?.role) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
