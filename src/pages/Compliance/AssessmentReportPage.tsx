import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Empty,
  message,
  Space,
  Spin,
  Tabs,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  EditOutlined,
  PlayCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  assessmentApi,
  type ComplianceAssessmentData,
} from '../../api/assessment.api';
import { GapItemCard } from './components/GapItemCard';
import { ScoreDashboardCard } from './components/ScoreDashboardCard';

const { Title, Paragraph, Text } = Typography;

export const AssessmentReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [assessment, setAssessment] = useState<ComplianceAssessmentData | null>(null);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const res = await assessmentApi.getLatestAssessment();
      if (res.data) {
        setAssessment(res.data);
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể tải báo cáo đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleRunAssessment = async () => {
    try {
      setRunning(true);
      message.loading({
        content: 'CELRA AI đang phân tích bối cảnh và đối chiếu kho luật...',
        key: 'assess_run',
        duration: 0,
      });
      const res = await assessmentApi.runAssessment();
      message.success({
        content: 'Đã hoàn tất đánh giá tuân thủ! Các nhiệm vụ đã được tự động sinh trên Kanban.',
        key: 'assess_run',
        duration: 3,
      });
      if (res.data) {
        setAssessment(res.data);
      }
    } catch (err: any) {
      message.error({
        content: err.message || 'Có lỗi khi chạy đánh giá AI',
        key: 'assess_run',
        duration: 3,
      });
    } finally {
      setRunning(false);
    }
  };

  const criticalItems = assessment?.items?.filter((i) => i.severity === 'CRITICAL') || [];
  const majorItems = assessment?.items?.filter((i) => i.severity === 'MAJOR') || [];
  const standardItems = assessment?.items?.filter((i) => i.severity === 'STANDARD') || [];

  return (
    <div style={{ padding: '0 8px' }}>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <AuditOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Báo cáo Đánh giá Tuân thủ AI (Compliance Assessment)
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
            Đối chiếu thông minh giữa Hồ sơ Doanh nghiệp và Bộ luật Lao động, Luật Quản lý Thuế.
          </Paragraph>
        </div>

        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate('/compliance/profile')}>
            Sửa Hồ sơ Khảo sát
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="large"
            loading={running}
            onClick={handleRunAssessment}
            style={{ backgroundColor: '#1677ff' }}
          >
            {running ? 'Đang phân tích...' : 'Chạy Đánh giá Tuân thủ Mới'}
          </Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#8c8c8c' }}>Đang tải báo cáo tuân thủ...</div>
        </div>
      ) : !assessment ? (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0' }}>
          <Empty
            description={
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  Doanh nghiệp chưa có báo cáo đánh giá nào
                </Text>
                <div style={{ color: '#8c8c8c', marginTop: 8, fontSize: 14 }}>
                  Hãy bấm nút &quot;Chạy Đánh giá Tuân thủ Mới&quot; để AI quét toàn bộ lỗ hổng pháp lý và sinh kế hoạch hành động.
                </div>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="large"
              loading={running}
              onClick={handleRunAssessment}
              style={{ marginTop: 16 }}
            >
              Bắt đầu Đánh giá Ngay
            </Button>
          </Empty>
        </Card>
      ) : (
        <div>
          {/* Tóm tắt Điểm số */}
          <ScoreDashboardCard
            score={assessment.overall_score}
            totalChecked={assessment.total_requirements_checked}
            compliantCount={assessment.compliant_count}
            criticalCount={criticalItems.length}
            majorCount={majorItems.length}
          />

          {/* AI Nhận định chung */}
          {assessment.ai_summary && (
            <Alert
              message="Nhận định từ Chuyên gia Pháp chế Số CELRA"
              description={assessment.ai_summary}
              type="info"
              showIcon
              style={{ marginBottom: 24, borderRadius: 8 }}
            />
          )}

          {/* Header Action Kanban */}
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết các Điểm Rủi ro & Lỗ hổng Cần xử lý ({assessment.items?.length || 0})
            </Title>
            <Button
              type="default"
              icon={<AppstoreOutlined />}
              onClick={() => navigate('/compliance/kanban')}
            >
              Mở Bảng Thực thi Kanban
            </Button>
          </div>

          {/* Tabs phân loại lỗ hổng */}
          <Tabs
            defaultActiveKey="all"
            items={[
              {
                key: 'all',
                label: `Tất cả (${assessment.items?.length || 0})`,
                children: (
                  <div>
                    {assessment.items?.map((item) => (
                      <GapItemCard
                        key={item.id}
                        item={item}
                        onNavigateToKanban={() => navigate('/compliance/kanban')}
                      />
                    ))}
                  </div>
                ),
              },
              {
                key: 'critical',
                label: (
                  <span style={{ color: '#ff4d4f' }}>
                    <WarningOutlined /> Khẩn cấp ({criticalItems.length})
                  </span>
                ),
                children: (
                  <div>
                    {criticalItems.length === 0 ? (
                      <Empty description="Tuyệt vời! Không có rủi ro mức độ khẩn cấp." />
                    ) : (
                      criticalItems.map((item) => (
                        <GapItemCard
                          key={item.id}
                          item={item}
                          onNavigateToKanban={() => navigate('/compliance/kanban')}
                        />
                      ))
                    )}
                  </div>
                ),
              },
              {
                key: 'major',
                label: `Nghiêm trọng (${majorItems.length})`,
                children: (
                  <div>
                    {majorItems.length === 0 ? (
                      <Empty description="Không có rủi ro nghiêm trọng." />
                    ) : (
                      majorItems.map((item) => (
                        <GapItemCard
                          key={item.id}
                          item={item}
                          onNavigateToKanban={() => navigate('/compliance/kanban')}
                        />
                      ))
                    )}
                  </div>
                ),
              },
              {
                key: 'standard',
                label: `Tiêu chuẩn (${standardItems.length})`,
                children: (
                  <div>
                    {standardItems.length === 0 ? (
                      <Empty description="Không có cảnh báo tiêu chuẩn." />
                    ) : (
                      standardItems.map((item) => (
                        <GapItemCard
                          key={item.id}
                          item={item}
                          onNavigateToKanban={() => navigate('/compliance/kanban')}
                        />
                      ))
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
