import React from 'react';
import { Card, Col, Progress, Row, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

interface Props {
  score: number;
  totalChecked: number;
  compliantCount: number;
  criticalCount: number;
  majorCount: number;
}

export const ScoreDashboardCard: React.FC<Props> = ({
  score,
  totalChecked,
  compliantCount,
  criticalCount,
  majorCount,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return '#52c41a';
    if (val >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreStatusText = (val: number) => {
    if (val >= 80) return 'Mức độ Tuân thủ An toàn';
    if (val >= 50) return 'Cần Khắc phục Lỗ hổng Sớm';
    return 'Cảnh báo Rủi ro Pháp lý Cao';
  };

  return (
    <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Progress
            type="dashboard"
            percent={score}
            strokeColor={getScoreColor(score)}
            size={160}
            format={(percent) => (
              <div>
                <span style={{ fontSize: 32, fontWeight: 700, color: getScoreColor(percent || 0) }}>
                  {percent}
                </span>
                <span style={{ fontSize: 14, color: '#8c8c8c' }}>/100</span>
                <div style={{ fontSize: 13, marginTop: 4, color: '#595959', fontWeight: 500 }}>
                  Điểm Tuân thủ
                </div>
              </div>
            )}
          />
          <div style={{ marginTop: 8, fontWeight: 600, color: getScoreColor(score) }}>
            {getScoreStatusText(score)}
          </div>
        </Col>

        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Statistic
                  title="Đã Đạt Chuẩn"
                  value={compliantCount}
                  valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                  prefix={<CheckCircleOutlined />}
                  suffix={`/ ${totalChecked}`}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
                <Statistic
                  title="Rủi ro Khẩn cấp"
                  value={criticalCount}
                  valueStyle={{ color: '#ff4d4f', fontWeight: 700 }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ backgroundColor: '#fffbe6', borderColor: '#ffe58f' }}>
                <Statistic
                  title="Rủi ro Đáng chú ý"
                  value={majorCount}
                  valueStyle={{ color: '#faad14', fontWeight: 700 }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ backgroundColor: '#f0f5ff', borderColor: '#adc6ff' }}>
                <Statistic
                  title="Tổng Tiêu chuẩn"
                  value={totalChecked}
                  valueStyle={{ color: '#1677ff', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
