// Small helper to extract user info from JWT stored in localStorage
export function getUserFromToken() {
  const token = localStorage.getItem("accessToken");
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
    const obj = JSON.parse(json);
    return {
      id:
        obj.sub ||
        obj["nameidentifier"] ||
        obj[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      name:
        obj.name ||
        obj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email:
        obj.email ||
        obj[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      role:
        obj.role ||
        obj.Role ||
        obj.roles ||
        obj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
        obj["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    };
  } catch {
    return null;
  }
}
