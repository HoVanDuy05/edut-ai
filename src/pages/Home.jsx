import React, { useEffect, useState, useRef } from 'react';
import { message, Spin, Typography, Button } from 'antd';
import {
  FireOutlined,
  RightOutlined,
  LeftOutlined,
  AppstoreAddOutlined,
  HighlightOutlined,
  RobotOutlined,
  BookOutlined,
} from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  fetchProducts,
  fetchFavorites,
  fetchSuggestions,
  fetchHistory,
  addToHistoryAPI,
} from '../services/api';
import { addToCartAPI } from '../services/cartApi';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SuggestionBar from '../components/SuggestionBar';
import useProductActions from '../hooks/useProductActions';
import AIChatBot from '../components/AIChatBot';
import BannerSlider from '../components/BannerSlider';
import UserInfoPanel from '../components/UserInfoPanel';

const { Title } = Typography;

const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;
const USER_ID = user?.id || null;

const iconColor = '#ff4d4f';
const categoryIconSize = 36;

const Home = () => {
  const {
    favorites,
    setFavorites,
    modalProduct,
    toggleFavorite,
    openModal,
    closeModal,
  } = useProductActions(USER_ID);

  const [allProducts, setAllProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const hotSliderRef = useRef(null);
  const newSliderRef = useRef(null);
  const suggestSliderRef = useRef(null);
  const historySliderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        const fav = USER_ID ? await fetchFavorites(USER_ID) : [];
        const historyProducts = USER_ID ? await fetchHistory(USER_ID) : [];
        setAllProducts(products);
        setFavorites(fav);
        setHistory(historyProducts);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        message.error('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setFavorites]);

  const handleAddToCart = async (product) => {
    try {
      if (!USER_ID) {
        message.warning('Bạn cần đăng nhập để thêm vào giỏ hàng');
        return;
      }
      await addToCartAPI(USER_ID, product.id);
      message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    } catch {
      message.error('Không thể thêm vào giỏ hàng');
    }
  };

  const handleSuggest = async () => {
    try {
      setLoading(true);
      const suggested = USER_ID ? await fetchSuggestions(USER_ID) : [];
      setSuggestedProducts(suggested);
      message.success('Đã tải gợi ý sản phẩm');
    } catch {
      message.error('Không thể tải gợi ý lúc này');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = async (product) => {
    try {
      openModal(product);
      if (USER_ID) {
        await addToHistoryAPI(USER_ID, product.id);
        const updatedHistory = await fetchHistory(USER_ID);
        setHistory(updatedHistory);
      }
    } catch {
      message.error('Không thể ghi lịch sử sản phẩm');
    }
  };

  const renderSliderSection = (title, products, sliderRef, icon) => {
    if (products.length === 0) return null;
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: Math.min(products.length, 4),
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } },
      ],
    };

    return (
      <div
        style={{
          position: 'relative',
          marginTop: 48,
          maxWidth: 1200,
          marginInline: 'auto',
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <Title
          level={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: iconColor,
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: 26 }}>{icon}</span> {title}
        </Title>

        <Button
          shape="circle"
          onClick={() => sliderRef.current?.slickPrev()}
          style={{
            position: 'absolute',
            top: '45%',
            left: -36,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: '#fff',
            border: 'none',
          }}
          aria-label="Previous"
        >
          <LeftOutlined style={{ fontSize: 18, color: iconColor }} />
        </Button>

        <Button
          shape="circle"
          onClick={() => sliderRef.current?.slickNext()}
          style={{
            position: 'absolute',
            top: '45%',
            right: -36,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: '#fff',
            border: 'none',
          }}
          aria-label="Next"
        >
          <RightOutlined style={{ fontSize: 18, color: iconColor }} />
        </Button>

        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <div key={product.id} style={{ padding: '0 12px' }}>
              <ProductCard
                product={product}
                onDetail={() => handleViewProduct(product)}
                onLike={() => toggleFavorite(product)}
                isLiked={favorites.some((f) => f.id === product.id)}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <BannerSlider />

      <div
        style={{
          background: 'linear-gradient(90deg, #ffd54f 0%, #ffca28 50%, #ffb300 100%)',
          padding: '48px 20px',
          textAlign: 'center',
          borderRadius: 16,
          maxWidth: 960,
          margin: '24px auto',
          boxShadow: '0 12px 32px rgba(255, 193, 7, 0.3)',
          color: '#4a2c00',
        }}
      >
        <Title level={2} style={{ fontWeight: 'bold', marginBottom: 12 }}>
          Chào mừng đến với <span style={{ color: '#d84315' }}>Nền tảng học tập AI</span>
        </Title>
        <p
          style={{
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto 24px',
            fontWeight: 500,
          }}
        >
          Nơi bạn có thể khám phá các khóa học mới, sản phẩm HOT và được gợi ý phù hợp từ hệ thống thông minh.
        </p>
        <Button
          type="primary"
          size="large"
          style={{
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(255, 69, 0, 0.6)',
            padding: '8px 32px',
          }}
        >
          Khám phá ngay
        </Button>
      </div>
      <UserInfoPanel />

      <div
        style={{
          maxWidth: 1200,
          margin: '40px auto',
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Lập trình', icon: <AppstoreAddOutlined style={{ fontSize: categoryIconSize, color: '#1890ff' }} /> },
          { label: 'Thiết kế', icon: <HighlightOutlined style={{ fontSize: categoryIconSize, color: '#52c41a' }} /> },
          { label: 'AI & Dữ liệu', icon: <RobotOutlined style={{ fontSize: categoryIconSize, color: '#faad14' }} /> },
          { label: 'Ngoại ngữ', icon: <BookOutlined style={{ fontSize: categoryIconSize, color: '#722ed1' }} /> },
        ].map((cat, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              padding: '20px 28px',
              borderRadius: 16,
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
              width: 180,
              fontWeight: 600,
              color: '#444',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              userSelect: 'none',
            }}
          >
            <div>{cat.icon}</div>
            <div style={{ marginTop: 12, fontSize: 18 }}>{cat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '20px auto 10px' }}>
        <SuggestionBar onSuggest={handleSuggest} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {renderSliderSection('Gợi ý sản phẩm', suggestedProducts, suggestSliderRef, <RightOutlined style={{ color: iconColor, fontSize: 28 }} />)}
          {renderSliderSection('Sản phẩm HOT', allProducts.filter((p) => p.isHot), hotSliderRef, <FireOutlined style={{ color: '#fa541c', fontSize: 28 }} />)}
          {renderSliderSection('Sản phẩm Mới', allProducts.filter((p) => p.isNew), newSliderRef, <RightOutlined style={{ color: '#1890ff', fontSize: 28, transform: 'rotate(-45deg)' }} />)}
          {renderSliderSection('Khóa học đã xem', history, historySliderRef, <BookOutlined style={{ color: '#722ed1', fontSize: 28 }} />)}
        </>
      )}

      <ProductModal product={modalProduct} visible={!!modalProduct} onClose={closeModal} />
      <AIChatBot allProducts={allProducts} userId={USER_ID || 'guest'} />
    </div>
  );
};

export default Home;
