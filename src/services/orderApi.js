const ORDER_KEY = 'orders';

const getAllOrders = () => {
  return JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
};

const saveAllOrders = (orders) => {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
};

export const createOrder = async (orderData) => {
  const orders = getAllOrders();
  const newOrder = {
    id: Date.now(),
    ...orderData,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  saveAllOrders(orders);
  return newOrder;
};

export const fetchOrdersByUser = async (userId) => {
  const orders = getAllOrders();
  return orders.filter((o) => o.userId === userId);
};
