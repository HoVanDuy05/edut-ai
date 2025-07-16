// services/local-api.js
import { products } from '../../config/products';

export const fetchProducts = async () => {
  return products;
};

export const fetchProductById = async (id) => {
  return products.find((p) => p.id === Number(id));
};

// ===== FAVORITES =====
export const fetchFavorites = async (userId) => {
  const data = JSON.parse(localStorage.getItem('favorites')) || [];
  const fav = data.find(f => f.userId === Number(userId));
  return fav ? products.filter(p => fav.productIds.includes(p.id)) : [];
};

export const toggleFavoriteAPI = async (userId, productId) => {
  const all = JSON.parse(localStorage.getItem('favorites')) || [];
  let userFav = all.find(f => f.userId === Number(userId));
  if (!userFav) {
    userFav = { userId: Number(userId), productIds: [Number(productId)] };
    all.push(userFav);
  } else {
    const exists = userFav.productIds.includes(Number(productId));
    userFav.productIds = exists
      ? userFav.productIds.filter(id => id !== Number(productId))
      : [...userFav.productIds, Number(productId)];
  }
  localStorage.setItem('favorites', JSON.stringify(all));
};

// ===== LỊCH SỬ =====
export const addToHistoryAPI = async (userId, productId) => {
  const all = JSON.parse(localStorage.getItem('history')) || [];
  let userHistory = all.find(h => h.userId === Number(userId));
  if (!userHistory) {
    userHistory = { userId: Number(userId), productIds: [Number(productId)] };
    all.push(userHistory);
  } else if (!userHistory.productIds.includes(Number(productId))) {
    userHistory.productIds.push(Number(productId));
  }
  localStorage.setItem('history', JSON.stringify(all));
};

export const fetchHistory = async (userId) => {
  const all = JSON.parse(localStorage.getItem('history')) || [];
  const userHistory = all.find(h => h.userId === Number(userId));
  return userHistory ? products.filter(p => userHistory.productIds.includes(p.id)) : [];
};

export const removeFromHistoryAPI = async (userId, productId) => {
  const all = JSON.parse(localStorage.getItem('history')) || [];
  const userHistory = all.find(h => h.userId === Number(userId));
  if (!userHistory) return;
  userHistory.productIds = userHistory.productIds.filter(id => id !== Number(productId));
  localStorage.setItem('history', JSON.stringify(all));
};

// ===== KHOÁ HỌC ĐÃ MUA =====
export const fetchPurchasedCourses = async (userId) => {
  const all = JSON.parse(localStorage.getItem('purchased')) || [];
  return all.filter(p => p.userId === Number(userId));
};
