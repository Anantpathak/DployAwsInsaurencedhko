import React from 'react';
import Navbar from '../components/navBar';
import ProductDetails from '../components/productDetails';
import { useSelector } from 'react-redux';

function Details() {
  const product = useSelector((state) => state.currentProduct.product);
  
  if (!product) {
    return <div>No product data available.</div>; // Handle null state
  }

  return (
    <>
      <div className="container-fluid bg-white">
        <Navbar />
      </div>
      <div className="container bg-white">
        <div className="row">
          <ProductDetails product={product} />
        </div>
      </div>
    </>
  );
}

export default Details;
