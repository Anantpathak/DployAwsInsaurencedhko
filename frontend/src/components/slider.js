import React from 'react';
import '../App.css';

const Carousel = () => {
  return (
    <div id="carouselExampleRide" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">

        {/* Slide 1 */}
        <div className="carousel-item active">
          <img
            src="https://morecustomersapp.com/wp-content/uploads/2020/08/banner-and-eCommerce.jpg"
            className="d-block w-100 carousel-img"
            alt="Slide 1"
          />
          <div className="carousel-caption d-none d-md-block animate-slideIn">
            <h2 className="text-shadow">Welcome to ShopNow</h2>
            <p className="text-shadow">Explore the best deals today.</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <img
            src="https://img.freepik.com/free-psd/banner-template-online-shopping_23-2148559048.jpg"
            className="d-block w-100 carousel-img"
            alt="Slide 2"
          />
          <div className="carousel-caption d-none d-md-block animate-slideIn">
            <h2 className="text-shadow">Big Discounts Everyday</h2>
            <p className="text-shadow">Get the trendiest products now.</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <img
            src="https://img.freepik.com/premium-vector/online-shop-ads-banner-template_653829-12.jpg"
            className="d-block w-100 carousel-img"
            alt="Slide 3"
          />
          <div className="carousel-caption d-none d-md-block animate-slideIn">
            <h2 className="text-shadow">Your One-Stop Shop</h2>
            <p className="text-shadow">Everything you need, all in one place.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleRide"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleRide"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
