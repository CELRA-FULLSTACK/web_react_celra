import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { evidenceApi, type EvidenceData } from '../../api/evidence.api';

const { Title, Paragraph, Text } = Typography;

export const DocumentVaultPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [evidences, setEvidences] = useState<EvidenceData[]>([]);
  const [searchText, setSearchText] = useState('');

  const fetchEvidences = async () => {
    try {
      setLoading(true);
      const res = await evidenceApi.getCompanyEvidences();
      if (res.data) {
        setEvidences(res.data);
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể tải kho tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidences();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await evidenceApi.deleteEvidence(id);
      message.success('Đã xóa tài liệu minh chứng');
      fetchEvidences();
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi xóa tài liệu');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const filteredData = evidences.filter((e) => {
    return (
      searchText.trim() === '' ||
      e.file_name.toLowerCase().includes(searchText.toLowerCase()) ||
      (e.task?.title && e.task.title.toLowerCase().includes(searchText.toLowerCase()))
    );
  });

  const columns = [
    {
      title: 'Tên Tài liệu / Tệp tin',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text: string, record: EvidenceData) => (
        <Space>
          <FileTextOutlined style={{ color: '#1677ff', fontSize: 18 }} />
          <div>
            <Text strong>{text}</Text>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.file_type || 'Tệp tin'}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Công việc liên quan',
      dataIndex: 'task',
      key: 'task',
      render: (task: EvidenceData['task']) =>
        task ? (
          <div>
            <Text style={{ fontSize: 13 }}>{task.title}</Text>
          </div>
        ) : (
          <Text type="secondary">N/A</Text>
        ),
    },
    {
      title: 'Dung lượng',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 120,
      render: (size: number | null) => <Text style={{ fontSize: 12 }}>{formatFileSize(size)}</Text>,
    },
    {
      title: 'Người tải lên',
      dataIndex: 'uploaded_by',
      key: 'uploaded_by',
      width: 160,
      render: (u: EvidenceData['uploaded_by']) => u?.full_name || 'Hệ thống',
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{new Date(date).toLocaleDateString('vi-VN')}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_: any, record: EvidenceData) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            href={record.file_url}
            target="_blank"
          >
            Xem file
          </Button>
          <Popconfirm
            title="Xóa tài liệu này?"
            description="Tài liệu sẽ bị xóa vĩnh viễn khỏi kho bằng chứng."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            <FileDoneOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Kho Bằng chứng Số (Digital Evidence Vault)
          </Title>
          <Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
            Quản trị tập trung toàn bộ tài liệu, hợp đồng và hồ sơ minh chứng đã nộp phục vụ tuân thủ pháp lý.
          </Paragraph>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchEvidences} loading={loading}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm tài liệu theo tên hoặc công việc..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
