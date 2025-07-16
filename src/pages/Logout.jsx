import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    message.success('Đã đăng xuất!');
    setTimeout(() => {
      navigate('/auth', { replace: true });
    }, 1000);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <Spin tip="Đang đăng xuất..." size="large" />
    </div>
  );
}
