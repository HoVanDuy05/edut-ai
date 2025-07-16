import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Image,
  message,
  Space,
  Empty,
  Checkbox,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { fetchProducts } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, removeFromCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để xem giỏ hàng');
      navigate('/auth');
    }
  }, [user, navigate]);

  const userId = user?.id;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [productsMap, setProductsMap] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
    fetchProducts().then((products) => {
      const map = {};
      products.forEach((p) => (map[p.id] = p));
      setProductsMap(map);
    });
  }, [userId, dispatch]);

  const handleRemove = async (productId) => {
    await dispatch(removeFromCart({ userId, productId }));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
    message.success('Đã xoá sản phẩm khỏi giỏ hàng');
  };

  const handleClearAll = async () => {
    for (const item of cartItems) {
      await dispatch(removeFromCart({ userId, productId: item.productId }));
    }
    setSelectedItems([]);
    message.success('Đã xoá toàn bộ giỏ hàng');
  };

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      message.warning('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    localStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));
    navigate('/checkout');
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.productId)
  );

  const total = selectedCartItems.reduce((sum, item) => {
    const product = productsMap[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: 'auto', paddingBottom: 100 }}>
      <Title level={2}>
        <ShoppingCartOutlined /> Giỏ hàng
      </Title>

      {cartItems.length === 0 ? (
        <Empty description="Giỏ hàng trống" style={{ marginTop: 80 }} />
      ) : (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {cartItems.map((item) => {
                const product = productsMap[item.productId];
                if (!product) return null;

                const checked = selectedItems.includes(item.productId);

                return (
                  <Card
                    key={item.productId}
                    size="small"
                    title={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setSelectedItems((prev) => [...prev, item.productId]);
                          } else {
                            setSelectedItems((prev) =>
                              prev.filter((id) => id !== item.productId)
                            );
                          }
                        }}
                      >
                        {product.name}
                      </Checkbox>
                    }
                  >
                    <Row align="middle" gutter={16}>
                      <Col>
                        <Image
                          width={80}
                          height={80}
                          src={product.image}
                          alt={product.name}
                          style={{ objectFit: 'cover', borderRadius: 8 }}
                          preview={false}
                        />
                      </Col>
                      <Col flex="auto">
                        <Text type="secondary">
                          Giá: {product.price.toLocaleString()} VND
                        </Text>
                        <br />
                        <Text>Số lượng: {item.quantity}</Text>
                      </Col>
                      <Col>
                        <Text strong>
                          {(product.price * item.quantity).toLocaleString()} VND
                        </Text>
                      </Col>
                      <Col>
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleRemove(item.productId)}
                        />
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </Space>
          </Col>
        </Row>
      )}

      {cartItems.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            borderTop: '1px solid #eee',
            padding: '12px 24px',
            zIndex: 1000,
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>
                Đã chọn: {selectedCartItems.length} sản phẩm
              </Text>
              <br />
              <Text>
                Tổng tiền:{' '}
                <span style={{ color: '#fa541c', fontWeight: 600 }}>
                  {total.toLocaleString()} VND
                </span>
              </Text>
            </Col>
            <Col>
              <Space>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearAll}
                >
                  Xoá tất cả
                </Button>
                <Button
                  type="primary"
                  icon={<CreditCardOutlined />}
                  disabled={selectedCartItems.length === 0}
                  onClick={handleCheckout}
                >
                  Thanh toán ({selectedCartItems.length})
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
