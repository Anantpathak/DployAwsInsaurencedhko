import React from 'react';
import IconsList from './iconList';
import './ProductItem.css'; // Import custom styles

const ProductItem = ({ product }) => {
  return (
    <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
      <div className="product-card shadow-sm">
        <div className="product-image-wrapper">
          <img className="product-image" src={product.image} alt={product.title} />
          <div className="product-icons">
            <IconsList key={product.id} product={product} />
          </div>
          <div className="tag bg-danger text-white">Sale</div>
        </div>
        <div className="product-details text-center mt-3">
          <h5 className="product-title">{product.title}</h5>
          <div className="product-rating mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="fas fa-star text-warning"></span>
            ))}
          </div>
          <div className="product-price text-success fw-bold">${product.price}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

