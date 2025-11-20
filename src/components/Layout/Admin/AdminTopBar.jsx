import { Layout, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo_grading_tool.png";

export default function AdminTopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    message.success("Logged out successfully");
    navigate("/auth/login");
  };

  const items = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout.Header
      style={{
        background: "#001529",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        width: "100%",
        zIndex: 999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
        <span style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
          Admin Dashboard
        </span>
      </div>

      <Dropdown menu={{ items }} placement="bottomRight">
        <Button
          type="text"
          icon={<UserOutlined />}
          style={{ color: "white", fontSize: "16px" }}
        />
      </Dropdown>
    </Layout.Header>
  );
}
