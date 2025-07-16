import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import {
  fetchFavorites,
  toggleFavoriteAPI,
  addToHistoryAPI,
} from '../services/api';
import {
  addToCart,
  fetchCartItems,
} from '../redux/cartSlice';
import { useEffect, useState } from 'react';

const useProductActions = (userId) => {
  const dispatch = useDispatch();
  const [modalProduct, setModalProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const cartItems = useSelector((state) => state.cart.items);
  const cartError = useSelector((state) => state.cart.error);

  useEffect(() => {
    if (userId) {
      fetchFavorites(userId).then(setFavorites);
      dispatch(fetchCartItems(userId));
    }
  }, [userId]);

  const toggleFavorite = async (product) => {
    await toggleFavoriteAPI(userId, product.id);
    const updated = await fetchFavorites(userId);
    setFavorites(updated);
    const liked = updated.some((p) => p.id === product.id);
    message.success(
      liked ? `Đã thêm ${product.name} vào yêu thích` : `Đã bỏ ${product.name} khỏi yêu thích`
    );
  };

  const handleAddToCart = async (product) => {
    try {
      const result = await dispatch(addToCart({ userId, product }));
      if (result.meta.requestStatus === 'rejected') {
        message.warning(result.payload);
      } else {
        message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      }
    } catch {
      message.error('Không thể thêm vào giỏ hàng');
    }
  };

  const openModal = async (product) => {
    setModalProduct(product);
    try {
      await addToHistoryAPI(userId, product.id);
    } catch {
      message.error('Không thể thêm vào lịch sử');
    }
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  return {
    favorites,
    setFavorites,
    modalProduct,
    toggleFavorite,
    openModal,
    closeModal,
    addToCart: handleAddToCart,
    cartItems,
    cartError,
  };
};

export default useProductActions;
