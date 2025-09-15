import { createContext, useContext, useState, useEffect } from "react";

export const CRMAuthContext = createContext();

export function CRMAuthProvider({ children }) {
  const [crmUser, setCrmUser] = useState(() => {
    const stored = localStorage.getItem("crmUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Save to localStorage on change
  useEffect(() => {
    if (crmUser) {
      localStorage.setItem("crmUser", JSON.stringify(crmUser));
    } else {
      localStorage.removeItem("crmUser");
    }
  }, [crmUser]);

  // Add login function to set user and role
  const login = ({ email, role }) => {
    setCrmUser({ email, role });
  };

  return (
    <CRMAuthContext.Provider value={{ crmUser, setCrmUser, login }}>
      {children}
    </CRMAuthContext.Provider>
  );
}

export function useCRMAuth() {
  return useContext(CRMAuthContext);
}