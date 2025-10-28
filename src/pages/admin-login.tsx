import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const AdminLoginPage = () => {
  const { mutate: login } = useLogin();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      login(values);
    } catch (error) {
      message.error("Erreur lors de la connexion");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#1a1a1a",
      }}
    >
      <Card
        style={{
          width: 450,
          background: "#2a2a2a",
          borderColor: "#404040",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          borderRadius: 12,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/assets/africtivistes-logo.png"
            alt="AfricTivistes"
            style={{
              height: 60,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              background: "#f0db4f",
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <SafetyOutlined style={{ fontSize: 40, color: "#000" }} />
          </div>
          <Title level={2} style={{ marginBottom: 8, color: "#f0db4f" }}>
            Espace Administrateur
          </Title>
          <Text style={{ color: "#b0b0b0" }}>
            ADISA - AfricTivistes Digital Safety Audit
          </Text>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre nom d'utilisateur",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#b0b0b0" }} />}
              placeholder="Nom d'utilisateur administrateur"
              size="large"
              style={{
                background: "#1a1a1a",
                borderColor: "#404040",
                color: "#e0e0e0",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre mot de passe",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#b0b0b0" }} />}
              placeholder="Mot de passe"
              size="large"
              style={{
                background: "#1a1a1a",
                borderColor: "#404040",
                color: "#e0e0e0",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                background: "#f0db4f",
                color: "#000",
                border: "none",
                fontWeight: 600,
                height: 48,
              }}
            >
              Se connecter en tant qu'Administrateur
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#1a1a1a",
            borderRadius: 8,
            border: "1px solid #404040",
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#b0b0b0" }}>
            🔒 Accès réservé aux administrateurs uniquement
          </Text>
        </div>
      </Card>
    </div>
  );
};
