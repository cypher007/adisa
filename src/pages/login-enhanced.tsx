import { Button, Card, Space, Typography } from "antd";
import { GoogleOutlined, GithubOutlined, TwitterOutlined, AppleOutlined, KeyOutlined, UserAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const LoginEnhancedPage = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: "12px"
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Welcome to ADISA
            </Title>
            <Text type="secondary">
              Sign in with your preferred method
            </Text>
          </div>

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Button
              type="primary"
              size="large"
              block
              icon={<KeyOutlined />}
              onClick={() => window.location.href = "/api/login"}
              style={{ height: "48px" }}
            >
              Sign In
            </Button>

            <Button
              size="large"
              block
              icon={<KeyOutlined />}
              onClick={() => window.location.href = "/api/login/openid"}
              style={{ height: "48px" }}
            >
              Sign In with OpenID
            </Button>

            <Button
              size="large"
              block
              icon={<UserAddOutlined />}
              onClick={() => window.location.href = "/api/register"}
              style={{ height: "48px" }}
            >
              Create Account
            </Button>
          </Space>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              type="link"
              onClick={() => window.location.href = "/api/forgot-password"}
            >
              Forgot Password?
            </Button>
          </div>

          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Powered by Replit Auth
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};
