import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Select,
  message,
  Tag,
  Statistic,
  Row,
  Col,
  Modal,
  Alert,
  Input,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useExam } from "../../admin/hooks/useExam";
import { useManagerSubmission } from "../hooks/useSubmission";
import { useExaminer } from "../../auth/hooks/useExaminer";

const { Title, Text } = Typography;

export default function AssignByClass() {
  const { getAllExams, loading: loadingExams } = useExam();
  const { getSubmissionsByExam, assignSubmissions, loading: loadingSubmissions } = useManagerSubmission();
  const { examiners, loading: loadingExaminers } = useExaminer();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState([]);
  const [selectedExaminerId, setSelectedExaminerId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await getAllExams();
      const examList = response?.payload || response || [];
      const availableExams = Array.isArray(examList)
        ? examList.filter((e) => e.status !== "Closed" && e.status !== "Draft")
        : [];
      setExams(availableExams);
    } catch (err) {
      console.error("Error loading exams:", err);
      message.error("Failed to load exams");
    }
  };

  const loadSubmissions = async (examId) => {
    if (!examId) return;
    try {
      const response = await getSubmissionsByExam(examId);
      const submissionsData = response.payload || response.Payload || [];
      setSubmissions(submissionsData);
      setSelectedClass(null);
      setSelectedSubmissionIds([]);
      setSelectedExaminerId(null);
    } catch (err) {
      console.error("Error loading submissions:", err);
      message.error("Failed to load submissions");
    }
  };

  const handleExamChange = (examId) => {
    setSelectedExamId(examId);
    loadSubmissions(examId);
  };

  // Group submissions by class
  const groupedByClass = submissions.reduce((acc, submission) => {
    const className = submission.class || "Unknown";
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(submission);
    return acc;
  }, {});

  const classes = Object.keys(groupedByClass).sort();

  // Filter submissions by selected class and search
  const filteredSubmissions = selectedClass
    ? groupedByClass[selectedClass].filter(
        (sub) =>
          sub.studentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
          sub.studentName?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleAssign = () => {
    if (selectedSubmissionIds.length === 0) {
      message.warning("Please select at least one submission");
      return;
    }
    if (!selectedExaminerId) {
      message.warning("Please select an examiner");
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirmAssignment = async () => {
    try {
      await assignSubmissions({
        examinerId: selectedExaminerId,
        submissionIds: selectedSubmissionIds,
      });

      message.success(
        `Successfully assigned ${selectedSubmissionIds.length} submission(s)!`
      );
      setIsModalVisible(false);
      setSelectedSubmissionIds([]);
      setSelectedExaminerId(null);
      loadSubmissions(selectedExamId); // Reload
    } catch (err) {
      console.error("Error assigning submissions:", err);
      message.error("Failed to assign submissions");
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedSubmissionIds,
    onChange: (selectedRowKeys) => {
      setSelectedSubmissionIds(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.isAssigned || record.isGraded,
    }),
  };

  const columns = [
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Exam Code",
      dataIndex: "examCode",
      key: "examCode",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          Extracted: "orange",
          Assigned: "blue",
          Grading: "cyan",
          Graded: "green",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Assigned",
      key: "isAssigned",
      render: (_, record) =>
        record.isAssigned ? (
          <Tag color="green">
            <CheckCircleOutlined /> Assigned
          </Tag>
        ) : (
          <Tag color="orange">Not Assigned</Tag>
        ),
    },
  ];

  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const selectedExaminer = examiners.find((e) => e.id === selectedExaminerId);

  const totalInClass = selectedClass ? groupedByClass[selectedClass].length : 0;
  const assignedInClass = selectedClass
    ? groupedByClass[selectedClass].filter((s) => s.isAssigned).length
    : 0;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <UsergroupAddOutlined style={{ fontSize: 32, color: "#1677ff" }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Assign Submissions by Class
              </Title>
              <Text type="secondary">
                Assign entire classes to examiners for grading
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
          placeholder="Choose an exam to assign submissions"
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

      {/* Class Selection */}
      {selectedExamId && classes.length > 0 && (
        <Card
          title="🎯 Select Class"
          bordered={false}
          style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Select
              style={{ width: "100%" }}
              size="large"
              placeholder="Choose a class to view submissions"
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                setSelectedSubmissionIds([]);
              }}
              allowClear
            >
              {classes.map((className) => (
                <Select.Option key={className} value={className}>
                  <Space>
                    <TeamOutlined />
                    <span>{className}</span>
                    <Tag color="blue">
                      {groupedByClass[className].length} students
                    </Tag>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            {selectedClass && (
              <Alert
                message={
                  <Space>
                    <TeamOutlined />
                    <Text>
                      Selected class: <strong>{selectedClass}</strong> (
                      {totalInClass} submissions, {assignedInClass} already assigned)
                    </Text>
                  </Space>
                }
                type="info"
                showIcon
              />
            )}
          </Space>
        </Card>
      )}

      {/* Statistics */}
      {selectedClass && (
        <Card
          bordered={false}
          style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total in Class"
                value={totalInClass}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1677ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Already Assigned"
                value={assignedInClass}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Not Assigned"
                value={totalInClass - assignedInClass}
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Selected"
                value={selectedSubmissionIds.length}
                valueStyle={{ color: "#722ed1" }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Examiner Selection & Assignment */}
      {selectedClass && (
        <Card
          title="👨‍🏫 Select Examiner"
          bordered={false}
          style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          extra={
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleAssign}
              disabled={
                selectedSubmissionIds.length === 0 || !selectedExaminerId
              }
            >
              Assign {selectedSubmissionIds.length} Submission(s)
            </Button>
          }
        >
          <Select
            style={{ width: "100%" }}
            size="large"
            placeholder="Choose an examiner to assign submissions"
            loading={loadingExaminers}
            value={selectedExaminerId}
            onChange={setSelectedExaminerId}
          >
            {examiners.map((examiner) => (
              <Select.Option key={examiner.id} value={examiner.id}>
                <Space>
                  <UserOutlined />
                  <span>{examiner.name}</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({examiner.email})
                  </Text>
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Card>
      )}

      {/* Submissions Table */}
      {selectedClass && (
        <Card
          title="📋 Submissions in Class"
          bordered={false}
          style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          extra={
            <Space>
              <Input
                placeholder="Search by student code or name"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Text type="secondary">
                {selectedSubmissionIds.length} selected
              </Text>
            </Space>
          }
        >
          <Alert
            message="Select submissions by checking the boxes, then choose an examiner to assign them"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredSubmissions}
            rowKey="id"
            loading={loadingSubmissions}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} submissions`,
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
            <UsergroupAddOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
            <div>
              <Title level={4}>No Exam Selected</Title>
              <Text type="secondary">
                Please select an exam from the dropdown above to assign submissions
                by class
              </Text>
            </div>
          </Space>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Assignment"
        open={isModalVisible}
        onOk={handleConfirmAssignment}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText="Confirm Assignment"
        okButtonProps={{ size: "large" }}
        cancelButtonProps={{ size: "large" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            message={`You are about to assign ${selectedSubmissionIds.length} submission(s)`}
            type="info"
            showIcon
          />

          <Card size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>
                <strong>Class:</strong> {selectedClass}
              </Text>
              <Text>
                <strong>Examiner:</strong> {selectedExaminer?.name}
              </Text>
              <Text type="secondary">{selectedExaminer?.email}</Text>
              <Text>
                <strong>Submissions:</strong> {selectedSubmissionIds.length}
              </Text>
            </Space>
          </Card>

          <Alert
            message="This action will assign the selected submissions to the examiner."
            type="warning"
            showIcon
          />
        </Space>
      </Modal>
    </div>
  );
}
