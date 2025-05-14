import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const NewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ newsType: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  function initialFormData() {
    return {
      heading: '',
      content: '',
      writer: '',
      publishedDate: '',
      newsType: ''
    };
  }
const API_BASE = process.env.REACT_APP_API_URL;
  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/news/all`);
      setNewsList(res.data);
      setFilteredNews(res.data);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const applyFilters = () => {
    const filtered = newsList.filter((n) => {
      return filters.newsType === '' || n.newsType === filters.newsType;
    });
    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, newsList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        publishedDate: new Date(formData.publishedDate)
      };

      if (editingId) {
        await axios.put(`${API_BASE}/api/news/update/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/news/create`, payload);
      }

      fetchNews();
      setShowModal(false);
      setEditingId(null);
      setFormData(initialFormData());
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (news) => {
    setFormData(news);
    setEditingId(news._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/news/delete/${id}`);
      fetchNews();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">News Management</h3>

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-3">
          <select
            className="form-select"
            value={filters.newsType}
            onChange={(e) => setFilters({ newsType: e.target.value })}
          >
            <option value="">All News Types</option>
            <option value="Car Insurance">Car Insurance</option>
            <option value="Bike Insurance">Bike Insurance</option>
            <option value="Health Insurance">Health Insurance</option>
            <option value="Life Insurance">Life Insurance</option>
            <option value="Term Insurance">Term Insurance</option>
            <option value="Investment News">Investment News</option>
            <option value="Business News">Business News</option>
            <option value="Travel Insurance">Travel Insurance</option>
          </select>
        </div>
        <Button onClick={() => {
          setFormData(initialFormData());
          setEditingId(null);
          setShowModal(true);
        }}>
          Add News
        </Button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Heading</th>
            <th>Writer</th>
            <th>Published Date</th>
            <th>News Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNews.map((n) => (
            <tr key={n._id}>
              <td>{n.heading}</td>
              <td>{n.writer}</td>
              <td>{new Date(n.publishedDate).toLocaleDateString()}</td>
              <td>{n.newsType}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleEdit(n)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(n._id)}>Delete</Button>
              </td>
            </tr>
          ))}
          {paginatedNews.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No data found.</td>
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
          <Modal.Title>{editingId ? 'Edit' : 'Add'} News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formData).map((key) => (
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type={key === 'publishedDate' ? 'date' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
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

export default NewsManager;
