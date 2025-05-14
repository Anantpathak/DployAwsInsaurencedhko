import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: null, // Corrected key name to 'imageUrl'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "imageUrl" ? files[0] : value,
    }));
  };
const API_BASE = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (product[key]) formData.append(key, product[key]);
    });

    try {
      await axios.post(`${API_BASE}/api/products/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!", {
        position: "top-center",
        theme: "colored",
        delay: 2000,
      });
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: null,
      });
      navigate("/");
    } catch (error) {
      toast.error(`Error adding product: ${error.message}`, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="col-md-8 mx-auto">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={handleChange}
            value={product.name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            onChange={handleChange}
            value={product.description}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            onChange={handleChange}
            value={product.price}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            name="category"
            onChange={handleChange}
            value={product.category}
            required
          >
            <option value="">Select a category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="home">Home</option>
            <option value="living">Living</option>
            <option value="beauty">Beauty</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            onChange={handleChange}
            value={product.stock}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">imageUrl</label>
          <input
            type="file"
            className="form-control"
            id="imageUrl"
            name="imageUrl"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-block btn-ping"
          style={{
            backgroundColor: "#ff3f6c",
            color: "white",
            fontWeight: 700,
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
