import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load saved user on first render
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData)); // ✅ save
    console.log("User logged in:", userData);
  };

//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem("user"); // ✅ clear
//   };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
