import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, Spin } from 'antd';
import {
  SendOutlined,
  MessageOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const AIChatBot = ({ allProducts = [], userId }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem(`aiChatHistory_${userId}`)) || []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatOpen) {
      axios
        .get('http://localhost:3001/chatBot')
        .then((res) => {
          setSuggestedQuestions(res.data);
        })
        .catch(() => {});

      if (messages.length === 0) {
        const greeting = {
          role: 'assistant',
          content: 'Chào bạn! Bạn cần tư vấn khóa học nào hôm nay?',
        };
        const newMessages = [greeting];
        setMessages(newMessages);
        localStorage.setItem(`aiChatHistory_${userId}`, JSON.stringify(newMessages));
      }

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatOpen]);

  const toggleChat = () => setChatOpen((prev) => !prev);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const productList = allProducts
        .map(
          (p) =>
            `- ${p.name}: ${p.description || 'Không có mô tả'} (${p.price.toLocaleString()}đ)`
        )
        .join('\n');

      const prompt = `Bạn là một trợ lý tư vấn khóa học. 
                      Hãy chỉ trả lời bằng định dạng sau cho từng sản phẩm:
                      [Tên khóa học] - [Mô tả ngắn] - [Giá]
                      Ví dụ: "Tiếng Anh giao tiếp người Mỹ - Nâng cao phản xạ nói - 999000đ"

Dưới đây là danh sách khóa học có sẵn:
${productList}`;

      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'system', content: prompt }, ...updatedMessages],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = {
        role: 'assistant',
        content: res.data.choices[0].message.content,
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      localStorage.setItem(`aiChatHistory_${userId}`, JSON.stringify(finalMessages));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, hệ thống đang bảo trì hoặc quá tải. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const extractProductsFromText = (text) => {
    const lowerText = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return allProducts.filter((p) =>
      lowerText.includes(
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )
    );
  };

  return (
    <div style={{ position: 'fixed', bottom: 80, right: 30, zIndex: 1000 }}>
      {chatOpen ? (
        <div
          style={{
            width: 380,
            maxHeight: '80vh',
            background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
            border: '1px solid #d0d0d0',
            borderRadius: 24,
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: 14,
              background: '#1677ff',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            AI Tư vấn khóa học
            <CloseOutlined
              onClick={toggleChat}
              style={{ cursor: 'pointer', fontSize: 18 }}
            />
          </div>

          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              background: '#f9f9f9',
            }}
          >
            {messages.length === 1 && suggestedQuestions.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <strong>Gợi ý:</strong>
                <ul style={{ paddingLeft: 16 }}>
                  {suggestedQuestions.map((q) => (
                    <li
                      key={q.id}
                      style={{
                        color: '#1677ff',
                        cursor: 'pointer',
                        margin: '6px 0',
                        textDecoration: 'underline',
                      }}
                      onClick={() => setInput(q.question)}
                    >
                      {q.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: msg.role === 'user' ? '#dbeafe' : '#eaeaea',
                    maxWidth: '85%',
                    fontSize: 14,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>

                {msg.role === 'assistant' &&
                  extractProductsFromText(msg.content).map((product) => (
                    <Card
                      key={product.id}
                      size="small"
                      hoverable
                      style={{ marginTop: 10, borderRadius: 12 }}
                      cover={
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            objectFit: 'cover',
                            height: 160,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                      }
                    >
                      <Card.Meta
                        title={product.name}
                        description={`${product.price.toLocaleString()}đ`}
                      />
                    </Card>
                  ))}
              </div>
            ))}

            {loading && <Spin style={{ display: 'block', marginTop: 12 }} />}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: 14,
              background: '#fff',
              borderTop: '1px solid #eee',
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <TextArea
                rows={1}
                placeholder="Nhập nội dung cần tư vấn..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleKeyPress}
                value={input}
                disabled={loading}
                style={{
                  borderRadius: 8,
                  fontSize: 14,
                  flex: 1,
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  borderRadius: 8,
                  height: 'auto',
                  padding: '0 14px',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="primary"
          shape="round"
          icon={<MessageOutlined />}
          size="large"
          onClick={toggleChat}
          style={{
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            background: '#1677ff',
            borderColor: '#1677ff',
          }}
        >
          Tư vấn AI
        </Button>
      )}
    </div>
  );
};

export default AIChatBot;
