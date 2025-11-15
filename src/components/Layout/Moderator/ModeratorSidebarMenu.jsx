import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function ModeratorSidebarMenu({ collapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { key: "/moderator", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/moderator/semesters", icon: <FileSearchOutlined />, label: "Submissions" },
    { key: "/moderator/settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  // FIX: Better matching so nested routes highlight the menu properly
  const selectedKey =
    items.find((i) => pathname.startsWith(i.key))?.key || "/moderator";

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
