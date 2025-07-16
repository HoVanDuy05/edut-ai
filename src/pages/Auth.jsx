import React, { useState } from 'react';
import {
  Row, Col, Card, Form, Input, Button, Typography, Divider, message,
} from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import '../css/Auth.css';

const { Title } = Typography;

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || [];
  };

  const saveUser = (user) => {
    const users = getUsers();
    localStorage.setItem('users', JSON.stringify([...users, user]));
  };

  const handleEmail = async (values) => {
    setLoading(true);
    try {
      const users = getUsers();

      if (mode === 'login') {
        const user = users.find(
          (u) => u.email === values.email && u.password === values.password
        );
        if (!user) throw new Error('Sai thông tin');
        localStorage.setItem('token', 'ok');
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        if (users.some((u) => u.email === values.email)) {
          throw new Error('Email đã sử dụng');
        }
        const newUser = {
          ...values,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        localStorage.setItem('token', 'ok');
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      window.location.href = '/profile';
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (resp) => {
    try {
      const decoded = JSON.parse(atob(resp.credential.split('.')[1]));
      const user = {
        name: decoded.name,
        email: decoded.email,
        createdAt: new Date().toISOString(),
      };

      const users = getUsers();
      const existed = users.find((u) => u.email === user.email);

      if (existed) {
        localStorage.setItem('token', 'ok');
        localStorage.setItem('user', JSON.stringify(existed));
      } else {
        const newUser = { ...user, id: Date.now() };
        saveUser(newUser);
        localStorage.setItem('token', 'ok');
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      window.location.href = '/profile';
    } catch (err) {
      console.error(err);
      message.error('Đăng nhập Google thất bại');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={22} sm={18} md={12} lg={8}>
        <Card>
          <Title level={3} style={{ textAlign: 'center' }}>
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Title>

          <Form onFinish={handleEmail} layout="vertical">
            {mode === 'register' && (
              <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                <Input placeholder="Tên của bạn" />
              </Form.Item>
            )}
            <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
              <Input placeholder="email@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block htmlType="submit" loading={loading}>
                {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>Hoặc</Divider>

          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => message.error('Google thất bại')}
          />

          <Divider />

          <Button type="link" block onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Auth;
