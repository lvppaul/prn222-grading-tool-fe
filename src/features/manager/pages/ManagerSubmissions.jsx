import React, { useState, useMemo } from "react";
import { Table, Tag, Button, Input, Select, Space, Card, message } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { FakeSubmissions } from "../../submissions/pages/FakeSubmissions";

const { Option } = Select;

const statusColor = {
  Extracted: "blue",
  Assigned: "gold",
  Rejected: "red",
  Graded: "purple",
  Regraded: "orange",
  Approved: "green",
};

const gradeColor = (grade) => {
  if (grade >= 90) return "green";
  if (grade >= 75) return "blue";
  if (grade >= 60) return "orange";
  return "red";
};

// Fake lecturer list to assign
const lecturers = [
  "Dr. Alice Johnson",
  "Mr. Bob Smith",
  "Charlie Brown",
  "Ms. Emily Lee",
];

export default function ManagerSubmissions() {
  const navigate = useNavigate();
  const { semester, examId } = useParams();

  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Map submissionId -> assigned lecturer
  const [assignedLecturers, setAssignedLecturers] = useState(() => {
    const map = {};
    FakeSubmissions.forEach((s) => {
      map[s.id] = s.examinerName || "";
    });
    return map;
  });

  const filteredData = useMemo(() => {
    return FakeSubmissions.filter((row) => {
      const matchExam = row.examId.toString() === examId;
      const matchSemester = row.semester === semester;
      if (!matchExam || !matchSemester) return false;

      const statusMatch = statusFilter === "All" || row.status === statusFilter;

      const gradeMatch =
        gradeFilter === "All" ||
        (gradeFilter === "Graded" && row.grade > 0) ||
        (gradeFilter === "Ungraded" && row.grade === 0);

      const searchMatch = row.studentCode
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return statusMatch && gradeMatch && searchMatch;
    });
  }, [semester, examId, statusFilter, gradeFilter, searchText]);

  const handleAssign = (recordId) => {
    const lect = assignedLecturers[recordId];
    if (!lect) {
      message.warning("Please select a lecturer before assigning.");
      return;
    }
    // Here you would call API later
    console.log("Assign lecturer:", lect, "to submission:", recordId);
    message.success(`Assigned ${lect} to submission #${recordId}`);
  };

  const columns = [
    {
      title: "Submission ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Student Code",
      dataIndex: "studentCode",
    },
    {
      title: "Current Examiner",
      dataIndex: "examinerName",
    },
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
      render: (status) => <Tag color={statusColor[status]}>{status}</Tag>,
    },
    {
      title: "Assign Lecturer",
      render: (_, record) => (
        <Space>
          <Select
            style={{ width: 190 }}
            value={assignedLecturers[record.id]}
            onChange={(val) =>
              setAssignedLecturers((prev) => ({ ...prev, [record.id]: val }))
            }
            placeholder="Select lecturer"
          >
            {lecturers.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
          <Button size="small" type="primary" onClick={() => handleAssign(record.id)}>
            Assign
          </Button>
        </Space>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(
              `/manager/submissions/${semester}/${examId}/${record.id}`
            )
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 10, fontSize: 26, fontWeight: 600 }}>
        Submissions — {semester} / Exam #{examId}
      </h1>

      <p style={{ color: "#777", marginBottom: 20 }}>
        Assign lecturers to grade each submission.
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
            placeholder="Search Student Code"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 12 }}
        style={{ background: "#fff", borderRadius: 8, padding: 16 }}
      />
    </div>
  );
}
