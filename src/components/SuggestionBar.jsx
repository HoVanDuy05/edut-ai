import React from 'react';
import { Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

export default class SuggestionBar extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          icon={<BulbOutlined />}
          size="large"
          onClick={this.props.onSuggest}
          style={{
            borderRadius: 20,
            padding: '0 24px',
            background: 'linear-gradient(to right, #1677ff, #69c0ff)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          Gợi ý từ AI
        </Button>
      </div>
    );
  }
}
