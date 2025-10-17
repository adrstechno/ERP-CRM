import { createContext, useContext, useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import SessionWarningModal from "../components/SessionWarningModel";


export const CRMAuthContext = createContext();

export function CRMAuthProvider({ children }) {
  const navigate = useNavigate();
  const [crmUser, setCrmUser] = useState(() => {
    const stored = localStorage.getItem("crmUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [warningOpen, setWarningOpen] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(20);

  const logoutTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  const clearAllTimeouts = () => {
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
  };

  const handleLogout = () => {
    clearAllTimeouts();
    localStorage.removeItem("authKey");
    localStorage.removeItem("crmUser");
    setCrmUser(null);
    setWarningOpen(false);
    navigate("/login", { replace: true });
  };

  const showWarning = () => setWarningOpen(true);

  const login = ({ email, role, token }) => {
    setCrmUser({ email, role, token });
    localStorage.setItem("authKey", token);
    localStorage.setItem("crmUser", JSON.stringify({ email, role }));

    scheduleTimers(token);
  };

  const scheduleTimers = (token) => {
    clearAllTimeouts();
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) return handleLogout();

      // Show warning 20s before expiry
      const warningTime = remaining > 20000 ? remaining - 20000 : 0;
      setWarningSeconds(Math.min(20, Math.floor(remaining / 1000)));

      if (warningTime > 0) {
        warningTimeoutRef.current = setTimeout(showWarning, warningTime);
      } else {
        setWarningOpen(true);
      }

      logoutTimeoutRef.current = setTimeout(handleLogout, remaining);
    } catch {
      handleLogout();
    }
  };

  const stayLoggedIn = () => {
    setWarningOpen(false);
    // Reset timers using current token
    const token = localStorage.getItem("authKey");
    if (token) scheduleTimers(token);
  };

  // Initialize timers on page reload
  useEffect(() => {
    const token = localStorage.getItem("authKey");
    if (token) scheduleTimers(token);

    return () => clearAllTimeouts();
  }, []);

  return (
    <CRMAuthContext.Provider value={{ crmUser, login, handleLogout }}>
      {children}
      <SessionWarningModal
        open={warningOpen}
        totalSeconds={warningSeconds}
        onStay={stayLoggedIn}
        onLogout={handleLogout}
      />
    </CRMAuthContext.Provider>
  );
}

export function useCRMAuth() {
  return useContext(CRMAuthContext);
}
