import React from 'react';
import { Row, Col, Form, Input, Button, Typography, message, Card } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Contact = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('Gửi liên hệ:', values);
    message.success('💬 Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.');
    form.resetFields();
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 20px',
        background: '#f9fbff',
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
        Liên hệ với chúng tôi
      </Title>
      <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 48 }}>
        Hãy để lại thông tin hoặc liên hệ trực tiếp. Chúng tôi luôn sẵn sàng hỗ trợ bạn.
      </Paragraph>

      <Row gutter={[32, 32]} align="stretch">
        {/* Bên trái - Thông tin liên hệ */}
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              padding: 24,
              height: '100%',
            }}
          >
            <div style={{ fontSize: 16, lineHeight: 2 }}>
              <p>
                <EnvironmentOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
              </p>
              <p>
                <PhoneOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                <strong>Hotline:</strong> 0123 456 789
              </p>
              <p>
                <MailOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                <strong>Email:</strong> support@khoahoc.vn
              </p>
            </div>

            <iframe
              title="Bản đồ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.165957209513!2d106.69745031428708!3d10.797233261778554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cbdf06b87f%3A0x87c9a53ed5d21a2b!2zMTAxIMSQxrDhu51uZyBOZ3V54buFbiBUcmkgVOG7kSAyLCBQaMaw4budbmcgNywgUXXDoW4gR2nhu4dwLCBI4buTIENow60gQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1617257286172!5m2!1svi!2s"
              width="100%"
              height="200"
              style={{ border: 0, marginTop: 20, borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Card>
        </Col>

        {/* Bên phải - Form liên hệ */}
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              padding: 24,
              height: '100%',
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              initialValues={{ name: '', email: '', message: '' }}
            >
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ tên..." size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input placeholder="Nhập email..." size="large" />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="message"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
              >
                <Input.TextArea
                  placeholder="Bạn cần hỗ trợ gì?"
                  rows={4}
                  size="large"
                  style={{ resize: 'none' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SendOutlined />}
                  block
                  style={{ borderRadius: 8 }}
                >
                  Gửi liên hệ
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
