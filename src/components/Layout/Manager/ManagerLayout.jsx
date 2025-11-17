import { useState } from "react";
import { Layout, Grid } from "antd";
import { Outlet } from "react-router-dom";
import ManagerSidebarMenu from "./ManagerSidebarMenu";
import ManagerTopBar from "./ManagerTopBar";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Dark Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        theme="dark"
        width={240}
        style={{ position: "sticky", top: 0, left: 0, height: "100vh" }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: collapsed ? "0 12px" : "0 16px",
            gap: 12,
            color: "#fff",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#1677ff",
            }}
          />
          {!collapsed && <span>CodeGrader</span>}
        </div>

        <ManagerSidebarMenu collapsed={collapsed} />
      </Sider>

      {/* Right side: Header + Content */}
      <Layout>
        <Header
          style={{
            height: 64,
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            paddingInline: 16,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <ManagerTopBar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </Header>

        <Content style={{ padding: 24, background: "#f5f7fa" }}>
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              minHeight: "calc(100vh - 64px - 48px)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
