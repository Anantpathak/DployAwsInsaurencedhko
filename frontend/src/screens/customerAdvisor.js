import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const cities = ["New Delhi", "Gurgaon", "Faridabad", "Ghaziabad", "Noida", "Kolkata", "Hyderabad", "Lucknow", "Mumbai", "Pune", "Bangalore"];
const expertises = ["Health Insurance", "Life Insurance", "Investment"];

const ratings = [
  { label: "More than 4.5 Stars", value: 4.5 },
  { label: "4 to 4.5 Stars", value: 4 },
  { label: "3 to 4 Stars", value: 3 },
  { label: "Less than 3 Stars", value: 0 }
];

const experiences = [
  { label: "More than 10 Years", value: 10 },
  { label: "5 to 10 Years", value: 5 },
  { label: "Less than 5 Years", value: 0 }
];
const API_BASE = process.env.REACT_APP_API_URL;
const Advisors = () => {
  const [advisors, setAdvisors] = useState([]);
  const [filters, setFilters] = useState({ city: '', expertise: '', minExperience: '', maxRating: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const advisorsPerPage = 10;

  useEffect(() => {
    fetchAdvisors();
  }, [filters]);

  const fetchAdvisors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/advisor/all`, { params: filters });
      setAdvisors(res.data);
      setCurrentPage(1); // reset to first page after filter
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', expertise: '', minExperience: '', maxRating: '' });
  };

  // Pagination
  const indexOfLast = currentPage * advisorsPerPage;
  const indexOfFirst = indexOfLast - advisorsPerPage;
  const currentAdvisors = advisors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(advisors.length / advisorsPerPage);

  return (
    <>
      <header className="sticky-top bg-white shadow-sm">
        <Navbar />
      </header>

      <div className="container-fluid d-flex mt-3">
        {/* Sidebar */}
        <div className="col-md-3 border-end px-4 py-3" style={{ height: '100vh', position: 'sticky', top: '70px', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Filters</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>Clear All</button>
          </div>

          {/* City */}
          <div className="mb-4">
            <h6>City</h6>
            {cities.map((city, idx) => (
              <div key={city} className="form-check mb-2">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="city"
                    id={`city-${idx}`}
                    checked={filters.city === city}
                    onChange={() => handleFilterChange('city', city)}
                  />
                  <label className="form-check-label ms-2" htmlFor={`city-${idx}`}>{city}</label>
                </div>
              </div>
            ))}
          </div>

          {/* Expertise */}
          <div className="mb-4">
            <h6>Expertise</h6>
            {expertises.map((exp, idx) => (
              <div key={exp} className="form-check mb-2">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="expertise"
                    id={`expertise-${idx}`}
                    checked={filters.expertise === exp}
                    onChange={() => handleFilterChange('expertise', exp)}
                  />
                  <label className="form-check-label ms-2" htmlFor={`expertise-${idx}`}>{exp}</label>
                </div>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="mb-4">
            <h6>Rating</h6>
            {ratings.map((r, idx) => (
              <div key={r.label} className="form-check mb-2">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="rating"
                    id={`rating-${idx}`}
                    checked={filters.maxRating === r.value}
                    onChange={() => handleFilterChange('maxRating', r.value)}
                  />
                  <label className="form-check-label ms-2" htmlFor={`rating-${idx}`}>{r.label}</label>
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="mb-4">
            <h6>Experience</h6>
            {experiences.map((e, idx) => (
              <div key={e.label} className="form-check mb-2">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="experience"
                    id={`experience-${idx}`}
                    checked={filters.minExperience === e.value}
                    onChange={() => handleFilterChange('minExperience', e.value)}
                  />
                  <label className="form-check-label ms-2" htmlFor={`experience-${idx}`}>{e.label}</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 px-4 py-3">
          {currentAdvisors.map((advisor, idx) => (
            <div className="card mb-4 p-3 shadow-sm" key={idx}>
              <div className="d-flex align-items-center">
                <img src={advisor.profilePic} alt="profile" width="80" height="80" className="rounded-circle me-3 border" />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{advisor.name}</h5>
                  <p className="mb-1">
                    Experience {advisor.experience} Yrs | Rating {advisor.rating} ⭐
                  </p>
                  <p className="mb-1 text-muted">{advisor.city}</p>
                  <div>
                    {advisor.expertise.map((exp, i) => (
                      <span key={i} className="badge bg-primary text-light me-2">{exp}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <button className="btn btn-danger">Book Home Visit</button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(totalPages).keys()].map(page => (
                <li key={page} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
<Footer/>
    </>
  );
};

export default Advisors;
