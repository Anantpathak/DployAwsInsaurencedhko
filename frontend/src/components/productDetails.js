import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions'; // Import the action for incrementing the cart counter
import { Link } from 'react-router-dom';



const ProductDetail = ({ product }) => {
  const dispatch = useDispatch();

  
  const handleShoppingBagClick = () => {
    dispatch(addToCart(product));
    alert('Carted')
  };

  return (
    <section className="bg-light mt-5">
      <div className="container pb-5">
        <div className="row">
          <div className="col-lg-5 mt-5">
            <div className="card mb-3">
              <img className="card-img img-fluid" src={product?.image} alt="" id="product-detail" />
            </div>
            {/* Carousel */}
          </div>
          <div className="col-lg-7 mt-5">
            <div className="card">
              <div className="card-body">
                <h1 className="h2">{product.title}</h1>
                <p className="h3 py-2">${product.price}</p>
                <p className="py-2">${product.description}</p>
                <form action="" method="GET">
                  <input type="hidden" name="product-title" value={product.name} />
                  {/* Size */}
                  <div className="row">
                    <div className="col-auto">
                      {/* Size Options */}
                    </div>
                    <div className="col-auto">
                      {/* Quantity */}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="row pb-3">
                    <div className="col d-grid">
                      <Link to="/cart/" className="btn btn-success btn-lg"  onClick={handleShoppingBagClick}>
                        Buy
                      </Link>
                    </div>
                    <div className="col d-grid">
                      <button type="button" className="btn btn-success btn-lg" name="submit" value="addtocard"  onClick={handleShoppingBagClick}>Add To Cart</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
