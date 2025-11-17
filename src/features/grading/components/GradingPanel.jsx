import React, { useMemo, useState } from "react";
import {
  Card,
  Slider,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Input,
  Select,
  message,
  Statistic,
} from "antd";
import {
  SendOutlined,
  CheckCircleTwoTone,
  ThunderboltTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MAX = {
  correctness: 30,
  efficiency: 25,
  readability: 20,
  documentation: 15,
  testing: 10,
};

const QUICK_FEEDBACK = [
  "Excellent structure and clean code",
  "Good implementation, minor improvements needed",
  "Needs optimization for better performance",
  "Consider edge cases and error handling",
];

export default function GradingPanel({ submission }) {
  const [scores, setScores] = useState({
    correctness: 25,
    efficiency: 20,
    readability: 15,
    documentation: 10,
    testing: 8,
  });

  const [chips, setChips] = useState(["Excellent structure and clean code"]);
  const [detail, setDetail] = useState("");
  const [finalGrade, setFinalGrade] = useState("B+");

  const total = useMemo(
    () =>
      scores.correctness +
      scores.efficiency +
      scores.readability +
      scores.documentation +
      scores.testing,
    [scores]
  );

  const toggleChip = (c) =>
    setChips((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const onSubmit = () => {
    const payload = {
      submissionId: submission.id,
      scores,
      quickFeedback: chips,
      detailedFeedback: detail,
      finalGrade,
      totalScore: total,
    };
    console.log(payload);
    message.success("Grade submitted");
  };

  return (
    <div className="grading-panel">
      <Card variant="outlined" size="small" className="panel-card">
        <Title level={4} style={{ marginTop: 0 }}>
          Grading Rubric
        </Title>

        <Row gutter={[16, 12]}>
          {Object.entries(scores).map(([key, val]) => (
            <Col span={24} key={key}>
              <Space direction="vertical" style={{ width: "100%" }} size={6}>
                <div className="rubric-label">
                  <Text strong style={{ textTransform: "capitalize" }}>
                    {key}
                  </Text>
                  <Text type="secondary">
                    {val} / {MAX[key]}
                  </Text>
                </div>
                <Slider
                  value={val}
                  max={MAX[key]}
                  onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
                />
              </Space>
            </Col>
          ))}
        </Row>

        <div className="total-box">
          <Statistic
            title="Total Score"
            value={total}
            suffix="/ 100"
            valueStyle={{ fontWeight: 700 }}
          />
        </div>
      </Card>

      <Card variant="outlined" size="small" className="panel-card">
        <Title level={5} style={{ marginTop: 0 }}>
          Quick Feedback
        </Title>
        <Space wrap>
          {QUICK_FEEDBACK.map((c) => (
            <Tag.CheckableTag
              key={c}
              checked={chips.includes(c)}
              onChange={() => toggleChip(c)}
              className="feedback-chip"
            >
              {c}
            </Tag.CheckableTag>
          ))}
        </Space>
      </Card>

      <Card variant="outlined" size="small" className="panel-card">
        <Title level={5} style={{ marginTop: 0 }}>
          Detailed Feedback
        </Title>
        <TextArea
          autoSize={{ minRows: 5 }}
          placeholder="Provide detailed feedback for the student…"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          showCount
          maxLength={2000}
        />
      </Card>

      <Card variant="outlined" size="small" className="panel-card">
        <Title level={5} style={{ marginTop: 0 }}>
          Final Grade
        </Title>
        <Select
          value={finalGrade}
          onChange={setFinalGrade}
          style={{ width: 160 }}
          options={[
            "A+", "A", "A-",
            "B+", "B", "B-",
            "C+", "C", "C-",
            "D", "F",
          ].map((g) => ({ value: g, label: g }))}
        />
      </Card>

      <Space style={{ width: "100%" }}>
        <Button
          type="primary"
          size="large"
          icon={<SendOutlined />}
          block
          onClick={onSubmit}
        >
          Submit Grade
        </Button>
        <Button icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
          Save Draft
        </Button>
        <Button icon={<ThunderboltTwoTone twoToneColor="#1677ff" />}>
          Mark Complete
        </Button>
      </Space>
    </div>
  );
}
