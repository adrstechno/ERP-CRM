import { createContext, useContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Corrected import
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Added for API calls
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
    const userData = { email, role };
    setCrmUser({ ...userData, token });
    localStorage.setItem("authKey", token);
    localStorage.setItem("crmUser", JSON.stringify(userData));
    scheduleTimers(token);
  };

  const scheduleTimers = (token) => {
    clearAllTimeouts();
    try {
      const decoded = jwtDecode(token); // ✅ Correct usage
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) return handleLogout();

      // Show warning 20 seconds before expiry
      const warningTime = remaining > 20000 ? remaining - 20000 : 0;
      setWarningSeconds(Math.min(20, Math.floor(remaining / 1000)));

      if (warningTime > 0) {
        warningTimeoutRef.current = setTimeout(showWarning, warningTime);
      } else {
        setWarningOpen(true); // Show immediately if less than 20s left
      }

      logoutTimeoutRef.current = setTimeout(handleLogout, remaining);
    } catch (error) {
      console.error("Invalid token:", error);
      handleLogout();
    }
  };

  // ⭐️ NEW: Function to get a new token from the backend
  const refreshToken = async () => {
    try {
      // Note: Your backend endpoint might be different
      const response = await axios.post('/api/auth/refresh-token', {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("authKey")}` }
      });
      
      const { token: newToken } = response.data;
      
      localStorage.setItem("authKey", newToken);
      setCrmUser(prev => ({ ...prev, token: newToken }));
      
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token. Logging out.", error);
      handleLogout(); // If refresh fails, force logout
      return null;
    }
  };

  // ⭐️ UPDATED: stayLoggedIn is now async and calls refreshToken
  const stayLoggedIn = async () => {
    setWarningOpen(false);
    const newToken = await refreshToken();
    if (newToken) {
      scheduleTimers(newToken);
    }
  };

  // Initialize timers on page load
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