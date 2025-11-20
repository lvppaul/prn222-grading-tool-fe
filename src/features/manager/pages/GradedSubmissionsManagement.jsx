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
  DatePicker,
  Tooltip,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  ExportOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useGradedSubmissions } from "../hooks/useGradedSubmissions";
import { useManagerSubmission } from "../hooks/useSubmission";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function GradedSubmissionsManagement() {
  const navigate = useNavigate();
  const {
    loading,
    error,
    gradedSubmissions,
    totalCount,
    getAllGradedSubmissions,
  } = useGradedSubmissions();
  
  const { approveSubmission, loading: approvingLoading } = useManagerSubmission();

  const [filters, setFilters] = useState({
    examId: "",
    examinerId: "",
    searchTerm: "",
    dateRange: null,
    page: 1,
    pageSize: 20,
    sortBy: "updatedAt",
    sortDirection: "desc",
  });

  const [approvingId, setApprovingId] = useState(null);

  // Load data on mount and when filters change
  useEffect(() => {
    loadGradedSubmissions();
  }, [filters]);

  const loadGradedSubmissions = async () => {
    try {
      const filterParts = [];

      // Exam ID filter
      if (filters.examId) {
        filterParts.push(`examId eq ${filters.examId}`);
      }

      // Examiner ID filter
      if (filters.examinerId) {
        filterParts.push(`assignedExaminerId eq ${filters.examinerId}`);
      }

      // Search filter (student name or code)
      if (filters.searchTerm) {
        filterParts.push(
          `(contains(tolower(studentName), '${filters.searchTerm.toLowerCase()}') or ` +
            `contains(tolower(studentCode), '${filters.searchTerm.toLowerCase()}'))`
        );
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const startDate = filters.dateRange[0].startOf("day").toISOString();
        const endDate = filters.dateRange[1].endOf("day").toISOString();
        filterParts.push(`updatedAt ge ${startDate} and updatedAt le ${endDate}`);
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

      await getAllGradedSubmissions(odataParams);
    } catch (err) {
      console.error("Error loading graded submissions:", err);
      message.error("Failed to load graded submissions");
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, searchTerm: value, page: 1 });
  };

  const handleExamFilter = (value) => {
    setFilters({ ...filters, examId: value, page: 1 });
  };

  const handleExaminerFilter = (value) => {
    setFilters({ ...filters, examinerId: value, page: 1 });
  };

  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates, page: 1 });
  };

  const handleTableChange = (pagination, _, sorter) => {
    setFilters({
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || "updatedAt",
      sortDirection: sorter.order === "ascend" ? "asc" : "desc",
    });
  };

  const handleApprove = async (record, event) => {
    // Prevent any default behavior
    if (event) {
      event.stopPropagation();
    }

    setApprovingId(record.id);
    const hideLoading = message.loading(
      `Approving grading for ${record.studentCode}...`,
      0
    );

    try {
      const response = await approveSubmission(record.id);
      hideLoading();

      if (response?.Status === 200 || response?.status === 200) {
        message.success({
          content: (
            <span>
              <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
              Successfully approved grading for <strong>{record.studentName}</strong>
            </span>
          ),
          duration: 3,
        });
        loadGradedSubmissions(); // Refresh the list
      } else {
        message.error({
          content: response?.Message || "Failed to approve grading",
          duration: 4,
        });
      }
    } catch (err) {
      hideLoading();
      console.error("Error approving submission:", err);
      message.error({
        content:
          err?.Message ||
          err?.message ||
          "Failed to approve grading. Please try again.",
        duration: 4,
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleViewCode = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleReset = () => {
    setFilters({
      examId: "",
      examinerId: "",
      searchTerm: "",
      dateRange: null,
      page: 1,
      pageSize: 20,
      sortBy: "updatedAt",
      sortDirection: "desc",
    });
  };

  const handleExport = () => {
    Modal.confirm({
      title: "Export Graded Submissions",
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
        "Examiner ID",
        "Status",
        "Graded At",
      ];

      const csvContent = [
        headers.join(","),
        ...gradedSubmissions.map((sub) =>
          [
            sub.id,
            sub.studentCode,
            `"${sub.studentName}"`,
            sub.examId,
            sub.assignedExaminerId,
            sub.status,
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
        `graded_submissions_${dayjs().format("YYYY-MM-DD")}.csv`
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

  // Get unique exam IDs and examiner IDs for filters
  const uniqueExamIds = [...new Set(gradedSubmissions.map((s) => s.examId))];
  const uniqueExaminerIds = [
    ...new Set(gradedSubmissions.map((s) => s.assignedExaminerId)),
  ];

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
      title: "Examiner ID",
      dataIndex: "assignedExaminerId",
      key: "assignedExaminerId",
      width: 120,
      sorter: true,
      render: (examinerId) => (
        <Tag color="green" icon={<UserOutlined />}>
          Examiner {examinerId}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Graded At",
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
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip 
            title={
              approvingId === record.id 
                ? "Approving..." 
                : "Click to approve this grading"
            }
          >
            <Button
              type="primary"
              size="small"
              icon={approvingId === record.id ? null : <CheckCircleOutlined />}
              onClick={(e) => handleApprove(record, e)}
              loading={approvingId === record.id}
              disabled={approvingId !== null && approvingId !== record.id}
              style={{ 
                background: "#52c41a", 
                borderColor: "#52c41a",
                minWidth: 90 
              }}
            >
              {approvingId === record.id ? "Approving" : "Approve"}
            </Button>
          </Tooltip>
          <Tooltip title="View Code">
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewCode(record.fileUrl)}
              disabled={approvingId === record.id}
            >
              Code
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Statistics calculations
  const stats = {
    total: totalCount,
    currentPage: gradedSubmissions.length,
    uniqueExams: uniqueExamIds.length,
    uniqueExaminers: uniqueExaminerIds.length,
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card
        style={{ marginBottom: 24 }}
        title={
          <Space>
            <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              Graded Submissions Management
            </span>
          </Space>
        }
      >
        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Graded"
                value={stats.total}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Current View"
                value={stats.currentPage}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Exams"
                value={stats.uniqueExams}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Examiners"
                value={stats.uniqueExaminers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#fa8c16" }}
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

            {/* Examiner Filter */}
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filter by Examiner"
                value={filters.examinerId || undefined}
                onChange={handleExaminerFilter}
                allowClear
              >
                {uniqueExaminerIds.map((examinerId) => (
                  <Option key={examinerId} value={examinerId}>
                    Examiner {examinerId}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Date Range */}
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: "100%" }}
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
              />
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row gutter={[8, 8]}>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadGradedSubmissions}
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
            dataSource={gradedSubmissions}
            rowKey="id"
            pagination={{
              current: filters.page,
              pageSize: filters.pageSize,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} graded submissions`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            loading={loading}
          />
        </Spin>
      </Card>
    </div>
  );
}
