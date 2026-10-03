import React from 'react';
import { Badge, Button, Card, Col, Descriptions, Row, Tag, Typography } from 'antd';
import {
  BankOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const { Title, Text, Paragraph } = Typography;

export const DashboardPage: React.FC = () => {
  const { user, company, permissions } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const canManageEmployees =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('employee:view');

  return (
    <div>
      {/* Banner Chào Mừng */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 12,
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: 24,
        }}
      >
        <Row align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Xin chào, {user?.full_name || user?.username}!
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0', fontSize: 15 }}>
              Chào mừng bạn đến với hệ thống quản trị tuân thủ pháp lý CELRA. Doanh nghiệp của bạn đang được bảo vệ trong môi trường đa người thuê an toàn.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 12 }}>
            {canManageEmployees && (
              <Button
                type="default"
                size="large"
                icon={<TeamOutlined />}
                onClick={() => navigate('/employees')}
                style={{
                  color: '#0369a1',
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Quản lý Nhân sự
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {/* Thông tin Doanh nghiệp & Quyền hạn */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BankOutlined style={{ color: '#0284c7' }} />
                Thông tin Doanh nghiệp của bạn
              </span>
            }
            bordered
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: '20px 24px' } }}
          >
            {company ? (
              <Descriptions
                column={1}
                bordered
                size="middle"
                labelStyle={{ width: 190, background: '#f8fafc', fontWeight: 500 }}
              >
                <Descriptions.Item label="Tên Doanh nghiệp">
                  <Text strong>{company.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">
                  <Text copyable strong style={{ color: '#0284c7' }}>
                    {company.tax_code}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái tài khoản">
                  <Badge status="success" text="Đang hoạt động (ACTIVE)" />
                </Descriptions.Item>
                <Descriptions.Item label="Mô hình cách ly dữ liệu">
                  <Tag color="cyan">Multi-tenant (Company ID: {company.id})</Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">
                Tài khoản của bạn thuộc quyền Quản trị viên Toàn hệ thống (Không giới hạn doanh nghiệp).
              </Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: '#0284c7' }} />
                Thông tin Phân quyền (RBAC)
              </span>
            }
            bordered
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: '20px 24px' } }}
          >
            <Descriptions
              column={1}
              bordered
              size="middle"
              labelStyle={{ width: 160, background: '#f8fafc', fontWeight: 500 }}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Tên đăng nhập">
                <Text code>{user?.username}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email liên hệ">
                <Text>{user?.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò chính">
                <Tag color="blue" style={{ fontSize: 13, padding: '2px 8px' }}>
                  {user?.role}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                <KeyOutlined style={{ marginRight: 6, color: '#10b981' }} />
                Các quyền hạn được cấp ({permissions.length}):
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {permissions.map((perm) => (
                  <Tag key={perm} color="green">
                    {perm}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
