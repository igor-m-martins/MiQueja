import React, { createContext, useContext, useEffect, useState } from "react";
import { buildUrl } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch(buildUrl("session"), { credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (data.active && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (e) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  const login = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await fetch(buildUrl("logout"), { method: "POST", credentials: "include" });
    } catch (e) {
      // ignore network errors
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
