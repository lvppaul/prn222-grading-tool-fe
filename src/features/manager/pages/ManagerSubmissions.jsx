import React, { useState, useMemo, useEffect } from "react";
import { Table, Tag, Button, Input, Select, Space, Card, message, Spin, Modal } from "antd";
import { EyeOutlined, SearchOutlined, UserAddOutlined, CheckOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useManagerSubmission } from "../hooks/useSubmission";
import { useExaminer } from "../../auth/hooks/useExaminer";

const { Option } = Select;

const statusColor = {
  Extracted: "blue",
  Assigned: "gold",
  Rejected: "red",
  Graded: "purple",
  Regrading: "orange",
  Approved: "green",
};

const gradeColor = (grade) => {
  if (grade >= 90) return "green";
  if (grade >= 75) return "blue";
  if (grade >= 60) return "orange";
  return "red";
};

export default function ManagerSubmissions() {
  const navigate = useNavigate();
  const { semester, examId } = useParams();
  const {
    getSubmissionsByExam,
    assignSubmissions,
    approveSubmission,
    rejectSubmission,
    markForRegrading,
    loading,
  } = useManagerSubmission();
  const { examiners, loading: loadingExaminers } = useExaminer();

  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedExaminerId, setSelectedExaminerId] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState(null);

  useEffect(() => {
    if (examId) {
      loadSubmissions();
    }
  }, [examId]);

  const loadSubmissions = async () => {
    try {
      const response = await getSubmissionsByExam(examId);
      const submissionList = response?.payload || [];
      setSubmissions(Array.isArray(submissionList) ? submissionList : []);
    } catch (err) {
      console.error("Error loading submissions:", err);
      message.error(err?.Message || "Failed to load submissions");
    }
  };

  const filteredData = useMemo(() => {
    return submissions.filter((row) => {
      const statusMatch = statusFilter === "All" || row.status === statusFilter;

      const gradeMatch =
        gradeFilter === "All" ||
        (gradeFilter === "Graded" && row.isGraded) ||
        (gradeFilter === "Ungraded" && !row.isGraded);

      const searchMatch = 
        row.studentCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        row.studentName?.toLowerCase().includes(searchText.toLowerCase());

      return statusMatch && gradeMatch && searchMatch;
    });
  }, [submissions, statusFilter, gradeFilter, searchText]);

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

  const handleApprove = async (record) => {
    try {
      await approveSubmission(record.id);
      message.success("Submission approved");
      loadSubmissions();
    } catch (err) {
      message.error(err?.Message || "Failed to approve submission");
    }
  };

  const openRejectModal = (record) => {
    setRejectTargetId(record.id);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectTargetId) return;
    try {
      await rejectSubmission(rejectTargetId, rejectReason);
      message.success("Submission rejected");
      setRejectModalVisible(false);
      setRejectTargetId(null);
      setRejectReason("");
      loadSubmissions();
    } catch (err) {
      message.error(err?.Message || "Failed to reject submission");
    }
  };

  const handleRegrade = async (record) => {
    try {
      await markForRegrading(record.id);
      message.success("Submission marked for regrading");
      loadSubmissions();
    } catch (err) {
      message.error(err?.Message || "Failed to mark for regrading");
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
      title: "Student Code",
      dataIndex: "studentCode",
      width: "12%",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      width: "18%",
    },
    {
      title: "Examiner",
      dataIndex: "assignedExaminerName",
      width: "15%",
      render: (name) => name || <Tag color="gray">Unassigned</Tag>,
    },
    {
      title: "Score",
      dataIndex: "totalScore",
      width: "10%",
      sorter: (a, b) => (a.totalScore || 0) - (b.totalScore || 0),
      render: (score) =>
        score == null ? (
          <Tag color="gray">—</Tag>
        ) : (
          <Tag color={gradeColor(score)}>{score.toFixed(1)}</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "12%",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <Tag color={statusColor[status]}>{status}</Tag>,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      width: "15%",
      render: (date) => date ? new Date(date).toLocaleString("vi-VN") : "—",
    },
    {
      title: "Actions",
      width: "22%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/manager/submissions/${semester}/${examId}/${record.id}`)
            }
          >
            View
          </Button>

          {record.status === "Graded" || record.status === "Regrading" ? (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record)}
            >
              Approve
            </Button>
          ) : null}

          <Button
            type="link"
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => openRejectModal(record)}
          >
            Reject
          </Button>

          {(record.status === "Graded" || record.status === "Approved") && (
            <Button
              type="link"
              size="small"
              icon={<RedoOutlined />}
              onClick={() => handleRegrade(record)}
            >
              Regrade
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.status === "Assigned" || record.status === "Graded",
    }),
  };

  return (
    <div>
      <h1 style={{ marginBottom: 10, fontSize: 26, fontWeight: 600 }}>
        Submissions — {semester} / Exam #{examId}
      </h1>

      <p style={{ color: "#777", marginBottom: 20 }}>
        Assign examiners to grade submissions. Select submissions and click "Assign Selected" button.
      </p>

      {/* FILTER TOOLBAR */}
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
              <span style={{ marginRight: 8 }}>Status:</span>
              <Select
                value={statusFilter}
                style={{ width: 160 }}
                onChange={setStatusFilter}
              >
                <Option value="All">All</Option>
                {Object.keys(statusColor).map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <span style={{ marginRight: 8 }}>Grade:</span>
              <Select
                value={gradeFilter}
                style={{ width: 160 }}
                onChange={setGradeFilter}
              >
                <Option value="All">All</Option>
                <Option value="Graded">Graded Only</Option>
                <Option value="Ungraded">Ungraded Only</Option>
              </Select>
            </div>

            <Input
              placeholder="Search Student Code or Name"
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAssignModalOpen}
            disabled={selectedRowKeys.length === 0}
          >
            Assign Selected ({selectedRowKeys.length})
          </Button>
        </Space>
      </Card>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          rowSelection={rowSelection}
          bordered
          pagination={{ pageSize: 12 }}
          style={{ background: "#fff", borderRadius: 8, padding: 16 }}
        />
      </Spin>

      {/* Reject Modal */}
      <Modal
        title="Reject Submission"
        open={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setRejectModalVisible(false)}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Reason for rejection (optional)"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

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
          <span style={{ marginRight: 8 }}>Select Examiner:</span>
          <Select
            style={{ width: "100%" }}
            placeholder="Choose an examiner"
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
