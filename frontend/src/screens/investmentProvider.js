import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Form, Alert, Badge, Image } from "react-bootstrap";

export default function InvestmentPlanProviderTable() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    keyFeatures: [],
    baseInvestmentAmount: "",
    forYear: "",
    getReturnAmount: "",
    investmentDuration: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    duration: "",
    minAmount: "",
    maxAmount: "",
  });
  const itemsPerPage = 10;

  const fetchData = async (filters = {}) => {
    try {
      let url = `${API_BASE}/api/investment/all`;
      if (Object.keys(filters).length) {
        url = `${API_BASE}/api/investment/filter?${new URLSearchParams(filters).toString()}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      const totalPages = Math.ceil(json.length / itemsPerPage);
      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      } else if (json.length === 0) {
        setPage(1);
      }
    } catch (err) {
      setErrorMessage("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.baseInvestmentAmount || formData.baseInvestmentAmount <= 0) errors.baseInvestmentAmount = "Base Investment Amount must be a positive number";
    if (!formData.forYear || formData.forYear <= 0) errors.forYear = "For Year must be a positive number";
    if (!formData.getReturnAmount || formData.getReturnAmount <= 0) errors.getReturnAmount = "Return Amount must be a positive number";
    if (!formData.investmentDuration) errors.investmentDuration = "Investment Duration is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "keyFeatures") {
      setFormData({ ...formData, [name]: value.split(",").map((s) => s.trim()).filter((s) => s) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openAddForm = () => {
    setEditing(null);
    setFormData({
      name: "",
      logoUrl: "",
      keyFeatures: [],
      baseInvestmentAmount: "",
      forYear: "",
      getReturnAmount: "",
      investmentDuration: "",
    });
    setFormErrors({});
    setErrorMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = editing
      ? `${API_BASE}/api/investment/update/${editing._id}`
      : `${API_BASE}/api/investment/create`;

    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        fetchData(filters);
        setErrorMessage("");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.errors?.map((err) => err.msg).join(", ") || "Failed to save. Please check form.");
      }
    } catch (err) {
      setErrorMessage("Failed to save. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const res = await fetch(`${API_BASE}/api/investment/delete/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchData(filters);
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to delete plan.");
        }
      } catch (err) {
        setErrorMessage("Failed to delete plan. Please try again.");
      }
    }
  };

  const openEditForm = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      logoUrl: item.logoUrl || "",
      keyFeatures: item.keyFeatures,
      baseInvestmentAmount: item.baseInvestmentAmount,
      forYear: item.forYear,
      getReturnAmount: item.getReturnAmount,
      investmentDuration: item.investmentDuration,
    });
    setFormErrors({});
    setErrorMessage("");
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchData(filters);
    setFiltersVisible(false);
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const maxPageButtons = 5;
  const getPageNumbers = () => {
    const pages = [];
    const halfMax = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, page - halfMax);
    let endPage = Math.min(pageCount, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift("...");
      pages.unshift(1);
    }

    if (endPage < pageCount) {
      pages.push("...");
      pages.push(pageCount);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif", width: "100%", boxSizing: "border-box" }}>
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <h2 className="fw-bold" style={{ color: "#2c3e50", fontSize: "1.5rem", margin: 0 }}>
          Investment Plan Providers
        </h2>
        {!showForm && (
          <div>
            <Button
              variant="info"
              onClick={() => setFiltersVisible(!filtersVisible)}
              style={{
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "0.9rem",
                marginRight: "8px",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {filtersVisible ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              variant="primary"
              onClick={openAddForm}
              style={{
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "0.9rem",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              + Add Plan
            </Button>
          </div>
        )}
      </div>

      {errorMessage && (
        <Alert variant="danger" style={{ marginBottom: "15px", borderRadius: "6px", fontSize: "0.9rem" }}>
          {errorMessage}
        </Alert>
      )}

      {filtersVisible && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "15px",
          }}
        >
          <h5 style={{ color: "#2c3e50", fontSize: "1.1rem", marginBottom: "15px" }}>Filters</h5>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Investment Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  placeholder="e.g., Short Term"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Min Investment Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="minAmount"
                  placeholder="e.g., 5000"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Max Investment Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="maxAmount"
                  placeholder="e.g., 100000"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <Button
                variant="success"
                onClick={applyFilters}
                style={{
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  width: "100%",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "15px", fontSize: "1.2rem" }}>
            {editing ? "Edit Investment Plan" : "Add Investment Plan"}
          </h3>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="name" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="logoUrl" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Logo URL (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="keyFeatures" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Key Features (Comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="keyFeatures"
                    value={formData.keyFeatures.join(", ")}
                    onChange={handleInputChange}
                    placeholder="e.g., High Returns, Low Risk"
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="baseInvestmentAmount" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Base Investment Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseInvestmentAmount"
                    value={formData.baseInvestmentAmount}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.baseInvestmentAmount}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.baseInvestmentAmount}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="forYear" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>For Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="forYear"
                    value={formData.forYear}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.forYear}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.forYear}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="getReturnAmount" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Return Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="getReturnAmount"
                    value={formData.getReturnAmount}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.getReturnAmount}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.getReturnAmount}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="investmentDuration" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Investment Duration</Form.Label>
                  <Form.Select
                    name="investmentDuration"
                    value={formData.investmentDuration}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.investmentDuration}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="">Select</option>
                    <option value="Short Term">Short Term</option>
                    <option value="Medium Term">Medium Term</option>
                    <option value="Long Term">Long Term</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.investmentDuration}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-2">
              <Button
                variant="success"
                type="submit"
                className="me-2"
                style={{ borderRadius: "6px", padding: "8px 16px", fontSize: "0.85rem", transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                {editing ? "Update" : "Create"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
                style={{ borderRadius: "6px", padding: "8px 16px", fontSize: "0.85rem", transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}

      {!showForm && (
        <>
          <div style={{ width: "100%", overflowX: "auto", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <Table striped bordered hover style={{ tableLayout: "auto", width: "100%", fontSize: "0.75rem" }}>
              <thead style={{ backgroundColor: "#343a40", color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                <tr>
                  <th style={{ padding: "8px", minWidth: "60px" }}>Logo</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Name</th>
                  <th style={{ padding: "8px", minWidth: "100px" }}>Key Features</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Base Amount (₹)</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>For Year</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Return Amount (₹)</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Duration</th>
                  <th style={{ padding: "8px", minWidth: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item._id}
                    style={{
                      transition: "background-color 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e9ecef")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "inherit")}
                  >
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "4px" }}>
                      {item.logoUrl ? (
                        <Image
                          src={item.logoUrl}
                          alt={item.name}
                          style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px" }}
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.keyFeatures.map((feature, idx) => (
                        <Badge key={idx} bg="secondary" style={{ marginRight: "4px", padding: "3px 6px", fontSize: "0.65rem" }}>
                          {feature}
                        </Badge>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>₹{item.baseInvestmentAmount}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.forYear}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>₹{item.getReturnAmount}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.investmentDuration}</td>
                    <td style={{ verticalAlign: "middle", textAlign: "center", padding: "4px", whiteSpace: "nowrap" }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => openEditForm(item)}
                        style={{ borderRadius: "4px", padding: "3px 6px", marginRight: "4px", fontSize: "0.65rem", minWidth: "50px" }}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        style={{ borderRadius: "4px", padding: "3px 6px", fontSize: "0.65rem", minWidth: "50px" }}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div
            className="mt-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              width: "100%",
            }}
          >
            <Button
              variant="outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "0.85rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Previous
            </Button>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {pageNumbers.map((num, idx) =>
                num === "..." ? (
                  <span
                    key={idx}
                    style={{
                      padding: "6px 10px",
                      fontSize: "0.85rem",
                      color: "#6c757d",
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={num}
                    variant={page === num ? "primary" : "outline-primary"}
                    onClick={() => setPage(num)}
                    style={{
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontSize: "0.85rem",
                      transition: "all 0.3s ease",
                      minWidth: "35px",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    {num}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline-primary"
              disabled={page === pageCount}
              onClick={() => setPage(page + 1)}
              style={{
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "0.85rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Next
            </Button>

            <span
              style={{
                fontSize: "0.85rem",
                color: "#2c3e50",
                marginLeft: "8px",
                whiteSpace: "nowrap",
              }}
            >
              Page {page} of {pageCount}
            </span>
          </div>
        </>
      )}
    </div>
  );
}