import axiosClient from "../../../lib/axios";

export const authService = {
  login: async (data) => {
    // New API returns: { success, message, data: { accessToken, refreshToken } }
    const res = await axiosClient.post("/Authentication/login", data);
    const payload = res.data;
    const accessToken = payload?.data?.accessToken;
    const refreshToken = payload?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      // Try to decode role from JWT and store it for role-based routing
      try {
        const role = getRoleFromJwt(accessToken);
        if (role) {
          localStorage.setItem("role", role);
        }
      } catch {
        // ignore decode errors
      }
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    return payload;
  },

  register: async (data) => {
    // API returns same shape as login: { success, message, data: { accessToken, refreshToken } }
    const res = await axiosClient.post("/Authentication/register", data);
    const payload = res.data;
    const accessToken = payload?.data?.accessToken;
    const refreshToken = payload?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      try {
        const role = getRoleFromJwt(accessToken);
        if (role) localStorage.setItem("role", role);
      } catch {
        // ignore
      }
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    return payload;
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      window.location.href = "/auth/login";
    }
  },
};

// Helper: decode JWT payload and extract role from common claim keys
function getRoleFromJwt(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = parts[1];
  // base64url -> base64
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding
  const pad = base64.length % 4;
  const padded =
    base64 + (pad === 2 ? "==" : pad === 3 ? "=" : pad === 1 ? "===" : "");
  const json = atob(padded);
  const obj = JSON.parse(json);

  // Common role claim names
  const roleKeys = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
  ];

  for (const key of roleKeys) {
    if (obj[key]) return obj[key];
  }

  // fallback: check 'claims' object
  if (obj.claims) {
    for (const key of roleKeys) {
      if (obj.claims[key]) return obj.claims[key];
    }
  }

  return null;
}
