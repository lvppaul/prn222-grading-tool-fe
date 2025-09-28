import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BaseLayout from "../../../components/BaseLayout";
// correct path: from src/features/auth/pages to src/assets/images is three levels up
import loginBg from "../../../assets/images/login_background.png";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const success = await login(values.email, values.password);
    if (success) {
      const role = localStorage.getItem("role");
      if (role === "examiner") navigate("/examiner");
      else if (role === "lecturer") navigate("/lecturer");
      else navigate("/");
    } else {
      message.error("Login failed");
    }
  };

  return (
    <BaseLayout title="Sign in" backgroundImage={loginBg} cardWidth={560}>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{
          margin: "0 auto",
          maxWidth: 520,
          padding: 32,
          borderRadius: 12,
          background: "rgba(255,255,255,0.02)",
          // keep card's glass effect visible; form itself is mostly transparent
          boxShadow: "none",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input size="large" placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
}
