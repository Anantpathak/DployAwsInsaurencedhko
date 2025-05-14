import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentProduct } from '../actions/setCurrentProductActions';
import { addToCart } from '../actions/cartActions';
import { addToWishlist } from '../actions/wishlistActions';
import './ProductItem.css'; // Reuse same stylesheet

const IconsList = ({ product }) => {
  const dispatch = useDispatch();

  const handleProductClick = () => {
    dispatch(setCurrentProduct(product));
  };

  const handleShoppingBagClick = () => {
    dispatch(addToCart(product));
    alert('Added to cart!');
  };

  const handleHeartClick = () => {
    dispatch(addToWishlist(product));
  };console.log("IconsList received:", product);

  return (
    <ul className="product-icons-list list-unstyled d-flex justify-content-center">
      <li className="icon-item" onClick={handleHeartClick}>
        <span className="far fa-heart"></span>
      </li>
      <li className="icon-item mx-3" onClick={handleShoppingBagClick}>
        <span className="fas fa-shopping-bag"></span>
      </li>
      <li className="icon-item">
        <Link to="/details/" onClick={handleProductClick}>
          <span className="fas fa-expand-arrows-alt"></span>
        </Link>
      </li>
    </ul>
  );
};

export default IconsList;
