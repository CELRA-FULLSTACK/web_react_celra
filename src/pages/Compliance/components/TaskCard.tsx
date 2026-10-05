import React from 'react';
import { Avatar, Card, Dropdown, Space, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ComplianceTaskData } from '../../../api/task.api';

const { Text, Paragraph } = Typography;

interface Props {
  task: ComplianceTaskData;
  onClick: () => void;
  onStatusChange: (newStatus: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE') => void;
  onOpenUpload: () => void;
}

export const TaskCard: React.FC<Props> = ({
  task,
  onClick,
  onStatusChange,
  onOpenUpload,
}) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <Tag color="error" style={{ margin: 0 }}>Khẩn cấp</Tag>;
      case 'MAJOR':
        return <Tag color="warning" style={{ margin: 0 }}>Nghiêm trọng</Tag>;
      default:
        return <Tag color="default" style={{ margin: 0 }}>Tiêu chuẩn</Tag>;
    }
  };

  const menuItems = [
    {
      key: 'TODO',
      label: 'Chuyển sang: Cần làm',
      disabled: task.status === 'TODO',
      onClick: () => onStatusChange('TODO'),
    },
    {
      key: 'IN_PROGRESS',
      label: 'Chuyển sang: Đang thực hiện',
      disabled: task.status === 'IN_PROGRESS',
      onClick: () => onStatusChange('IN_PROGRESS'),
    },
    {
      key: 'RESOLVE',
      label: 'Chuyển sang: Chờ xác nhận',
      disabled: task.status === 'RESOLVE',
      onClick: () => onStatusChange('RESOLVE'),
    },
    {
      key: 'DONE',
      label: 'Đánh dấu: Hoàn thành',
      disabled: task.status === 'DONE',
      onClick: () => onStatusChange('DONE'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'upload',
      label: 'Tải lên Bằng chứng',
      icon: <FileTextOutlined />,
      onClick: onOpenUpload,
    },
  ];

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 8,
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space size={4}>{getSeverityBadge(task.severity)}</Space>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: 16, color: '#8c8c8c', padding: '0 4px' }} />
          </Dropdown>
        </div>
      </div>

      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{ margin: '8px 0 6px 0', fontWeight: 600, fontSize: 13, color: '#262626' }}
      >
        {task.title}
      </Paragraph>

      {task.legal_reference && (
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {task.legal_reference}
          </Text>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid #fafafa',
        }}
      >
        <Space size={6}>
          {task.deadline && (
            <Tag
              icon={<CalendarOutlined />}
              style={{ fontSize: 11, margin: 0 }}
              color="#f5f5f5"
            >
              {task.deadline}
            </Tag>
          )}
          {task.evidences && task.evidences.length > 0 && (
            <Tag color="cyan" icon={<FileTextOutlined />} style={{ fontSize: 11, margin: 0 }}>
              {task.evidences.length} file
            </Tag>
          )}
        </Space>

        <span title={task.assigned_to ? task.assigned_to.full_name : 'Chưa giao'}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: task.assigned_to ? '#1677ff' : '#d9d9d9' }}
          />
        </span>
      </div>
    </Card>
  );
};
