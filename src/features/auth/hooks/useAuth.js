import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { getUserFromToken, isAuthenticated } from "../utils/authUtils";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => getUserFromToken());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  useEffect(() => {
    // sync user/auth state when storage changes (e.g., other tabs)
    const onStorage = () => {
      setUser(getUserFromToken());
      setAuthenticated(isAuthenticated());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });

      // update local state from stored token
      setUser(getUserFromToken());
      setAuthenticated(isAuthenticated());
      return res;
    } catch (err) {
      // bubble up error shape
      return { success: false, message: err?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      setUser(getUserFromToken());
      setAuthenticated(isAuthenticated());
      return res;
    } catch (err) {
      return { success: false, message: err?.message || "Register failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, user, authenticated };
}
