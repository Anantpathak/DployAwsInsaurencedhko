import React, { useState } from "react";

const Sidebar = ({ applyFilters }) => {
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    priceRange: 0,
  });

  const [showSidebar, setShowSidebar] = useState(false);

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updated = { ...prevFilters };
      const index = updated[filterType].indexOf(value);
      if (index === -1) {
        updated[filterType].push(value);
      } else {
        updated[filterType].splice(index, 1);
      }
      return updated;
    });
  };

  const handlePriceChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: e.target.value,
    }));
  };

  const handleApplyFilters = () => {
    if (typeof applyFilters === "function") {
      applyFilters(filters);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="btn btn-dark d-md-none mb-3"
        onClick={() => setShowSidebar(!showSidebar)}
        style={{ zIndex: 10 }}
      >
        {showSidebar ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Sidebar Container */}
      <div
        className={`sidebar bg-white rounded shadow-sm px-4 py-3 ${
          showSidebar ? "d-block" : "d-none d-md-block"
        }`}
        style={{
          minWidth: "260px",
          maxWidth: "280px",
          height: "100%",
          position: "sticky",
          top: "80px",
          alignSelf: "flex-start",
        }}
      >
        <h5 className="mb-4 text-primary fw-semibold border-bottom pb-2">
          🛍 Filter Products
        </h5>

        {/* CATEGORY */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark">Category</h6>
          {["Electronics", "Clothing", "Accessories", "Shoes"].map((cat) => (
            <div className="form-check mt-2" key={cat}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-${cat}`}
                checked={filters.category.includes(cat)}
                onChange={() => handleCheckboxChange("category", cat)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat}`}>
                {cat}
              </label>
            </div>
          ))}
        </div>

        {/* BRAND */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark">Brand</h6>
          {["Samsung", "Apple", "Nike", "Adidas"].map((brand) => (
            <div className="form-check mt-2" key={brand}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`brand-${brand}`}
                checked={filters.brand.includes(brand)}
                onChange={() => handleCheckboxChange("brand", brand)}
              />
              <label className="form-check-label" htmlFor={`brand-${brand}`}>
                {brand}
              </label>
            </div>
          ))}
        </div>

        {/* PRICE RANGE */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark">Price Range</h6>
          <input
            type="range"
            className="form-range"
            min="0"
            max="1000"
            step="50"
            value={filters.priceRange}
            onChange={handlePriceChange}
            style={{ accentColor: "#0d6efd" }}
          />
          <span className="text-muted">Up to: ${filters.priceRange}</span>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={handleApplyFilters}
          className="btn btn-primary w-100 rounded-pill shadow"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
};

export default Sidebar;
