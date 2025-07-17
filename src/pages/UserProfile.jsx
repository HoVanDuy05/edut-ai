import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  List,
  Avatar,
  Spin,
  message,
  Progress,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import { fetchFavorites } from '../services/api';
import ModalCoursePlayer from '../components/ModalCoursePlayer';
import '../css/UserPage.css';

const { TabPane } = Tabs;

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.error('Bạn chưa đăng nhập');
      navigate('/auth');
      return;
    }

    const loadUserData = async () => {
      try {
        setUserInfo(user);
        const fav = await fetchFavorites(user.id);
        setFavorites(fav);

        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = allOrders.filter((o) => o.userId === user.id);
        const items = userOrders.flatMap((o) =>
          o.items.map((item) => ({
            ...item.product,
            progress: Math.floor(Math.random() * 100),
          }))
        );
        setPurchased(items);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu người dùng:', err);
        message.error('Lỗi khi tải dữ liệu người dùng');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const onSelectCourse = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <div className="centered">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="user-page">
      <Card className="user-header-card">
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>
          <Col flex={1}>
            <h2 style={{ marginBottom: 4 }}>{userInfo?.name}</h2>
            <p style={{ margin: 0, color: '#888' }}>{userInfo?.email}</p>
            <p style={{ margin: 0, fontSize: 13 }}>🎉 Thành viên từ: {userInfo?.createdAt}</p>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="1" className="user-tabs">
        <TabPane
          tab={
            <span>
              <HeartOutlined /> Yêu thích
            </span>
          }
          key="1"
        >
          <List
            grid={{ gutter: 20, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={favorites}
            renderItem={(item) => (
              <List.Item>
                <Card hoverable className="course-card">
                  <img src={item.image} alt={item.name} className="course-img" />
                  <h4 style={{ marginTop: 12 }}>{item.name}</h4>
                  <p style={{ color: '#666' }}>{item.price.toLocaleString()}đ</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined /> Đã mua
            </span>
          }
          key="2"
        >
          <List
            grid={{ gutter: 20, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={purchased}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  className="course-card"
                  onClick={() => onSelectCourse(item)}
                >
                  <img src={item.image} alt={item.name} className="course-img" />
                  <h4 style={{ marginTop: 12 }}>{item.name}</h4>
                  <p style={{ color: '#666' }}>{item.price.toLocaleString()}đ</p>
                  <Progress
                    percent={item.progress}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#52c41a',
                    }}
                    style={{ marginTop: 10 }}
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>

      <ModalCoursePlayer
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default UserProfile;
