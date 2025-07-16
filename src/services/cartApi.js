const CART_KEY = 'cart_data';

const getAllCarts = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

const saveAllCarts = (carts) => {
  localStorage.setItem(CART_KEY, JSON.stringify(carts));
};

export const fetchCart = async (userId) => {
  const carts = getAllCarts();
  const cart = carts.find((c) => Number(c.userId) === Number(userId));
  return cart ? cart.items : [];
};

export const updateCart = async (userId, newItems) => {
  const carts = getAllCarts();
  const index = carts.findIndex((c) => Number(c.userId) === Number(userId));

  if (index === -1) {
    carts.push({ userId: Number(userId), items: newItems });
  } else {
    carts[index].items = newItems;
  }

  saveAllCarts(carts);
};

export const addToCartAPI = async (userId, productId, quantity = 1) => {
  const carts = getAllCarts();
  const userIndex = carts.findIndex((c) => Number(c.userId) === Number(userId));

  if (userIndex === -1) {
    carts.push({
      userId: Number(userId),
      items: [{ productId: Number(productId), quantity }],
    });
  } else {
    const items = [...carts[userIndex].items];
    const itemIndex = items.findIndex((item) => item.productId === Number(productId));

    if (itemIndex !== -1) {
      items[itemIndex].quantity += quantity;
    } else {
      items.push({ productId: Number(productId), quantity });
    }

    carts[userIndex].items = items;
  }

  saveAllCarts(carts);
};

export const removeFromCartAPI = async (userId, productId) => {
  const carts = getAllCarts();
  const userIndex = carts.findIndex((c) => Number(c.userId) === Number(userId));

  if (userIndex === -1) return;

  const updatedItems = carts[userIndex].items.filter(
    (item) => item.productId !== Number(productId)
  );

  carts[userIndex].items = updatedItems;
  saveAllCarts(carts);
};

export const updateCartItemQuantityAPI = async (userId, productId, quantity) => {
  const carts = getAllCarts();
  const userIndex = carts.findIndex((c) => Number(c.userId) === Number(userId));

  if (userIndex === -1) return;

  const updatedItems = carts[userIndex].items.map((item) =>
    item.productId === Number(productId) ? { ...item, quantity } : item
  );

  carts[userIndex].items = updatedItems;
  saveAllCarts(carts);
};
