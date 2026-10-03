import React, { useState } from 'react';
import { Alert, Button, Form, Input, message, Typography } from 'antd';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { forgotPasswordApi, type ForgotPasswordPayload } from '../../api/auth.api';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const onFinish = async (values: ForgotPasswordPayload) => {
    try {
      setLoading(true);
      await forgotPasswordApi(values);
      setSubmittedEmail(values.email);
      message.success('Yêu cầu đã được gửi thành công!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
          Khôi phục mật khẩu
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Nhập email đăng ký để nhận liên kết đặt lại mật khẩu an toàn
        </Text>
      </div>

      {submittedEmail ? (
        <div>
          <Alert
            message="Đã gửi liên kết khôi phục"
            description={`Nếu email "${submittedEmail}" tồn tại trên hệ thống CELRA, liên kết đặt lại mật khẩu (hết hạn sau 15 phút) đã được gửi tới hộp thư của bạn. Vui lòng kiểm tra email (hoặc console server nếu đang ở chế độ dev).`}
            type="success"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#0284c7',
                fontWeight: 600,
              }}
            >
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
          </div>
        </div>
      ) : (
        <Form<ForgotPasswordPayload>
          name="forgot_password_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            label="Email tài khoản"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email!' },
              { type: 'email', message: 'Email không đúng định dạng!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
              placeholder="email@congty.vn"
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
              Gửi liên kết khôi phục
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
