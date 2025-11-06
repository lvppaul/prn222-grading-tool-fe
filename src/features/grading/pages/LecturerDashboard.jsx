import { Layout, Typography, Card, Row, Col, Avatar, Space, List } from "antd";
import { UserOutlined, FileSearchOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LecturerDashboard() {
  const recentSubmissions = [
    { student: "Alice Johnson", task: "Binary Search Assignment", status: "Graded" },
    { student: "Bob Smith", task: "LinkedList Implementation", status: "Pending" },
    { student: "Charlie Brown", task: "React Hooks Task", status: "Graded" },
  ];

  return (
    <Layout style={{ padding: "32px" }}>
      {/* Welcome Section */}
      <Card style={{ marginBottom: 24 }}>
        <Space align="center">
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={3} style={{ margin: 0 }}>Welcome back, Lecturer 👋</Title>
            <Text type="secondary">Here's an overview of your grading activity</Text>
          </div>
        </Space>
      </Card>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Title level={4}>Total Submissions Graded</Title>
            <Text strong style={{ fontSize: 24 }}>42</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Title level={4}>Pending Reviews</Title>
            <Text strong style={{ fontSize: 24 }}>6</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Title level={4}>Average Score</Title>
            <Text strong style={{ fontSize: 24 }}>82 / 100</Text>
          </Card>
        </Col>
      </Row>

      {/* Recent Submissions */}
      <Card title="Recent Submissions">
        <List
          dataSource={recentSubmissions}
          renderItem={(item) => (
            <List.Item actions={[<Text strong>{item.status}</Text>]}>
              <List.Item.Meta
                avatar={<Avatar icon={<FileSearchOutlined />} />}
                title={item.student}
                description={item.task}
              />
            </List.Item>
          )}
        />
      </Card>
    </Layout>
  );
}
