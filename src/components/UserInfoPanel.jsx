import React, { useEffect, useState } from 'react';
import { Card, Avatar, Progress, Typography, Spin, message } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { fetchPurchasedCourses } from '../services/api';

const { Title, Text } = Typography;

const UserInfoPanel = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!token || !userData) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setUser(userData);
        const data = await fetchPurchasedCourses(userData.id);
        setCourses(data);
      } catch (err) {
        console.error('Lỗi khi tải thông tin người dùng:', err);
        message.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user || !localStorage.getItem('token')) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '32px auto' }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ marginBottom: 4 }}>{user.name}</Title>
              <Text type="secondary">{user.email}</Text>
              <div style={{ marginTop: 16 }}>
                <Title level={5}><BookOutlined /> Khóa học đã mua: {courses.length}</Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8 }}>
                  {courses.map(course => (
                    <div key={course.id} style={{ minWidth: 200 }}>
                      <Text strong>{course.name}</Text>
                      <Progress
                        percent={course.progress}
                        status="active"
                        strokeColor={{ from: '#108ee9', to: '#87d068' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserInfoPanel;
