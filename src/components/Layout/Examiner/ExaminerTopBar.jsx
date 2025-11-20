import { Space, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function ExaminerTopBar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/auth/login");
  };

  const userMenuItems = [
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
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ fontSize: 18 }}
      />

      <Space size="large">
        <span style={{ color: "#666", fontWeight: 500 }}>Examiner Portal</span>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} style={{ background: "#1677ff" }} />
            <span style={{ fontWeight: 500 }}>Examiner</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
}
