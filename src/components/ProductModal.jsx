import { Link } from 'react-router-dom';
import React from 'react';
import { Modal, Rate } from 'antd';

export default class ProductModal extends React.Component {
  render() {
    const { product, visible, onClose } = this.props;
    if (!product) return null;

    return (
      <Modal open={visible} onCancel={onClose} footer={null}>
        <img src={product.image} alt={product.name} style={{ width: '100%' }} />
        <h2>{product.name}</h2>
        <Link to={`/product/${product.id}`}>Xem chi tiết</Link>
        <p>{product.longDescription}</p>
        <Rate defaultValue={product.rating} />
        <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>
      </Modal>
    );
  }
}
