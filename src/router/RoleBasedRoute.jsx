import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div
        style={{
          position: "fixed", // cố định toàn màn hình
          top: 0,
          left: 0,
          width: "100vw", // chiếm toàn bộ chiều ngang
          height: "100vh", // chiếm toàn bộ chiều dọc
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // căn giữa ngang
          justifyContent: "center", // căn giữa dọc
          textAlign: "center",
          backgroundColor: "#fff", // optional: nền trắng
        }}
      >
        <h1>🚫 Bạn không có quyền truy cập</h1>
        <p>Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.</p>
        <a
          href="/"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          ⬅️ Quay lại Trang chủ
        </a>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;
