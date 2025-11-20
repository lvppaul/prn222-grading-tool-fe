import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, message, Card, Spin, Row, Col, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useExam } from '../hooks/useExam';

export default function CreateExamPage() {
  const [form] = Form.useForm();
  const { loading, error, createExam, getAllSemesters } = useExam();
  const [rubricFileList, setRubricFileList] = useState([]);
  const [studentFileList, setStudentFileList] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    setLoadingSemesters(true);
    try {
      const response = await getAllSemesters();
      const semesterList = response?.payload || response || [];
      setSemesters(Array.isArray(semesterList) ? semesterList : []);
    } catch (err) {
      console.error('Error loading semesters:', err);
      message.error('Failed to load semesters');
    } finally {
      setLoadingSemesters(false);
    }
  };

  const handleRubricFileChange = ({ fileList: newFileList }) => {
    setRubricFileList(newFileList);
  };

  const handleStudentFileChange = ({ fileList: newFileList }) => {
    setStudentFileList(newFileList);
  };

  const onFinish = async (values) => {
    if (rubricFileList.length === 0) {
      message.error('Vui lòng upload file Rubric');
      return;
    }
    if (studentFileList.length === 0) {
      message.error('Vui lòng upload file học sinh');
      return;
    }

    const formData = new FormData();
    formData.append('Code', values.code);
    formData.append('Name', values.name);
    formData.append('SemesterId', values.semesterId);
    formData.append('RubricFile', rubricFileList[0].originFileObj);
    formData.append('StudentFile', studentFileList[0].originFileObj);

    try {
      const response = await createExam(formData);
      notification.success({
        message: 'Tạo kì thi thành công',
        description: `Mã: ${values.code} | Tên: ${values.name}`,
        placement: 'topRight',
      });
      form.resetFields();
      setRubricFileList([]);
      setStudentFileList([]);
    } catch (err) {
      message.error(err?.Message || 'Lỗi khi tạo kì thi');
      console.error('Error creating exam:', err);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16} lg={12}>
          <Card
            title={
              <h2 style={{ margin: 0, color: '#1890ff' }}>
                ➕ Tạo Kì Thi Mới
              </h2>
            }
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Spin spinning={loading} tip="Đang xử lý...">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                {/* Exam Code */}
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Mã Kì Thi</span>}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mã kì thi',
                    },
                    {
                      pattern: /^[A-Z0-9_]+$/,
                      message: 'Mã kì thi chỉ được chứa chữ hoa, số và dấu gạch dưới',
                    },
                  ]}
                >
                  <Input
                    placeholder="VD: EXAM_PRN232_2024"
                    size="large"
                    allowClear
                  />
                </Form.Item>

                {/* Exam Name */}
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Tên Kì Thi</span>}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên kì thi',
                    },
                    {
                      min: 3,
                      message: 'Tên kì thi phải ít nhất 3 ký tự',
                    },
                  ]}
                >
                  <Input
                    placeholder="VD:Practical Exam PRN232"
                    size="large"
                    allowClear
                  />
                </Form.Item>

                {/* Semester */}
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Học Kì</span>}
                  name="semesterId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn học kì',
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn học kì"
                    size="large"
                    loading={loadingSemesters}
                    options={semesters.map((sem) => ({
                      label: sem.name,
                      value: sem.id,
                    }))}
                  />
                </Form.Item>

                {/* Rubric File */}
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>File Rubric</span>}
                  name="rubricFile"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (rubricFileList.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Vui lòng upload file Rubric')
                        );
                      },
                    },
                  ]}
                >
                  <Upload
                    maxCount={1}
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleRubricFileChange}
                    fileList={rubricFileList}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      size="large"
                      style={{
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Chọn file Rubric (xlsx, xls, csv, pdf)
                    </Button>
                  </Upload>
                </Form.Item>
                {rubricFileList.length > 0 && (
                  <div style={{ marginBottom: '16px', color: '#52c41a' }}>
                    ✓ File được chọn: {rubricFileList[0].name}
                  </div>
                )}

                {/* Student Submission File */}
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>File Danh Sách Sinh Viên</span>}
                  name="studentFile"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (studentFileList.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Vui lòng upload file danh sách sinh viên')
                        );
                      },
                    },
                  ]}
                >
                  <Upload
                    maxCount={1}
                    accept=".xlsx"
                    onChange={handleStudentFileChange}
                    fileList={studentFileList}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      size="large"
                      style={{
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Chọn file (xlsx)
                    </Button>
                  </Upload>
                </Form.Item>
                {studentFileList.length > 0 && (
                  <div style={{ marginBottom: '16px', color: '#52c41a' }}>
                    ✓ File được chọn: {studentFileList[0].name}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    style={{
                      padding: '12px',
                      marginBottom: '16px',
                      background: '#fff2f0',
                      border: '1px solid #ffccc7',
                      borderRadius: '4px',
                      color: '#ff4d4f',
                    }}
                  >
                    ⚠️ {error?.Message || 'Có lỗi xảy ra'}
                  </div>
                )}

                {/* Submit Button */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    block
                    style={{ marginTop: '8px' }}
                  >
                    {loading ? 'Đang tạo...' : 'Tạo Kì Thi'}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>

        {/* Info Panel */}
        <Col xs={24} md={8}>
          <Card
            title="ℹ️ Hướng Dẫn"
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <p>
                <strong>Mã Kì Thi:</strong> Định danh duy nhất, chỉ chứa chữ
                hoa, số và dấu gạch dưới.
              </p>
              <p>
                <strong>Tên Kì Thi:</strong> Tên mô tả kì thi, dễ nhận diện.
              </p>
              <p>
                <strong>Học Kì:</strong> Chọn kì học phù hợp.
              </p>
              <p>
                <strong>File Rubric:</strong> Tài liệu tiêu chí chấm điểm
                (.xlsx, .xls, .csv, .pdf).
              </p>
              <p>
                <strong>File Danh Sách Sinh Viên:</strong> Tập tin chứa danh sách sinh viên
                (.xlsx).
              </p>
              <hr />
              <p style={{ color: '#666', fontSize: '12px' }}>
                💡 Sau khi tạo thành công, kì thi sẽ ở trạng thái "Nháp". Bạn
                có thể chỉnh sửa và xuất bản sau.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
