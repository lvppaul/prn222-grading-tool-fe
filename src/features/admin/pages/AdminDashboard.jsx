import { Card, Row, Col, Statistic, Button, Table, Space, Tag, message, Spin } from "antd";
import {
  FileTextOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  CheckOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useExam } from "../../../features/admin/hooks/useExam";
import { useExportScore } from "../hooks/useExportScore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { getAllExams, loading, publishExam, closeExam } = useExam();
  const { exportScoreAndDownload, isExporting } = useExportScore();
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });
  const [publishingId, setPublishingId] = useState(null);
  const [closingId, setClosingId] = useState(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await getAllExams();
      const examList = response?.payload || response || [];
      setExams(Array.isArray(examList) ? examList : []);

      // Calculate stats
      const published = examList.filter((e) => e.isPublished)?.length || 0;
      setStats({
        total: examList.length,
        published: published,
        draft: examList.length - published,
      });
    } catch (err) {
      console.error("Error loading exams:", err);
      message.error("Failed to load exams");
    }
  };

  const handlePublish = async (record) => {
    setPublishingId(record.id);
    try {
      await publishExam(record.id);
      message.success("Công bố kì thi thành công!");
      loadExams();
    } catch (err) {
      message.error("Lỗi khi công bố kì thi");
      console.error("Error:", err);
    } finally {
      setPublishingId(null);
    }
  };

  const handleClose = async (record) => {
    setClosingId(record.id);
    try {
      await closeExam(record.id);
      message.success("Đóng kì thi thành công!");
      loadExams();
    } catch (err) {
      message.error("Lỗi khi đóng kì thi");
      console.error("Error:", err);
    } finally {
      setClosingId(null);
    }
  };

  const handleExportScore = async (record) => {
    try {
      await exportScoreAndDownload(record.id);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const columns = [
    {
      title: "Exam Code",
      dataIndex: "code",
      key: "code",
      width: "12%",
    },
    {
      title: "Exam Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semesterName",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status) => (
        <Tag color={status === "Published" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "26%",
      render: (_, record) => (
        <Space>
          {record.status === "Draft" ? (
            <Button
              type="primary"
              size="small"
              icon={publishingId === record.id ? <LoadingOutlined spin /> : <CheckOutlined />}
              loading={publishingId === record.id}
              onClick={() => handlePublish(record)}
            >
              {publishingId === record.id ? "Publishing..." : "Publish"}
            </Button>
          ) : record.status === "Published" || record.status === "Grading" || record.status === "Graded" || record.status === "Approved" ? (
            <>
              <Button
                type="default"
                size="small"
                icon={closingId === record.id ? <LoadingOutlined spin /> : <LockOutlined />}
                loading={closingId === record.id}
                onClick={() => handleClose(record)}
                danger
              >
                {closingId === record.id ? "Closing..." : "Close"}
              </Button>
              <Button
                type="primary"
                size="small"
                icon={isExporting(record.id) ? <LoadingOutlined spin /> : <DownloadOutlined />}
                loading={isExporting(record.id)}
                onClick={() => handleExportScore(record)}
              >
                {isExporting(record.id) ? "Exporting..." : "Export điểm"}
              </Button>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Total Exams"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Published"
              value={stats.published}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Draft"
              value={stats.draft}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Exams Table */}
      <Card
        title="📋 Recent Exams"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Table
          columns={columns}
          dataSource={exams}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
