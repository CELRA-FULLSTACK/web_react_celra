import React, { useState } from 'react';
import { Alert, Button, Form, Input, message, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi, type ResetPasswordPayload } from '../../api/auth.api';

const { Title, Text } = Typography;

interface ResetFormValues extends ResetPasswordPayload {
  confirm_password?: string;
}

export const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const onFinish = async (values: ResetFormValues) => {
    if (!token) {
      message.error('Mã token xác thực không tồn tại trong liên kết');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordApi({
        token,
        new_password: values.new_password,
      });

      if (res.status) {
        message.success(
          'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
          4,
        );
        navigate('/login');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
          Thiết lập mật khẩu mới
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Nhập mật khẩu mới an toàn cho tài khoản của bạn
        </Text>
      </div>

      {!token ? (
        <div>
          <Alert
            message="Liên kết không hợp lệ"
            description="Đường link đặt lại mật khẩu thiếu mã token xác thực hoặc đã bị sửa đổi. Vui lòng thực hiện lại thao tác quên mật khẩu."
            type="error"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#0284c7', fontWeight: 600 }}>
              Gửi lại yêu cầu khôi phục
            </Link>
          </div>
        </div>
      ) : (
        <Form<ResetFormValues>
          name="reset_password_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirm_password"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
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
              Cập nhật mật khẩu
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
          </div>
        </Form>
      )}
    </div>
  );
};
