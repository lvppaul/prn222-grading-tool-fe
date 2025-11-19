import { Outlet } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebarMenu from "./AdminSidebarMenu";
import { Layout } from "antd";

export default function AdminLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminTopBar />
      <Layout style={{ marginTop: 64, marginLeft: 200 }}>
        <AdminSidebarMenu />
        <Layout.Content style={{ padding: "24px", background: "#f5f5f5", marginLeft: 0 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
