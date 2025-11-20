import { useState, useEffect } from "react";
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  message, 
  Spin, 
  Typography,
  Row,
  Col,
  Statistic,
  Tabs,
  Input
} from "antd";
import { 
  CheckSquareOutlined, 
  EditOutlined, 
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSubmission } from "../hooks/useSubmission";

const { Title, Text } = Typography;

export default function ExaminerSubmissions() {
  const navigate = useNavigate();
  const { getAssignedSubmissions, loading } = useSubmission();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    graded: 0,
    pending: 0,
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await getAssignedSubmissions();
      const list = response?.payload || response || [];
      const data = Array.isArray(list) ? list : [];
      setSubmissions(data);
      setFilteredSubmissions(data);
      calculateStats(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
      message.error("Failed to load submissions");
    }
  };

  const loadSubmissionsForExam = async (examId) => {
    try {
      console.log(`Loading submissions for exam ${examId}...`);
      const subResponse = await getAssignedSubmissions(examId);
      console.log(`Exam ${examId} response:`, subResponse);
      const subList = subResponse?.payload || [];
      console.log(`Exam ${examId} submissions:`, subList);
      
      setSubmissionsByExam(prev => ({
        ...prev,
        [examId]: Array.isArray(subList) ? subList : []
      }));
      
      calculateStats(Array.isArray(subList) ? subList : []);
    } catch (err) {
      console.error(`Error loading submissions for exam ${examId}:`, err);
      message.error(`Failed to load submissions for exam ${examId}`);
      setSubmissionsByExam(prev => ({
        ...prev,
        [examId]: []
      }));
      calculateStats([]);
    }
  };

  const calculateStats = (submissions) => {
    const graded = submissions.filter(s => s.isGraded)?.length || 0;
    setStats({
      total: submissions.length,
      graded: graded,
      pending: submissions.length - graded,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredSubmissions(submissions);
      calculateStats(submissions);
      return;
    }

    const filtered = submissions.filter((submission) =>
      submission.studentCode?.toLowerCase().includes(value.toLowerCase().trim())
    );
    setFilteredSubmissions(filtered);
    calculateStats(filtered);
  };

  const handleTabChange = () => {};

  const columns = [
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      width: "15%",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      width: "25%",
    },
    {
      title: "Status",
      dataIndex: "isGraded",
      key: "isGraded",
      width: "15%",
      render: (isGraded) => (
        <Tag color={isGraded ? "green" : "orange"}>
          {isGraded ? "Graded" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space>
          {record.isGraded ? (
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/examiner/grading/${record.id}`)}
            >
              View
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/examiner/grading/${record.id}`)}
            >
              Grade
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const currentSubmissions = filteredSubmissions;

  return (
    <div>
      {/* Search Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo mã sinh viên (Student Code)"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          size="large"
          style={{ width: "100%" }}
        />
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Total Submissions"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Graded"
              value={stats.graded}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Submissions Table */}
      <Card
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Spin spinning={loading}>
          {currentSubmissions.length > 0 ? (
            <Table
              columns={columns}
              dataSource={currentSubmissions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
              <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>No submissions assigned to you yet</p>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
}
