import { Layout, Menu } from "antd";
import { FileTextOutlined, UploadOutlined, CloudUploadOutlined, PlusOutlined, TeamOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "/admin",
      icon: <FileTextOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "/admin/exams/create",
      icon: <PlusOutlined />,
      label: "Create Exam",
      onClick: () => navigate("/admin/exams/create"),
    },
    {
      key: "/admin/upload-submissions",
      icon: <CloudUploadOutlined />,
      label: "Upload Submissions",
      onClick: () => navigate("/admin/upload-submissions"),
    },
    {
      key: "/admin/students",
      icon: <TeamOutlined />,
      label: "Student Management",
      onClick: () => navigate("/admin/students"),
    },
    {
      key: "/admin/submissions",
      icon: <FolderOpenOutlined />,
      label: "Submission Management",
      onClick: () => navigate("/admin/submissions"),
    },
  ];

  return (
    <Layout.Sider
      width={200}
      style={{
        background: "#fff",
        position: "fixed",
        left: 0,
        top: 64,
        bottom: 0,
        overflowY: "auto",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        zIndex: 900,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ borderRight: 0 }}
      />
    </Layout.Sider>
  );
}
