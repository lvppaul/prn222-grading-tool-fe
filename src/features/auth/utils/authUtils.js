// Helpers to manage tokens and extract user info from JWT
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
}

function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded =
      base64 + (pad === 2 ? "==" : pad === 3 ? "=" : pad === 1 ? "===" : "");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserFromToken() {
  const token = localStorage.getItem("accessToken");
  const obj = decodeJwt(token);
  if (!obj) return null;

  return {
    id:
      obj.sub ||
      obj.nameidentifier ||
      obj[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      null,
    name:
      obj.name ||
      obj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      null,
    email:
      obj.email ||
      obj[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] ||
      null,
    role:
      obj.role ||
      obj.Role ||
      obj.roles ||
      obj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
      obj["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null,
  };
}

export function getRoleFromToken() {
  const token = localStorage.getItem("accessToken");
  const obj = decodeJwt(token);
  if (!obj) return null;
  return (
    obj.role ||
    obj.roles ||
    obj.Role ||
    obj["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    obj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
    null
  );
}

export function isAuthenticated() {
  // Per backend rules, frontend should not consider the access token expired.
  // We treat the presence of an access token as authenticated and let the
  // backend handle token expiration/refresh logic.
  const token = localStorage.getItem("accessToken");
  return !!token;
}
