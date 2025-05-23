import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Form, Alert, Badge, Image } from "react-bootstrap";

export default function HealthInsuranceProviderTable() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    premiumStartingFrom: "",
    keyFeatures: [],
    claimType: "",
    coverAmount: "",
    areaPincode: "",
    insuranceFor: "",
    gender: "",
    members: [{ relationship: "", age: "", count: 1 }],
    knownDiseases: [],
    otherDisease: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    insuranceFor: "",
    areaPincode: "",
    coverAmount: "",
    gender: "",
    knownDiseases: "",
    members: "",
  });
  const itemsPerPage = 10;

  const fetchData = async (filters = {}) => {
    try {
      let url = `${API_BASE}/api/health/all`;
      if (Object.keys(filters).length) {
        url = `${API_BASE}/api/health/filter?${new URLSearchParams(filters).toString()}`;
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
    if (!formData.premiumStartingFrom || formData.premiumStartingFrom <= 0) errors.premiumStartingFrom = "Premium must be a positive number";
    if (!formData.claimType.trim()) errors.claimType = "Claim Type is required";
    if (!formData.coverAmount.trim()) errors.coverAmount = "Cover Amount is required";
    if (!formData.areaPincode.trim()) errors.areaPincode = "Area Pincode is required";
    if (!formData.insuranceFor) errors.insuranceFor = "Insurance For is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (formData.members.length === 0) {
      errors.members = "At least one member is required";
    } else {
      formData.members.forEach((member, idx) => {
        if (!member.relationship) errors[`members[${idx}].relationship`] = "Relationship is required";
        if (!member.age || member.age <= 0) errors[`members[${idx}].age`] = "Age must be a positive number";
        if (member.count < 1) errors[`members[${idx}].count`] = "Count must be at least 1";
      });
    }
    if (formData.knownDiseases.includes("Other") && !formData.otherDisease.trim()) {
      errors.otherDisease = "Other disease description is required";
    }

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

  const handleKnownDiseasesChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, knownDiseases: options });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { relationship: "", age: "", count: 1 }],
    });
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const openAddForm = () => {
    setEditing(null);
    setFormData({
      name: "",
      logoUrl: "",
      premiumStartingFrom: "",
      keyFeatures: [],
      claimType: "",
      coverAmount: "",
      areaPincode: "",
      insuranceFor: "",
      gender: "",
      members: [{ relationship: "", age: "", count: 1 }],
      knownDiseases: [],
      otherDisease: "",
    });
    setFormErrors({});
    setErrorMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = editing
      ? `${API_BASE}/api/health/update/${editing._id}`
      : `${API_BASE}/api/health/create`;

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
    if (window.confirm("Are you sure you want to delete this provider?")) {
      try {
        const res = await fetch(`${API_BASE}/api/health/delete/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchData(filters);
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to delete provider.");
        }
      } catch (err) {
        setErrorMessage("Failed to delete provider. Please try again.");
      }
    }
  };

  const openEditForm = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      logoUrl: item.logoUrl || "",
      premiumStartingFrom: item.premiumStartingFrom,
      keyFeatures: item.keyFeatures,
      claimType: item.claimType,
      coverAmount: item.coverAmount,
      areaPincode: item.areaPincode,
      insuranceFor: item.insuranceFor,
      gender: item.gender,
      members: item.members.length > 0 ? item.members : [{ relationship: "", age: "", count: 1 }],
      knownDiseases: item.knownDiseases,
      otherDisease: item.otherDisease || "",
    });
    setFormErrors({});
    setErrorMessage("");
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const formattedFilters = { ...filters };
    if (filters.knownDiseases) {
      formattedFilters.knownDiseases = JSON.stringify(filters.knownDiseases.split(",").map((d) => d.trim()));
    }
    if (filters.members) {
      try {
        const membersArray = filters.members.split(";").map((m) => {
          const [relationship, age, count] = m.split(",");
          return { relationship: relationship.trim(), age: parseInt(age), count: parseInt(count) || 1 };
        });
        formattedFilters.members = JSON.stringify(membersArray);
      } catch (err) {
        setErrorMessage("Invalid members filter format. Use: relationship,age,count;relationship,age,count");
        return;
      }
    }
    fetchData(formattedFilters);
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
          Health Insurance Providers
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
              + Add Provider
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
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Insurance For</Form.Label>
                <Form.Control
                  type="text"
                  name="insuranceFor"
                  placeholder="e.g., Family"
                  value={filters.insuranceFor}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Area Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="areaPincode"
                  placeholder="e.g., 400001"
                  value={filters.areaPincode}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Cover Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="coverAmount"
                  placeholder="e.g., 5L"
                  value={filters.coverAmount}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Gender</Form.Label>
                <Form.Control
                  type="text"
                  name="gender"
                  placeholder="e.g., Male"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Known Diseases</Form.Label>
                <Form.Control
                  type="text"
                  name="knownDiseases"
                  placeholder="e.g., Diabetes,BP/Hypertension"
                  value={filters.knownDiseases}
                  onChange={handleFilterChange}
                  style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="mb-2">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Members</Form.Label>
                <Form.Control
                  type="text"
                  name="members"
                  placeholder="e.g., You,30,1;Spouse,28,1"
                  value={filters.members}
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
            {editing ? "Edit Health Insurance Provider" : "Add Health Insurance Provider"}
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
                <Form.Group controlId="premiumStartingFrom" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Premium Starting From (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="premiumStartingFrom"
                    value={formData.premiumStartingFrom}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.premiumStartingFrom}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.premiumStartingFrom}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="keyFeatures" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Key Features (Comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="keyFeatures"
                    value={formData.keyFeatures.join(", ")}
                    onChange={handleInputChange}
                    placeholder="e.g., Cashless Treatment, No Claim Bonus"
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="claimType" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Claim Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="claimType"
                    value={formData.claimType}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.claimType}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.claimType}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="coverAmount" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Cover Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="coverAmount"
                    value={formData.coverAmount}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.coverAmount}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.coverAmount}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="areaPincode" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Area Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="areaPincode"
                    value={formData.areaPincode}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.areaPincode}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.areaPincode}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="insuranceFor" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Insurance For</Form.Label>
                  <Form.Select
                    name="insuranceFor"
                    value={formData.insuranceFor}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.insuranceFor}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="">Select</option>
                    <option value="Personal">Personal</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.insuranceFor}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="gender" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.gender}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.gender}</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="knownDiseases" className="mb-2">
                  <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Known Diseases</Form.Label>
                  <Form.Select
                    multiple
                    name="knownDiseases"
                    value={formData.knownDiseases}
                    onChange={handleKnownDiseasesChange}
                    style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem", height: "80px" }}
                  >
                    <option value="No existing disease">No existing disease</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="BP/Hypertension">BP/Hypertension</option>
                    <option value="Heart Disease">Heart Disease</option>
                    <option value="Asthma">Asthma</option>
                    <option value="Thyroid Disorder">Thyroid Disorder</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {formData.knownDiseases.includes("Other") && (
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="otherDisease" className="mb-2">
                    <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Other Disease</Form.Label>
                    <Form.Control
                      type="text"
                      name="otherDisease"
                      value={formData.otherDisease}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.otherDisease}
                      style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>{formErrors.otherDisease}</Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            )}

            <div className="mb-3">
              <Form.Label style={{ color: "#2c3e50", fontWeight: "500", fontSize: "0.85rem" }}>Members</Form.Label>
              {formData.members.map((member, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label style={{ fontSize: "0.8rem" }}>Relationship</Form.Label>
                      <Form.Select
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(index, "relationship", e.target.value)}
                        isInvalid={!!formErrors[`members[${index}].relationship`]}
                        style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                      >
                        <option value="">Select</option>
                        <option value="You">You</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Son">Son</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>
                        {formErrors[`members[${index}].relationship`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ fontSize: "0.8rem" }}>Age</Form.Label>
                      <Form.Control
                        type="number"
                        value={member.age}
                        onChange={(e) => handleMemberChange(index, "age", e.target.value)}
                        isInvalid={!!formErrors[`members[${index}].age`]}
                        style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                      />
                      <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>
                        {formErrors[`members[${index}].age`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ fontSize: "0.8rem" }}>Count</Form.Label>
                      <Form.Control
                        type="number"
                        value={member.count}
                        onChange={(e) => handleMemberChange(index, "count", parseInt(e.target.value))}
                        isInvalid={!!formErrors[`members[${index}].count`]}
                        style={{ borderRadius: "6px", padding: "6px", fontSize: "0.85rem" }}
                        min="1"
                      />
                      <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>
                        {formErrors[`members[${index}].count`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeMember(index)}
                      style={{ borderRadius: "4px", padding: "6px", fontSize: "0.85rem" }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addMember}
                style={{ borderRadius: "6px", padding: "6px 12px", fontSize: "0.85rem" }}
              >
                + Add Member
              </Button>
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
                  <th style={{ padding: "8px", minWidth: "80px" }}>Premium (₹)</th>
                  <th style={{ padding: "8px", minWidth: "100px" }}>Key Features</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Claim Type</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Cover Amount</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Area Pincode</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Insurance For</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Gender</th>
                  <th style={{ padding: "8px", minWidth: "120px" }}>Members</th>
                  <th style={{ padding: "8px", minWidth: "120px" }}>Known Diseases</th>
                  <th style={{ padding: "8px", minWidth: "80px" }}>Other Disease</th>
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
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>₹{item.premiumStartingFrom}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.keyFeatures.map((feature, idx) => (
                        <Badge key={idx} bg="secondary" style={{ marginRight: "4px", padding: "3px 6px", fontSize: "0.65rem" }}>
                          {feature}
                        </Badge>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.claimType}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.coverAmount}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.areaPincode}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.insuranceFor}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.gender}</td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.members.map((member, idx) => (
                        <Badge key={idx} bg="primary" style={{ marginRight: "4px", padding: "3px 6px", fontSize: "0.65rem" }}>
                          {member.relationship} (Age: {member.age}, Count: {member.count})
                        </Badge>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.knownDiseases.map((disease, idx) => (
                        <Badge key={idx} bg="warning" style={{ marginRight: "4px", padding: "3px 6px", fontSize: "0.65rem", color: "#000" }}>
                          {disease}
                        </Badge>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "middle", padding: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.otherDisease || "-"}
                    </td>
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