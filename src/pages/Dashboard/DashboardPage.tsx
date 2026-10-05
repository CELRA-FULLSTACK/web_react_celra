import React, { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  FileDoneOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { complianceProfileApi } from '../../api/complianceProfile.api';
import { useAppSelector } from '../../hooks/redux';

const { Title, Text, Paragraph } = Typography;

export const DashboardPage: React.FC = () => {
  const { user, company, permissions } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [completeness, setCompleteness] = useState<number | null>(null);

  useEffect(() => {
    complianceProfileApi.getProfile().then((res) => {
      if (res.data?.completeness_score !== undefined) {
        setCompleteness(res.data.completeness_score);
      }
    }).catch(() => {});
  }, []);

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
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<AuditOutlined />}
                onClick={() => navigate('/compliance/assessment')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0284c7',
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Đánh giá Tuân thủ AI
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Reminder Banner for Incomplete Profile */}
      {completeness !== null && completeness < 70 && (
        <Alert
          message="Hồ sơ tuân thủ số chưa hoàn thiện"
          description={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span>
                Doanh nghiệp mới hoàn thành <b>{completeness}%</b> thông tin khảo sát. Hãy bổ sung để AI quét chính xác hơn các nghĩa vụ luật định.
              </span>
              <Button
                type="primary"
                size="small"
                onClick={() => navigate('/compliance/profile')}
              >
                Hoàn thiện ngay
              </Button>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {/* Phím tắt Truy cập Nhanh Tuân thủ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, borderColor: '#e2e8f0' }}
            onClick={() => navigate('/compliance/kanban')}
          >
            <Space align="start">
              <AppstoreOutlined style={{ fontSize: 24, color: '#0284c7', marginTop: 4 }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>Bảng Kanban Thực thi</Text>
                <div style={{ fontSize: 12, color: '#64748b' }}>Quản lý tiến độ task tuân thủ</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, borderColor: '#e2e8f0' }}
            onClick={() => navigate('/compliance/assessment')}
          >
            <Space align="start">
              <AuditOutlined style={{ fontSize: 24, color: '#10b981', marginTop: 4 }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>Đánh giá Tuân thủ AI</Text>
                <div style={{ fontSize: 12, color: '#64748b' }}>Quét lỗ hổng & điểm rủi ro</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, borderColor: '#e2e8f0' }}
            onClick={() => navigate('/compliance/profile')}
          >
            <Space align="start">
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#f59e0b', marginTop: 4 }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>Hồ sơ Bối cảnh Số</Text>
                <div style={{ fontSize: 12, color: '#64748b' }}>Khảo sát nhân sự & thuế</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ borderRadius: 10, borderColor: '#e2e8f0' }}
            onClick={() => navigate('/compliance/documents')}
          >
            <Space align="start">
              <FileDoneOutlined style={{ fontSize: 24, color: '#8b5cf6', marginTop: 4 }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>Kho Bằng chứng Số</Text>
                <div style={{ fontSize: 12, color: '#64748b' }}>Tài liệu pháp lý đã nộp</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

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
