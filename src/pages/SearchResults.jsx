import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import useProductActions from '../hooks/useProductActions';
import { Spin, Empty, Row, Col, Typography } from 'antd';

const { Title } = Typography;
const USER_ID = 1;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const keyword = query.get('keyword') || '';

  const {
    favorites,
    modalProduct,
    toggleFavorite,
    openModal,
    closeModal,
  } = useProductActions(USER_ID);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await fetchProducts();
        const filtered = all.filter((p) =>
          p.name.toLowerCase().includes(keyword.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error('Lỗi khi tìm kiếm:', err);
      } finally {
        setLoading(false);
      }
    };

    if (keyword.trim()) {
      load();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [keyword]);

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '24px 16px',
        background: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Title level={3} style={{ marginBottom: 20 }}>
        Kết quả tìm kiếm cho: <em style={{ color: '#1890ff' }}>{keyword}</em>
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Empty description="Không có kết quả phù hợp" />
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          {results.map((product) => (
            <Col
              key={product.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
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
}
