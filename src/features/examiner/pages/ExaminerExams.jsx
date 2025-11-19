import { useState, useEffect } from "react";
import { Card, Table, Tag, Space, Button, message, Spin } from "antd";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../admin/hooks/useExam";

export default function ExaminerExams() {
  const navigate = useNavigate();
  const { getAllExams, loading } = useExam();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await getAllExams();
      const examList = response?.payload || response || [];
      // Filter only published/grading exams for examiner
      const availableExams = Array.isArray(examList) 
        ? examList.filter(e => ["Published", "Grading", "Graded", "Approved"].includes(e.status))
        : [];
      setExams(availableExams);
    } catch (err) {
      console.error("Error loading exams:", err);
      message.error("Failed to load exams");
    }
  };

  const columns = [
    {
      title: "Exam Code",
      dataIndex: "code",
      key: "code",
      width: "15%",
    },
    {
      title: "Exam Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semesterName",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => {
        const colorMap = {
          Published: "blue",
          Grading: "orange",
          Graded: "green",
          Approved: "cyan",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/examiner/submissions/${record.id}`)}
          >
            View Submissions
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 20, color: "#1677ff" }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>My Exams</span>
          </Space>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={exams}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Spin>
      </Card>
    </div>
  );
}
