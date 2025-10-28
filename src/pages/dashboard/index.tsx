
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  message,
  Table,
  Tag,
  Space,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  AuditOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useGetIdentity } from "@refinedev/core";

interface DashboardStats {
  totalUsers: number;
  totalInvitations: number;
  totalAudits: number;
  pendingInvitations: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const { data: identity } = useGetIdentity();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInvitations: 0,
    totalAudits: 0,
    pendingInvitations: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [form] = Form.useForm();

  const isAdmin = identity?.role === "admin";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch("/api/admin/users");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Calculate stats
        setStats({
          totalUsers: usersData.length,
          totalInvitations: 0, // Will be updated when we add invitation endpoint
          totalAudits: 0, // Will be updated when we add audit endpoint
          pendingInvitations: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (values: { email: string }) => {
    try {
      setInviteLoading(true);
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        message.success("Invitation envoyée avec succès!");
        form.resetFields();
        setInviteModalVisible(false);
        fetchDashboardData();
      } else {
        const error = await response.json();
        message.error(error.error || "Erreur lors de l'envoi de l'invitation");
      }
    } catch (error) {
      console.error("Invite error:", error);
      message.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const userColumns = [
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Nom complet",
      key: "fullName",
      render: (record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Actif" : "Inactif"}
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
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h1>
            Tableau de bord{" "}
            {identity && `- Bienvenue ${identity.firstName || identity.name}`}
          </h1>
        </Col>

        {isAdmin && (
          <>
            {/* Statistics Cards */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Utilisateurs"
                  value={stats.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Invitations Envoyées"
                  value={stats.totalInvitations}
                  prefix={<MailOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Audits Réalisés"
                  value={stats.totalAudits}
                  prefix={<AuditOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Invitations en Attente"
                  value={stats.pendingInvitations}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>

            {/* Invite Button */}
            <Col span={24}>
              <Card>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <h3>Actions Rapides</h3>
                  <Button
                    type="primary"
                    icon={<MailOutlined />}
                    size="large"
                    onClick={() => setInviteModalVisible(true)}
                  >
                    Inviter un Utilisateur
                  </Button>
                </Space>
              </Card>
            </Col>

            {/* Recent Users Table */}
            <Col span={24}>
              <Card title="Utilisateurs Récents" loading={loading}>
                <Table
                  dataSource={users}
                  columns={userColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </>
        )}

        {!isAdmin && (
          <Col span={24}>
            <Card>
              <h3>Bienvenue sur ADISA</h3>
              <p>
                Plateforme AfricTivistes Digital Safety Audit - Votre espace de
                travail pour les audits de sécurité numérique.
              </p>
            </Card>
          </Col>
        )}
      </Row>

      {/* Invite Modal */}
      <Modal
        title="Inviter un Utilisateur"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleInvite} layout="vertical">
          <Form.Item
            name="email"
            label="Adresse Email"
            rules={[
              { required: true, message: "Veuillez saisir une adresse email" },
              { type: "email", message: "Veuillez saisir une adresse email valide" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="utilisateur@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={inviteLoading}
                icon={<MailOutlined />}
              >
                Envoyer l'Invitation
              </Button>
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  form.resetFields();
                }}
              >
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
