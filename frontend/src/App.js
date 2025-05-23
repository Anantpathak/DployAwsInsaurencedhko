import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your component files
import Home from "./screens/Home";
import WomenProducts from "./screens/WomenProducts";
import MenProducts from "./screens/MenProducts";
import KidsProducts from "./screens/KidsProducts";
import AccessoriesProducts from "./screens/AccessoriesProducts";
import CosmeticsProducts from "./screens/CosmeticsProducts";
import Details from "./screens/Details";
import CartDetails from "./screens/cartedItems";
import ProceedToPayment from "./screens/proceedToPayment";
import AdminDashboard from "./components/AdminDashboard";
import Car from "./screens/car";
import AdminHome from "./components/adminHome";
import CarProvider from "./screens/carProvider";
import BikeProvider from "./screens/bikePovider";
import AdvisorProvider from "./screens/customerAdvisor";
import News from "./screens/customerNews";
import Bike from "./screens/bikePolicy";
import Health from "./screens/health";
import Term from "./screens/term";
import Investment from "./screens/investment";
import Buisness from "./screens/buisness";
import Family from "./screens/family";
import Register from "./components/CustomerRegister";
import HomeVisit from "./screens/HomeAssistance";
import HealthProvider from "./screens/healthProvider";
import GuarnteeProvider from "./screens/guarntee";
// Assume you have a way to get the current user and their admin status
const getCurrentUser = () => {
  // Replace this with your actual authentication logic
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null; // Example: get user from local storage
};

const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();
  if (user && user.isAdmin) {
    return children;
  } else {
    // Redirect to login or some other unauthorized page
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Product Routes */}
        <Route path="/women" element={<WomenProducts />} />
        <Route path="/men" element={<MenProducts />} />
        <Route path="/kids" element={<KidsProducts />} />
        <Route path="/accessories" element={<AccessoriesProducts />} />
        <Route path="/cosmetics" element={<CosmeticsProducts />} />
        <Route path="/details" element={<Details />} />
        <Route path="/cart" element={<CartDetails />} />
        <Route path="/payment" element={<ProceedToPayment />} />

        {/* Insurance Routes */}
        <Route path="/car-insurance" element={<Car />} />
        <Route path="/bikePolicy" element={<Bike />} />
        <Route path="/healthPolicy" element={<Health />} />
        <Route path="/term" element={<Term />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/buisness" element={<Buisness />} />
        <Route path="/family" element={<Family />} />
<Route path="/register" element={<Register />} />
<Route path="/news" element={<News />} />
<Route path="/homeVisit" element={<HomeVisit />} />
        {/* Admin Routes (Secured) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminHome"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/carProvider"
          element={
            <PrivateRoute>
              <CarProvider />
            </PrivateRoute>
          }
        />
        <Route
          path="/bikeProvider"
          element={
            <PrivateRoute>
              <BikeProvider />
            </PrivateRoute>
          }
        />
        <Route
          path="/customerAdvisor"
          element={
            
              <AdvisorProvider />
          
          }
        />
        <Route
          path="/healthProvider"
          element={
            
              <HealthProvider />
          
          }
        />
        <Route
          path="/guanteeProvider"
          element={
            
              <GuarnteeProvider />
          
          }
        />

      </Routes>
  );
}

export default App;
