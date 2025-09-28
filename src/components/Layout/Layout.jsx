import React from "react";
import { Layout as AntLayout } from "antd";
import Header from "./Header";

const { Content } = AntLayout;

export default function Layout({ children }) {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: 20 }}>{children}</Content>
    </AntLayout>
  );
}
