import React, { useEffect, useState, useMemo } from 'react';
import {
  Typography, Card, Space, Button, Form, Input, message,
  Divider, Avatar, List, Rate, Row, Col, Tooltip, Progress,
  Modal, Grid
} from 'antd';
import {
  MessageOutlined, LikeOutlined,
  DislikeOutlined, EditOutlined, CommentOutlined
} from '@ant-design/icons';
import { fetchUsers } from '../services/userApi';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function CommentSection() {
  const [form] = Form.useForm();
  const [replyForms, setReplyForms] = useState({});
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setIsAdmin(user.role === 'admin');

    const loadData = async () => {
      try {
        const users = await fetchUsers();
        const matchedUser = users.find(u => u.id === user.id);
        setCurrentUser(matchedUser);
        const stored = JSON.parse(localStorage.getItem('comments')) || [];
        setComments(stored);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    loadData();
  }, []);

  const ratingStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comments.forEach(c => stats[c.rating]++);
    return stats;
  }, [comments]);

  const averageRating = useMemo(() => {
    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    return comments.length ? (total / comments.length).toFixed(1) : 0;
  }, [comments]);

  const formatDate = (datetime) => {
    const d = new Date(datetime);
    return d.toLocaleString('vi-VN', {
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const saveToStorage = (data) => {
    setComments(data);
    localStorage.setItem('comments', JSON.stringify(data));
  };

  const handleSubmit = (values) => {
    if (!currentUser) {
      message.error('Không tìm thấy người dùng!');
      return;
    }

    const newComment = {
      id: Date.now(),
      userId: currentUser.id,
      name: currentUser.name,
      content: values.content,
      rating: values.rating,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };

    const updated = [newComment, ...comments];
    saveToStorage(updated);
    message.success('Đã gửi bình luận!');
    form.resetFields();
    setModalVisible(false);
  };

  const handleReaction = (id, type) => {
    const updated = comments.map(c =>
      c.id === id ? { ...c, [type]: c[type] + 1 } : c
    );
    saveToStorage(updated);
  };

  const toggleReplyForm = (id) => {
    setReplyForms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReply = (commentId, replyValues) => {
    const updated = comments.map(c =>
      c.id === commentId
        ? {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: Date.now(),
                name: 'Admin',
                content: replyValues.content,
                createdAt: new Date().toISOString()
              }
            ]
          }
        : c
    );
    saveToStorage(updated);
    setReplyForms(prev => ({ ...prev, [commentId]: false }));
    message.success('Admin đã trả lời!');
  };

  const renderForm = () => {
    if (!currentUser) {
      return <Text type="danger">Không tìm thấy người dùng để bình luận.</Text>;
    }

    return (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 4 }}>
            {currentUser.name}
          </Title>
          <Text type="secondary">(Bạn đang đánh giá sản phẩm)</Text>
        </div>

        <Form.Item
          name="rating"
          label="Đánh giá sao"
          rules={[{ required: true, message: 'Chọn sao!' }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: 'Nhập bình luận!' }]}
        >
          <TextArea rows={4} placeholder="Viết cảm nhận..." maxLength={300} showCount />
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<MessageOutlined />}>
          Gửi bình luận
        </Button>
      </Form>
    );
  };

  return (
    <div style={{ marginTop: 60 }}>
      <Title level={3}>Đánh giá sản phẩm</Title>

      <Card style={{ marginBottom: 32, borderRadius: 12 }}>
        <Row gutter={32} align="middle">
          <Col xs={24} md={6}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Title level={1} style={{ margin: 0 }}>{averageRating}</Title>
              <Text>/5</Text>
              <Rate disabled allowHalf value={parseFloat(averageRating)} />
              <Text type="secondary">({comments.length} đánh giá)</Text>
            </Space>
          </Col>

          <Col xs={24} md={14}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingStats[star];
              const percent = comments.length ? (count / comments.length) * 100 : 0;
              return (
                <Row key={star} align="middle" style={{ marginBottom: 8 }}>
                  <Col span={4}><Text>{star} sao</Text></Col>
                  <Col span={16}>
                    <Progress percent={parseFloat(percent.toFixed(1))} showInfo={false} strokeColor="#faad14" />
                  </Col>
                  <Col span={4}><Text>{percent.toFixed(1)}%</Text></Col>
                </Row>
              );
            })}
          </Col>

          <Col xs={24} md={4} style={{ textAlign: 'center' }}>
            {isMobile && (
              <Button
                icon={<EditOutlined />}
                type="primary"
                style={{ backgroundColor: '#c48b5f', border: 'none' }}
                onClick={() => setModalVisible(true)}
              >
                Viết đánh giá
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {!isMobile && (
        <Card id="comment-form" style={{ marginBottom: 32, borderRadius: 12 }}>
          {renderForm()}
        </Card>
      )}

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="Viết đánh giá"
        destroyOnClose
      >
        {renderForm()}
      </Modal>

      <Divider />

      <List
        itemLayout="vertical"
        dataSource={comments}
        locale={{ emptyText: 'Chưa có bình luận nào' }}
        renderItem={item => (
          <Card key={item.id} style={{ marginBottom: 16, borderRadius: 10 }}>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.name[0].toUpperCase()}</Avatar>}
                title={<Text strong>{item.name}</Text>}
                description={
                  <>
                    <Rate disabled value={item.rating} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </>
                }
              />
              <Paragraph>{item.content}</Paragraph>
              <Space style={{ marginBottom: 8 }}>
                <Tooltip title="Thích">
                  <Button size="small" icon={<LikeOutlined />} onClick={() => handleReaction(item.id, 'likes')}>
                    {item.likes}
                  </Button>
                </Tooltip>
                <Tooltip title="Không thích">
                  <Button size="small" icon={<DislikeOutlined />} onClick={() => handleReaction(item.id, 'dislikes')}>
                    {item.dislikes}
                  </Button>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Trả lời">
                    <Button size="small" icon={<CommentOutlined />} onClick={() => toggleReplyForm(item.id)}>
                      Trả lời
                    </Button>
                  </Tooltip>
                )}
              </Space>

              {replyForms[item.id] && isAdmin && (
                <Form
                  layout="vertical"
                  onFinish={(values) => handleReply(item.id, values)}
                  style={{ marginTop: 12, background: '#fafafa', padding: 12, borderRadius: 8 }}
                >
                  <Form.Item name="content" rules={[{ required: true, message: 'Nhập trả lời!' }]}>\n                    <TextArea rows={2} placeholder="Nhập trả lời..." />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Gửi trả lời</Button>
                </Form>
              )}

              {(item.replies || []).map(reply => (
                <Card
                  key={reply.id}
                  type="inner"
                  size="small"
                  style={{ marginTop: 12, borderLeft: '3px solid #1890ff' }}
                >
                  <Text strong>{reply.name}</Text>{' '}
                  <Text type="secondary">({formatDate(reply.createdAt)})</Text>
                  <Paragraph style={{ marginTop: 4 }}>{reply.content}</Paragraph>
                </Card>
              ))}
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
}
