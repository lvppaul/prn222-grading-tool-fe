import { ConfigProvider, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function ModeratorSidebarMenu({ collapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { key: "/moderator/semesters", icon: <FileSearchOutlined />, label: "Submissions" },
  ];

  // Correct match for nested routes
  const selectedKey =
    items.find((i) => pathname === i.key || pathname.startsWith(i.key))?.key ||
    "/moderator";

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemSelectedBg: "#1677ff",      // selected background color
            darkItemSelectedColor: "#ffffff",   // selected text color
            darkItemHoverBg: "#165996",         // hover
          },
        },
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={({ key }) => navigate(key)}
        inlineCollapsed={collapsed}
        style={{ borderInlineEnd: "none", paddingTop: 8 }}
      />
    </ConfigProvider>
  );
}
