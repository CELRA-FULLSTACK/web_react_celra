import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { logout } from '../../../store/slices/authSlice';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, company, permissions } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Chỉ hiển thị menu Nhân sự nếu có quyền employee:view hoặc là SYSTEM_ADMIN
  const canViewEmployees =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('employee:view');
  const canViewRoles =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('employee:view');

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Bàn làm việc',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/compliance/kanban',
      icon: <AppstoreOutlined />,
      label: 'Bảng Kanban Tuân thủ',
      onClick: () => navigate('/compliance/kanban'),
    },
    {
      key: '/compliance/assessment',
      icon: <AuditOutlined />,
      label: 'Đánh giá Tuân thủ AI',
      onClick: () => navigate('/compliance/assessment'),
    },
    {
      key: '/compliance/profile',
      icon: <SafetyCertificateOutlined />,
      label: 'Hồ sơ Tuân thủ Số',
      onClick: () => navigate('/compliance/profile'),
    },
    {
      key: '/compliance/documents',
      icon: <FileDoneOutlined />,
      label: 'Kho Bằng chứng Số',
      onClick: () => navigate('/compliance/documents'),
    },
    ...(canViewEmployees
      ? [
          {
            key: '/employees',
            icon: <TeamOutlined />,
            label: 'Quản lý Nhân sự',
            onClick: () => navigate('/employees'),
          },
        ]
      : []),
    ...(canViewRoles
      ? [
          {
            key: '/roles',
            icon: <SafetyCertificateOutlined />,
            label: 'Quản trị Vai trò',
            onClick: () => navigate('/roles'),
          },
        ]
      : []),
  ];

  const userDropdownItems = [
    {
      key: 'user_info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.full_name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</div>
          <Tag color="blue" style={{ marginTop: 4 }}>
            {user?.role}
          </Tag>
        </div>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: '#0f172a',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 24px' : '0 20px',
            background: '#090d16',
            color: '#fff',
            gap: 12,
          }}
        >
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: '#38bdf8' }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.05em' }}>
                CELRA
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1 }}>
                Compliance Platform
              </div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            marginTop: 12,
            borderRight: 0,
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />

          <Space size="large" align="center">
            {company && (
              <Tag
                icon={<BankOutlined />}
                color="cyan"
                style={{
                  padding: '4px 10px',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 6,
                }}
              >
                {company.name} (MST: {company.tax_code})
              </Tag>
            )}

            <Dropdown
              menu={{ items: userDropdownItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: '#0284c7' }}
                  icon={<UserOutlined />}
                />
                <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                    {user?.full_name || user?.username}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {user?.role}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#ffffff',
            borderRadius: 12,
            minHeight: 280,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
