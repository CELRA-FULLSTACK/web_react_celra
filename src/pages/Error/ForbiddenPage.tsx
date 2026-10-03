import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Result
        status="403"
        title="403 - Truy cập bị từ chối"
        subTitle="Bạn không có quyền hạn cần thiết để truy cập chức năng này. Vui lòng liên hệ quản trị viên doanh nghiệp của bạn."
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/dashboard')}
            style={{ background: '#0284c7' }}
          >
            Về Bàn làm việc
          </Button>
        }
      />
    </div>
  );
};
