import React, { useState } from 'react';
import { Button, Divider, Input, message, Modal, Typography, Upload } from 'antd';
import { FileTextOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { evidenceApi } from '../../../api/evidence.api';
import { taskApi, type ComplianceTaskData } from '../../../api/task.api';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface Props {
  visible: boolean;
  task: ComplianceTaskData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadEvidenceModal: React.FC<Props> = ({
  visible,
  task,
  onClose,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [completionNote, setCompletionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!task) return null;

  const handleUploadAndResolve = async () => {
    try {
      setSubmitting(true);

      // 1. Nếu có file được chọn, thực hiện upload
      if (fileList.length > 0) {
        const fileToUpload = fileList[0].originFileObj || fileList[0];
        await evidenceApi.uploadTaskEvidence(task.id, fileToUpload);
        message.success('Đã tải lên bằng chứng thành công!');
      }

      // 2. Nếu có nhập ghi chú giải trình hoặc người dùng muốn chuyển DONE
      if (completionNote.trim() !== '' || fileList.length > 0) {
        await taskApi.updateTaskStatus(
          task.id,
          fileList.length > 0 ? 'RESOLVE' : 'DONE',
          completionNote.trim() || undefined,
        );
      }

      setFileList([]);
      setCompletionNote('');
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi xử lý tải lên bằng chứng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#1677ff' }} />
          <span>Nộp Bằng chứng & Hoàn tất Task #{task.id}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<UploadOutlined />}
          loading={submitting}
          onClick={handleUploadAndResolve}
        >
          Xác nhận & Cập nhật Task
        </Button>,
      ]}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 14 }}>
          {task.title}
        </Text>
        {task.action_guide && (
          <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
            💡 Hướng dẫn: {task.action_guide}
          </Paragraph>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>1. Tải lên tệp tài liệu / hồ sơ minh chứng (PDF, JPG, PNG, DOCX):</Text>
        <div style={{ marginTop: 8 }}>
          <Dragger
            maxCount={1}
            fileList={fileList}
            beforeUpload={(file) => {
              const isLt10M = file.size / 1024 / 1024 < 10;
              if (!isLt10M) {
                message.error('Dung lượng file phải nhỏ hơn 10MB!');
                return Upload.LIST_IGNORE;
              }
              setFileList([file]);
              return false; // Ngăn chặn tự động upload
            }}
            onRemove={() => setFileList([])}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#1677ff', fontSize: 36 }} />
            </p>
            <p className="ant-upload-text">Kéo thả file vào đây hoặc bấm để duyệt file</p>
            <p className="ant-upload-hint">Hỗ trợ định dạng PDF, hình ảnh, văn bản tối đa 10MB</p>
          </Dragger>
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }}>HOẶC</Divider>

      <div>
        <Text strong>2. Ghi chú giải trình lý do hoàn thành (Nếu không cần file):</Text>
        <TextArea
          rows={3}
          placeholder="VD: Đã hoàn tất ký phụ lục lao động và lưu tại tủ hồ sơ văn phòng công ty..."
          value={completionNote}
          onChange={(e) => setCompletionNote(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>
    </Modal>
  );
};
