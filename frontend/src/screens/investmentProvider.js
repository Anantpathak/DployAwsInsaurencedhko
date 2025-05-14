import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const TermInsuranceManager = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ planType: '', payoutType: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function initialFormData() {
    return {
      name: '',
      investAmountPerMonth: '',
      payFor: '',
      returnsAfter: '',
      payoutType: '',
      planType: '',
      returnPercentage: '',
      otherBenefits: ''
    };
  }
const API_BASE = process.env.REACT_APP_API_URL;
  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/investment-insurance-provider/all`);
      setProviders(res.data);
      setFilteredProviders(res.data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const applyFilters = () => {
    const filtered = providers.filter((p) => {
      return (
        (filters.planType === '' || p.planType === filters.planType) &&
        (filters.payoutType === '' || p.payoutType === filters.payoutType)
      );
    });
    setFilteredProviders(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, providers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        returnPercentage: parseFloat(formData.returnPercentage),
        otherBenefits: formData.otherBenefits.split(',').map(b => b.trim())
      };

      if (editingId) {
        await axios.put(`${API_BASE}/api/investment-insurance-provider/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/investment-insurance-provider`, payload);
      }

      fetchProviders();
      setShowModal(false);
      setEditingId(null);
      setFormData(initialFormData());
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (provider) => {
    const editData = {
      ...provider,
      otherBenefits: Array.isArray(provider.otherBenefits) ? provider.otherBenefits.join(', ') : provider.otherBenefits
    };
    setFormData(editData);
    setEditingId(provider._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/investment-insurance-provider/${id}`);
      fetchProviders();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const paginatedProviders = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Term Insurance Providers</h3>

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-3">
          <select
            className="form-select"
            value={filters.planType}
            onChange={(e) => setFilters({ ...filters, planType: e.target.value })}
          >
            <option value="">All Plans</option>
            <option value="Term">Term</option>
            <option value="Whole Life">Whole Life</option>
            <option value="ULIP">ULIP</option>
          </select>
          <select
            className="form-select"
            value={filters.payoutType}
            onChange={(e) => setFilters({ ...filters, payoutType: e.target.value })}
          >
            <option value="">All Payouts</option>
            <option value="Lump Sum">Lump Sum</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <Button onClick={() => {
          setFormData(initialFormData());
          setEditingId(null);
          setShowModal(true);
        }}>
          Add Provider
        </Button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Invest/Month</th>
            <th>Pay For</th>
            <th>Returns After</th>
            <th>Payout</th>
            <th>Plan</th>
            <th>Return %</th>
            <th>Benefits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProviders.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.investAmountPerMonth}</td>
              <td>{p.payFor}</td>
              <td>{p.returnsAfter}</td>
              <td>{p.payoutType}</td>
              <td>{p.planType}</td>
              <td>{p.returnPercentage}</td>
              <td>{Array.isArray(p.otherBenefits) ? p.otherBenefits.join(', ') : p.otherBenefits}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleEdit(p)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>Delete</Button>
              </td>
            </tr>
          ))}
          {paginatedProviders.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? 'primary' : 'outline-primary'}
            className="mx-1"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Provider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formData).map((key) => (
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
            <Form.Text className="text-muted">
              For multiple benefits, separate them using commas.
            </Form.Text>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSubmit}>{editingId ? 'Update' : 'Add'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TermInsuranceManager;
