import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  taskApi,
  type ComplianceTaskData,
  type KanbanBoardData,
} from '../../api/task.api';
import { KanbanColumn } from './components/KanbanColumn';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { UploadEvidenceModal } from './components/UploadEvidenceModal';

const { Title, Paragraph } = Typography;

export const KanbanBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kanbanData, setKanbanData] = useState<KanbanBoardData>({
    TODO: [],
    IN_PROGRESS: [],
    RESOLVE: [],
    DONE: [],
  });

  const [selectedTask, setSelectedTask] = useState<ComplianceTaskData | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [uploadTask, setUploadTask] = useState<ComplianceTaskData | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string | undefined>();

  const fetchKanban = async () => {
    try {
      setLoading(true);
      const res = await taskApi.getKanbanBoard();
      if (res.data) {
        setKanbanData(res.data);
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể tải bảng công việc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanban();
  }, []);

  const handleStatusChange = async (
    taskId: number,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE',
  ) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      message.success('Cập nhật trạng thái công việc thành công!');
      fetchKanban();
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const openTaskDetail = (task: ComplianceTaskData) => {
    setSelectedTask(task);
    setDrawerVisible(true);
  };

  const openUploadModal = (task: ComplianceTaskData) => {
    setUploadTask(task);
    setUploadModalVisible(true);
  };

  const filterTasks = (tasks: ComplianceTaskData[]) => {
    return tasks.filter((t) => {
      const matchSearch =
        searchText.trim() === '' ||
        t.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchText.toLowerCase()));
      const matchSeverity = !severityFilter || t.severity === severityFilter;
      return matchSearch && matchSeverity;
    });
  };

  return (
    <div style={{ padding: '0 8px' }}>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <AppstoreOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Bảng Thực thi Tuân thủ (Compliance Kanban Board)
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
            Quản trị tiến độ xử lý lỗ hổng, giao việc và theo dõi hạn nộp hồ sơ pháp lý.
          </Paragraph>
        </div>

        <Space>
          <Button icon={<AuditOutlined />} onClick={() => navigate('/compliance/assessment')}>
            Xem Báo cáo Đánh giá
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchKanban} loading={loading}>
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          marginBottom: 16,
          backgroundColor: '#fff',
          padding: '12px 16px',
          borderRadius: 8,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          border: '1px solid #f0f0f0',
        }}
      >
        <Input
          placeholder="Tìm kiếm công việc..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />

        <Select
          placeholder="Lọc mức độ ưu tiên"
          value={severityFilter}
          onChange={(val) => setSeverityFilter(val)}
          style={{ width: 180 }}
          allowClear
          options={[
            { value: 'CRITICAL', label: '🔴 Khẩn cấp' },
            { value: 'MAJOR', label: '🟠 Nghiêm trọng' },
            { value: 'STANDARD', label: '🟡 Tiêu chuẩn' },
          ]}
        />
      </div>

      {loading && kanbanData.TODO.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <KanbanColumn
              title="1. Cần làm (To Do)"
              status="TODO"
              tasks={filterTasks(kanbanData.TODO)}
              headerColor="#595959"
              badgeColor="#8c8c8c"
              onSelectTask={openTaskDetail}
              onStatusChange={handleStatusChange}
              onOpenUpload={openUploadModal}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <KanbanColumn
              title="2. Đang thực hiện"
              status="IN_PROGRESS"
              tasks={filterTasks(kanbanData.IN_PROGRESS)}
              headerColor="#d46b08"
              badgeColor="#fa8c16"
              onSelectTask={openTaskDetail}
              onStatusChange={handleStatusChange}
              onOpenUpload={openUploadModal}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <KanbanColumn
              title="3. Chờ xác nhận (Resolve)"
              status="RESOLVE"
              tasks={filterTasks(kanbanData.RESOLVE)}
              headerColor="#531dab"
              badgeColor="#722ed1"
              onSelectTask={openTaskDetail}
              onStatusChange={handleStatusChange}
              onOpenUpload={openUploadModal}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <KanbanColumn
              title="4. Hoàn thành (Done)"
              status="DONE"
              tasks={filterTasks(kanbanData.DONE)}
              headerColor="#389e0d"
              badgeColor="#52c41a"
              onSelectTask={openTaskDetail}
              onStatusChange={handleStatusChange}
              onOpenUpload={openUploadModal}
            />
          </Col>
        </Row>
      )}

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        visible={drawerVisible}
        task={selectedTask}
        onClose={() => setDrawerVisible(false)}
        onStatusChange={(newStatus) => {
          if (selectedTask) {
            handleStatusChange(selectedTask.id, newStatus);
          }
        }}
        onOpenUpload={() => {
          if (selectedTask) {
            openUploadModal(selectedTask);
          }
        }}
      />

      {/* Upload Evidence Modal */}
      <UploadEvidenceModal
        visible={uploadModalVisible}
        task={uploadTask}
        onClose={() => setUploadModalVisible(false)}
        onSuccess={() => {
          fetchKanban();
          if (selectedTask && uploadTask && selectedTask.id === uploadTask.id) {
            taskApi.getTaskDetail(selectedTask.id).then((res) => {
              if (res.data) setSelectedTask(res.data);
            });
          }
        }}
      />
    </div>
  );
};
