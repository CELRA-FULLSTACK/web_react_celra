import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginApi, type LoginPayload } from '../../api/auth.api';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: LoginPayload & { remember?: boolean }) => {
    try {
      setLoading(true);
      const res = await loginApi({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });
      if (res.status && res.data) {
        dispatch(
          setCredentials({
            accessToken: res.data.accessToken,
            user: res.data.user,
            company: res.data.company,
          }),
        );

        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
          Đăng nhập hệ thống
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Nhập thông tin tài khoản doanh nghiệp hoặc nhân viên
        </Text>
      </div>

      <Form<LoginPayload>
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          label="Tên đăng nhập hoặc Email"
          name="usernameOrEmail"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên đăng nhập hoặc email!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
            placeholder="admin_company hoặc email@congty.vn"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="••••••••"
          />
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            style={{ color: '#0284c7', fontSize: 14, fontWeight: 500 }}
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item style={{ marginBottom: 16 }}>
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
            Đăng nhập
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text type="secondary">Doanh nghiệp chưa có tài khoản? </Text>
          <Link
            to="/register-company"
            style={{ color: '#0284c7', fontWeight: 600 }}
          >
            Đăng ký doanh nghiệp ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};
