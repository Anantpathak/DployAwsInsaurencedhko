import React, { useReducer, useState } from "react";
import axios from "axios";
import Navbar from "./navBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../reducers/userReducer";
import "./Login.css"; // Add this line for CSS styling

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const API_BASE = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/");
      dispatch(login(res.data.user));
      setMessage("Login successful!");
      if (res?.data?.token) {
        localStorage.setItem("token", res?.data?.token);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed!");
    }
  };

  return (
    <div className="login-bg">
      <Navbar />
      <div className="login-container">
        <div className="login-card animated-slide">
        <h2 className="logo-title">🛒 E <span>Shofify</span></h2>
          <h2 className="login-heading">Welcome Back!</h2>
          <p className="login-subtext">Please login to continue shopping</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-block login-button"
            >
              Login
            </button>
          </form>

          {message && <p className="text-success text-center mt-3">{message}</p>}
          {error && <p className="text-danger text-center mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
