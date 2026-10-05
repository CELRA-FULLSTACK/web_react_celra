import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import {
  ExclamationCircleOutlined,
  FileProtectOutlined,
  RightCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { AssessmentItemData } from '../../../api/assessment.api';

const { Text, Paragraph, Title } = Typography;

interface Props {
  item: AssessmentItemData;
  onNavigateToKanban?: () => void;
}

export const GapItemCard: React.FC<Props> = ({ item, onNavigateToKanban }) => {
  const getSeverityTag = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Tag color="error" icon={<WarningOutlined />}>Mức độ: Khẩn cấp</Tag>;
      case 'MAJOR':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>Mức độ: Nghiêm trọng</Tag>;
      default:
        return <Tag color="default">Mức độ: Tiêu chuẩn</Tag>;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'NON_COMPLIANT':
        return <Tag color="red">Chưa tuân thủ</Tag>;
      case 'MISSING_EVIDENCE':
        return <Tag color="orange">Thiếu hồ sơ minh chứng</Tag>;
      case 'NEED_EXPERT':
        return <Tag color="purple">Cần chuyên gia tư vấn</Tag>;
      default:
        return <Tag color="green">Đã tuân thủ</Tag>;
    }
  };

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        borderLeft: item.severity === 'CRITICAL' ? '4px solid #ff4d4f' : '4px solid #faad14',
      }}
      size="small"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={5} style={{ margin: '0 0 8px 0', color: '#1f1f1f' }}>
            {item.title}
          </Title>
          <Space wrap size={[4, 8]} style={{ marginBottom: 12 }}>
            {getSeverityTag(item.severity)}
            {getStatusTag(item.status)}
            <Tag color="blue" icon={<FileProtectOutlined />}>
              Căn cứ: {item.legal_reference}
            </Tag>
          </Space>
        </div>
      </div>

      <Paragraph style={{ margin: '8px 0', color: '#595959', fontSize: 13 }}>
        <Text strong style={{ color: '#262626' }}>Nguyên nhân rủi ro: </Text>
        {item.gap_reason || 'Chưa ghi nhận đủ thông tin hoàn tất nghĩa vụ này.'}
      </Paragraph>

      {item.recommended_action && (
        <div
          style={{
            backgroundColor: '#f6ffed',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #b7eb8f',
            marginTop: 8,
          }}
        >
          <Text strong style={{ color: '#389e0d' }}>
            <RightCircleOutlined style={{ marginRight: 6 }} />
            Hành động đề xuất:
          </Text>
          <Text style={{ marginLeft: 6, color: '#262626' }}>{item.recommended_action}</Text>
        </div>
      )}

      {item.auto_generated_task_id && onNavigateToKanban && (
        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <Text
            style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer' }}
            onClick={onNavigateToKanban}
          >
            Đã tạo Task #{item.auto_generated_task_id} trên Kanban $\rightarrow$
          </Text>
        </div>
      )}
    </Card>
  );
};
