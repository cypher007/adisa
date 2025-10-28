import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  SafetyOutlined,
  TeamOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
  users2FAEnabled: number;
}

export const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingInvitations: 0,
    users2FAEnabled: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);

        setStats({
          totalUsers: data.users?.length || 0,
          activeUsers: data.users?.filter((u: User) => u.role !== "admin").length || 0,
          pendingInvitations: 0,
          users2FAEnabled: data.users?.filter((u: User) => u.twoFactorEnabled).length || 0,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (values: { email: string }) => {
    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Invitation envoyée à ${values.email}`);
        setInviteModalVisible(false);
        form.resetFields();
        loadDashboardData();
      } else {
        message.error(data.message || "Erreur lors de l'envoi de l'invitation");
      }
    } catch (error) {
      message.error("Erreur lors de l'envoi de l'invitation");
    }
  };

  const columns = [
    {
      title: "Utilisateur",
      dataIndex: "username",
      key: "username",
      render: (text: string, record: User) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
          {record.role === "admin" && (
            <Tag color="gold">Admin</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "2FA",
      dataIndex: "twoFactorEnabled",
      key: "twoFactorEnabled",
      render: (enabled: boolean) =>
        enabled ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Activé
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="default">
            Non activé
          </Tag>
        ),
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={2} style={{ margin: 0 }}>
              Tableau de Bord Admin
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setInviteModalVisible(true)}
            >
              Inviter un utilisateur
            </Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Utilisateurs"
              value={stats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Utilisateurs Actifs"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="2FA Activé"
              value={stats.users2FAEnabled}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Invitations en Attente"
              value={stats.pendingInvitations}
              prefix={<MailOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Card
            title="Utilisateurs Récents"
            extra={
              <Button type="link" onClick={loadDashboardData}>
                Actualiser
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total: ${total} utilisateurs`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <MailOutlined />
            <span>Inviter un Nouvel Utilisateur</span>
          </Space>
        }
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInvite}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="email"
            label="Adresse Email"
            rules={[
              {
                required: true,
                message: "Veuillez saisir une adresse email",
              },
              {
                type: "email",
                message: "Veuillez saisir une adresse email valide",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="utilisateur@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  form.resetFields();
                }}
              >
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                Envoyer l'Invitation
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#f0f5ff",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 L'utilisateur recevra un email avec un lien d'invitation valable
            7 jours. Il devra créer son compte et configurer l'authentification
            à deux facteurs (2FA) pour accéder au système.
          </Text>
        </div>
      </Modal>
    </div>
  );
};
