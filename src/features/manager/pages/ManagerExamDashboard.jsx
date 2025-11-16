// src/features/manager/pages/ManagerExamDashboard.jsx
import React from "react";
import { Card, Row, Col, Tooltip, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FakeSubmissions } from "../../submissions/pages/FakeSubmissions";

export default function ManagerExamDashboard() {
  const { semester } = useParams();
  const navigate = useNavigate();

  // Build exam list from FakeSubmissions for this semester
  const examsMap = {};

  FakeSubmissions.forEach((s) => {
    if (s.semester !== semester) return;

    if (!examsMap[s.examId]) {
      examsMap[s.examId] = {
        examId: s.examId,
        code: `EX-${semester}-${s.examId}`,
        name: `Exam ${s.examId}`,
        submissionCount: 0,
        semester,
      };
    }
    examsMap[s.examId].submissionCount++;
  });

  const exams = Object.values(examsMap);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>
        {semester} — Exams (Manager)
      </h1>

      <p style={{ color: "#555", marginBottom: 20 }}>
        Select an exam to view and assign grading lecturers.
      </p>

      {exams.length === 0 ? (
        <Empty description="No exams found for this semester." />
      ) : (
        <Row gutter={[20, 20]}>
          {exams.map((exam) => (
            <Col span={8} key={exam.examId}>
              <Tooltip
                title={
                  <div>
                    <b>{exam.code}</b>
                    <br />
                    {exam.name}
                    <br />
                    <span>{exam.submissionCount} submissions</span>
                  </div>
                }
              >
                <Card
                  hoverable
                  style={{ borderRadius: 12, minHeight: 120 }}
                  onClick={() =>
                    navigate(
                      `/manager/submissions/${exam.semester}/${exam.examId}`
                    )
                  }
                >
                  <h3 style={{ marginBottom: 5 }}>{exam.code}</h3>
                  <div style={{ fontSize: 14, color: "#555" }}>
                    {exam.name}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {exam.submissionCount} Submissions
                  </div>
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
