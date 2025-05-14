import React, { useState, useEffect } from 'react';
import ProductItemSmall from '../components/productItemSmall';
import './ProductsSearch.css';

const categoryFiltersMap = {
  men: ['mens-shirts', 'mens-watches', 'mens-shoes', 'fragrances', 'skincare'],
  women: ['womens-dresses', 'womens-watches', 'womens-bags', 'fragrances', 'skincare'],
  kids: ['toys', 'baby-clothing', 'kids-watches', 'education', 'learning'],
  home: ['furniture', 'kitchen', 'decor', 'lighting'],
  beauty: ['makeup', 'haircare', 'skincare', 'perfume'],
};

const apiEndpointsMap = {
  men: 'https://dummyjson.com/products/category/mens-watches',
  women: 'https://dummyjson.com/products/category/womens-watches',
  kids: 'https://dummyjson.com/products/category/toys',
  home: 'https://dummyjson.com/products/category/furniture',
  beauty: 'https://dummyjson.com/products/category/fragrances',
};

const ProductsSearch = ({ type = 'men' }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);

  const filters = categoryFiltersMap[type] || [];
  const endpoint = apiEndpointsMap[type] || 'https://dummyjson.com/products';

  useEffect(() => {
    fetch(`${endpoint}?limit=100`)
      .then((response) => response.json())
      .then((data) => {
        const loadedProducts = data.products || data; // in case the response is a flat array
        setProducts(loadedProducts);
        setAllProducts(loadedProducts);
      })
      .catch((error) => console.error(`Error fetching ${type} products:`, error));
  }, [type]);

  const handleCategoryChange = (cat) => {
    setCategoryFilter(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (categoryFilter.length) {
      filtered = filtered.filter(p => categoryFilter.includes(p.category));
    }

    if (priceRange) {
      filtered = filtered.filter(p => p.price <= priceRange);
    }

    setProducts(filtered);
    setShowFilters(false); // Close on mobile
  };

  return (
    <div className="container-fluid">
      <button
        className="btn btn-dark d-md-none my-3 mx-auto d-block"
        onClick={() => setShowFilters(!showFilters)}
        style={{ zIndex: 1050 }}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="row position-relative">
        <div className={`col-md-3 ${showFilters ? '' : 'd-none d-md-block'}`}>
          <div className={`custom-sidebar ${showFilters ? 'active' : ''}`}>
            <h5 className="mb-3 border-bottom pb-2 fw-bold text-primary">🧰 Filters</h5>

            <div className="mb-4">
              <h6 className="fw-bold">Category</h6>
              {filters.map((cat) => (
                <div className="form-check" key={cat}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${cat}`}
                    checked={categoryFilter.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <label className="form-check-label text-capitalize" htmlFor={`cat-${cat}`}>
                    {cat.replace(/-/g, ' ')}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h6 className="fw-bold">Price Range</h6>
              <input
                type="range"
                className="form-range"
                min="0"
                max="1000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <span className="text-muted">Up to ${priceRange}</span>
            </div>

            <button className="btn btn-primary w-100 rounded-pill" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>

        <div className="col-12 col-md-9 mt-3">
          <div className="row">
            {products.map(product => (
              <ProductItemSmall
                key={product.id}
                product={{ ...product, image: product.thumbnail || product.image }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSearch;
