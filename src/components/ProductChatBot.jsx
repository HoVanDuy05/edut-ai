import React, { useState } from 'react';
import { Input, Button, Card, List, Typography, message } from 'antd';
import { fetchProducts } from '../services/api';

const { Text } = Typography;

export default function ProductChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { type: 'user', text: input }]);
    setLoading(true);

    try {
      const allProducts = await fetchProducts();
      const keyword = input.toLowerCase();

      const matched = allProducts.filter((p) =>
        `${p.name} ${p.description} ${p.longDescription}`.toLowerCase().includes(keyword)
      );

      setSuggestions(matched);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: matched.length
            ? `Tôi tìm thấy ${matched.length} khóa học phù hợp:`
            : 'Xin lỗi, tôi không tìm thấy khóa học phù hợp.',
        },
      ]);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Lỗi khi gợi ý sản phẩm');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Card title="🧠 Tư vấn khóa học AI" style={{ marginTop: 32 }}>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <Text strong>{msg.type === 'user' ? 'Bạn: ' : 'Bot: '}</Text>
            <Text>{msg.text}</Text>
          </div>
        ))}
      </div>

      <Input.Search
        placeholder="Nhập yêu cầu của bạn..."
        enterButton="Gửi"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSearch={handleSend}
        loading={loading}
      />

      {suggestions.length > 0 && (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={suggestions}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.name}
                cover={<img src={item.image} alt={item.name} />}
              >
                <Text strong>{item.price.toLocaleString()} VND</Text>
              </Card>
            </List.Item>
          )}
          style={{ marginTop: 24 }}
        />
      )}
    </Card>
  );
}
