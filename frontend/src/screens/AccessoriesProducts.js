import '../App.css';
import ProductsSection from '../components/productSection';
import Carousel from '../components/slider';

function AccessoriesProducts() {
  return (<>
    <div className="container-fluid bg-white">
      <div className="row">
        <Carousel/>
        </div>
    </div>
    <div className="container bg-white">
    <div className="row">
        <ProductsSection/>
      </div>
    </div>
    </>
  );
}

export default AccessoriesProducts;
