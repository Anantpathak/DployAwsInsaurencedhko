import '../App.css';
import Navbar from '../components/navBar';
import ProductsSearch from './productSearch';

function KidsProducts() {
  return (<>
    <div className="container bg-white">
      <Navbar/>
      <div className="row mt-5 pt-5">
      <ProductsSearch type="kids" />
      </div>
    </div>
    </>
  );
}

export default KidsProducts;
