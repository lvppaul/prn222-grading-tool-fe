import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Space,
  Typography,
  Input,
  message,
  Select,
  Tag,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useExam } from "../hooks/useExam";
import useStudent from "../hooks/useStudent";

const { Title, Text } = Typography;

export default function StudentManagement() {
  const { getAllExams, loading: loadingExams } = useExam();
  const {
    students,
    loading: loadingStudents,
    getStudentsByExam,
  } = useStudent();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await getAllExams();
      const examList = response?.payload || response || [];
      const availableExams = Array.isArray(examList) ? examList : [];
      setExams(availableExams);
    } catch (err) {
      console.error("Error loading exams:", err);
      message.error("Failed to load exams");
    }
  };

  const loadStudents = async (examId) => {
    if (!examId) return;
    try {
      await getStudentsByExam(examId);
    } catch (err) {
      console.error("Error loading students:", err);
      message.error("Failed to load students");
    }
  };

  const handleExamChange = (examId) => {
    setSelectedExamId(examId);
    loadStudents(examId);
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const filteredStudents = students.filter(
    (student) =>
      student.studentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.class?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      sorter: (a, b) => (a.studentCode || "").localeCompare(b.studentCode || ""),
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      sorter: (a, b) => (a.class || "").localeCompare(b.class || ""),
    },
    {
      title: "Solution Name",
      dataIndex: "solutionName",
      key: "solutionName",
      ellipsis: true,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <TeamOutlined style={{ fontSize: 32, color: "#1677ff" }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Student Management
              </Title>
              <Text type="secondary">
                Manage students and their submissions for each exam
              </Text>
            </div>
          </Space>
        </Space>
      </Card>

      {/* Exam Selection */}
      <Card
        title="📚 Select Exam"
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Select
          style={{ width: "100%" }}
          size="large"
          placeholder="Choose an exam to manage students"
          loading={loadingExams}
          value={selectedExamId}
          onChange={handleExamChange}
        >
          {exams.map((exam) => (
            <Select.Option key={exam.id} value={exam.id}>
              <Space>
                <span>
                  {exam.code} - {exam.name}
                </span>
                <Tag color="blue">{exam.status}</Tag>
                <Text type="secondary">({exam.semesterName})</Text>
              </Space>
            </Select.Option>
          ))}
        </Select>
        {selectedExam && (
          <div style={{ marginTop: 16 }}>
            <Tag color="green">Selected: {selectedExam.code}</Tag>
          </div>
        )}
      </Card>

      {/* Statistics */}
      {selectedExamId && students.length > 0 && (
        <Card
          bordered={false}
          style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Total Students"
                value={students.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1677ff" }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Exam Code"
                value={selectedExam?.code || "N/A"}
                valueStyle={{ fontSize: 20 }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Exam Status"
                value={selectedExam?.status || "N/A"}
                valueStyle={{ fontSize: 20, color: "#52c41a" }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Student List */}
      {selectedExamId && (
        <Card
          title="👥 Student List"
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          extra={
            <Input
              placeholder="Search by code, name, or class"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          }
        >
          <Table
            columns={columns}
            dataSource={filteredStudents}
            rowKey="id"
            loading={loadingStudents}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} students`,
            }}
          />
        </Card>
      )}

      {/* No Exam Selected */}
      {!selectedExamId && (
        <Card
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center" }}
        >
          <Space direction="vertical" size="large">
            <TeamOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
            <div>
              <Title level={4}>No Exam Selected</Title>
              <Text type="secondary">
                Please select an exam from the dropdown above to manage students
              </Text>
            </div>
          </Space>
        </Card>
      )}


    </div>
  );
}
