// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { fetchHistory, removeFromHistoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import RemoveButton from '../components/RemoveButton';
import useProductActions from '../hooks/useProductActions';

const USER_ID = 1;

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    favorites,
    modalProduct,
    toggleFavorite,
    openModal,
    closeModal,
  } = useProductActions(USER_ID);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(USER_ID);
        setHistory(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử:', error);
        message.error('Không thể tải lịch sử.');
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleRemove = async (product) => {
    try {
      await removeFromHistoryAPI(USER_ID, product.id);
      setHistory((prev) => prev.filter((p) => p.id !== product.id));
      message.success(`Đã xóa khỏi lịch sử: ${product.name}`);
    } catch {
      message.error('Không thể xóa khỏi lịch sử.');
    }
  };

  return (
    <div style={{ padding: '24px 40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Lịch sử đã xem</h1>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Spin size="large" />
        </div>
      ) : history.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>
          Bạn chưa xem sản phẩm nào.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'center',
          }}
        >
          {history.map((product) => (
            <div key={product.id} style={{ position: 'relative' }}>
              <ProductCard
                product={product}
                onDetail={() => openModal(product)}
                onLike={() => toggleFavorite(product)}
                isLiked={favorites.some((f) => f.id === product.id)}
              />
              <RemoveButton onClick={() => handleRemove(product)} />
            </div>
          ))}
        </div>
      )}

      <ProductModal
        product={modalProduct}
        visible={!!modalProduct}
        onClose={closeModal}
      />
    </div>
  );
};

export default History;
