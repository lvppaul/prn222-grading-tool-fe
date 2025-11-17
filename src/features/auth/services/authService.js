import axiosClient from "../../../lib/axios";
import { setTokens, clearTokens, getRoleFromToken } from "../utils/authUtils";

export const authService = {
  login: async (data) => {
    console.log("login data", data);
    const res = await axiosClient.post("/auth/login", data);
    const body = res.data;

    // New API structure: { payload: { accessToken, refreshToken }, status, message }
    const tokenContainer = body?.payload || {};
    const accessToken = tokenContainer?.accessToken;
    const refreshToken = tokenContainer?.refreshToken;

    if (!accessToken) {
      return { success: false, message: body?.message || "Login failed" };
    }

    // persist tokens using helper
    setTokens({ accessToken, refreshToken });

    // store role if present in token
    try {
      const role = getRoleFromToken();
      if (role) localStorage.setItem("role", role);
    } catch {
      // ignore
    }

    return {
      success: true,
      message: body?.message || "Login successful",
      data: body,
    };
  },

  register: async (data) => {
    console.log("register data", data);
    const res = await axiosClient.post("/auth/register", data);
    const body = res.data;

    const tokenContainer = body?.payload || {};
    const accessToken = tokenContainer?.accessToken;
    const refreshToken = tokenContainer?.refreshToken;

    if (!accessToken) {
      return {
        success: false,
        message: body?.message || "Registration failed",
      };
    }

    setTokens({ accessToken, refreshToken });

    try {
      const role = getRoleFromToken();
      if (role) localStorage.setItem("role", role);
    } catch {
      // ignore
    }

    return {
      success: true,
      message: body?.message || "Registration successful",
      data: body,
    };
  },

  logout: async () => {
    // Call backend to invalidate tokens
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      await axiosClient.post("/auth/logout", {
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
