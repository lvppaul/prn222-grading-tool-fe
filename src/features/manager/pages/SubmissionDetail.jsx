import React, { useState } from "react";
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  List, 
  Modal, 
  Select, 
  message 
} from "antd";
import { 
  ArrowLeftOutlined, 
  FileOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

export default function SubmissionDetail() {
  const navigate = useNavigate();
  const { semester, examId, id } = useParams();

  // Fake student info
  const studentInfo = {
    studentCode: "SE15021",
    fullName: "Nguyen Hai",
    className: "SE1501",
    solutionName: "SE15021_Assignment3.zip",
  };

  // Fake exam info
  const examInfo = {
    examCode: "EX-2025-FA-SE",
    examName: "Software Engineering Final",
    semester: "FA25",
  };

  // ===========================
  // Submission info
  // ===========================
  const [submissionInfo, setSubmissionInfo] = useState({
    fileUrl: "https://example.com/submissions/SE15021.zip",
    violations: ["Late Submission", "Incorrect Naming Convention"],
    examinerName: "Dr. Alice Johnson",
    gradedAt: "2025-01-14 14:32",
    isFinalized: false,
    gradingAttempts: [
      {
        attempt: 1,
        examiner: "Dr. Alice Johnson",
        gradedAt: "2025-01-10 13:20",
        score: 78,
        comment: "Decent work but missing edge cases.",
      },
      {
        attempt: 2,
        examiner: "Charlie Brown",
        gradedAt: "2025-01-14 14:32",
        score: 85,
        comment: "Regraded. Logic improved.",
      },
    ],
  });

  // ===========================
  // Assign Lecturer
  // ===========================
  const lecturers = [
    "Dr. Alice Johnson",
    "Mr. Bob Smith",
    "Charlie Brown",
    "Ms. Emily Lee"
  ];

  const [assignVisible, setAssignVisible] = useState(false);
  const [assignedLecturer, setAssignedLecturer] = useState(submissionInfo.examinerName);

  const handleSaveAssign = () => {
    setSubmissionInfo({
      ...submissionInfo,
      examinerName: assignedLecturer
    });

    message.success(`Lecturer assigned: ${assignedLecturer}`);
    setAssignVisible(false);
  };

  return (
    <div>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => navigate(`/manager/submissions/${semester}/${examId}`)}
      >
        Back to Submissions
      </Button>

      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
        Submission Detail #{id}
      </h1>

      <Space direction="vertical" size={24} style={{ width: "100%" }}>

        {/* Student Info */}
        <Card title="Student Information" bordered style={{ borderRadius: 12 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="Student Code">{studentInfo.studentCode}</Descriptions.Item>
            <Descriptions.Item label="Full Name">{studentInfo.fullName}</Descriptions.Item>
            <Descriptions.Item label="Class">{studentInfo.className}</Descriptions.Item>
            <Descriptions.Item label="Solution Name">{studentInfo.solutionName}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Exam Info */}
        <Card title="Exam Information" bordered style={{ borderRadius: 12 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="Exam Code">{examInfo.examCode}</Descriptions.Item>
            <Descriptions.Item label="Exam Name">{examInfo.examName}</Descriptions.Item>
            <Descriptions.Item label="Semester">{examInfo.semester}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Submission Grading */}
        <Card 
          title="Submission Grading" 
          bordered 
          style={{ borderRadius: 12 }}
          extra={
            <Space>
              {/* Assign Lecturer */}
              <Button onClick={() => setAssignVisible(true)}>
                Assign Lecturer
              </Button>
            </Space>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label="File URL">
              <a href={submissionInfo.fileUrl} target="_blank" rel="noopener noreferrer">
                <FileOutlined /> Download Submission
              </a>
            </Descriptions.Item>

            <Descriptions.Item label="Violations">
              {submissionInfo.violations.length === 0 ? (
                <Tag color="green">None</Tag>
              ) : (
                submissionInfo.violations.map((v, idx) => (
                  <Tag color="red" key={idx}>{v}</Tag>
                ))
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Examiner">
              {submissionInfo.examinerName}
            </Descriptions.Item>

            <Descriptions.Item label="Is Finalized?">
              {submissionInfo.isFinalized ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>Finalized</Tag>
              ) : (
                <Tag color="orange" icon={<CloseCircleOutlined />}>Not Finalized</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Latest Graded At">
              {submissionInfo.gradedAt}
            </Descriptions.Item>
          </Descriptions>

          {/* Grading Attempts */}
          <h3 style={{ marginTop: 20, marginBottom: 10 }}>Grading Attempts</h3>

          <List
            bordered
            style={{ borderRadius: 8 }}
            dataSource={submissionInfo.gradingAttempts}
            renderItem={(item) => (
              <List.Item>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <strong>Attempt #{item.attempt}</strong>
                  <div><b>Score:</b> {item.score}</div>
                  <div><b>Examiner:</b> {item.examiner}</div>
                  <div><b>Graded At:</b> {item.gradedAt}</div>
                  <div><b>Comment:</b> {item.comment}</div>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </Space>

      {/* Assign Lecturer Modal */}
      <Modal
        centered
        open={assignVisible}
        title="Assign Lecturer"
        okText="Save"
        onOk={handleSaveAssign}
        onCancel={() => setAssignVisible(false)}
      >
        <p>Select a lecturer:</p>
        <Select
          style={{ width: "100%" }}
          value={assignedLecturer}
          onChange={setAssignedLecturer}
        >
          {lecturers.map((lec) => (
            <Option key={lec} value={lec}>
              {lec}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}
