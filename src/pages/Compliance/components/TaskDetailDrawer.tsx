import React from 'react';
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  List,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ComplianceTaskData } from '../../../api/task.api';

const { Text, Title, Paragraph } = Typography;

interface Props {
  visible: boolean;
  task: ComplianceTaskData | null;
  onClose: () => void;
  onStatusChange: (status: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE') => void;
  onOpenUpload: () => void;
}

export const TaskDetailDrawer: React.FC<Props> = ({
  visible,
  task,
  onClose,
  onStatusChange,
  onOpenUpload,
}) => {
  if (!task) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Tag color="default">Cần làm</Tag>;
      case 'IN_PROGRESS':
        return <Tag color="processing">Đang thực hiện</Tag>;
      case 'RESOLVE':
        return <Tag color="purple">Chờ xác nhận</Tag>;
      case 'DONE':
        return <Tag color="success">Hoàn thành</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <Tag color="error" icon={<WarningOutlined />}>Khẩn cấp</Tag>;
      case 'MAJOR':
        return <Tag color="warning">Nghiêm trọng</Tag>;
      default:
        return <Tag color="default">Tiêu chuẩn</Tag>;
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Chi tiết Công việc #{task.id}</span>
          <Space>{getStatusBadge(task.status)}</Space>
        </div>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={onOpenUpload}
          >
            Nộp Bằng chứng
          </Button>
        </Space>
      }
    >
      <Title level={4} style={{ marginTop: 0 }}>
        {task.title}
      </Title>

      <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Mức độ ưu tiên">
          {getSeverityBadge(task.severity)}
        </Descriptions.Item>
        <Descriptions.Item label="Hạn chót">
          <Tag icon={<CalendarOutlined />} color="blue">
            {task.deadline || 'Không có'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Người phụ trách">
          <Space>
            <UserOutlined />
            <Text strong>
              {task.assigned_to ? task.assigned_to.full_name : 'Chưa phân công'}
            </Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Select
            value={task.status}
            onChange={(val) => onStatusChange(val)}
            style={{ width: 140 }}
            options={[
              { value: 'TODO', label: 'Cần làm' },
              { value: 'IN_PROGRESS', label: 'Đang làm' },
              { value: 'RESOLVE', label: 'Chờ xác nhận' },
              { value: 'DONE', label: 'Hoàn thành' },
            ]}
          />
        </Descriptions.Item>
      </Descriptions>

      {task.legal_reference && (
        <div
          style={{
            backgroundColor: '#f0f5ff',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid #adc6ff',
          }}
        >
          <Text strong style={{ color: '#1d39c4' }}>
            <FileProtectOutlined style={{ marginRight: 6 }} />
            Căn cứ pháp lý:
          </Text>
          <div style={{ marginTop: 4, color: '#262626' }}>{task.legal_reference}</div>
        </div>
      )}

      {task.description && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Mô tả rủi ro / nguyên nhân:</Text>
          <Paragraph style={{ marginTop: 4, color: '#595959' }}>{task.description}</Paragraph>
        </div>
      )}

      {task.action_guide && (
        <div
          style={{
            backgroundColor: '#f6ffed',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid #b7eb8f',
          }}
        >
          <Text strong style={{ color: '#389e0d' }}>
            💡 Hướng dẫn thực hiện:
          </Text>
          <Paragraph style={{ marginTop: 4, color: '#262626', marginBottom: 0 }}>
            {task.action_guide}
          </Paragraph>
        </div>
      )}

      {task.completion_note && (
        <div
          style={{
            backgroundColor: '#fffbe6',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid #ffe58f',
          }}
        >
          <Text strong style={{ color: '#d48806' }}>
            📝 Ghi chú giải trình hoàn thành:
          </Text>
          <div style={{ marginTop: 4, color: '#262626' }}>{task.completion_note}</div>
        </div>
      )}

      <Divider style={{ margin: '16px 0' }} />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>
            <FileTextOutlined style={{ marginRight: 6 }} />
            Tài liệu & Bằng chứng đã nộp ({task.evidences?.length || 0})
          </Title>
        </div>

        {!task.evidences || task.evidences.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có tài liệu minh chứng nào được tải lên"
          />
        ) : (
          <List
            size="small"
            dataSource={task.evidences}
            renderItem={(ev) => (
              <List.Item
                actions={[
                  <Button
                    key="download"
                    type="link"
                    size="small"
                    icon={<DownloadOutlined />}
                    href={ev.file_url}
                    target="_blank"
                  >
                    Xem file
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                  title={<Text strong>{ev.file_name}</Text>}
                  description={
                    <Space size={8}>
                      <Tag color="green">Đã nộp</Tag>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {new Date(ev.created_at).toLocaleDateString('vi-VN')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Drawer>
  );
};
