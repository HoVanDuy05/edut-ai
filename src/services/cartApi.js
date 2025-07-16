import axios from 'axios';
const API_BASE = 'http://localhost:3001';
export const fetchCart = async (userId) => {
  const res = await axios.get(`${API_BASE}/cart`);
  const userCart = res.data.find((c) => Number(c.userId) === Number(userId));
  return userCart ? userCart.items : [];
};

export const updateCart = async (userId, newItems) => {
  const res = await axios.get(`${API_BASE}/cart`);
  const cart = res.data.find((c) => Number(c.userId) === Number(userId));

  if (!cart) {
    await axios.post(`${API_BASE}/cart`, {
      userId: Number(userId),
      items: newItems,
    });
  } else {
    await axios.patch(`${API_BASE}/cart/${cart.id}`, {
      items: newItems,
    });
  }
};

export const addToCartAPI = async (userId, productId, quantity = 1) => {
  const res = await axios.get(`${API_BASE}/cart`);
  const cart = res.data.find((c) => Number(c.userId) === Number(userId));

  if (!cart) {
    await axios.post(`${API_BASE}/cart`, {
      userId: Number(userId),
      items: [{ productId: Number(productId), quantity }],
    });
    return;
  }

  const items = [...cart.items];
  const index = items.findIndex((item) => item.productId === Number(productId));

  if (index !== -1) {
    items[index].quantity += quantity;
  } else {
    items.push({ productId: Number(productId), quantity });
  }

  await axios.patch(`${API_BASE}/cart/${cart.id}`, { items });
};

export const removeFromCartAPI = async (userId, productId) => {
  const res = await axios.get(`${API_BASE}/cart`);
  const cart = res.data.find((c) => Number(c.userId) === Number(userId));

  if (!cart) return;

  const updatedItems = cart.items.filter((item) => item.productId !== Number(productId));
  await axios.patch(`${API_BASE}/cart/${cart.id}`, { items: updatedItems });
};

export const updateCartItemQuantityAPI = async (userId, productId, quantity) => {
  const res = await axios.get(`${API_BASE}/cart`);
  const cart = res.data.find((c) => Number(c.userId) === Number(userId));
  if (!cart) return;

  const items = cart.items.map((item) =>
    item.productId === Number(productId)
      ? { ...item, quantity }
      : item
  );

  await axios.patch(`${API_BASE}/cart/${cart.id}`, { items });
};
