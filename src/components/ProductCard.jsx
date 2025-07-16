import React from 'react';
import { Button, Typography, Tooltip } from 'antd';
import {
  HeartTwoTone,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const ProductCard = ({ product, onDetail, onLike, isLiked, onAddToCart }) => {
  const handleAddToCart = (e) => {
    const img = document.createElement('img');
    img.src = product.image;
    img.style.position = 'fixed';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.zIndex = 1000;

    const rect = e.currentTarget.getBoundingClientRect();
    img.style.left = rect.left + 'px';
    img.style.top = rect.top + 'px';

    document.body.appendChild(img);

    const cartIcon = document.getElementById('main-cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();

    const deltaX = cartRect.left - rect.left;
    const deltaY = cartRect.top - rect.top;

    img.animate(
      [
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`, opacity: 0.5 },
      ],
      {
        duration: 800,
        easing: 'ease-in-out',
      }
    );

    setTimeout(() => {
      document.body.removeChild(img);
      if (onAddToCart) onAddToCart(product);
    }, 800);
  };

  return (
    <div className="product-card">
      <Tooltip title="Thêm vào giỏ hàng">
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          className="cart-button"
        />
      </Tooltip>

      <div className="card-content">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-img" />
        </Link>

        <div className="info">
          <Link to={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <Text strong style={{ color: '#1890ff', display: 'block', margin: '8px 0' }}>
            {product.price.toLocaleString()} VND
          </Text>

          <div className="actions">
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => onDetail(product)}
            >
              Xem nhanh
            </Button>

            <Button onClick={() => onLike(product)} type="text" size="small">
              {isLiked ? (
                <HeartTwoTone twoToneColor="#eb2f96" />
              ) : (
                <HeartOutlined />
              )}
              <span style={{ marginLeft: 4 }}>Yêu thích</span>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          position: relative;
          width: 100%;
          padding: 12px;
        }

        .cart-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .product-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 6px;
        }

        .info {
          margin-top: 12px;
          text-align: center;
        }

        .product-name {
          font-size: 16px;
          font-weight: 500;
          color: #000;
          display: block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .actions {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 576px) {
          .card-content {
            flex-direction: row;
            align-items: flex-start;
            gap: 12px;
          }

          .product-img {
            width: 100px;
            height: 100px;
          }

          .info {
            flex: 1;
            text-align: left;
            margin-top: 0;
          }

          .product-name {
            max-width: 100%;
          }

          .actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
