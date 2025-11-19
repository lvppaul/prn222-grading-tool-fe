import { ConfigProvider, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileSearchOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

export default function ManagerSidebarMenu({ collapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { key: "/manager/semesters", icon: <FileSearchOutlined />, label: "Submissions" },
    { key: "/manager/extracted", icon: <ClockCircleOutlined />, label: "Extracted" },
    { key: "/manager/assign-by-class", icon: <UsergroupAddOutlined />, label: "Assign by Class" },
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
