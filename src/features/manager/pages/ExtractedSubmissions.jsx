import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  message,
  Spin,
  Row,
  Col,
  Statistic,
  Modal,
  Select,
  Input,
} from "antd";
import {
  FileTextOutlined,
  UserAddOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useManagerSubmission } from "../hooks/useSubmission";
import { useExaminer } from "../../auth/hooks/useExaminer";

const { Option } = Select;

export default function ExtractedSubmissions() {
  const { getExtractedSubmissions, assignSubmissions, loading } = useManagerSubmission();
  const { examiners, loading: loadingExaminers } = useExaminer();
  const [submissions, setSubmissions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedExaminerId, setSelectedExaminerId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [examFilter, setExamFilter] = useState("All");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await getExtractedSubmissions();
      const submissionList = response?.payload || [];
      setSubmissions(Array.isArray(submissionList) ? submissionList : []);
    } catch (err) {
      console.error("Error loading extracted submissions:", err);
      message.error(err?.Message || "Failed to load extracted submissions");
    }
  };

  const uniqueExams = [...new Set(submissions.map(s => s.examCode))].filter(Boolean);

  const filteredData = submissions.filter((row) => {
    const examMatch = examFilter === "All" || row.examCode === examFilter;
    const searchMatch =
      row.studentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      row.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
      row.examCode?.toLowerCase().includes(searchText.toLowerCase());
    return examMatch && searchMatch;
  });

  const handleAssignModalOpen = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select submissions to assign.");
      return;
    }
    setAssignModalVisible(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedExaminerId) {
      message.warning("Please select an examiner.");
      return;
    }

    try {
      await assignSubmissions({
        examinerId: selectedExaminerId,
        submissionIds: selectedRowKeys,
      });
      message.success(`Assigned ${selectedRowKeys.length} submissions successfully!`);
      setAssignModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedExaminerId(null);
      loadSubmissions();
    } catch (err) {
      message.error(err?.Message || "Failed to assign submissions");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "8%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Class",
      dataIndex: "class",
      width: "12%",
    },
    {
      title: "Student Code",
      dataIndex: "studentCode",
      width: "12%",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      width: "18%",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "—"),
    },
    {
      title: "File URL",
      dataIndex: "fileUrl",
      width: "18%",
      ellipsis: true,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
          {url}
        </a>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <FileTextOutlined style={{ fontSize: 32, color: "#1677ff" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                Extracted Submissions
              </h2>
              <p style={{ margin: 0, color: "#666" }}>
                Ready to be assigned to examiners for grading
              </p>
            </div>
          </Space>
        </Space>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Total Extracted"
              value={submissions.length}
              prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Selected"
              value={selectedRowKeys.length}
              prefix={<UserAddOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Space size="large" wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Space size="large" wrap>
            <div>
              <span style={{ marginRight: 8 }}>Exam:</span>
              <Select
                value={examFilter}
                style={{ width: 180 }}
                onChange={setExamFilter}
              >
                <Option value="All">All Exams</Option>
                {uniqueExams.map((exam) => (
                  <Option key={exam} value={exam}>
                    {exam}
                  </Option>
                ))}
              </Select>
            </div>

            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>

          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={handleAssignModalOpen}
            disabled={selectedRowKeys.length === 0}
          >
            Assign Selected ({selectedRowKeys.length})
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* Assignment Modal */}
      <Modal
        title="Assign Submissions to Examiner"
        open={assignModalVisible}
        onOk={handleAssignSubmit}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedExaminerId(null);
        }}
        okText="Assign"
        cancelText="Cancel"
      >
        <p>You are about to assign {selectedRowKeys.length} submissions.</p>
        <div style={{ marginTop: 16 }}>
          <span style={{ marginRight: 8, fontWeight: 500 }}>Select Examiner:</span>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            placeholder="Choose an examiner"
            size="large"
            loading={loadingExaminers}
            value={selectedExaminerId}
            onChange={setSelectedExaminerId}
          >
            {examiners.map((examiner) => (
              <Option key={examiner.id} value={examiner.id}>
                {examiner.name} ({examiner.email})
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
