// src/features/manager/pages/ManagerSemesterDashboard.jsx
import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const SEMESTERS = ["SU25", "FA25", "SU24", "FA24", "SU23", "FA23"];

export default function ManagerSemesterDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>
        Manager – Semesters
      </h1>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Select a semester to manage its exams and submissions.
      </p>

      <Row gutter={[20, 20]}>
        {SEMESTERS.map((sem) => (
          <Col span={8} key={sem}>
            <Card
              hoverable
              style={{ borderRadius: 12, minHeight: 100, textAlign: "center" }}
              onClick={() => navigate(`/manager/exams/${sem}`)}
            >
              <h2 style={{ margin: 0 }}>{sem}</h2>
              <div style={{ color: "#666", marginTop: 8 }}>View Exams</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
