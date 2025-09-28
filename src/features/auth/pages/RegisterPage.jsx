import { Card, Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const { Option } = Select;

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const payload = await register(values);
    if (payload?.success) {
      const role = localStorage.getItem("role");
      if (role === "examiner") navigate("/examiner");
      else if (role === "lecturer") navigate("/lecturer");
      else navigate("/");
    } else {
      message.error(payload?.message || "Register failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      <Card style={{ width: 480 }}>
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ roleId: 2 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Role" name="roleId">
            <Select>
              <Option value={1}>Examiner</Option>
              <Option value={2}>Lecturer</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
