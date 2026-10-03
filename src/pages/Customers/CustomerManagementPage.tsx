import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  createCustomerApi,
  type Customer,
  getCustomersApi,
  toggleCustomerStatusApi,
  updateCustomerApi,
} from '../../api/customer.api';
import { useAppSelector } from '../../hooks/redux';

const { Title, Text } = Typography;
const { Option } = Select;

export const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const { user, permissions } = useAppSelector((state) => state.auth);

  const canCreate =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('customer:create');
  const canUpdate =
    user?.role === 'SYSTEM_ADMIN' || permissions.includes('customer:update');

  const fetchCustomers = async (
    page = 1,
    limit = 10,
    s = search,
    status = statusFilter,
  ) => {
    try {
      setLoading(true);
      const res = await getCustomersApi({ page, limit, search: s, status });
      if (res.status && res.data) {
        setCustomers(res.data.items || []);
        setPagination({
          current: res.data.pagination.page,
          pageSize: res.data.pagination.limit,
          total: res.data.pagination.total,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách khách hàng';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = () => {
    fetchCustomers(1, pagination.pageSize, search, statusFilter);
  };

  const handleTableChange = (pag: { current?: number; pageSize?: number }) => {
    fetchCustomers(pag.current || 1, pag.pageSize || 10, search, statusFilter);
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOpenEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      email: record.email || '',
      address: record.address || '',
      notes: record.notes || '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingCustomer) {
        const res = await updateCustomerApi(editingCustomer.id, values);
        if (res.status) {
          message.success('Cập nhật thông tin khách hàng thành công!');
          setModalVisible(false);
          fetchCustomers(pagination.current, pagination.pageSize);
        }
      } else {
        const res = await createCustomerApi(values);
        if (res.status) {
          message.success('Tạo hồ sơ khách hàng mới thành công!');
          setModalVisible(false);
          fetchCustomers(1, pagination.pageSize);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác không thành công';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: Customer) => {
    const nextStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await toggleCustomerStatusApi(record.id, { status: nextStatus });
      if (res.status) {
        message.success(res.data?.message || 'Cập nhật trạng thái thành công!');
        fetchCustomers(pagination.current, pagination.pageSize);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể thay đổi trạng thái';
      message.error(msg);
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Khách hàng',
      key: 'name',
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      ellipsis: true,
      render: (text: string | null) =>
        text ? <Text>{text}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (text: string | null) =>
        text ? <Text>{text}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 180,
      ellipsis: true,
      render: (text: string | null) =>
        text ? <Text type="secondary">{text}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Đã vô hiệu'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '—',
    },
    ...(canUpdate
      ? [
          {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            fixed: 'right' as const,
            render: (_: unknown, record: Customer) => (
              <Space size="small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenEdit(record)}
                  style={{ color: '#0284c7' }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title={
                    record.status === 'ACTIVE'
                      ? 'Vô hiệu hóa khách hàng?'
                      : 'Kích hoạt lại khách hàng?'
                  }
                  description={
                    record.status === 'ACTIVE'
                      ? 'Khách hàng sẽ không thể sử dụng dịch vụ.'
                      : 'Khách hàng sẽ có thể sử dụng dịch vụ lại.'
                  }
                  onConfirm={() => handleToggleStatus(record)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  okButtonProps={{ danger: record.status === 'ACTIVE' }}
                >
                  <Button
                    type="text"
                    danger={record.status === 'ACTIVE'}
                    icon={
                      record.status === 'ACTIVE' ? <LockOutlined /> : <UnlockOutlined />
                    }
                  >
                    {record.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                  </Button>
                </Popconfirm>
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
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <UserOutlined style={{ marginRight: 8, color: '#0284c7' }} />
            Quản Lý Khách Hàng
          </Title>
          <Text type="secondary">
            Danh sách khách hàng đăng ký và khách vãng lai
          </Text>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchCustomers()}>
            Làm mới
          </Button>
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              style={{ background: '#0284c7' }}
            >
              Thêm Khách Hàng
            </Button>
          )}
        </Space>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm theo tên, SĐT, email..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Trạng thái"
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v || '')}
          style={{ width: 160 }}
          allowClear
        >
          <Option value="ACTIVE">Hoạt động</Option>
          <Option value="INACTIVE">Đã vô hiệu</Option>
        </Select>
        <Button type="primary" onClick={handleSearch} style={{ background: '#0284c7' }}>
          Tìm kiếm
        </Button>
      </Space>

      <Card
        bordered={false}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<Customer>
          rowKey="id"
          columns={columns}
          dataSource={customers}
          loading={loading}
          scroll={{ x: 1100 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Tổng số: ${total} khách hàng`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingCustomer ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitting}
        okText={editingCustomer ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={520}
        okButtonProps={{ style: { background: '#0284c7' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Họ và tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: 'Số điện thoại không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="0912345678" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Email không đúng định dạng' }]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú nội bộ về khách hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
