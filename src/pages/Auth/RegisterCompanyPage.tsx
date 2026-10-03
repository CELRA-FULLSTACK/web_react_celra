import React, { useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import {
  BankOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompanyApi, type RegisterCompanyPayload } from '../../api/auth.api';

const { Title, Text } = Typography;

interface RegisterFormValues extends RegisterCompanyPayload {
  confirm_password?: string;
}

export const RegisterCompanyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      const res = await registerCompanyApi(values);

      if (res.status) {
        message.success(
          'Đăng ký doanh nghiệp thành công! Vui lòng đăng nhập để bắt đầu.',
          4,
        );
        navigate('/login');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng ký thất bại';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
          Đăng ký Doanh nghiệp mới
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Khởi tạo tài khoản doanh nghiệp tự phục vụ để bắt đầu quản trị tuân thủ
        </Text>
      </div>

      <Form<RegisterFormValues>
        form={form}
        name="register_company_form"
        layout="vertical"
        onFinish={onFinish}
        size="middle"
      >
        <Divider titlePlacement="start" style={{ margin: '12px 0 16px', color: '#0284c7' }}>
          <Text strong style={{ color: '#0284c7' }}>
            1. THÔNG TIN DOANH NGHIỆP
          </Text>
        </Divider>

        <Form.Item
          label="Tên doanh nghiệp"
          name="company_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp!' }]}
        >
          <Input
            prefix={<BankOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Ví dụ: Công ty Cổ phần Nông sản Miền Tây"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mã số thuế"
              name="tax_code"
              rules={[{ required: true, message: 'Vui lòng nhập mã số thuế!' }]}
            >
              <Input
                prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />}
                placeholder="1800123456"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email doanh nghiệp"
              name="company_email"
              rules={[
                { required: true, message: 'Vui lòng nhập email công ty!' },
                { type: 'email', message: 'Email không đúng định dạng!' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                placeholder="contact@doanhnghiep.vn"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Số điện thoại liên hệ" name="company_phone">
              <Input
                prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
                placeholder="02923888999"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Địa chỉ trụ sở" name="address">
              <Input placeholder="Quận Ninh Kiều, TP Cần Thơ" />
            </Form.Item>
          </Col>
        </Row>

        <Divider titlePlacement="start" style={{ margin: '16px 0 16px', color: '#0284c7' }}>
          <Text strong style={{ color: '#0284c7' }}>
            2. TÀI KHOẢN CHỦ DOANH NGHIỆP (ADMIN)
          </Text>
        </Divider>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Họ và tên người đại diện"
              name="full_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Nguyễn Văn A"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 3, message: 'Tối thiểu 3 ký tự' },
              ]}
            >
              <Input placeholder="admin_company" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email cá nhân người đại diện"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không đúng định dạng!' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
            placeholder="nguyenvana@gmail.com"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="••••••••"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu xác nhận không khớp!'),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="••••••••"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 44,
              fontSize: 15,
              fontWeight: 600,
              background: '#0284c7',
              borderRadius: 8,
            }}
          >
            Đăng ký Doanh nghiệp
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 600 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};
