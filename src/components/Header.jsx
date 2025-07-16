import React, { useEffect, useState } from 'react';
import {
  Input, Badge, Dropdown, Button, Typography, Divider, message
} from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MenuOutlined, HeartOutlined, ClockCircleOutlined, ShoppingCartOutlined,
  DeleteOutlined, CreditCardOutlined, CloseOutlined,
  UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, SearchOutlined
} from '@ant-design/icons';
import { fetchProducts } from '../services/api';
import {
  fetchCart,
  removeFromCartAPI,
} from '../services/cartApi';
import '../css/Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, removeFromCart } from '../redux/cartSlice';

const { Search } = Input;
const { Text } = Typography;

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const userId = user?.id;
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {});
    loadCart();
  }, []);

  const loadCart = () => {
    fetchCart(userId).then(data => dispatch(setCart(data))).catch(() => {});
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setLoading(true);

    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setTimeout(() => {
      setResults(filtered.slice(0, 5));
      setLoading(false);
    }, 300);
  };

  const handleSearchSubmit = (value) => {
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
      setKeyword('');
      setResults([]);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCartAPI(userId, productId);
    dispatch(removeFromCart(productId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    message.success('Đã đăng xuất!');
    setTimeout(() => {
      navigate('/auth', { replace: true });
      window.location.reload();
    }, 500);
  };

  const highlightKeyword = (text) => {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: '#ffe58f' }}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const userMenu = (
    <div style={{ padding: 8, width: 200 }}>
      {user ? (
        <>
          <Text strong>{user.name}</Text>
          <div style={{ marginTop: 8 }}>
            <Button
              type="text"
              icon={<SettingOutlined />}
              block
              onClick={() => navigate('/profile')}
            >
              Quản lý tài khoản
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              danger
              block
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            block
            onClick={() => navigate('/auth')}
            style={{ marginBottom: 8 }}
          >
            Đăng nhập
          </Button>
          <Button block onClick={() => navigate('/auth')}>
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );

  const renderSearchDropdown = () => {
    if (!keyword) return null;

    const suggestions = allProducts
      .filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 2);

    return (
      <div className="search-dropdown">
        {loading ? (
          <div className="search-loading">Đang tải...</div>
        ) : (
          <>
            {suggestions.length > 0 && (
              <>
                <div className="search-suggestions">
                  {suggestions.map((s, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        navigate(`/search?keyword=${encodeURIComponent(s.name)}`);
                        setKeyword('');
                        setResults([]);
                      }}
                    >
                      <SearchOutlined style={{ marginRight: 8, marginBottom: 8 }} />
                      {highlightKeyword(s.name)}
                    </div>
                  ))}
                </div>
                <Divider style={{ margin: '8px 0' }} />
              </>
            )}
            {results.map((product) => (
              <NavLink
                to={`/product/${product.id}`}
                key={product.id}
                className="search-result-item"
                onClick={() => setKeyword('')}
              >
                <div className="search-result-content">
                  <img src={product.image} alt={product.name} />
                  <div className="search-info">
                    <strong className="search-title">{highlightKeyword(product.name)}</strong>
                    <div className="search-meta">
                      <Text type="secondary">Khóa học • {product.instructor || 'Giảng viên'}</Text>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </>
        )}
      </div>
    );
  };

  const miniCartContent = (
    <div style={{ width: 340, maxHeight: 400, overflowY: 'auto', padding: 12, backgroundColor: '#fff', borderRadius: 8 }}>
      {cartItems.length === 0 ? (
        <>
          <Text type="secondary">Giỏ hàng của bạn đang trống</Text>
          <NavLink to="/cart" style={{ marginTop: 10, display: 'block' }}>
            <Button icon={<ShoppingCartOutlined />} block>
              Xem giỏ hàng
            </Button>
          </NavLink>
        </>
      ) : (
        <>
          {cartItems.map((item) => {
            const product = allProducts.find(p => Number(p.id) === Number(item.productId));
            if (!product) return null;
            return (
              <div key={item.productId} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <img src={product.image} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 12 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {item.quantity} x {product.price.toLocaleString()}đ
                  </Text>
                </div>
                <DeleteOutlined onClick={() => handleRemoveItem(item.productId)} style={{ color: '#ff4d4f', fontSize: 16, cursor: 'pointer' }} />
              </div>
            );
          })}
          <div style={{ marginTop: 16 }}>
            <NavLink to="/cart">
              <Button icon={<ShoppingCartOutlined />} block>
                Xem giỏ hàng
              </Button>
            </NavLink>
            <Button
              icon={<CreditCardOutlined />}
              type="primary"
              block
              style={{ marginTop: 8 }}
              onClick={() => navigate('/checkout')}
            >
              Thanh toán nhanh
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className={`mobile-slide-menu ${showMobileMenu ? 'show' : ''}`}>
        <div className="mobile-slide-header">
          <CloseOutlined className="close-btn" onClick={() => setShowMobileMenu(false)} />
        </div>
        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={() => setShowMobileMenu(false)}>Trang chủ</NavLink>
          <NavLink to="/products" onClick={() => setShowMobileMenu(false)}>Khóa học</NavLink>
          <NavLink to="/about" onClick={() => setShowMobileMenu(false)}>Giới thiệu</NavLink>
          <NavLink to="/contact" onClick={() => setShowMobileMenu(false)}>Liên hệ</NavLink>
          <NavLink to="/cart" onClick={() => setShowMobileMenu(false)}>Giỏ hàng</NavLink>
          <NavLink to="/history" onClick={() => setShowMobileMenu(false)}>Lịch sử</NavLink>
        </nav>
      </div>
      {showMobileMenu && <div className="overlay" onClick={() => setShowMobileMenu(false)} />}

      <div className="header header-desktop">
        <NavLink to="/" className="logo">EduMaster</NavLink>
        <div className="menu-desktop">
          <NavLink to="/" className="menu-item">Trang chủ</NavLink>
          <NavLink to="/products" className="menu-item">Khóa học</NavLink>
          <NavLink to="/about" className="menu-item">Giới thiệu</NavLink>
          <NavLink to="/contact" className="menu-item">Liên hệ</NavLink>
        </div>
        <div className="search-wrapper">
          <Search
            placeholder="Tìm kiếm khoá học..."
            allowClear
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            value={keyword}
          />
          {renderSearchDropdown()}
        </div>
        <div className="icons">
          <NavLink to="/favorites"><HeartOutlined className="icon" /></NavLink>
          <Dropdown dropdownRender={() => miniCartContent} trigger={['hover']}>
            <Badge count={cartItems.length} size="small">
              <ShoppingCartOutlined className="icon" id="main-cart-icon" />
            </Badge>
          </Dropdown>
          <NavLink to="/history"><ClockCircleOutlined className="icon" /></NavLink>
          <Dropdown overlay={userMenu} trigger={['click']} className="user-menu">
            <UserOutlined />
          </Dropdown>
        </div>
      </div>

      <div className="header header-mobile">
        <div className="top">
          <MenuOutlined className="menu" onClick={() => setShowMobileMenu(true)} />
          <NavLink to="/" className="logo">EduMaster</NavLink>
          <div className="icons">
            <NavLink to="/favorites"><HeartOutlined className="icon" /></NavLink>
            <Dropdown dropdownRender={() => miniCartContent} trigger={['hover']}>
              <Badge count={cartItems.length} size="small">
                <ShoppingCartOutlined className="icon" id="main-cart-icon" />
              </Badge>
            </Dropdown>
            <NavLink to="/history"><ClockCircleOutlined className="icon" /></NavLink>
          </div>
        </div>
        <div className="search-wrapper">
          <Search
            placeholder="Tìm kiếm khoá học..."
            allowClear
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            value={keyword}
          />
          {renderSearchDropdown()}
        </div>
      </div>
    </>
  );
}
