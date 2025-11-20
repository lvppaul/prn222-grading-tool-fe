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
  Input,
  Select,
  Tooltip,
  Modal,
  Badge,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  ExportOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useAllSubmissions } from "../hooks/useAllSubmissions";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

export default function AdminSubmissionManagement() {
  const navigate = useNavigate();
  const {
    loading,
    error,
    submissions,
    totalCount,
    getAllSubmissions,
  } = useAllSubmissions();

  const [filters, setFilters] = useState({
    status: "",
    examId: "",
    searchTerm: "",
    page: 1,
    pageSize: 20,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  // Load data on mount and when filters change
  useEffect(() => {
    loadSubmissions();
  }, [filters]);

  const loadSubmissions = async () => {
    try {
      const filterParts = [];

      // Status filter
      if (filters.status) {
        filterParts.push(`status eq '${filters.status}'`);
      }

      // Exam ID filter
      if (filters.examId) {
        filterParts.push(`examId eq ${filters.examId}`);
      }

      // Search filter (student name or code)
      if (filters.searchTerm) {
        filterParts.push(
          `(contains(tolower(studentName), '${filters.searchTerm.toLowerCase()}') or ` +
            `contains(tolower(studentCode), '${filters.searchTerm.toLowerCase()}'))`
        );
      }

      const odataParams = {
        $orderby: `${filters.sortBy} ${filters.sortDirection}`,
        $top: filters.pageSize,
        $skip: (filters.page - 1) * filters.pageSize,
        $count: true,
      };

      if (filterParts.length > 0) {
        odataParams.$filter = filterParts.join(" and ");
      }

      await getAllSubmissions(odataParams);
    } catch (err) {
      console.error("Error loading submissions:", err);
      message.error("Failed to load submissions");
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, searchTerm: value, page: 1 });
  };

  const handleStatusFilter = (value) => {
    setFilters({ ...filters, status: value, page: 1 });
  };

  const handleExamFilter = (value) => {
    setFilters({ ...filters, examId: value, page: 1 });
  };

  const handleTableChange = (pagination, _, sorter) => {
    setFilters({
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || "createdAt",
      sortDirection: sorter.order === "ascend" ? "asc" : "desc",
    });
  };

  const handleViewSubmission = (record) => {
    // Navigate to submission detail or view code
    window.open(record.fileUrl, "_blank");
  };

  const handleDeleteSubmission = (record) => {
    Modal.confirm({
      title: "Delete Submission",
      content: `Are you sure you want to delete submission for ${record.studentName} (${record.studentCode})?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          // TODO: Implement delete API
          message.success("Submission deleted successfully");
          loadSubmissions();
        } catch (err) {
          message.error("Failed to delete submission");
        }
      },
    });
  };

  const handleReset = () => {
    setFilters({
      status: "",
      examId: "",
      searchTerm: "",
      page: 1,
      pageSize: 20,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  };

  const handleExport = () => {
    Modal.confirm({
      title: "Export Submissions",
      content: "Do you want to export the current filtered results to CSV?",
      onOk: () => {
        exportToCSV();
      },
    });
  };

  const exportToCSV = () => {
    try {
      const headers = [
        "ID",
        "Student Code",
        "Student Name",
        "Exam ID",
        "Status",
        "File URL",
        "Created At",
        "Updated At",
      ];

      const csvContent = [
        headers.join(","),
        ...submissions.map((sub) =>
          [
            sub.id,
            sub.studentCode,
            `"${sub.studentName}"`,
            sub.examId,
            sub.status,
            sub.fileUrl,
            new Date(sub.createdAt).toISOString(),
            new Date(sub.updatedAt).toISOString(),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `submissions_${dayjs().format("YYYY-MM-DD")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Export successful!");
    } catch (err) {
      console.error("Export error:", err);
      message.error("Failed to export data");
    }
  };

  // Get unique exam IDs and status for filters
  const uniqueExamIds = [...new Set(submissions.map((s) => s.examId))];
  const statusOptions = ["Pending", "Extracted", "Assigned", "Graded", "Approved"];

  // Get status icon and color
  const getStatusDisplay = (status) => {
    const statusConfig = {
      Pending: { icon: <ClockCircleOutlined />, color: "default" },
      Extracted: { icon: <SyncOutlined />, color: "processing" },
      Assigned: { icon: <UserOutlined />, color: "blue" },
      Graded: { icon: <CheckCircleOutlined />, color: "success" },
      Approved: { icon: <CheckCircleOutlined />, color: "green" },
    };

    const config = statusConfig[status] || { icon: <FileTextOutlined />, color: "default" };
    return <Tag icon={config.icon} color={config.color}>{status}</Tag>;
  };

  // Calculate statistics
  const stats = {
    total: totalCount,
    pending: submissions.filter((s) => s.status === "Pending").length,
    extracted: submissions.filter((s) => s.status === "Extracted").length,
    graded: submissions.filter((s) => s.status === "Graded").length,
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: true,
    },
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 120,
      sorter: true,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Exam ID",
      dataIndex: "examId",
      key: "examId",
      width: 100,
      sorter: true,
      render: (examId) => (
        <Tag color="blue" icon={<FileTextOutlined />}>
          Exam {examId}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => getStatusDisplay(status),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: true,
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 5 }} />
          {dayjs(date).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      sorter: true,
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 5 }} />
          {dayjs(date).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
   
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card
        style={{ marginBottom: 24 }}
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              All Submissions Management
            </span>
          </Space>
        }
      >
        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Extracted"
                value={stats.extracted}
                prefix={<SyncOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Graded"
                value={stats.graded}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Row gutter={[16, 16]}>
            {/* Search */}
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by student name or code..."
                prefix={<SearchOutlined />}
                value={filters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>

            {/* Status Filter */}
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filter by Status"
                value={filters.status || undefined}
                onChange={handleStatusFilter}
                allowClear
              >
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Exam Filter */}
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filter by Exam"
                value={filters.examId || undefined}
                onChange={handleExamFilter}
                allowClear
              >
                {uniqueExamIds.map((examId) => (
                  <Option key={examId} value={examId}>
                    Exam {examId}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row gutter={[8, 8]}>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadSubmissions}
                loading={loading}
              >
                Refresh
              </Button>
            </Col>
            <Col>
              <Button icon={<FilterOutlined />} onClick={handleReset}>
                Reset Filters
              </Button>
            </Col>
       
          </Row>
        </Space>
      </Card>

      {/* Error Display */}
      {error && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{ color: "red" }}>
            <strong>Error:</strong> {error.toString()}
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={submissions}
            rowKey="id"
            pagination={{
              current: filters.page,
              pageSize: filters.pageSize,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} submissions`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1400 }}
            loading={loading}
          />
        </Spin>
      </Card>
    </div>
  );
}
