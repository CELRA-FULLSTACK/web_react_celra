import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import {
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { type AssignableRole, getAssignableRolesApi } from '../../api/rbac.api';
import { createEmployeeApi, type CreateEmployeePayload } from '../../api/user.api';

interface CreateEmployeeModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateEmployeePayload>();
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<AssignableRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      const fetchRoles = async () => {
        try {
          setLoadingRoles(true);
          const res = await getAssignableRolesApi();
          if (res.status && res.data) {
            setRoles(res.data);
            // Mặc định chọn role COMPANY_STAFF
            const staffRole = res.data.find((r) => r.code === 'COMPANY_STAFF');
            if (staffRole) {
              form.setFieldValue('role_id', staffRole.id);
            }
          }
        } catch {
          message.error('Không thể tải danh sách vai trò');
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const res = await createEmployeeApi(values);

      if (res.status) {
        message.success(`Đã tạo tài khoản nhân viên "${values.full_name}" thành công!`);
        form.resetFields();
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tạo nhân viên thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm mới Nhân viên vào Doanh nghiệp"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText="Lưu nhân viên"
      cancelText="Hủy"
      width={560}
      okButtonProps={{ style: { background: '#0284c7' } }}
    >
      <Form<CreateEmployeePayload>
        form={form}
        layout="vertical"
        name="create_employee_form"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="full_name"
          label="Họ và tên nhân viên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Ví dụ: Lê Thị Mai"
          />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[
            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
            { min: 3, message: 'Tối thiểu 3 ký tự' },
          ]}
        >
          <Input
            prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />}
            placeholder="lethimai"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email nhân viên"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không đúng định dạng!' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            placeholder="lethimai@doanhnghiep.vn"
          />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại liên hệ">
          <Input
            prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
            placeholder="0912345678"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu khởi tạo ban đầu"
          extra="Doanh nghiệp cấp mật khẩu này cho nhân viên đăng nhập lần đầu."
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu khởi tạo!' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item
          name="role_id"
          label="Vai trò gán cho nhân viên"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            loading={loadingRoles}
            placeholder="Chọn vai trò phân quyền"
            options={roles.map((r) => ({
              value: r.id,
              label: `${r.name} (${r.code})`,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
