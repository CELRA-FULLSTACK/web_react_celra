import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  InputNumber,
  message,
  Progress,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import {
  AuditOutlined,
  FileDoneOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  complianceProfileApi,
  type ComplianceProfileData,
} from '../../api/complianceProfile.api';

const { Title, Paragraph, Text } = Typography;

export const ComplianceProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completenessScore, setCompletenessScore] = useState(0);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await complianceProfileApi.getProfile();
      if (res.data) {
        setCompletenessScore(res.data.completeness_score || 0);
        form.setFieldsValue({
          total_employees: res.data.total_employees,
          probation_employees: res.data.probation_employees,
          official_employees: res.data.official_employees,
          has_internal_labor_rules: res.data.has_internal_labor_rules,
          has_registered_labor_rules: res.data.has_registered_labor_rules,
          has_signed_all_labor_contracts: res.data.has_signed_all_labor_contracts,
          has_social_insurance_registration: res.data.has_social_insurance_registration,
          tax_declaration_cycle: res.data.tax_declaration_cycle || 'QUARTERLY',
          accounting_standard: res.data.accounting_standard || 'CIRCULAR_133',
          has_electronic_invoices: res.data.has_electronic_invoices,
          has_digital_signature: res.data.has_digital_signature,
        });
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể tải hồ sơ tuân thủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onFinish = async (values: Partial<ComplianceProfileData>) => {
    try {
      setSaving(true);
      const res = await complianceProfileApi.updateProfile(values);
      message.success('Cập nhật hồ sơ tuân thủ số thành công!');
      if (res.data?.completeness_score !== undefined) {
        setCompletenessScore(res.data.completeness_score);
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <TeamOutlined />
          1. Lao động & Nhân sự
        </span>
      ),
      children: (
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="total_employees"
              label="Tổng số nhân sự hiện có"
              tooltip="Bao gồm cả lao động chính thức, thử việc, thời vụ"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 15" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="official_employees"
              label="Số lao động chính thức"
              tooltip="Nhân sự đã ký HĐLĐ có thời hạn hoặc không xác định thời hạn"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 12" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="probation_employees"
              label="Số nhân sự đang thử việc"
              tooltip="Nhân sự đang trong thời gian thử việc theo thỏa thuận"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 3" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_signed_all_labor_contracts"
              label="Đã ký Hợp đồng lao động bằng văn bản với 100% nhân sự?"
              valuePropName="checked"
            >
              <Checkbox>Đã hoàn tất ký kết HĐLĐ đầy đủ</Checkbox>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_social_insurance_registration"
              label="Đã đăng ký tham gia BHXH bắt buộc cho nhân sự chính thức?"
              valuePropName="checked"
            >
              <Checkbox>Đã trích nộp BHXH định kỳ hàng tháng</Checkbox>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_internal_labor_rules"
              label="Doanh nghiệp đã ban hành Nội quy lao động bằng văn bản chưa?"
              valuePropName="checked"
            >
              <Checkbox>Đã ban hành văn bản Nội quy lao động</Checkbox>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_registered_labor_rules"
              label="Đã đăng ký Nội quy lao động với Sở/Phòng LĐTB&XH chưa? (Nếu >= 10 người)"
              valuePropName="checked"
            >
              <Checkbox>Đã có xác nhận đăng ký từ cơ quan quản lý</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <FileDoneOutlined />
          2. Thuế & Kế toán
        </span>
      ),
      children: (
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="tax_declaration_cycle"
              label="Chu kỳ kê khai thuế Giá trị gia tăng (GTGT)"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'QUARTERLY', label: 'Theo Quý (Doanh thu năm trước liền kề <= 50 tỷ)' },
                  { value: 'MONTHLY', label: 'Theo Tháng (Doanh thu năm trước liền kề > 50 tỷ)' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="accounting_standard"
              label="Chế độ kế toán áp dụng"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'CIRCULAR_133', label: 'Thông tư 133/2016/TT-BTC (Dành cho DN nhỏ và vừa)' },
                  { value: 'CIRCULAR_200', label: 'Thông tư 200/2014/TT-BTC (Dành cho mọi loại hình DN)' },
                  { value: 'CIRCULAR_88', label: 'Thông tư 88/2021/TT-BTC (Dành cho hộ kinh doanh)' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_electronic_invoices"
              label="Đã phát hành và sử dụng Hóa đơn điện tử hợp pháp?"
              valuePropName="checked"
            >
              <Checkbox>Đang sử dụng hóa đơn điện tử theo Nghị định 123</Checkbox>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="has_digital_signature"
              label="Đang sở hữu Chữ ký số (USB Token / SmartCA) còn thời hạn?"
              valuePropName="checked"
            >
              <Checkbox>Chữ ký số còn hiệu lực sử dụng</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <SafetyCertificateOutlined />
          3. Giấy phép & Hồ sơ sẵn có
        </span>
      ),
      children: (
        <div style={{ padding: '8px 0' }}>
          <Alert
            message="Số hóa kho hồ sơ"
            description="Đánh dấu các loại hồ sơ, giấy chứng nhận hoặc tài liệu pháp lý doanh nghiệp bạn đã có sẵn. Điều này giúp AI đề xuất chính xác các loại giấy tờ còn thiếu."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Checkbox defaultChecked disabled>
                Giấy chứng nhận đăng ký doanh nghiệp (ĐKKD)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox defaultChecked>
                Thông báo phát hành Hóa đơn điện tử
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox>
                Hồ sơ phương án Phòng cháy chữa cháy (PCCC)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox>
                Giấy chứng nhận cơ sở đủ điều kiện An toàn thực phẩm (nếu F&B)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox>
                Biên bản cam kết / Đề án Bảo vệ môi trường
              </Checkbox>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          <SafetyCertificateOutlined style={{ color: '#1677ff', marginRight: 8 }} />
          Hồ sơ Tuân thủ Số (Enterprise Compliance Profile)
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 4 }}>
          Khảo sát bối cảnh thực tế của doanh nghiệp để làm cơ sở cho AI đối chiếu quy định pháp luật và phát hiện lỗ hổng.
        </Paragraph>
      </div>

      <Card style={{ marginBottom: 20, borderRadius: 12, backgroundColor: '#fafafa' }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={16}>
            <Text strong style={{ fontSize: 15 }}>
              Mức độ hoàn thiện hồ sơ: {completenessScore}%
            </Text>
            <Progress
              percent={completenessScore}
              status={completenessScore >= 80 ? 'success' : 'active'}
              strokeColor={completenessScore >= 80 ? '#52c41a' : '#1677ff'}
            />
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<AuditOutlined />}
              onClick={() => navigate('/compliance/assessment')}
            >
              Chuyển sang Đánh giá AI
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} loading={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Tabs defaultActiveKey="1" items={tabItems} size="large" />

          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button icon={<HomeOutlined />} onClick={() => navigate('/dashboard')}>
              Bỏ qua & Xem Dashboard
            </Button>

            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
              >
                Lưu Khảo sát & Tính điểm
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};
