import React from 'react';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

export default function GoogleLoginButton({ onClick, children }) {
  return (
    <Button
      icon={<GoogleOutlined />}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        color: '#555',
      }}
      onClick={onClick}
      block
    >
      {children || 'Tiếp tục với Google'}
    </Button>
  );
}
