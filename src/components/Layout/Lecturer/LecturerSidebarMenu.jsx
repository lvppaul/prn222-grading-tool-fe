import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  DashboardOutlined,
  ReadOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function SidebarMenu({ collapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { key: "/lecturer", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/lecturer/grading", icon: <ReadOutlined />, label: "Grading" },
    { key: "/lecturer/settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  // determine selected item by prefix match
  const selectedKey =
    items.find((i) => pathname === i.key || pathname.startsWith(i.key))?.key ||
    "/lecturer";

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={({ key }) => navigate(key)}
      style={{ borderInlineEnd: "none", paddingTop: 8 }}
    />
  );
}
