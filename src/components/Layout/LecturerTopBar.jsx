import { Button, Dropdown, Space, Avatar, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function TopBar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const items = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/lecturer/settings"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.removeItem("role");
        navigate("/auth/login");
      },
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
      />

      <div style={{ marginLeft: "auto" }}>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <div style={{ textAlign: "right", lineHeight: 1 }}>
              <Text strong>Lecturer</Text>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  alice.johnson@univ.edu
                </Text>
              </div>
            </div>
            <Avatar size={40} icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
}
