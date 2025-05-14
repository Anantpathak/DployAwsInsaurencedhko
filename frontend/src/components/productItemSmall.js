import React from 'react';
import IconsList from './iconList'; // Assuming the correct path to IconsList

const ProductItemSmall = ({ product }) => {
  return (
    <div className="col-lg-3 col-sm-6 my-3">
      <div className="product-card">
        <div className="product-image-wrapper">
          <img className="product-image" src={product.image} alt={product.title} />
          {/* This must wrap the icon list */}
          <div className="product-icons">
            <ul className="product-icons-list list-unstyled d-flex justify-content-center">
              <IconsList key={product.id} product={product} />
            </ul>
          </div>
        </div>

        <div className="tag bg-danger text-white">Sale</div>

        <div className="text-center p-3">
          <div className="product-title">{product.title}</div>
          <div className="text-warning">
            <span className="fas fa-star"></span>
            <span className="fas fa-star"></span>
            <span className="fas fa-star"></span>
            <span className="fas fa-star"></span>
            <span className="fas fa-star"></span>
          </div>
          <div className="product-price">${product.price}</div>
        </div>
      </div>
    </div>
  );
};


export default ProductItemSmall;
