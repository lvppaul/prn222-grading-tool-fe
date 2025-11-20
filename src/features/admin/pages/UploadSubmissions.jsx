import { useState, useEffect } from "react";
import {
  Card,
  Select,
  Upload,
  Button,
  message,
  Space,
  Typography,
  Progress,
  List,
  Tag,
  Alert,
  Spin,
  Tabs,
  Table,
  Input,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  FileZipOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useExam } from "../hooks/useExam";
import { useUploadSubmission } from "../hooks/useUploadSubmission";
import useStudent from "../hooks/useStudent";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

export default function UploadSubmissions() {
  const { getAllExams, loading: loadingExams } = useExam();
  const { uploadZipBatch, loading: uploading, uploadProgress } = useUploadSubmission();
  const { students, loading: loadingStudents, getStudentsByExam } = useStudent();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [viewExamId, setViewExamId] = useState(null);
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

  const handleUpload = async () => {
    if (!selectedExamId) {
      message.warning("Please select an exam first");
      return;
    }

    if (fileList.length === 0) {
      message.warning("Please select a ZIP file to upload");
      return;
    }

    const file = fileList[0];
    if (!file.name.endsWith(".zip")) {
      message.error("Please upload a ZIP file");
      return;
    }

    try {
      const result = await uploadZipBatch(selectedExamId, file);
      message.success(result.Message || "Upload successful!");
      setUploadResult(result);
      setFileList([]);
    } catch (err) {
      console.error("Upload error:", err);
      message.error(err?.Message || err || "Upload failed");
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (!file.name.endsWith(".zip")) {
        message.error("Only ZIP files are allowed!");
        return Upload.LIST_IGNORE;
      }

      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        message.error("File size must be less than 500MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
    maxCount: 1,
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const viewExam = exams.find((e) => e.id === viewExamId);

  const filteredStudents = students.filter(
    (student) =>
      student.StudentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.FullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.Class?.toLowerCase().includes(searchText.toLowerCase())
  );

  const studentColumns = [
    {
      title: "Student Code",
      dataIndex: "StudentCode",
      key: "StudentCode",
      sorter: (a, b) => (a.StudentCode || "").localeCompare(b.StudentCode || ""),
    },
    {
      title: "Full Name",
      dataIndex: "FullName",
      key: "FullName",
      sorter: (a, b) => (a.FullName || "").localeCompare(b.FullName || ""),
    },
    {
      title: "Class",
      dataIndex: "Class",
      key: "Class",
      sorter: (a, b) => (a.Class || "").localeCompare(b.Class || ""),
    },
    {
      title: "Solution Name",
      dataIndex: "SolutionName",
      key: "SolutionName",
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <UploadOutlined style={{ fontSize: 32, color: "#1677ff" }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Student Submissions Management
              </Title>
              <Text type="secondary">
                Upload and view student submissions for exams
              </Text>
            </div>
          </Space>
        </Space>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "upload",
            label: (
              <span>
                <UploadOutlined /> Upload Submissions
              </span>
            ),
            children: (
              <UploadTabContent
                exams={exams.filter((e) => e.status !== "Closed")}
                loadingExams={loadingExams}
                selectedExamId={selectedExamId}
                setSelectedExamId={setSelectedExamId}
                selectedExam={selectedExam}
                fileList={fileList}
                uploading={uploading}
                uploadProgress={uploadProgress}
                uploadProps={uploadProps}
                handleUpload={handleUpload}
                uploadResult={uploadResult}
                setUploadResult={setUploadResult}
              />
            ),
          },
          {
            key: "view",
            label: (
              <span>
                <EyeOutlined /> View Uploaded Submissions
              </span>
            ),
            children: (
              <ViewTabContent
                exams={exams}
                loadingExams={loadingExams}
                viewExamId={viewExamId}
                setViewExamId={setViewExamId}
                viewExam={viewExam}
                loadStudents={loadStudents}
                students={filteredStudents}
                loadingStudents={loadingStudents}
                searchText={searchText}
                setSearchText={setSearchText}
                studentColumns={studentColumns}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

function UploadTabContent({
  exams,
  loadingExams,
  selectedExamId,
  setSelectedExamId,
  selectedExam,
  fileList,
  uploading,
  uploadProgress,
  uploadProps,
  handleUpload,
  uploadResult,
  setUploadResult,
}) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        title="📋 Instructions"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Alert
          message="ZIP File Structure"
          description={
            <div>
              <Paragraph>
                The ZIP file should contain folders for each student, with the following structure:
              </Paragraph>
              <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>
{`submissions.zip
├── StudentCode1/
│   └── [student files]
├── StudentCode2/
│   └── [student files]
└── StudentCode3/
    └── [student files]`}
              </pre>
              <Paragraph style={{ marginTop: 12 }}>
                • Each folder name should match the student code in the system
                <br />
                • Maximum file size: 500MB
                <br />• Supported format: ZIP only
              </Paragraph>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>

      <Card
        title="🚀 Upload Submissions"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              1. Select Exam
            </Text>
            <Select
              style={{ width: "100%" }}
              size="large"
              placeholder="Choose an exam"
              loading={loadingExams}
              value={selectedExamId}
              onChange={setSelectedExamId}
              disabled={uploading}
            >
              {exams.map((exam) => (
                <Select.Option key={exam.id} value={exam.id}>
                  <Space>
                    <FileZipOutlined />
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
              <div style={{ marginTop: 8 }}>
                <Tag color="green">Selected: {selectedExam.code}</Tag>
              </div>
            )}
          </div>

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              2. Upload ZIP File
            </Text>
            <Dragger {...uploadProps} disabled={uploading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag ZIP file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single ZIP file upload. Maximum size: 500MB
              </p>
            </Dragger>
          </div>

          {uploading && (
            <Card size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Uploading and processing...</Text>
                <Progress percent={uploadProgress} status="active" />
                <Text type="secondary">
                  Please wait while the system processes the submissions
                </Text>
              </Space>
            </Card>
          )}

          <Button
            type="primary"
            size="large"
            icon={<UploadOutlined />}
            onClick={handleUpload}
            loading={uploading}
            disabled={!selectedExamId || fileList.length === 0 || uploading}
            block
          >
            {uploading ? `Uploading ${uploadProgress}%` : "Upload Submissions"}
          </Button>
        </Space>
      </Card>

      {uploadResult && (
        <Card
          title={
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
              <span>Upload Successful</span>
            </Space>
          }
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Alert message={uploadResult.Message} type="success" showIcon />

            <Card size="small" title="Summary">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>
                  <strong>Total Students:</strong> {uploadResult.TotalStudents}
                </Text>
                {uploadResult.Students && uploadResult.Students.length > 0 && (
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Uploaded Students:
                    </Text>
                    <List
                      size="small"
                      bordered
                      dataSource={uploadResult.Students}
                      renderItem={(student) => (
                        <List.Item>
                          <Tag color="blue">{student}</Tag>
                        </List.Item>
                      )}
                      style={{ maxHeight: 300, overflow: "auto" }}
                    />
                  </div>
                )}
              </Space>
            </Card>

            <Button
              onClick={() => {
                setUploadResult(null);
                setSelectedExamId(null);
              }}
            >
              Upload Another File
            </Button>
          </Space>
        </Card>
      )}
    </Space>
  );
}

function ViewTabContent({
  exams,
  loadingExams,
  viewExamId,
  setViewExamId,
  viewExam,
  loadStudents,
  students,
  loadingStudents,
  searchText,
  setSearchText,
  studentColumns,
}) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        title="📚 Select Exam to View"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Select
            style={{ width: "100%" }}
            size="large"
            placeholder="Choose an exam to view uploaded submissions"
            loading={loadingExams}
            value={viewExamId}
            onChange={(examId) => {
              setViewExamId(examId);
              loadStudents(examId);
            }}
          >
            {exams.map((exam) => (
              <Select.Option key={exam.id} value={exam.id}>
                <Space>
                  <FileZipOutlined />
                  <span>
                    {exam.code} - {exam.name}
                  </span>
                  <Tag color="blue">{exam.status}</Tag>
                  <Text type="secondary">({exam.semesterName})</Text>
                </Space>
              </Select.Option>
            ))}
          </Select>
          {viewExam && (
            <Alert
              message={
                <Space>
                  <CheckCircleOutlined />
                  <span>
                    Viewing submissions for: <strong>{viewExam.code}</strong>
                  </span>
                </Space>
              }
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>

      {viewExamId && students.length > 0 && (
        <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                title="Uploaded Submissions"
                value={students.length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Exam Code"
                value={viewExam?.code || "N/A"}
                valueStyle={{ fontSize: 20 }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {viewExamId && (
        <Card
          title="👥 Uploaded Students"
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
          {loadingStudents ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" tip="Loading students..." />
            </div>
          ) : students.length === 0 ? (
            <Alert
              message="No students found"
              description="No submissions have been uploaded for this exam yet."
              type="warning"
              showIcon
            />
          ) : (
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="Id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} students`,
              }}
            />
          )}
        </Card>
      )}

      {!viewExamId && (
        <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Alert
            message="No Exam Selected"
            description="Please select an exam from the dropdown above to view uploaded submissions."
            type="info"
            showIcon
          />
        </Card>
      )}
    </Space>
  );
}
