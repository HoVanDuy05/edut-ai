// src/components/Footer.jsx
import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Title, Link } = Typography;

const CustomFooter = () => {
  return (
    <Footer style={{ background: '#001529', color: '#fff', padding: '40px 80px' }}>
      <Row gutter={[32, 32]}>
        {/* Giới thiệu */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ color: '#fff' }}>Về chúng tôi</Title>
          <Text style={{ color: '#ccc' }}>
            Chúng tôi cung cấp các khoá học chất lượng cao từ những giảng viên hàng đầu.
          </Text>
          <div style={{ marginTop: 16 }}>
            <Space>
              <FacebookFilled style={{ fontSize: 24, color: '#3b5998' }} />
              <TwitterSquareFilled style={{ fontSize: 24, color: '#1da1f2' }} />
              <InstagramFilled style={{ fontSize: 24, color: '#e4405f' }} />
            </Space>
          </div>
        </Col>

        {/* Liên kết nhanh */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ color: '#fff' }}>Liên kết</Title>
          <Space direction="vertical">
            <Link href="/" style={{ color: '#ccc' }}>Trang chủ</Link>
            <Link href="/about" style={{ color: '#ccc' }}>Giới thiệu</Link>
            <Link href="/courses" style={{ color: '#ccc' }}>Khoá học</Link>
            <Link href="/contact" style={{ color: '#ccc' }}>Liên hệ</Link>
          </Space>
        </Col>

        {/* Thông tin liên hệ */}
        <Col xs={24} sm={24} md={8}>
          <Title level={4} style={{ color: '#fff' }}>Liên hệ</Title>
          <Space direction="vertical">
            <Text style={{ color: '#ccc' }}>
              <EnvironmentOutlined /> 123 Đường ABC, Quận 1, TP.HCM
            </Text>
            <Text style={{ color: '#ccc' }}>
              <PhoneOutlined /> 0123 456 789
            </Text>
            <Text style={{ color: '#ccc' }}>
              <MailOutlined /> support@khoahoc.vn
            </Text>
          </Space>
        </Col>
      </Row>

      <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid #444', paddingTop: 20 }}>
        <Text style={{ color: '#aaa' }}>© {new Date().getFullYear()} EduMaster.vn. Đã đăng ký bản quyền.</Text>
      </div>
    </Footer>
  );
};

export default CustomFooter;
