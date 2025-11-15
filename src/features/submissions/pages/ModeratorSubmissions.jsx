import React, { useState, useMemo } from "react";
import { Table, Tag, Button, Input, Select, Space, Card } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

export default function ModeratorSubmissions() {
  const { Option } = Select;

  // Status color mapping
  const statusColor = {
    Extracted: "blue",
    Assigned: "gold",
    Rejected: "red",
    Graded: "purple",
    Regraded: "orange",
    Approved: "green",
  };

  // Grade color mapping
  const gradeColor = (grade) => {
    if (grade >= 90) return "green";
    if (grade >= 75) return "blue";
    if (grade >= 60) return "orange";
    return "red";
  };

  // Fake dataset
  const rawData = [
    { id: 101, examId: 5, semester: "SU25", studentCode: "SE15001", examinerName: "Dr. Alice Johnson", status: "Assigned", grade: 0 },
    { id: 102, examId: 5, semester: "SU25", studentCode: "SE15002", examinerName: "Dr. Alice Johnson", status: "Extracted", grade: 0 },
    { id: 103, examId: 5, semester: "FA24", studentCode: "SE15003", examinerName: "Mr. Bob Smith", status: "Graded", grade: 85 },
    { id: 104, examId: 7, semester: "FA24", studentCode: "SE15004", examinerName: "Charlie Brown", status: "Approved", grade: 92 },
    { id: 105, examId: 7, semester: "SU24", studentCode: "SE15005", examinerName: "Dr. Alice Johnson", status: "Rejected", grade: 0 },
    { id: 106, examId: 8, semester: "SU24", studentCode: "SE15006", examinerName: "Mr. Bob Smith", status: "Regraded", grade: 78 },
    { id: 107, examId: 8, semester: "FA23", studentCode: "SE15007", examinerName: "Charlie Brown", status: "Assigned", grade: 0 },
    { id: 108, examId: 9, semester: "FA23", studentCode: "SE15008", examinerName: "Dr. Alice Johnson", status: "Extracted", grade: 0 },
    { id: 109, examId: 9, semester: "SU23", studentCode: "SE15009", examinerName: "Mr. Bob Smith", status: "Approved", grade: 96 },
    { id: 110, examId: 10, semester: "SU23", studentCode: "SE15010", examinerName: "Charlie Brown", status: "Graded", grade: 72 },
    { id: 111, examId: 10, semester: "FA25", studentCode: "SE15011", examinerName: "Dr. Alice Johnson", status: "Assigned", grade: 0 },
    { id: 112, examId: 12, semester: "FA25", studentCode: "SE15012", examinerName: "Mr. Bob Smith", status: "Approved", grade: 88 },
    { id: 113, examId: 12, semester: "SU25", studentCode: "SE15013", examinerName: "Charlie Brown", status: "Graded", grade: 79 },
    { id: 114, examId: 14, semester: "SU25", studentCode: "SE15014", examinerName: "Dr. Alice Johnson", status: "Regraded", grade: 82 },
    { id: 115, examId: 14, semester: "FA24", studentCode: "SE15015", examinerName: "Mr. Bob Smith", status: "Rejected", grade: 0 },
    { id: 116, examId: 15, semester: "FA24", studentCode: "SE15016", examinerName: "Charlie Brown", status: "Extracted", grade: 0 },
    { id: 117, examId: 15, semester: "SU24", studentCode: "SE15017", examinerName: "Dr. Alice Johnson", status: "Assigned", grade: 0 },
    { id: 118, examId: 16, semester: "SU24", studentCode: "SE15018", examinerName: "Mr. Bob Smith", status: "Approved", grade: 94 },
    { id: 119, examId: 16, semester: "FA23", studentCode: "SE15019", examinerName: "Charlie Brown", status: "Assigned", grade: 0 },
    { id: 120, examId: 17, semester: "FA23", studentCode: "SE15020", examinerName: "Dr. Alice Johnson", status: "Graded", grade: 68 },
    { id: 121, examId: 17, semester: "FA25", studentCode: "SE15021", examinerName: "Mr. Bob Smith", status: "Regraded", grade: 75 },
    { id: 122, examId: 18, semester: "FA25", studentCode: "SE15022", examinerName: "Charlie Brown", status: "Extracted", grade: 0 },
    { id: 123, examId: 18, semester: "SU25", studentCode: "SE15023", examinerName: "Dr. Alice Johnson", status: "Assigned", grade: 0 },
    { id: 124, examId: 19, semester: "SU25", studentCode: "SE15024", examinerName: "Mr. Bob Smith", status: "Approved", grade: 91 },
    { id: 125, examId: 19, semester: "FA24", studentCode: "SE15025", examinerName: "Charlie Brown", status: "Approved", grade: 89 },
    { id: 126, examId: 20, semester: "FA24", studentCode: "SE15026", examinerName: "Dr. Alice Johnson", status: "Rejected", grade: 0 },
    { id: 127, examId: 20, semester: "SU23", studentCode: "SE15027", examinerName: "Mr. Bob Smith", status: "Graded", grade: 63 },
    { id: 128, examId: 21, semester: "SU23", studentCode: "SE15028", examinerName: "Charlie Brown", status: "Assigned", grade: 0 },
    { id: 129, examId: 21, semester: "FA23", studentCode: "SE15029", examinerName: "Dr. Alice Johnson", status: "Extracted", grade: 0 },
    { id: 130, examId: 22, semester: "FA23", studentCode: "SE15030", examinerName: "Mr. Bob Smith", status: "Approved", grade: 94 },
  ].map((x, i) => ({ ...x, key: i }));

  // Toolbar state
  const [statusFilter, setStatusFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Apply filters
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      const statusMatch = statusFilter === "All" || row.status === statusFilter;
      const semesterMatch = semesterFilter === "All" || row.semester === semesterFilter;
      const searchMatch = row.studentCode.toLowerCase().includes(searchText.toLowerCase());

      const gradeMatch =
        gradeFilter === "All" ||
        (gradeFilter === "Graded" && row.grade > 0) ||
        (gradeFilter === "Ungraded" && row.grade === 0);

      return statusMatch && semesterMatch && gradeMatch && searchMatch;
    });
  }, [rawData, statusFilter, semesterFilter, gradeFilter, searchText]);

  // Table columns
  const columns = [
    { title: "Submission ID", dataIndex: "id", sorter: (a, b) => a.id - b.id },
    { title: "Exam ID", dataIndex: "examId" },
    { title: "Semester", dataIndex: "semester" },
    { title: "Student Code", dataIndex: "studentCode" },
    { title: "Assigned Examiner", dataIndex: "examinerName" },

    {
      title: "Grade",
      dataIndex: "grade",
      sorter: (a, b) => a.grade - b.grade,
      render: (grade) =>
        grade === 0 ? (
          <Tag color="gray">—</Tag>
        ) : (
          <Tag color={gradeColor(grade)}>{grade}</Tag>
        ),
    },

    {
        title: "Status",
        dataIndex: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => (
            <Tag color={statusColor[status]}>{status}</Tag>
        ),
    },

    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() =>
            window.location.href = `/moderator/submissions/${record.id}`
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 26, fontWeight: 600 }}>
        Submissions
      </h1>

      {/* FILTER TOOLBAR BOX */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Space size="large" wrap>

          {/* Status filter */}
          <div>
            <span style={{ marginRight: 8 }}>Status:</span>
            <Select value={statusFilter} style={{ width: 160 }} onChange={setStatusFilter}>
              <Option value="All">All</Option>
              {Object.keys(statusColor).map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </div>

          {/* Semester filter */}
          <div>
            <span style={{ marginRight: 8 }}>Semester:</span>
            <Select value={semesterFilter} style={{ width: 160 }} onChange={setSemesterFilter}>
              <Option value="All">All</Option>
              {["SU25", "FA25", "SU24", "FA24", "SU23", "FA23"].map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </div>

          {/* Grade filter */}
          <div>
            <span style={{ marginRight: 8 }}>Grade:</span>
            <Select value={gradeFilter} style={{ width: 160 }} onChange={setGradeFilter}>
              <Option value="All">All</Option>
              <Option value="Graded">Graded Only</Option>
              <Option value="Ungraded">Ungraded Only</Option>
            </Select>
          </div>

          {/* Search box */}
          <Input
            placeholder="Search Student Code"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>
      </Card>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ background: "#fff", borderRadius: 8, padding: 16 }}
      />
    </div>
  );
}
