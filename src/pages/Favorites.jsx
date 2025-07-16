import React, { useEffect, useState } from 'react';
import { Spin, message, Row, Col, Typography } from 'antd';
import { fetchFavorites } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import useProductActions from '../hooks/useProductActions';

const { Title, Paragraph } = Typography;
const USER_ID = 1;

const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const {
    modalProduct,
    toggleFavorite,
    openModal,
    closeModal,
    favorites,
    setFavorites,
  } = useProductActions(USER_ID);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites(USER_ID);
        setFavoriteProducts(data);
        setFavorites(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        message.error('Không thể tải danh sách yêu thích.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [setFavorites]);

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Sản phẩm yêu thích
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <Spin size="large" />
        </div>
      ) : favoriteProducts.length === 0 ? (
        <Paragraph style={{ textAlign: 'center', color: '#999' }}>
          Bạn chưa yêu thích sản phẩm nào.
        </Paragraph>
      ) : (
        <Row gutter={[24, 24]} justify="start">
          {favoriteProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard
                product={product}
                onDetail={() => openModal(product)}
                onLike={() => toggleFavorite(product)}
                isLiked={favorites.some((f) => f.id === product.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <ProductModal
        product={modalProduct}
        visible={!!modalProduct}
        onClose={closeModal}
      />
    </div>
  );
};

export default Favorites;
