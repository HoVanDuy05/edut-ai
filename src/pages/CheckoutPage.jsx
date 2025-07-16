import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Radio,
  Space,
  Image,
  Button,
  message,
  Empty,
} from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  PayCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, removeFromCart } from '../redux/cartSlice';
import { fetchProducts } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CreditCardForm from '../components/payment/CreditCardForm';
import BankTransferForm from '../components/payment/BankTransferForm';
import PayPalForm from '../components/payment/PayPalForm';

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [productsMap, setProductsMap] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit');

  useEffect(() => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để thanh toán');
      navigate('/auth');
    }
  }, [user, navigate]);

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

  const selectedCartItems = cartItems;

  const total = selectedCartItems.reduce((sum, item) => {
    const product = productsMap[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const handleSuccess = async () => {
    for (const item of selectedCartItems) {
      await dispatch(removeFromCart({ userId, productId: item.productId }));
    }
    message.success('Thanh toán thành công. Cảm ơn bạn!');
    navigate('/');
  };

  return (
    <div style={{ padding: 24, paddingBottom: 100, maxWidth: 1000, margin: 'auto' }}>
      <Title level={2}>Thanh toán</Title>

      {selectedCartItems.length === 0 ? (
        <Empty description="Không có sản phẩm để thanh toán" style={{ marginTop: 80 }} />
      ) : (
        <>
          <Row gutter={32}>
            <Col xs={24} md={16}>
              <Card title="Thông tin sản phẩm" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {selectedCartItems.map((item) => {
                    const product = productsMap[item.productId];
                    if (!product) return null;
                    return (
                      <Row key={item.productId} align="middle" gutter={16}>
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
                          <Text strong>{product.name}</Text>
                          <br />
                          <Text type="secondary">
                            Số lượng: {item.quantity}
                          </Text>
                        </Col>
                        <Col>
                          <Text strong>
                            {(product.price * item.quantity).toLocaleString()} VND
                          </Text>
                        </Col>
                      </Row>
                    );
                  })}
                </Space>
              </Card>

              <Divider />

              <Card title="Hình thức thanh toán" bordered={false}>
                <Radio.Group
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                >
                  <Space direction="vertical">
                    <Radio value="credit">
                      <CreditCardOutlined style={{ marginRight: 8 }} />
                      Thẻ tín dụng/ghi nợ
                    </Radio>
                    <Radio value="bank">
                      <BankOutlined style={{ marginRight: 8 }} />
                      Chuyển khoản ngân hàng / Ví điện tử
                    </Radio>
                    <Radio value="paypal">
                      <PayCircleOutlined style={{ marginRight: 8 }} />
                      PayPal
                    </Radio>
                  </Space>
                </Radio.Group>

                <Divider />

                {paymentMethod === 'credit' && (
                  <CreditCardForm onSubmit={handleSuccess} />
                )}
                {paymentMethod === 'bank' && (
                  <BankTransferForm onSubmit={handleSuccess} />
                )}
                {paymentMethod === 'paypal' && (
                  <PayPalForm onSubmit={handleSuccess} />
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card title="Tổng kết" bordered={false}>
                <Text>Tổng tiền:</Text>
                <Title level={3} style={{ color: '#fa541c', marginTop: 8 }}>
                  {total.toLocaleString()} VND
                </Title>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#fff',
              borderTop: '1px solid #eee',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
              padding: '12px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Text>
              Tổng cộng:{' '}
              <span style={{ color: '#fa541c', fontWeight: 600 }}>
                {total.toLocaleString()} VND
              </span>
            </Text>
            <Button type="primary" onClick={handleSuccess}>
              Xác nhận thanh toán
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
