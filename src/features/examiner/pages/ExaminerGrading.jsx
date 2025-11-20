import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Spin,
  Typography,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Divider,
  Space,
  Tag,
  Statistic,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useSubmission } from "../hooks/useSubmission";

const { Title, Text } = Typography;

export default function ExaminerGrading() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { getGradingForm, getGradingBySubmission, submitGrading, loading } =
    useSubmission();

  const [form] = Form.useForm();
  const [gradingForm, setGradingForm] = useState(null);
  const [existingGrading, setExistingGrading] = useState(null);

  useEffect(() => {
    if (submissionId) {
      loadGradingForm();
    }
  }, [submissionId]);

  const loadGradingForm = async () => {
    try {
      const response = await getGradingForm(submissionId);
      const data = response?.payload || response;
      setGradingForm(data);
      await loadExistingGrading(data);
    } catch (error) {
      console.error("Error loading grading form:", error);
      message.error("Failed to load grading form");
    }
  };

  const loadExistingGrading = async (formData) => {
    try {
      const gradingRes = await getGradingBySubmission(submissionId);
      const gradingData = gradingRes?.payload || gradingRes;

      // If there is no existing grading, init empty values
      if (!gradingData || !gradingData.gradingItems) {
        initEmptyForm(formData);
        return;
      }

      setExistingGrading(gradingData);

      const rubricItems = formData?.rubric?.rubricItems || [];
      const flatItems = [];

      rubricItems.forEach((parent) => {
        (parent.children || []).forEach((child) => {
          flatItems.push(child);
        });
      });

      const itemsValue = {};

      flatItems.forEach((child, index) => {
        const match = gradingData.gradingItems.find(
          (g) => g.rubricItemId === child.id
        );

        itemsValue[index] = {
          score: match?.score ?? 0,
          comment: match?.comment || "",
        };
      });

      form.setFieldsValue({
        overallComment: gradingData.overallComment || "",
        items: itemsValue,
      });
    } catch (error) {
      console.error("Error loading existing grading:", error);
      // If error, still init empty form so examiner can grade
      initEmptyForm(formData);
    }
  };

  const initEmptyForm = (formData) => {
    const rubricItems = formData?.rubric?.rubricItems || [];
    const flatChildren = [];

    rubricItems.forEach((parent) => {
      (parent.children || []).forEach((child) => {
        flatChildren.push(child);
      });
    });

    const initialItems = {};
    flatChildren.forEach((_, index) => {
      initialItems[index] = { score: 0, comment: "" };
    });

    form.setFieldsValue({
      overallComment: "",
      items: initialItems,
    });
  };

  // Convert rubric (parent + children) from API to flat grading items
  const itemsArray = useMemo(() => {
    const rubricItems = gradingForm?.rubric?.rubricItems || [];
    if (!rubricItems.length) return [];

    const result = [];

    rubricItems.forEach((parent) => {
      const groupTitle = parent.title; // e.g. "Login (1.0)"
      const groupCode = parent.code; // e.g. "P1"

      (parent.children || []).forEach((child) => {
        result.push({
          rubricItemId: child.id,
          code: child.code,
          name: child.title,
          description: child.criteria,
          maxScore: child.maxScore,
          groupTitle,
          groupCode,
        });
      });
    });

    return result;
  }, [gradingForm]);

  // Group items by parent rubric item (Login, List All, ...)
  const groupedItems = useMemo(() => {
    if (!itemsArray.length) return [];

    const groupsMap = {};

    itemsArray.forEach((item) => {
      const key = item.groupCode || item.groupTitle || "Other";
      if (!groupsMap[key]) {
        groupsMap[key] = {
          code: item.groupCode,
          title: item.groupTitle,
          items: [],
        };
      }
      groupsMap[key].items.push(item);
    });

    return Object.values(groupsMap);
  }, [itemsArray]);

  const handleSubmit = async (values) => {
    try {
      const gradingItems = itemsArray.map((item, index) => ({
        rubricItemId: item.rubricItemId,
        score: values.items?.[index]?.score ?? 0,
        comment: values.items?.[index]?.comment || "",
      }));

      const payload = {
        submissionId: Number(submissionId),
        overallComment: values.overallComment || "",
        gradingItems,
      };

      const response = await submitGrading(payload);
      const success = response?.status === 200 || response?.Status === 200;

      if (success) {
        message.success("Grading submitted successfully");
        navigate(-1);
      } else {
        message.error(response?.message || "Failed to submit grading");
      }
    } catch (error) {
      console.error("Error submitting grading:", error);
      message.error("Failed to submit grading");
    }
  };

  const totalScore = useMemo(() => {
    if (!itemsArray.length) return 0;
    const values = form.getFieldValue("items") || {};
    return itemsArray.reduce((sum, item, index) => {
      const score = values[index]?.score ?? 0;
      return sum + Number(score || 0);
    }, 0);
  }, [itemsArray, form]);

  if (!gradingForm && loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back to submissions
      </Button>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Title level={3}>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            Grading Submission #{submissionId}
          </Title>
          <Space direction="vertical">
            <Space>
              <UserOutlined />
              <Text strong>{gradingForm?.submission?.studentName || "Unknown student"}</Text>
              {gradingForm?.submission?.studentCode && (
                <Tag color="blue">{gradingForm.submission.studentCode}</Tag>
              )}
            </Space>
            <Space>
              <FileTextOutlined />
              <Text>{gradingForm?.rubric?.name || "Exam"}</Text>
            </Space>
            {gradingForm?.submission?.fileUrl && (
              <Text>
                Source:&nbsp;
                <a href={gradingForm.submission.fileUrl} target="_blank" rel="noreferrer">
                  {gradingForm.submission.fileUrl}
                </a>
              </Text>
            )}
          </Space>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Score"
              value={totalScore}
              precision={2}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ overallComment: "" }}
        >
          <Title level={4}>Rubric</Title>
          <Divider />

          {groupedItems.map((group, groupIndex) => (
            <div key={group.name || groupIndex} style={{ marginBottom: 24 }}>
              <Space align="baseline" style={{ marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>
                  {group.code ? `${group.code} - ${group.title}` : group.title}
                </Title>
                {/* Tổng điểm của group đã nằm trong title, ví dụ (1.0), nên không cần weight riêng */}
              </Space>

              {group.items.map((item, indexInGroup) => {
                const globalIndex = itemsArray.findIndex(
                  (x) => x.rubricItemId === item.rubricItemId
                );

                return (
                  <Card
                    key={item.rubricItemId || `${groupIndex}-${indexInGroup}`}
                    style={{ marginBottom: 12, background: "#fafafa" }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Space direction="vertical" size={4}>
                          <Text strong>{item.name}</Text>
                          {item.subTitle && (
                            <Text type="secondary">{item.subTitle}</Text>
                          )}
                          {item.description && (
                            <Text type="secondary">{item.description}</Text>
                          )}
                          <Text type="secondary">
                            Max: <strong>{item.maxScore}</strong>
                          </Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={`Score (0 - ${item.maxScore})`}
                          name={["items", globalIndex, "score"]}
                          rules={[
                            {
                              required: true,
                              message: "Please input score",
                            },
                            () => ({
                              validator(_, value) {
                                if (
                                  value === undefined ||
                                  value === null ||
                                  value < 0 ||
                                  value > item.maxScore
                                ) {
                                  return Promise.reject(
                                    new Error(
                                      `Score must be between 0 and ${item.maxScore}`
                                    )
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            min={0}
                            max={item.maxScore}
                            step={0.25}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Comment"
                          name={["items", globalIndex, "comment"]}
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder="Comment for this criterion"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </div>
          ))}

          <Divider />

          <Form.Item label="Overall Comment" name="overallComment">
            <Input.TextArea rows={4} placeholder="Overall feedback for this submission" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
              loading={loading}
            >
              Submit Grading
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
