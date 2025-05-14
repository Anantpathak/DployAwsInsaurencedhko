import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InsuranceProviderTable() {
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
  });
const API_BASE = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    const res = await fetch(`${API_BASE}/api/insurance-provider/all`);
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
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing
      ? `${API_BASE}/api/insurance-provider/update/${editing._id}`
      : `${API_BASE}/api/insurance-provider/create`;

    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchData();
    } else {
      alert("Failed to save. Please check form.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      const res = await fetch(`${API_BASE}/api/insurance-provider/delete/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
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
    });
    setModalOpen(true);
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Insurance Providers</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add
        </button>
      </div>

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
                <td>{item.insuranceTypes.join(", ")}</td>
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
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
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
                  {["name", "cashlessGarages", "claimsSettled", "claimType", "premiumStartingFrom", "insuranceTypes", "keyFeatures"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize">{field}</label>
                      <input
                        type={field === "premiumStartingFrom" ? "number" : "text"}
                        className="form-control"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={["insuranceTypes", "keyFeatures"].includes(field) ? "Comma-separated values" : ""}
                      />
                    </div>
                  ))}
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-success me-2">
                      {editing ? "Update" : "Create"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                      Cancel
                    </button>
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
