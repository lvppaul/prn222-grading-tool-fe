import axiosClient from "../../../lib/axios";
import { setTokens, clearTokens, getRoleFromToken } from "../utils/authUtils";

export const authService = {
  login: async (data) => {
    console.log("login data", data);
    // API can return tokens under `data` or `payload` depending on backend
    const res = await axiosClient.post("/Authentication/login", data);
    const body = res.data;
    // prefer body.payload, fallback to body.data
    const tokenContainer = body?.payload || body?.data || {};
    const accessToken = tokenContainer?.accessToken;
    const refreshToken = tokenContainer?.refreshToken;

    // persist tokens using helper
    setTokens({ accessToken, refreshToken });

    // store role if present in token
    try {
      const role = getRoleFromToken();
      if (role) localStorage.setItem("role", role);
    } catch {
      // ignore
    }

    return body;
  },

  register: async (data) => {
    console.log("register data", data);
    const res = await axiosClient.post("/Authentication/register", data);
    const body = res.data;
    const tokenContainer = body?.payload || body?.data || {};
    const accessToken = tokenContainer?.accessToken;
    const refreshToken = tokenContainer?.refreshToken;

    setTokens({ accessToken, refreshToken });

    try {
      const role = getRoleFromToken();
      if (role) localStorage.setItem("role", role);
    } catch {
      // ignore
    }

    return body;
  },

  logout: async () => {
    // Call backend to invalidate tokens
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      await axiosClient.post("/Authentication/logout", {
        accessToken,
        refreshToken,
      });
    } catch {
      // ignore network errors, still clear local storage
    } finally {
      clearTokens();
      window.location.href = "/auth/login";
    }
  },
};

// read role from current stored token is handled in `authUtils`
