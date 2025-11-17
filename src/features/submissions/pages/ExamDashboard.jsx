import React from "react";
import { Card, Row, Col, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FakeSubmissions } from "./FakeSubmissions";

export default function ExamDashboard() {
  const { semester } = useParams();
  const navigate = useNavigate();

  // Step 1: Get all exams for this semester
  const examsInSemester = {}; // { examId: { code, name } } later dynamic

  // Extract unique exams from submission data
  FakeSubmissions.forEach((s) => {
    if (s.semester === semester) {
      if (!examsInSemester[s.examId]) {
        examsInSemester[s.examId] = {
          examId: s.examId,
          code: `EX-${semester}-${s.examId}`,
          name: `Exam ${s.examId} Name`,
          submissionCount: 0,
          semester: s.semester,
        };
      }
      examsInSemester[s.examId].submissionCount++;
    }
  });

  const exams = Object.values(examsInSemester);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 10 }}>
        {semester} — Exams
      </h1>

      <p style={{ color: "#555", marginBottom: 20 }}>Please choose an exam.</p>

      <Row gutter={[20, 20]}>
        {exams.map((exam) => (
          <Col span={8} key={exam.examId}>
            <Tooltip
              title={
                <div>
                  <b>{exam.code}</b><br />
                  {exam.name}<br />
                  <span>{exam.submissionCount} submissions</span>
                </div>
              }
            >
              <Card
                hoverable
                style={{ borderRadius: 12, minHeight: 120 }}
                onClick={() =>
                  navigate(`/moderator/submissions/${semester}/${exam.examId}`)
                }
              >
                <h3 style={{ marginBottom: 5 }}>{exam.code}</h3>
                <div style={{ fontSize: 14, color: "#555" }}>{exam.name}</div>

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
    </div>
  );
}
