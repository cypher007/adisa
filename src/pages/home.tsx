import React from "react";
import { useNavigate } from "react-router";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
  LockOutlined,
  BarChartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2d3436 0%, #000000 100%)",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          padding: "80px 24px 120px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <img
            src="/assets/africtivistes-logo.png"
            alt="AfricTivistes"
            style={{
              height: 80,
              marginBottom: 32,
              filter: "brightness(0) invert(1)",
            }}
          />
          <Title
            level={1}
            style={{
              color: "white",
              fontSize: "3.5rem",
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            Africtivistes Digital Self-Audit
          </Title>

          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.5rem",
              marginBottom: 48,
              maxWidth: 800,
              margin: "0 auto 48px",
            }}
          >
            Renforcez votre résilience numérique grâce à notre outil
            d'auto-évaluation sécurisé conçu pour les organisations africaines.
          </Paragraph>

          <Button
            size="large"
            style={{
              height: 56,
              fontSize: 18,
              padding: "0 48px",
              background: "#e0e0e0",
              color: "#1a1a1a",
              border: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/login")}
          >
            Se connecter
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "80px 24px",
          marginTop: -60,
          borderRadius: "40px 40px 0 0",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  textAlign: "center",
                  height: "100%",
                  background: "#2a2a2a",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#404040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <LockOutlined style={{ fontSize: 40, color: "#e0e0e0" }} />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: "#e0e0e0" }}>
                  Sécurité renforcée
                </Title>
                <Paragraph style={{ fontSize: 16, color: "#b0b0b0" }}>
                  Vos données sont chiffrées et protégées selon les meilleures
                  pratiques.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  textAlign: "center",
                  height: "100%",
                  background: "#2a2a2a",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#404040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <BarChartOutlined style={{ fontSize: 40, color: "#e0e0e0" }} />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: "#e0e0e0" }}>
                  Analyse détaillée
                </Title>
                <Paragraph style={{ fontSize: 16, color: "#b0b0b0" }}>
                  Obtenez des recommandations personnalisées pour améliorer
                  votre sécurité.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  textAlign: "center",
                  height: "100%",
                  background: "#2a2a2a",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#404040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <GlobalOutlined style={{ fontSize: 40, color: "#e0e0e0" }} />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: "#e0e0e0" }}>
                  Adapté à l'Afrique
                </Title>
                <Paragraph style={{ fontSize: 16, color: "#b0b0b0" }}>
                  Conçu spécifiquement pour les défis numériques des
                  organisations africaines.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {/* Additional Info Section */}
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 24, color: "#e0e0e0" }}>
              Pourquoi ADISA ?
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#b0b0b0",
                maxWidth: 800,
                margin: "0 auto 48px",
              }}
            >
              ADISA (Africtivistes Digital Safety Audit) est un outil
              d'auto-évaluation développé par AfricTivistes pour aider les
              organisations africaines à évaluer et renforcer leur sécurité
              numérique. Notre plateforme offre un diagnostic complet et des
              recommandations adaptées à votre contexte.
            </Paragraph>

            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/login")}
                style={{
                  height: 48,
                  fontSize: 16,
                  padding: "0 40px",
                  background: "#e0e0e0",
                  color: "#1a1a1a",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Commencer maintenant
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#1a1a1a",
          color: "white",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <Text style={{ color: "rgba(255, 255, 255, 0.6)" }}>
          © 2025 AfricTivistes. Tous droits réservés.
        </Text>
      </div>
    </div>
  );
};
