import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    userType: 'Customer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="register-bg">
      <div className="phone-frame">
        <div className="phone-notch">
          <div className="camera"></div>
        </div>
        <div className="status-bar">
          <span>11:11</span>
          <div className="icons">
            <span className="network">📶</span>
            <span className="wifi">📡</span>
            <span className="battery">🔋</span>
          </div>
        </div>

        <div className="notification">🔔 It's shopping time!</div>

        <form className="phone-form" onSubmit={handleSubmit}>
          <h2 className="logo-title">🛒 E <span>Shofify</span></h2>
          <h1 className="welcome-heading">Welcome to India's Latest Online Shop</h1>
          <p className="welcome-subtext">Sign up and explore the latest trends.</p>

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

