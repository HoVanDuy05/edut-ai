import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  SmileOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        Giới thiệu về chúng tôi
      </Title>

      <Paragraph style={{ fontSize: 16, lineHeight: 1.8, textAlign: 'center' }}>
        Chào mừng bạn đến với <strong>EduMaster</strong> – nền tảng học trực tuyến giúp bạn phát triển kỹ năng mọi lúc, mọi nơi. 
        Chúng tôi mang đến các khóa học chất lượng cao từ các giảng viên hàng đầu, với mục tiêu giúp bạn chạm tới ước mơ học tập và phát triển nghề nghiệp.
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        <Col xs={24} md={12} lg={6}>
          <Card
            hoverable
            bordered={false}
            style={{ textAlign: 'center', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <BookOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 16 }} />
            <Title level={4}>100+ Khóa học</Title>
            <Paragraph>Kho nội dung phong phú từ cơ bản đến nâng cao thuộc nhiều lĩnh vực khác nhau.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            hoverable
            bordered={false}
            style={{ textAlign: 'center', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <TeamOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 16 }} />
            <Title level={4}>Giảng viên uy tín</Title>
            <Paragraph>Đội ngũ giảng viên giàu kinh nghiệm, từng giảng dạy tại các trường đại học danh tiếng.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            hoverable
            bordered={false}
            style={{ textAlign: 'center', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <SmileOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 16 }} />
            <Title level={4}>Học mọi lúc</Title>
            <Paragraph>Giao diện thân thiện, dễ sử dụng, phù hợp với mọi thiết bị.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            hoverable
            bordered={false}
            style={{ textAlign: 'center', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <CustomerServiceOutlined style={{ fontSize: 40, color: '#eb2f96', marginBottom: 16 }} />
            <Title level={4}>Hỗ trợ 24/7</Title>
            <Paragraph>Đội ngũ chăm sóc khách hàng nhiệt tình, sẵn sàng hỗ trợ bạn mọi lúc.</Paragraph>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Title level={3}>Sứ mệnh của chúng tôi</Title>
        <Paragraph style={{ fontSize: 16, maxWidth: 800, margin: 'auto' }}>
          Chúng tôi mong muốn mang đến cho mọi người cơ hội học tập dễ dàng, tiết kiệm chi phí và hiệu quả.
          Với tinh thần đổi mới, EduMaster cam kết luôn nâng cấp chất lượng nội dung và công nghệ để hỗ trợ học viên tốt nhất.
        </Paragraph>
      </div>
    </div>
  );
};

export default About;
