import { Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function ExaminerSidebarMenu({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/examiner/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/examiner/submissions",
      icon: <CheckSquareOutlined />,
      label: "Assigned Submissions",
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{ border: 0 }}
    />
  );
}
