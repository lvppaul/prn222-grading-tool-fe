import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { getUserFromToken } from "../../features/auth/utils/authUtils";

const { Header: AntHeader } = Layout;

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = getUserFromToken();
  const name = user?.name || "User";

  console.log("User in header:", user);
  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    { type: "divider", key: "divider-1" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo / Project Name */}
      <h3 style={{ margin: 0 }}>PRN222 Grading Tool</h3>

      {/* User Info */}
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ textAlign: "right", lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {user?.role || "-"}
            </div>
          </div>
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
        </div>
      </Dropdown>
    </AntHeader>
  );
}
