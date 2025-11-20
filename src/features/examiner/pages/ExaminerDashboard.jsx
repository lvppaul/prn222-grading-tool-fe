import { Card, Row, Col, Statistic, Typography, Space } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ExaminerDashboard() {
  return (
    <div>
      {/* Welcome Section */}
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <DashboardOutlined style={{ fontSize: 32, color: "#1677ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              Welcome to Examiner Dashboard
            </Title>
          </Space>
          <Paragraph style={{ fontSize: 16, color: "#666", margin: 0 }}>
            Manage and grade your assigned submissions efficiently.
          </Paragraph>
        </Space>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Active Exams"
              value={0}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Graded Submissions"
              value={0}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Pending Submissions"
              value={0}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="middle">
          <Paragraph>
            • View your assigned exams in the <strong>My Exams</strong> section
          </Paragraph>
          <Paragraph>
            • Check submissions that need grading in <strong>Assigned Submissions</strong>
          </Paragraph>
          <Paragraph>
            • Start grading submissions by clicking on the exam
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}
