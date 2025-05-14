import '../App.css';
import ProductsSection from '../components/productSection';
import Navbar from '../components/navBar';
import ProductsSearch from './productSearch';
function MenProducts() {
  return (<>
    <div className="container bg-white">
      <Navbar/>
      <div className="row mt-5 pt-5">
      <ProductsSearch type="men" />
      </div>
    </div>
    </>
  );
}

export default MenProducts;