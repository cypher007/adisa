import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button, Card, Typography, message, Statistic } from "antd";
import { SafetyOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Countdown } = Statistic;

export const Verify2FAPage = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onFinish = async (values: { token: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/2fa/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: values.token }),
      });

      const data = await response.json();

      if (data.authenticated) {
        message.success("Authentification réussie !");
        navigate("/");
      } else {
        message.error(data.message || "Code 2FA invalide");
        setLoading(false);
      }
    } catch (error) {
      message.error("Erreur lors de la vérification");
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SafetyOutlined style={{ fontSize: 48, color: "#667eea" }} />
          <Title level={2} style={{ marginBottom: 8, marginTop: 16 }}>
            Vérification 2FA
          </Title>
          <Paragraph type="secondary">
            Entrez le code à 6 chiffres généré par votre application
            d'authentification (Google Authenticator)
          </Paragraph>
        </div>

        <Form
          name="verify2fa"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="token"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le code 2FA",
              },
              {
                pattern: /^\d{6}$/,
                message: "Le code doit contenir 6 chiffres",
              },
            ]}
          >
            <Input
              placeholder="000000"
              size="large"
              maxLength={6}
              style={{
                fontSize: 24,
                textAlign: "center",
                letterSpacing: 8,
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Text type="secondary">
              Nouveau code dans : <strong>{countdown}s</strong>
            </Text>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Vérifier
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button
            type="link"
            onClick={() => navigate("/login")}
            style={{ padding: 0 }}
          >
            Retour à la connexion
          </Button>
        </div>
      </Card>
    </div>
  );
};
