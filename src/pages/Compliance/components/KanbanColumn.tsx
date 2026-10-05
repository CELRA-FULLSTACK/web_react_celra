import React from 'react';
import { Badge, Card, Empty } from 'antd';
import type { ComplianceTaskData } from '../../../api/task.api';
import { TaskCard } from './TaskCard';

interface Props {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE';
  tasks: ComplianceTaskData[];
  headerColor: string;
  badgeColor: string;
  onSelectTask: (task: ComplianceTaskData) => void;
  onStatusChange: (taskId: number, newStatus: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE') => void;
  onOpenUpload: (task: ComplianceTaskData) => void;
}

export const KanbanColumn: React.FC<Props> = ({
  title,
  tasks,
  headerColor,
  badgeColor,
  onSelectTask,
  onStatusChange,
  onOpenUpload,
}) => {
  return (
    <Card
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        height: '100%',
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: 12, flex: 1, overflowY: 'auto' }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: headerColor }}>{title}</span>
          <Badge
            count={tasks.length}
            style={{ backgroundColor: badgeColor }}
            showZero
          />
        </div>
      }
    >
      {tasks.length === 0 ? (
        <div style={{ padding: '30px 0' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ color: '#bfbfbf' }}>Không có công việc</span>}
          />
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onSelectTask(task)}
            onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
            onOpenUpload={() => onOpenUpload(task)}
          />
        ))
      )}
    </Card>
  );
};
