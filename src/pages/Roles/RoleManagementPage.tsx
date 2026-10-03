import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  createRoleApi,
  deleteRoleApi,
  getRolesApi,
  type Role,
  type RolePermission,
  type SystemResource,
  updateRoleApi,
  updateRolePermissionsApi,
} from '../../api/role.api';

const { Title, Text, Paragraph } = Typography;

const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];

export const RoleManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [systemResources, setSystemResources] = useState<SystemResource[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const [isMatrixDrawerVisible, setIsMatrixDrawerVisible] = useState(false);
  const [activeRoleForMatrix, setActiveRoleForMatrix] = useState<Role | null>(null);
  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, string[]>>({});
  const [savingMatrix, setSavingMatrix] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await getRolesApi();
      if (res.status && res.data) {
        setRoles(res.data.roles || []);
        setSystemResources(res.data.systemResources || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách vai trò';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description,
    });
    setIsModalVisible(true);
  };

  const handleSubmitRoleForm = async (values: { name: string; code: string; description?: string }) => {
    try {
      setSubmitting(true);
      if (editingRole) {
        await updateRoleApi(editingRole.id, {
          name: values.name,
          description: values.description,
        });
        message.success('Cập nhật vai trò thành công!');
      } else {
        await createRoleApi({
          name: values.name,
          code: values.code,
          description: values.description,
        });
        message.success('Tạo vai trò mới thành công!');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await deleteRoleApi(roleId);
      message.success('Đã xóa vai trò.');
      fetchRoles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa vai trò';
      message.error(msg);
    }
  };

  const handleOpenMatrixDrawer = (role: Role) => {
    setActiveRoleForMatrix(role);
    const permMap: Record<string, string[]> = {};
    (role.permission_matrix || []).forEach((p) => {
      permMap[p.resource] = p.actions || [];
    });
    setMatrixPermissions(permMap);
    setIsMatrixDrawerVisible(true);
  };

  const handleToggleAction = (resource: string, action: string) => {
    const currentActions = matrixPermissions[resource] || [];
    let updatedActions: string[];
    if (currentActions.includes(action)) {
      updatedActions = currentActions.filter((a) => a !== action);
    } else {
      updatedActions = [...currentActions, action];
    }
    setMatrixPermissions({
      ...matrixPermissions,
      [resource]: updatedActions,
    });
  };

  const handleToggleRowAll = (resource: string) => {
    const currentActions = matrixPermissions[resource] || [];
    const allSelected = ALL_ACTIONS.every((a) => currentActions.includes(a));
    setMatrixPermissions({
      ...matrixPermissions,
      [resource]: allSelected ? [] : [...ALL_ACTIONS],
    });
  };

  const handleSaveMatrix = async () => {
    if (!activeRoleForMatrix) return;
    try {
      setSavingMatrix(true);
      const permissions: RolePermission[] = Object.entries(matrixPermissions)
        .filter(([, actions]) => actions.length > 0)
        .map(([resource, actions]) => ({ resource, actions }));

      await updateRolePermissionsApi(activeRoleForMatrix.id, permissions);
      message.success('Cập nhật ma trận phân quyền thành công!');
      setIsMatrixDrawerVisible(false);
      fetchRoles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu phân quyền';
      message.error(msg);
    } finally {
      setSavingMatrix(false);
    }
  };

  const columns: ColumnsType<Role> = [
    {
      title: 'Vai trò',
      key: 'name',
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{record.name}</div>
          <Text code style={{ fontSize: 12 }}>
            {record.code}
          </Text>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string | null) =>
        text ? <Text type="secondary">{text}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'is_system',
      key: 'is_system',
      width: 120,
      render: (isSystem: boolean) =>
        isSystem ? (
          <Tag color="blue">Hệ thống</Tag>
        ) : (
          <Tag color="green">Tùy chỉnh</Tag>
        ),
    },
    {
      title: 'Số quyền',
      key: 'permCount',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const count = (record.permission_matrix || []).reduce(
          (sum, p) => sum + (p.actions?.length || 0),
          0,
        );
        return <Text strong>{count}</Text>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<AppstoreOutlined />}
            onClick={() => handleOpenMatrixDrawer(record)}
            style={{ color: '#0284c7' }}
          >
            Phân quyền
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
            style={{ color: '#0284c7' }}
          >
            Sửa
          </Button>
          {!record.is_system && (
            <Popconfirm
              title="Xóa vai trò này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDeleteRole(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <SafetyCertificateOutlined style={{ marginRight: 8, color: '#0284c7' }} />
            Quản trị Vai trò & Phân quyền
          </Title>
          <Text type="secondary">
            Tạo và quản lý vai trò với ma trận phân quyền chi tiết
          </Text>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchRoles}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
            style={{ background: '#0284c7' }}
          >
            Tạo vai trò mới
          </Button>
        </Space>
      </div>

      <Card
        bordered={false}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<Role>
          rowKey="id"
          columns={columns}
          dataSource={roles}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={false}
        />
      </Card>

      {/* Create/Edit Role Modal */}
      <Modal
        title={editingRole ? 'Chỉnh sửa Vai trò' : 'Tạo Vai trò mới'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={submitting}
        okText={editingRole ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={480}
        okButtonProps={{ style: { background: '#0284c7' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRoleForm}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
          >
            <Input placeholder="Ví dụ: Nhân viên Kinh doanh" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã vai trò"
            rules={[
              { required: true, message: 'Vui lòng nhập mã vai trò!' },
              {
                pattern: /^[A-Z_]+$/,
                message: 'Mã vai trò chỉ gồm chữ hoa và dấu gạch dưới',
              },
            ]}
            extra="Mã vai trò phải là duy nhất, viết hoa, phân cách bằng dấu gạch dưới."
          >
            <Input placeholder="SALES_STAFF" disabled={!!editingRole} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả vai trò này có thể làm gì..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Permission Matrix Drawer */}
      <Drawer
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#0284c7' }} />
            <span>Ma trận Phân quyền</span>
            <Tag color="blue">{activeRoleForMatrix?.name}</Tag>
          </Space>
        }
        width={640}
        open={isMatrixDrawerVisible}
        onClose={() => setIsMatrixDrawerVisible(false)}
        extra={
          <Button
            type="primary"
            loading={savingMatrix}
            onClick={handleSaveMatrix}
            style={{ background: '#0284c7' }}
          >
            Lưu phân quyền
          </Button>
        }
      >
        <Alert
          message="Phân quyền theo tài nguyên"
          description="Chọn các hành động (VIEW, CREATE, UPDATE, DELETE) mà vai trò này được phép thực hiện trên từng tài nguyên hệ thống."
          type="info"
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
        />

        <Table
          rowKey="resource"
          dataSource={systemResources.map((r) => ({
            ...r,
            actions: matrixPermissions[r.resource] || [],
          }))}
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Tài nguyên',
              dataIndex: 'label',
              key: 'label',
              width: 220,
              render: (text: string, record: SystemResource) => (
                <Space>
                  <Checkbox
                    checked={ALL_ACTIONS.every((a) =>
                      (matrixPermissions[record.resource] || []).includes(a),
                    )}
                    indeterminate={
                      (matrixPermissions[record.resource] || []).length > 0 &&
                      !ALL_ACTIONS.every((a) =>
                        (matrixPermissions[record.resource] || []).includes(a),
                      )
                    }
                    onChange={() => handleToggleRowAll(record.resource)}
                  />
                  <Text strong>{text}</Text>
                </Space>
              ),
            },
            ...ALL_ACTIONS.map((action) => ({
              title: action,
              key: action,
              width: 100,
              align: 'center' as const,
              render: (_: unknown, record: SystemResource) => (
                <Checkbox
                  checked={(matrixPermissions[record.resource] || []).includes(action)}
                  onChange={() => handleToggleAction(record.resource, action)}
                />
              ),
            })),
          ]}
        />
      </Drawer>
    </div>
  );
};
