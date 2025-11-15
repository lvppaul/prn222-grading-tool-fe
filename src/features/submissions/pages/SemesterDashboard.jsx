import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const semesters = ["SU25", "FA25", "SU24", "FA24", "SU23", "FA23"];

export default function SemesterDashboard() {
  const navigate = useNavigate();

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
              style={{ textAlign: "center", borderRadius: 12 }}
              onClick={() => navigate(`/moderator/exams/${sem}`)}
            >
              <h2>{sem}</h2>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
