import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const semesters = ["SU25", "FA25", "SU24", "FA24", "SU23", "FA23"];

export default function SemesterDashboard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Extract selected value from URL
  const selected = pathname.split("/").pop(); // e.g. "SU25"

  const getCardStyle = (sem) => ({
    textAlign: "center",
    borderRadius: 12,
    cursor: "pointer",
    transition: "0.2s",
    backgroundColor: selected === sem ? "#1677ff" : "#ffffff",
    color: selected === sem ? "#ffffff" : "#000000",
    border: selected === sem ? "1px solid #1677ff" : "1px solid #e5e7eb",
    boxShadow:
      selected === sem
        ? "0 4px 12px rgba(22,119,255,0.35)"
        : "0 2px 6px rgba(0,0,0,0.05)",
  });

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
        Select a Semester
      </h1>

      <Row gutter={[20, 20]}>
        {semesters.map((sem) => (
          <Col span={6} key={sem}>
            <Card
              hoverable
              style={getCardStyle(sem)}
              onClick={() => navigate(`/moderator/exams/${sem}`)}
            >
              <h2 style={{ margin: 0, color: selected === sem ? "white" : "black" }}>
                {sem}
              </h2>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
