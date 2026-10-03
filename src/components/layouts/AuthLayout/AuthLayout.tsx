import React from 'react';
import { Card, Layout, Typography, Space } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export const AuthLayout: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Space orientation="horizontal" size="middle" align="center">
            <SafetyCertificateOutlined
              style={{
                fontSize: 42,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: 12,
                borderRadius: 12,
                border: '1px solid rgba(56, 189, 248, 0.2)',
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <Title
                level={2}
                style={{
                  color: '#ffffff',
                  margin: 0,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                CELRA
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                Compliance & Legal Management Platform
              </Text>
            </div>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 14 }}>
              Hệ thống Quản trị Tuân thủ Pháp lý Doanh nghiệp
            </Text>
          </div>
        </div>

        <Card
          bordered={false}
          style={{
            width: '100%',
            maxWidth: 580,
            borderRadius: 16,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            background: '#ffffff',
          }}
          bodyStyle={{ padding: '32px 32px 28px' }}
        >
          <Outlet />
        </Card>
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          color: '#64748b',
          fontSize: 13,
          padding: '20px 0 0',
        }}
      >
        © 2026 CELRA Platform. Thiết kế theo chuẩn Multi-tenant RBAC.
      </Footer>
    </Layout>
  );
};
