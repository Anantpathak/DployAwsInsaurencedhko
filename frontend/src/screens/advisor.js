import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

const AdvisorManager = () => {
  const [advisors, setAdvisors] = useState([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ city: '', expertise: [], experience: '', rating: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  function initialFormData() {
    return {
      name: '',
      experience: '',
      rating: '',
      city: '',
      expertise: [],
      profilePic: ''
    };
  }
const API_BASE = process.env.REACT_APP_API_URL;
  const fetchAdvisors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/advisor/all`);
      setAdvisors(res.data);
      setFilteredAdvisors(res.data);
    } catch (err) {
      console.error('Error fetching advisors:', err);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const applyFilters = () => {
    const filtered = advisors.filter((a) => {
      return (
        (!filters.city || a.city === filters.city) &&
        (filters.expertise.length === 0 || filters.expertise.some(e => a.expertise.includes(e))) &&
        (!filters.experience || a.experience === Number(filters.experience)) &&
        (!filters.rating || a.rating === Number(filters.rating))
      );
    });
    setFilteredAdvisors(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, advisors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        rating: Number(formData.rating)
      };

      if (editingId) {
        await axios.put(`${API_BASE}/api/advisor/update/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/advisor/create`, payload);
      }

      fetchAdvisors();
      setShowModal(false);
      setEditingId(null);
      setFormData(initialFormData());
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (advisor) => {
    setFormData(advisor);
    setEditingId(advisor._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/advisor/delete/${id}`);
      fetchAdvisors();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'expertise') {
      const newExpertise = checked
        ? [...filters.expertise, value]
        : filters.expertise.filter((e) => e !== value);
      setFilters({ ...filters, expertise: newExpertise });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const paginatedAdvisors = filteredAdvisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdvisors.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Advisor Management</h3>

      {/* Filter Section */}
      <Row className="mb-4 align-items-center">
        <Col md={4} sm={12}>
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => {
              setFormData(initialFormData());
              setEditingId(null);
              setShowModal(true);
            }}
          >
            Add Advisor
          </Button>
        </Col>
        <Col md={8} sm={12}>
          <Row>
            <Col md={4} sm={6}>
              <Form.Select
                onChange={handleFilterChange}
                name="city"
                value={filters.city}
                aria-label="City filter"
                className="mb-2"
              >
                <option value="">All Cities</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Kolkata">Kolkata</option>
              </Form.Select>
            </Col>
            <Col md={4} sm={6}>
              <div>
                <Form.Label>Expertise</Form.Label>
                <div className="d-flex flex-column">
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Health Insurance"
                    value="Health Insurance"
                    checked={filters.expertise.includes('Health Insurance')}
                    onChange={handleFilterChange}
                    name="expertise"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Life Insurance"
                    value="Life Insurance"
                    checked={filters.expertise.includes('Life Insurance')}
                    onChange={handleFilterChange}
                    name="expertise"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Investment"
                    value="Investment"
                    checked={filters.expertise.includes('Investment')}
                    onChange={handleFilterChange}
                    name="expertise"
                  />
                </div>
              </div>
            </Col>
            <Col md={4} sm={12}>
              <InputGroup>
                <Form.Control
                  placeholder="Experience (years)"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  name="experience"
                  className="mb-2"
                />
                <Form.Control
                  placeholder="Rating (e.g. 4.5)"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  name="rating"
                  className="mb-2"
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Table Section */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>City</th>
            <th>Expertise</th>
            <th>Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAdvisors.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.experience} yrs</td>
              <td>{a.rating}</td>
              <td>{a.city}</td>
              <td>{a.expertise.join(', ')}</td>
              <td>
                {a.profilePic ? (
                  <img src={a.profilePic} alt="pic" width="50" height="50" />
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleEdit(a)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(a._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {paginatedAdvisors.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className="d-flex justify-content-center mt-4">
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

      {/* Modal for Add/Edit Advisor */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Advisor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formData).map((key) => (
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type={key === 'profilePic' ? 'url' : key === 'experience' || key === 'rating' ? 'number' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editingId ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdvisorManager;
