import { useState } from "react";
import { authService } from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await authService.login({ email, password });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      return res;
    } catch {
      return { success: false, message: "Register failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading };
}
