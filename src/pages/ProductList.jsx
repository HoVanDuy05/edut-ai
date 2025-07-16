import React, { useEffect, useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Pagination,
  Spin,
  Divider,
  message,
  Button,
} from 'antd';
import {
  AppstoreOutlined,
  FireOutlined,
  FilterOutlined,
  StarOutlined,
  RobotOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Slider from 'react-slick';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import useProductActions from '../hooks/useProductActions';
import FilterSidebar from '../components/FilterSidebar';
import AIChatBot from '../components/AIChatBot';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { Title, Text } = Typography;

function CustomArrow({ direction, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        [direction]: -18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      {direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const userId = 1;
  const { modalProduct, openModal, closeModal, toggleFavorite, addToCart, favorites } = useProductActions(userId);
  const pageSize = 8;




  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFiltered(data);
      } catch {
        message.error('Không thể tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let result = [...products];
    if (keyword) {
      result = result.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    result = result.filter((p) => {
      if (priceRange === '<500') return p.price < 500000;
      if (priceRange === '500-1000') return p.price >= 500000 && p.price <= 1000000;
      if (priceRange === '>1000') return p.price > 1000000;
      return true;
    });
    if (ratingFilter.length > 0) {
      result = result.filter((p) => ratingFilter.some((r) => p.rating >= parseFloat(r)));
    }
    if (durationFilter.length > 0) {
      result = result.filter((p) =>
        durationFilter.some((d) => {
          if (d === '<1') return p.duration < 1;
          if (d === '1-3') return p.duration >= 1 && p.duration < 3;
          if (d === '3-6') return p.duration >= 3 && p.duration < 6;
          if (d === '6-17') return p.duration >= 6 && p.duration < 17;
          return true;
        })
      );
    }
    setFiltered(result);
    setPage(1);
  }, [keyword, priceRange, ratingFilter, durationFilter, products]);

  const startIndex = (page - 1) * pageSize;
  const current = filtered.slice(startIndex, startIndex + pageSize);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  const oneItemSettings = {
    ...settings,
    slidesToShow: 1,
  };

  const suggestedAI = products.slice(0, 6);
  const featuredCourses = products.filter((p) => p.isHot === true).slice(0, 3);
  const topInstructors = [
    { name: 'Nguyễn Văn A', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Trần Thị B', img: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Phạm Văn C', img: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Lê Thị D', img: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Hoàng Văn E', img: 'https://i.pravatar.cc/150?img=5' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 16 }}>
      <div style={{ marginBottom: 50, textAlign: 'center' }}>
        <Title level={3}><RobotOutlined /> Gợi ý từ AI</Title>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Slider {...settings}>
            {suggestedAI.map((product) => (
              <div key={product.id} style={{ padding: '0 12px' }}>
                <ProductCard 
                product={product}
                onDetail={() => openModal(product)}
                onLike={() => toggleFavorite(product)}
                isLiked={favorites.some((f) => f.id === product.id)}
                onAddToCart={() => addToCart(product)}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <Divider />
      <div style={{ marginBottom: 50, textAlign: 'center' }}>
        <Title level={3} style={{ marginBottom: 32 }}><StarOutlined /> Khóa học nổi bật</Title>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Slider {...oneItemSettings}>
            {featuredCourses.map((product) => (
                <div key={product.id} onClick={() => openModal(product)} style={{ cursor: 'pointer' }}>
                <div
                    style={{
                    display: 'flex',
                    background: '#fff',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '40%', objectFit: 'cover' }}
                    />
                    <div style={{ padding: 24, textAlign: 'left', width: '60%' }}>
                    <Title level={4} style={{ marginBottom: 8 }}>{product.name}</Title>
                    <Text>{product.description}</Text>
                    <div style={{ marginTop: 12 }}>
                        <Text strong>Giá: </Text>{product.price.toLocaleString()} đ
                    </div>
                    <div style={{ marginTop: 4 }}>
                        <Text strong>Giảng viên: </Text>{product.instructor || 'Chưa rõ'}
                    </div>
                    </div>
                </div>
                </div>
            ))}
          </Slider>
        </div>
      </div>
      <Divider />
      <div style={{ marginBottom: 50, textAlign: 'center' }}>
        <Title level={3} style={{ marginBottom: 32 }}><UserOutlined /> Giảng viên nổi tiếng</Title>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Slider {...settings}>
            {topInstructors.map((instructor, index) => (
              <div key={index} style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={instructor.img}
                    alt={instructor.name}
                    style={{ width: 100, height: 100, marginBottom: 16, borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <Title level={5}>{instructor.name}</Title>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {!isMobile && (
          <Col xs={24} md={6}>
            <FilterSidebar
              isMobile={false}
              visible
              keyword={keyword}
              onKeywordChange={setKeyword}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
              durationFilter={durationFilter}
              onDurationChange={setDurationFilter}
              onClose={() => {}}
            />
          </Col>
        )}

        <Col xs={24} md={18}>
          {isMobile && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilterMobile(true)}
              style={{ marginBottom: 16 }}
            >
              Bộ lọc
            </Button>
          )}

          <Title level={4}>
            <AppstoreOutlined /> Danh sách sản phẩm
          </Title>
          <Text type="secondary">Tìm thấy {filtered.length} sản phẩm phù hợp</Text>
          <Divider />

          {loading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <FireOutlined style={{ fontSize: 40, color: '#999' }} />
              <p>Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ) : (
            <>
              <Row gutter={[16, 24]}>
                {current.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard 
                        product={product}
                        onDetail={() => openModal(product)}
                        onLike={() => toggleFavorite(product)}
                        isLiked={favorites.some((f) => f.id === product.id)}
                        onAddToCart={() => addToCart(product)}
                    />
                  </Col>
                ))}
              </Row>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={filtered.length}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Col>
      </Row>

      <FilterSidebar
        isMobile
        visible={showFilterMobile}
        onClose={() => setShowFilterMobile(false)}
        keyword={keyword}
        onKeywordChange={setKeyword}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
        durationFilter={durationFilter}
        onDurationChange={setDurationFilter}
      />
        <ProductModal
            product={modalProduct}
            visible={!!modalProduct}
            onClose={closeModal}        
        />
        <AIChatBot allProducts={products} userId={userId} />
    </div>
  );
}
