// src/components/QuickViewButton.jsx
import React from 'react';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const QuickViewButton = ({ onClick }) => {
  return (
    <Button
      type="primary"
      ghost
      size="small"
      icon={<EyeOutlined />}
      onClick={onClick}
    >
      Xem nhanh
    </Button>
  );
};

export default QuickViewButton;
