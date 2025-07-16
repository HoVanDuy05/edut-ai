import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const fetchProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};

export const fetchSuggestions = async (userId) => {
  const res = await axios.get(`${API_BASE}/suggestions`);
  const suggestion = res.data.find((s) => s.userId === userId || s.userId === Number(userId));
  if (!suggestion) return [];

  const productRes = await axios.get(`${API_BASE}/products`);
  return productRes.data.filter((p) => suggestion.productIds.includes(Number(p.id)));
};

export const fetchFavorites = async (userId) => {
  const res = await axios.get(`${API_BASE}/favorites`);
  const userFavorites = res.data.find((f) => f.userId === userId || f.userId === Number(userId));
  if (!userFavorites) return [];

  const productRes = await axios.get(`${API_BASE}/products`);
  return productRes.data.filter((p) => userFavorites.productIds.includes(Number(p.id)));
};

export const toggleFavoriteAPI = async (userId, productId) => {
  const res = await axios.get(`${API_BASE}/favorites`);
  let userFav = res.data.find((f) => f.userId === userId || f.userId === Number(userId));

  const isFavorite = userFav?.productIds?.some((id) => Number(id) === Number(productId)) ?? false;

  const updatedList = isFavorite
    ? userFav.productIds.filter((id) => Number(id) !== Number(productId))
    : [...(userFav?.productIds || []), Number(productId)]; 

  if (!userFav) {
    await axios.post(`${API_BASE}/favorites`, {
      userId: Number(userId),
      productIds: [Number(productId)],
    });
  } else {
    await axios.patch(`${API_BASE}/favorites/${userFav.id}`, {
      productIds: updatedList,
    });
  }
};


export const addToHistoryAPI = async (userId, productId) => {
  const res = await axios.get(`${API_BASE}/history`);
  const userHistory = res.data.find((h) => h.userId === userId || h.userId === Number(userId));

  const numericProductId = Number(productId);

  if (!userHistory) {
    await axios.post(`${API_BASE}/history`, {
      userId: Number(userId),
      productIds: [numericProductId],
    });
    return;
  }

  const updatedList = userHistory.productIds.includes(numericProductId)
    ? userHistory.productIds
    : [...userHistory.productIds, numericProductId];

  await axios.patch(`${API_BASE}/history/${userHistory.id}`, {
    productIds: updatedList,
  });
};

export const fetchHistory = async (userId) => {
  if (!userId) throw new Error('Thiếu userId');

  const res = await axios.get(`${API_BASE}/history`);
  const userHistory = res.data.find(
    (h) => h.userId === userId || h.userId === Number(userId)
  );

  if (!userHistory) return [];

  const productRes = await axios.get(`${API_BASE}/products`);
  return productRes.data.filter((p) => userHistory.productIds.includes(Number(p.id)));
};

export const removeFromHistoryAPI = async (userId, productId) => {
  const res = await axios.get(`${API_BASE}/history`);
  const userHistory = res.data.find(
    (h) => h.userId === userId || h.userId === Number(userId)
  );

  if (!userHistory) return;

  const updatedList = userHistory.productIds.filter(
    (id) => Number(id) !== Number(productId)
  );

  await axios.patch(`${API_BASE}/history/${userHistory.id}`, {
    productIds: updatedList,
  });
};

export const fetchPurchasedCourses = async (userId) => {
  const res = await axios.get(`${API_BASE}/purchased?userId=${userId}`);
  return res.data;
};