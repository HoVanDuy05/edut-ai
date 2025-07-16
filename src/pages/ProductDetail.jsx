import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography, Button, Rate, Tag, Divider, message,
  Space, Skeleton, Row, Col, Collapse
} from 'antd';
import {
  ArrowLeftOutlined, HeartOutlined, HeartFilled,
  VideoCameraOutlined
} from '@ant-design/icons';
import Slider from 'react-slick';
import { fetchProductById, fetchProducts } from '../services/api';
import { addToCartAPI } from '../services/cartApi';
import useProductActions from '../hooks/useProductActions';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CommentSection from '../components/CommentSection';
import ModalVideo from '../components/ModalVideo';
import '../css/ProductDetail.css';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function ProductDetail() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.id ;

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const { favorites, toggleFavorite, openModal, modalProduct, closeModal } = useProductActions(userId);

  const videos = [
    { title: 'Giới thiệu', url: 'https://www.youtube.com/embed/ysz5S6PUM-U', duration: '03:04' },
    { title: 'Download slide + code', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '00:23' },
    { title: 'About me', url: 'https://www.youtube.com/embed/9bZkp7q19f0', duration: '00:54' },
    { title: 'Khoá học dành cho ai?', url: 'https://www.youtube.com/embed/ysz5S6PUM-U', duration: '01:51' },
    { title: 'Nội dung khoá học', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '01:49' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        const all = await fetchProducts();
        setProduct(data);
        const rel = all.filter(p => p.id !== data.id && p.category === data.category);
        setRelated(rel.slice(0, 10));
      } catch {
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const isLiked = favorites.some(f => f.id === product?.id);

  const onAddToCart = async () => {
    try {
      await addToCartAPI(userId, product.id);
      message.success(`Đã thêm sản phẩm vào giỏ`);
    } catch {
      message.error('Lỗi thêm vào giỏ');
    }
  };
  const renderLesson = (video, index) => (
    <div
      key={index}
      onClick={() => {
        setCurrentVideo(video);
        setModalOpen(true);
      }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, cursor: 'pointer' }}
    >
      <VideoCameraOutlined style={{ color: '#1890ff' }} />
      <span>{video.title} ({video.duration})</span>
    </div>
  );

  if (loading || !product) {
    return <div style={{ padding: 80 }}><Skeleton active /></div>;
  }

  return (
    <div className="product-page">
      <Link to="/">
        <Button type="link" icon={<ArrowLeftOutlined />}>Quay lại</Button>
      </Link>

      <Row gutter={32}>
        <Col xs={24} md={16}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image-banner"
          />

          <Title level={2} style={{ marginTop: 24 }}>{product.name}</Title>

          <div className="mobile-content-info">
            <Button
                type="primary"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => {
                  setCurrentVideo(videos[0]);
                  setModalOpen(true);
                }}
            >
              Xem trước video
            </Button>
            <Divider />
            <Rate value={product.rating} disabled allowHalf />
            <Tag color="blue" style={{ marginLeft: 8 }}>{product.rating.toFixed(1)} sao</Tag>
            <Title level={3} style={{ color: '#cf1322', marginTop: 12 }}>
              {product.price.toLocaleString()} đ
            </Title>
            <p style={{ textDecoration: 'line-through', color: '#888' }}>1.859.000 đ</p>
            <p style={{ color: '#fa541c', fontWeight: 500 }}>Giảm 83%</p>
            <Space wrap style={{ marginTop: 8 }}>
              <Button
                type={isLiked ? 'default' : 'dashed'}
                ghost={isLiked}
                icon={isLiked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                onClick={() => toggleFavorite(product)}
              >
                {isLiked ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
            </Space>
          </div>

          {/* Mô tả */}
          <Divider style={{ margin: '24px 0' }} />
          <Title level={4}>Mô tả khóa học</Title>
          <Paragraph type="secondary">{product.description}</Paragraph>
          <Paragraph type="secondary">{product.longDescription}</Paragraph>
          <Divider />
          <div style={{ marginTop: 60 }}>
            <Title level={3}>Nội dung khóa học</Title>
            <Collapse accordion>
              <Panel header="Phần 1: Giới thiệu khóa học" key="1">
                {videos.map((v, i) => renderLesson(v, i))}
              </Panel>
              <Panel header="Phần 2: Career Path & AWS" key="2">
                {renderLesson({ title: 'Định nghĩa Cloud', url: 'https://www.youtube.com/embed/ysz5S6PUM-U', duration: '03:34' })}
                {renderLesson({ title: 'Giới thiệu Career Path', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '04:12' })}
              </Panel>
            </Collapse>
          </div>

          <CommentSection />

          {related.length > 0 && (
            <div style={{ marginTop: 60 }}>
              <Title level={3}>Sản phẩm liên quan</Title>
              <Slider
                dots
                infinite
                speed={500}
                slidesToShow={4}
                responsive={[
                  { breakpoint: 1024, settings: { slidesToShow: 3 } },
                  { breakpoint: 768, settings: { slidesToShow: 2 } },
                  { breakpoint: 480, settings: { slidesToShow: 1 } },
                ]}
              >
                {related.map(item => (
                  <div key={item.id} className="related-carousel">
                    <ProductCard
                      product={item}
                      onDetail={() => openModal(item)}
                      onLike={() => toggleFavorite(item)}
                      isLiked={favorites.some(f => f.id === item.id)}
                      onAddToCart={() => addToCartAPI(userId, item.id)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </Col>

        <Col xs={24} md={8}>
          <div className="course-info-box">
            <div className="desktop-content">
              <Title level={2} style={{ marginBottom: 16 }}>{product.name}</Title>
              <Paragraph type="secondary">{product.description}</Paragraph>
              <Divider />
              <Button
                type="primary"
                block
                icon={<VideoCameraOutlined />}
                onClick={() => {
                  setCurrentVideo(videos[0]);
                  setModalOpen(true);
                }}
              >
                Xem trước video
              </Button>
              <Divider />
              <Rate value={product.rating} disabled allowHalf />
              <Tag color="blue" style={{ marginLeft: 8 }}>{product.rating.toFixed(1)} sao</Tag>
              <Title level={3} style={{ marginTop: 16, color: '#cf1322' }}>
                {product.price.toLocaleString()} đ
              </Title>
              <p style={{ textDecoration: 'line-through', color: '#888' }}>
                1.859.000 đ
              </p>
              <p style={{ color: '#fa541c', fontWeight: 500 }}>Giảm 83%</p>

              <Button type="primary" block size="large" style={{ marginTop: 8 }} onClick={onAddToCart}>
                Thêm vào giỏ hàng
              </Button>
              <Button block size="large" style={{ marginTop: 8 }}>
                Mua ngay
              </Button>

              <Divider />
              <p style={{ fontWeight: 600 }}>Khóa học bao gồm:</p>
              <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
                <li>25,5 giờ video theo yêu cầu</li>
                <li>2 bài kiểm tra thực hành</li>
                <li>Bài tập và bài viết</li>
                <li>Tài nguyên có thể tải xuống</li>
                <li>Học trên TV và điện thoại</li>
                <li>Chứng chỉ hoàn thành</li>
              </ul>

              <Divider />
              <Button
                type={isLiked ? 'default' : 'dashed'}
                icon={isLiked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                onClick={() => toggleFavorite(product)}
                block
              >
                {isLiked ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
            </div>

            <div className="mobile-content">
              <div className="price">{product.price.toLocaleString()} đ</div>
              <div className="btn-group">
                <Button type="primary" onClick={onAddToCart}>Thêm vào giỏ</Button>
                <Button>Mua ngay</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <ModalVideo
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videos={[...videos]}
        initialVideo={currentVideo}
      />
      <ProductModal
              product={modalProduct}
              visible={!!modalProduct}
              onClose={closeModal}
            />
    </div>
  );
}
