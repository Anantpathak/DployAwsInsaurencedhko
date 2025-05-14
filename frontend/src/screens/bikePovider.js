import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BikeInsuranceProviderTable() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cashlessGarages: "",
    claimsSettled: "",
    claimType: "",
    premiumStartingFrom: "",
    insuranceTypes: [],
    keyFeatures: [],
    bikeBrandName: "",
    bikeModel: "",
    bikeOwnedYear: "",
    bikeRegisteredCity: "",
  });
const API_BASE = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    brand: "",
    model: "",
    year: "",
    city: "",
  });

  const fetchData = async (filters = {}) => {
    let url = `${API_BASE}/api/bike-insurance-provider/all`;
    if (Object.keys(filters).length) {
      url = `${API_BASE}/api/bike-insurance-provider/filter?${new URLSearchParams(filters).toString()}`;
    }

    const res = await fetch(url);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["insuranceTypes", "keyFeatures"].includes(name)) {
      setFormData({ ...formData, [name]: value.split(",").map((s) => s.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openAddModal = () => {
    setEditing(null);
    setFormData({
      name: "",
      cashlessGarages: "",
      claimsSettled: "",
      claimType: "",
      premiumStartingFrom: "",
      insuranceTypes: [],
      keyFeatures: [],
      bikeBrandName: "",
      bikeModel: "",
      bikeOwnedYear: "",
      bikeRegisteredCity: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing
      ? `${API_BASE}/api/bike-insurance-provider/update/${editing._id}`
      : `${API_BASE}/api/bike-insurance-provider/create`;

    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchData(filters);
    } else {
      alert("Failed to save. Please check form.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      const res = await fetch(`${API_BASE}/api/bike-insurance-provider/delete/${id}`, { method: "DELETE" });
      if (res.ok) fetchData(filters);
    }
  };

  const openEditModal = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      cashlessGarages: item.cashlessGarages,
      claimsSettled: item.claimsSettled,
      claimType: item.claimType,
      premiumStartingFrom: item.premiumStartingFrom,
      insuranceTypes: item.insuranceTypes,
      keyFeatures: item.keyFeatures,
      bikeBrandName: item.bikeBrandName,
      bikeModel: item.bikeModel,
      bikeOwnedYear: item.bikeOwnedYear,
      bikeRegisteredCity: item.bikeRegisteredCity,
    });
    setModalOpen(true);
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchData(filters);
    setFiltersVisible(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Bike Insurance Providers</h2>
        <div>
          <button className="btn btn-info me-2" onClick={() => setFiltersVisible(!filtersVisible)}>
            {filtersVisible ? "Hide Filters" : "Show Filters"}
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add</button>
        </div>
      </div>

      {/* Filters */}
      {filtersVisible && (
        <div className="mb-3">
          <h5>Filters</h5>
          <div className="row">
            <div className="col"><input className="form-control" name="type" placeholder="Insurance Type" value={filters.type} onChange={handleFilterChange} /></div>
            <div className="col"><input className="form-control" name="brand" placeholder="Bike Brand" value={filters.brand} onChange={handleFilterChange} /></div>
            <div className="col"><input className="form-control" name="model" placeholder="Bike Model" value={filters.model} onChange={handleFilterChange} /></div>
            <div className="col"><input className="form-control" type="number" name="year" placeholder="Bike Year" value={filters.year} onChange={handleFilterChange} /></div>
            <div className="col"><input className="form-control" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} /></div>
          </div>
          <button className="btn btn-success mt-2" onClick={applyFilters}>Apply Filters</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Cashless Garages</th>
              <th>Claims Settled</th>
              <th>Claim Type</th>
              <th>Premium</th>
              <th>Insurance Types</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.cashlessGarages}</td>
                <td>{item.claimsSettled}</td>
                <td>{item.claimType}</td>
                <td>{item.premiumStartingFrom}</td>
                <td>{item.insuranceTypes?.join(", ")}</td>
                <td>{item.bikeBrandName}</td>
                <td>{item.bikeModel}</td>
                <td>{item.bikeOwnedYear}</td>
                <td>{item.bikeRegisteredCity}</td>
                <td>
                  <button className="btn btn-sm btn-outline-success me-2" onClick={() => openEditModal(item)}>✏️</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: pageCount }, (_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit Provider" : "Add Provider"}</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {[
                    "name", "cashlessGarages", "claimsSettled", "claimType",
                    "premiumStartingFrom", "insuranceTypes", "keyFeatures",
                    "bikeBrandName", "bikeModel", "bikeOwnedYear", "bikeRegisteredCity"
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize">{field}</label>
                      <input
                        type={["premiumStartingFrom", "bikeOwnedYear"].includes(field) ? "number" : "text"}
                        className="form-control"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={["insuranceTypes", "keyFeatures"].includes(field) ? "Comma-separated" : ""}
                      />
                    </div>
                  ))}
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-success me-2">{editing ? "Update" : "Create"}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
