// src/components/RemoveButton.jsx
import React from 'react';
import { Button } from 'antd';

const RemoveButton = ({ onClick }) => (
  <Button
    danger
    size="small"
    onClick={onClick}
    style={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
      backgroundColor: '#fff1f0',
      border: '1px solid #ffa39e',
      color: '#cf1322',
      borderRadius: 4,
      fontWeight: 500,
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    }}
  >
    Xóa
  </Button>
);

export default RemoveButton;
