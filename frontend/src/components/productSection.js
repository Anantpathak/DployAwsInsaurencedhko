import React, { useState, useEffect } from "react";
import ProductItem from "./productItem"; // Importing your styled product item


const ProductsSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="container py-4">
      <div className="row">
        {products.map((product) => (
          <ProductItem key={product.id} product={transformProductData(product)} />
        ))}
      </div>

      {/* Animations for product cards */}
      <style>{`
        .product-item {
          animation: fadeInUp 0.5s ease-in-out;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-item:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Ensure compatibility with your component expecting product.image
const transformProductData = (product) => ({
  ...product,
  image: product.thumbnail, // DummyJSON uses 'thumbnail' but your UI uses 'image'
});

export default ProductsSection;
