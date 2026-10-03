import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  deleteEmployeeApi,
  type Employee,
  getEmployeesApi,
} from '../../api/user.api';
import { useAppSelector } from '../../hooks/redux';
import { CreateEmployeeModal } from './CreateEmployeeModal';

const { Title, Text } = Typography;

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { user, permissions } = useAppSelector((state) => state.auth);

  // Quyền hạn kiểm tra theo RBAC
  const canCreate =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('employee:create');
  const canDelete =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('employee:delete');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployeesApi();
      if (res.status && res.data) {
        setEmployees(res.data);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Không thể tải danh sách nhân viên';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeactivate = async (id: number) => {
    try {
      const res = await deleteEmployeeApi(id);
      if (res.status) {
        message.success('Đã khóa tài khoản nhân viên thành công');
        fetchEmployees();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Khóa tài khoản thất bại';
      message.error(msg);
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 220,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 160,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 240,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone: string | null) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      width: 240,
      render: (roles: Employee['roles']) => (
        <Space size={[0, 4]} wrap>
          {roles.map((r) => (
            <Tag
              color={r.code === 'COMPANY_ADMIN' ? 'blue' : 'geekblue'}
              key={r.id}
            >
              {r.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Badge
          status={status === 'ACTIVE' ? 'success' : 'default'}
          text={status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN'),
    },
    ...(canDelete
      ? [
          {
            title: 'Thao tác',
            key: 'action',
            width: 110,
            fixed: 'right' as const,
            render: (_: unknown, record: Employee) => (
              <Space size="middle">
                {record.id !== user?.id && record.status === 'ACTIVE' ? (
                  <Popconfirm
                    title="Khóa tài khoản nhân viên"
                    description={`Bạn có chắc chắn muốn khóa tài khoản "${record.full_name}"?`}
                    onConfirm={() => handleDeactivate(record.id)}
                    okText="Khóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<LockOutlined />}
                    >
                      Khóa
                    </Button>
                  </Popconfirm>
                ) : (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {record.id === user?.id ? 'Tài khoản của bạn' : '—'}
                  </Text>
                )}
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <TeamOutlined style={{ marginRight: 8, color: '#0284c7' }} />
            Quản lý Nhân sự Doanh nghiệp
          </Title>
          <Text type="secondary">
            Cấp tài khoản và quản lý danh sách nhân sự trực thuộc công ty của bạn
          </Text>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchEmployees}>
            Làm mới
          </Button>
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ background: '#0284c7' }}
            >
              Thêm nhân viên mới
            </Button>
          )}
        </Space>
      </div>

      <Card
        bordered={false}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<Employee>
          rowKey="id"
          columns={columns}
          dataSource={employees}
          loading={loading}
          scroll={{ x: 1150 }}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng số: ${total} nhân sự` }}
        />
      </Card>

      <CreateEmployeeModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchEmployees();
        }}
      />
    </div>
  );
};
